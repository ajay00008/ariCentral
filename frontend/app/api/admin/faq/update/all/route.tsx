import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { z } from 'zod'

const FAQSubSemiCollectionElementSchema = z.object({
  id: z.number(),
  collectionElementHeading: z.string(),
  collectionItemMarkdown: z.string()
})

const FAQSubCollectionElementSchema = z.object({
  id: z.number(),
  collectionElement: z.array(FAQSubSemiCollectionElementSchema)
})

const FAQCollectionElementSchema = z.object({
  id: z.number(),
  attributes: z.object({
    collectionName: z.string(),
    collectionItems: FAQSubCollectionElementSchema
  })
})

const FAQCollectionArraySchema = z.array(FAQCollectionElementSchema)

function findDeletedElements (original: FAQCollectionElement[], updated: FAQCollectionElement[]): FAQCollectionElement[] {
  const deletedElements: FAQCollectionElement[] = []

  const missingElements = original.filter(
    originalElement => !updated.some(updatedElement => updatedElement.id === originalElement.id)
  )

  deletedElements.push(...missingElements)

  return deletedElements
}

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const data = await request.json()
    const { collectionArray, originalCollection }: { collectionArray: FAQCollectionElement[], originalCollection: FAQCollectionElement[] } = data.data

    if (typeof collectionArray === 'undefined') {
      return NextResponse.json({ message: 'collectionArray body parameter is required.' }, { status: 400 })
    } else if (typeof originalCollection === 'undefined') {
      return NextResponse.json({ message: 'originalCollection body parameter is required.' }, { status: 400 })
    }

    if (!FAQCollectionArraySchema.safeParse(collectionArray).success) {
      return NextResponse.json({ message: 'CollectionArray body parameter should be an array of FAQ collection.' }, { status: 400 })
    } else if (!FAQCollectionArraySchema.safeParse(originalCollection).success) {
      return NextResponse.json({ message: 'OriginalCollection body parameter should be an array of FAQ collection.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const deletedElements = findDeletedElements(originalCollection, collectionArray)

    if (deletedElements.length !== 0) {
      const deletePromises = deletedElements.map(async (element) => {
        await fetchAPI(`/api/faqs/${element.id}`, {
          method: 'DELETE',
          token: sessionToken
        }, false, true)
      })

      await Promise.all(deletePromises)
    }

    const promises = collectionArray.map(async (item) => {
      await fetchAPI(`/api/faqs/${item.id}?populate=deep`, {
        method: 'PUT',
        token: sessionToken,
        fields: JSON.stringify({
          data: {
            collectionName: item.attributes.collectionName,
            collectionItems: {
              collectionElement: [...item.attributes.collectionItems.collectionElement]
            }
          }
        })
      }, false, true)
    })

    await Promise.all(promises)

    return NextResponse.json({ message: 'Data was updated.' }, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      err: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
