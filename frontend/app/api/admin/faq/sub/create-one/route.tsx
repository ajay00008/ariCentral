import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { z } from 'zod'
import cloneDeep from 'lodash.clonedeep'

export async function POST (request: Request): Promise<NextResponse<ActionCreateSingleFloor>> {
  try {
    const data = await request.json()
    const { collectionId }: { collectionId: number } = data.data

    const collectionIdZodCheck = z.number()

    if (typeof collectionId === 'undefined') {
      return NextResponse.json({ message: 'collectionId body parameter is required.' }, { status: 400 })
    }

    if (!collectionIdZodCheck.safeParse(collectionId).success) {
      return NextResponse.json({ message: 'CollectionId body parameter should be number.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI('/api/faqs?populate=deep&pagination[pageSize]=100', {
      method: 'GET',
      token: sessionToken
    }, false, true)

    const serverResponse = await response.json()
    const finalServerData = cloneDeep(serverResponse.data)
    const foundedCollection = finalServerData.find((collection: FAQCollectionElement) => collection.id === collectionId)
    if (foundedCollection === undefined) {
      return NextResponse.json({ message: 'Wasnt able to find parent with that id' }, { status: 400 })
    }
    const existingItems = foundedCollection.attributes.collectionItems.collectionElement

    const response2: Response = await fetchAPI(`/api/faqs/${collectionId}?populate=deep`, {
      method: 'PUT',
      token: sessionToken,
      fields: JSON.stringify({
        data: {
          collectionItems: {
            collectionElement: [
              ...existingItems,
              {
                collectionElementHeading: '',
                collectionItemMarkdown: ''
              }
            ]
          }
        }
      })
    }, false, true)

    if (response2.ok) {
      const serverData = await response2.json()
      return NextResponse.json(serverData.data, { status: 200 })
    } else {
      return NextResponse.json({
        code: response2.status,
        message: response2.statusText
      }, { status: response2.status })
    }
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      err: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
