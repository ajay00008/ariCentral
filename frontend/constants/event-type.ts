export const EventType = {
  DOWNLOAD_CLICK: 'download_click',
  MAKE_OFFER_CLICK: 'make_offer_click',
  PAGE_VIEW: 'page_view'
} as const

export type EventTypeKeys = (typeof EventType)[keyof typeof EventType]
