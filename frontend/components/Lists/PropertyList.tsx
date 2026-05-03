'use client'

import { PropertyCard } from '@/components/Cards/PropertyCard'

interface Props {
  data: PropertiesData['data']['allProperties'] | null
  onDelete: (id: number) => void
}

export function PropertyList ({ data, onDelete }: Props): React.ReactNode {
  if (data === null) {
    return null
  }
  return (
    <ul className='flex flex-col gap-2 mt-8'>
      {data.data?.map((item) => (
        <li key={item.id}><PropertyCard data={item} onDelete={onDelete} /></li>
      ))}
    </ul>
  )
}
