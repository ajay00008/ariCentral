'use client'

import * as React from 'react'
import { getAllProperties } from '@/app/actions'

interface InjectedProps {
  allProperties: FullProperty[]
  loading?: boolean
  skeletonCount?: number
  setBottomSentinel?: (el: HTMLDivElement | null) => void
}

export function withInfiniteAllProperties<P extends InjectedProps> (
  Wrapped: React.ComponentType<P>,
  options: { pageSize: number }
): React.ComponentType<Omit<P, keyof InjectedProps>> {
  const PAGE_SIZE = options.pageSize

  function Component (props: Omit<P, keyof InjectedProps>): React.ReactElement {
    const [items, setItems] = React.useState<FullProperty[]>([])
    const [page, setPage] = React.useState(1)
    const [hasMore, setHasMore] = React.useState(true)
    const [isFetching, setIsFetching] = React.useState(false)
    const bottomRef = React.useRef<HTMLDivElement | null>(null)
    const observerRef = React.useRef<IntersectionObserver | null>(null)

    const fetchPage = React.useCallback(async (nextPage: number) => {
      setIsFetching(true)
      try {
        const data = await getAllProperties(nextPage, PAGE_SIZE)
        if (data.length === 0) {
          setHasMore(false)
          return
        }
        setItems(prev => {
          const existing = new Set(prev.map(p => p.id))
          const merged = [...prev, ...data.filter(p => !existing.has(p.id))]
          return merged
        })
        if (data.length < PAGE_SIZE) {
          setHasMore(false)
        }
      } finally {
        setIsFetching(false)
      }
    }, [])

    React.useEffect(() => {
      void fetchPage(1)
    }, [fetchPage])

    const setBottomSentinel = React.useCallback((el: HTMLDivElement | null) => {
      if ((observerRef.current != null) && (bottomRef.current != null)) {
        observerRef.current.unobserve(bottomRef.current)
        observerRef.current.disconnect()
      }

      bottomRef.current = el
      if (el == null) return

      const observer = new IntersectionObserver((entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasMore && !isFetching) {
          const next = page + 1
          setPage(next)
          void fetchPage(next)
        }
      }, { root: null, rootMargin: '200px', threshold: 0 })

      observer.observe(el)
      observerRef.current = observer
    }, [fetchPage, hasMore, isFetching, page])

    const baseProps = props as P
    return (
      <Wrapped
        {...baseProps}
        allProperties={items}
        loading={isFetching}
        skeletonCount={PAGE_SIZE}
        setBottomSentinel={setBottomSentinel}
      />
    )
  }

  const wrappedName = Wrapped.displayName ?? Wrapped.name ?? 'Component'
  Component.displayName = `withInfiniteAllProperties(${wrappedName})`

  return Component
}
