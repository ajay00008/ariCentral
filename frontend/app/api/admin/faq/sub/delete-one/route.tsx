import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import cloneDeep from 'lodash.clonedeep'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { z } from 'zod'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const data = await request.json()
    const { collectionId, subCollectionId }: { collectionId: number, subCollectionId: number } = data.data

    const collectionIdZodCheck = z.number()
    const subCollectionIdZodCheck = z.number()

    if (typeof collectionId === 'undefined') {
      return NextResponse.json({ message: 'collectionId body parameter is required.' }, { status: 400 })
    } else if (typeof subCollectionId === 'undefined') {
      return NextResponse.json({ message: 'subCollectionId body parameter is required.' }, { status: 400 })
    }

    if (!collectionIdZodCheck.safeParse(collectionId).success) {
      return NextResponse.json({ message: 'CollectionId body parameter should be number.' }, { status: 400 })
    } else if (!subCollectionIdZodCheck.safeParse(subCollectionId).success) {
      return NextResponse.json({ message: 'SubCollectionId body parameter should be number.' }, { status: 400 })
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
    if (foundedCollection === undefined) return NextResponse.json({ message: 'Parent collection was not founded.' }, { status: 400 })

    const subCollectionToUpdateIndex = foundedCollection.attributes.collectionItems.collectionElement.findIndex((item: FAQSubSemiCollectionElement) => item.id === subCollectionId)
    if (subCollectionToUpdateIndex === -1) return NextResponse.json({ message: 'Sub collection index was not founded.' }, { status: 400 })

    let serverResultSend

    if (subCollectionToUpdateIndex === 0) {
      serverResultSend = foundedCollection.attributes.collectionItems.collectionElement = []
    } else {
      serverResultSend = foundedCollection.attributes.collectionItems.collectionElement.splice(subCollectionToUpdateIndex, 1)
    }

    const response2: Response = await fetchAPI(`/api/faqs/${collectionId}?populate=deep`, {
      method: 'PUT',
      token: sessionToken,
      fields: JSON.stringify({
        data: {
          collectionItems: {
            collectionElement: serverResultSend
          }
        }
      })
    }, false, true)

    if (response2.ok) {
      const serverData = await response2.json()
      return NextResponse.json(serverData, { status: 200 })
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
