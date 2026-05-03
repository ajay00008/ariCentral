'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FAQCollectionCard } from '@/components/Cards/FAQCollectionCard'

interface Props {
  faqCollection: FAQCollectionElement[]
  onCollectionCreate: () => void
  onCollectionNameUpdate: (e: React.ChangeEvent<HTMLInputElement>, collectionId: number) => void
  onCollectionDelete: (collectionId: number | undefined) => void
  onCollectionSubCreate: (collectionId: number) => void
  onSubCollectionNameUpdate: (e: React.ChangeEvent<HTMLInputElement>, collectionId: number, subCollectionId: number) => void
  onSubCollectionDelete: (collectionId: number, subCollectionId: number) => void
  onSubCollectionChange: (collectionId: number, subCollectionId: number, markdown: string) => void
}

export function FAQCollectionManager ({
  onCollectionCreate,
  onCollectionNameUpdate,
  onCollectionDelete,
  onCollectionSubCreate,
  onSubCollectionNameUpdate,
  onSubCollectionDelete,
  onSubCollectionChange,
  faqCollection
}: Props): React.ReactNode {
  return (
    <div className='flex flex-col gap-[50px]'>
      <div className='flex gap-6'>
        <p className='text-2xl text-black justify-center content-center'>FAQ Collection</p>
      </div>
      {faqCollection?.map((collection) => (
        <FAQCollectionCard
          key={collection.id}
          currentCollection={collection}
          onCollectionNameUpdate={onCollectionNameUpdate}
          onCollectionDelete={onCollectionDelete.bind(null, collection.id)}
          onCollectionSubCreate={onCollectionSubCreate}
          onSubCollectionNameUpdate={onSubCollectionNameUpdate}
          onSubCollectionDelete={onSubCollectionDelete}
          onSubCollectionChange={onSubCollectionChange}
        />
      ))}
      <Button variant='secondary' className='flex flex-row-reverse gap-5 w-fit' onClick={onCollectionCreate}>
        <Plus className='mr-2 h-4 w-4' /> Add Collection Element
      </Button>
    </div>
  )
}
