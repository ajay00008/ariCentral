import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { z } from 'zod'
import { isPublicPropertiesEnabled } from '@/lib/public-properties'

const realFieldnames: Record<string, string> = {
  mainQ: 'filters[Name][$containsi]',
  StreetAddress1: 'filters[StreetAddress1][$containsi]',
  StreetAddress2: 'filters[StreetAddress2][$containsi]',
  City: 'filters[City][$containsi]',
  Country: 'filters[Country][$containsi]',
  Suburb: 'filters[Suburb][$containsi]',
  Region: 'filters[Region][$containsi]',
  PostalCode: 'filters[PostalCode][$containsi]',
  Pool: 'filters[Facilities][Items][Item][$containsi]',
  Spa: 'filters[Facilities][Items][Item][$containsi]',
  Sauna: 'filters[Facilities][Items][Item][$containsi]',
  RooftopTerrace: 'filters[Facilities][Items][Item][$containsi]',
  Lift: 'filters[Facilities][Items][Item][$containsi]',
  WaterViews: 'filters[Facilities][Items][Item][$containsi]',
  PreRelease: 'filters[StageOfBuild][$eq]',
  UnderConstruction: 'filters[StageOfBuild][$eq]',
  Completed: 'filters[StageOfBuild][$eq]',
  Min: 'filters[floors][units][price][$gte]',
  Max: 'filters[floors][units][price][$lte]',
  Bedroom: 'filters[floors][units][beds][$containsi]',
  Bathroom: 'filters[floors][units][baths][$eq]',
  Living: 'filters[floors][units][living][$eq]',
  CarSpaces: 'filters[floors][units][cars][$eq]',
  Townhouse: 'filters[floors][units][type][$eq]',
  Apartment: 'filters[floors][units][type][$eq]',
  House: 'filters[floors][units][type][$eq]',
  Penthouse: 'filters[floors][units][type][$eq]',
  Land: 'filters[floors][units][type][$eq]',
  Villa: 'filters[floors][units][type][$eq]'
}

function buildQueryString (filterParams: FilterParamsSearchAction): string {
  const urlParams = new URLSearchParams()
  const booleanKeyHandlers: Record<string, (realField: string, key: string) => string> = {
    Townhouse: (realField, key) => key.toLowerCase(),
    House: (realField, key) => key.toLowerCase(),
    Apartment: (realField, key) => key.toLowerCase(),
    Villa: (realField, key) => key.toLowerCase(),
    Land: (realField, key) => key.toLowerCase(),
    Penthouse: (realField, key) => key.toLowerCase(),
    WaterViews: (realField, key) => key.split(/(?=[A-Z])/).join(' '),
    RooftopTerrace: (realField, key) => key.split(/(?=[A-Z])/).join(' ')
  }

  function isValidValue (value: any): boolean {
    return value !== undefined && value !== null && value !== '' && value !== 'Any'
  }

  for (const [key, value] of Object.entries(filterParams)) {
    if (!isValidValue(value)) continue

    if (key === 'mainQ' && Array.isArray(value)) {
      let orIndex = 0
      value.forEach((val) => {
        if (typeof val === 'string' && val !== '') {
          [
            'Name', 'StreetAddress1', 'StreetAddress2', 'PostalCode',
            'Country', 'City', 'Region', 'Suburb'
          ].forEach(field => {
            urlParams.append(`filters[$or][${orIndex++}][${field}][$containsi]`, val)
          })
        }
      })
      continue
    }

    const realField = realFieldnames[key]
    if (realField === '') continue

    if (Array.isArray(value)) {
      value.forEach((val) => {
        if (typeof val === 'string' && val !== '') {
          urlParams.append(realField, val)
        }
      })
      continue
    }

    if (typeof value === 'boolean' && value) {
      urlParams.append(
        realField,
        booleanKeyHandlers[key](realField, key)
      )
      continue
    }

    if (typeof value !== 'boolean') {
      urlParams.append(realField, value.toString())
    }
  }

  urlParams.append('populate', 'deep')
  return urlParams.toString()
}

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const allowPublicProperties = isPublicPropertiesEnabled()
    const { data: requestData } = await request.json()
    const { filterParams, page: reqPage, pageSize: reqPageSize }: { filterParams: FilterParamsSearchAction, page: string, pageSize: string } =
      requestData
    if (filterParams !== undefined) delete filterParams.viewType

    if (filterParams.mainQ[0] === null) {
      filterParams.mainQ = ['']
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (!allowPublicProperties && sessionToken === '') {
      return NextResponse.json(
        { message: 'Please, use our official application' },
        { status: 503 }
      )
    }

    const qs = buildQueryString(filterParams)

    if (!z.string().safeParse(reqPage).success) {
      return NextResponse.json({ message: 'Invalid page parameter' }, { status: 400 })
    }
    if (!z.string().safeParse(reqPageSize).success) {
      return NextResponse.json({ message: 'Invalid pageSize parameter' }, { status: 400 })
    }

    const page = reqPage
    const pageSize = reqPageSize

    const searchUrl = `/api/properties?${qs}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    const resp: Response = await fetchAPI(
      searchUrl,
      { token: allowPublicProperties ? undefined : sessionToken },
      false,
      true
    )
    if (!resp.ok) {
      return NextResponse.json(
        { code: resp.status, message: resp.statusText },
        { status: resp.status }
      )
    }
    const result = await resp.json()

    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json(
      {
        code: Codes.INTERNAL_SERVER_ERROR.code,
        err: Codes.INTERNAL_SERVER_ERROR.message
      },
      { status: 500 }
    )
  }
}
