import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { format } from 'date-fns'

export async function POST (request: Request): Promise<NextResponse<ActionCreateUser | APIError>> {
  try {
    const { data } = await request.json()
    const {
      slug,
      name,
      description,
      date,
      content
    }: {
      slug: string
      name: string
      description: string
      date: string
      content: string
    } = data
    const slugCheck = z.string()
    const NameCheck = z.string()
    const descriptionCheck = z.string()
    const dateCheck = z.string()
    const contentCheck = z.string()

    if (typeof slug === 'undefined') {
      return NextResponse.json({ message: 'slug body parameter is required.' }, { status: 400 })
    } else if (typeof name === 'undefined') {
      return NextResponse.json({ message: 'name body parameter is required.' }, { status: 400 })
    } else if (typeof description === 'undefined') {
      return NextResponse.json({ message: 'description body parameter is required.' }, { status: 400 })
    } else if (typeof date === 'undefined') {
      return NextResponse.json({ message: 'date body parameter is required.' }, { status: 400 })
    } else if (typeof content === 'undefined') {
      return NextResponse.json({ message: 'content body parameter is required.' }, { status: 400 })
    }

    if (!slugCheck.safeParse(slug).success) {
      return NextResponse.json({ message: 'Slug should be a string.' }, { status: 400 })
    } else if (!NameCheck.safeParse(name).success) {
      return NextResponse.json({ message: 'Name should be a string.' }, { status: 400 })
    } else if (!descriptionCheck.safeParse(description).success) {
      return NextResponse.json({ message: 'Description should be string.' }, { status: 400 })
    } else if (!dateCheck.safeParse(date).success) {
      return NextResponse.json({ message: 'Date should be string.' }, { status: 400 })
    } else if (!contentCheck.safeParse(content).success) {
      return NextResponse.json({ message: 'Content should be string.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const checkResponse: Response = await fetchAPI('/api/pages?populate=deep&pagination[pageSize]=100', {
      method: 'GET',
      token: sessionToken,
      fields: undefined
    }, false, true)

    const checkResData = await checkResponse.json()
    const foundedSlug = (checkResData.data as DynamicPage[]).find(it => it.attributes.Slug === slug)
    if (foundedSlug !== undefined) {
      return NextResponse.json({ message: 'Slug is already taken / used.' }, { status: 200 })
    }

    const publishDate = format(new Date(), 'yyyy-MM-dd')

    const response: Response = await fetchAPI('/api/pages?populate=deep', {
      method: 'POST',
      token: sessionToken,
      fields: JSON.stringify({
        data: {
          Slug: slug,
          Name: name,
          Description: description,
          Date: date,
          Content: content,
          publishedAt: publishDate
        }
      })
    }, false, true)

    const newPage = await response.json()

    if (response.ok) {
      return NextResponse.json(newPage.data, { status: 200 })
    } else {
      return NextResponse.json({
        code: response.status,
        message: response.statusText
      }, { status: response.status })
    }
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      err: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
