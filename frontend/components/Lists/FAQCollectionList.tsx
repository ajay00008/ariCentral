'use client'

import { FAQCollectionSubCard } from '@/components/Cards/FAQCollectionSubCard'

interface Props {
  currentCollection: FAQCollectionElement
  onSubCollectionNameUpdate: (e: React.ChangeEvent<HTMLInputElement>, collectionId: number, subCollectionId: number) => void
  onSubCollectionDelete: (collectionId: number, subCollectionId: number) => void
  onSubCollectionChange: (collectionId: number, subCollectionId: number, markdown: string) => void
}

export function FAQCollectionList ({
  currentCollection,
  onSubCollectionNameUpdate,
  onSubCollectionDelete,
  onSubCollectionChange
}: Props): React.ReactNode {
  return (
    <ul className='flex flex-col gap-10'>
      {currentCollection.attributes.collectionItems.collectionElement.map((item) => (
        <FAQCollectionSubCard
          key={item.id}
          currentCollection={item}
          parentCollectionId={currentCollection.id}
          onSubCollectionNameUpdate={onSubCollectionNameUpdate}
          onSubCollectionDelete={onSubCollectionDelete}
          onSubCollectionChange={onSubCollectionChange}
        />
      ))}
    </ul>
  )
}
