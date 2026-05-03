import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { z } from 'zod'
import { sendTrackEvent } from '@/app/actions'
import { EventType, EventTypeKeys } from '@/constants/event-type'

const isValidEventType = (event: string): event is EventTypeKeys => {
  return Object.values(EventType).includes(event as EventTypeKeys)
}

export async function POST (request: NextRequest): Promise<NextResponse> {
  try {
    const { data } = await request.json()
    const { slug, eventType }: { slug: string, eventType: string } = data

    if (!z.string().min(1).safeParse(slug).success) {
      return NextResponse.json({ message: 'Slug is required and should be a string.' }, { status: 400 })
    }

    if (!isValidEventType(eventType)) {
      return NextResponse.json({ message: 'Invalid event type.' }, { status: 400 })
    }

    void sendTrackEvent(slug, eventType)

    return NextResponse.json({ message: `${eventType.replace('_', ' ')} event tracked successfully.`, success: true }, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      message: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
