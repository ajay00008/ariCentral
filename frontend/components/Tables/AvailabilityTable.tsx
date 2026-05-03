'use client'

import * as React from 'react'
import { useUnitModalProvider } from '@/providers/UnitModalProvider'
import { AvailabilityTableHeaders } from '@/components/Custom/AvailabilityTableHeaders'
import { AvailabilityTableRow } from '@/components/Custom/AvailabilityTableRow'

interface Props {
  data: CustomUnit[] | null
  currency: Currency
}

interface ShouldHide {
  powder: boolean
  cars: boolean
}

export function formatNumber (number: number | undefined): string | number {
  if (number === undefined) return ''
  if (number >= 1000) {
    return number.toLocaleString('en-US')
  } else {
    return number
  }
}

export function AvailabilityTable ({ data, currency }: Props): React.ReactNode {
  const { openModal } = useUnitModalProvider()
  const [shouldHide, setShouldHide] = React.useState<ShouldHide>({
    powder: false,
    cars: false
  })

  React.useEffect(() => {
    if (data !== null) {
      setShouldHide({
        powder: data.every(item => item.attributes.powder === 0),
        cars: data.every(item => item.attributes.cars === 0)
      })
    }
  }, [data])

  return (
    <div className='w-full'>
      <AvailabilityTableHeaders shouldHide={shouldHide} />
      {data?.map(item => (
        <AvailabilityTableRow
          key={item.id}
          item={item}
          shouldHide={shouldHide}
          currency={currency}
          openModal={openModal}
        />
      ))}
    </div>
  )
}
