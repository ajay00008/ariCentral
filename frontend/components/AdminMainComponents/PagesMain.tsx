'use client'

import * as React from 'react'
import { PagesList } from '@/components/Lists/PagesList'
import { getAllDynamicPages } from '@/app/actions'

export function PagesMain (): React.ReactNode {
  const [pagesData, setPagesData] = React.useState<DynamicPage[] | null>(null)

  React.useEffect(() => {
    async function fetchData (): Promise<void> {
      const data = await getAllDynamicPages()
      setPagesData(data.data)
    }

    void fetchData()
  }, [])

  return (
    <div className='flex flex-col pt-[50px] pb-[50px] width-[100%] height-[100%] px-16'>
      <PagesList data={pagesData} />
    </div>
  )
}
