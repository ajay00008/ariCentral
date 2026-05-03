'use client'

import * as React from 'react'
import { PropertyList } from '@/components/Lists/PropertyList'
import { CreatePropertyModal } from '@/components/Modals/CreatePropertyModal'
import { getPropertyCollection } from '@/app/actions'
import cloneDeep from 'lodash.clonedeep'

export function PropertyMain (): React.ReactNode {
  const [propertyData, setPropertyData] = React.useState<PropertiesData['data'] | null>(null)

  function handleDeletePropertyById (id: number): void {
    const updatedProperty = cloneDeep(propertyData)
    const propertyIndex = updatedProperty?.allProperties.data.findIndex(it => it.id === id)
    if (propertyIndex === undefined || propertyIndex === -1) return
    const updatedData = updatedProperty?.allProperties.data.filter((_, index) => index !== propertyIndex) ?? []
    setPropertyData({ allProperties: { data: updatedData } })
  }

  React.useEffect(() => {
    async function fetchData (): Promise<void> {
      const data = await getPropertyCollection()
      setPropertyData(data)
    }

    void fetchData()
  }, [])

  return (
    <div className='flex flex-col pt-[50px] pb-[50px] width-[100%] height-[100%] px-16'>
      {propertyData !== null && <CreatePropertyModal data={propertyData.allProperties.data} />}
      {propertyData !== null && <PropertyList data={propertyData.allProperties} onDelete={handleDeletePropertyById} />}
    </div>
  )
}
