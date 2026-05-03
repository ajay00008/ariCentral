'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FAQCollectionList } from '@/components/Lists/FAQCollectionList'

interface Props {
  currentCollection: FAQCollectionElement
  onCollectionNameUpdate: (e: React.ChangeEvent<HTMLInputElement>, collectionId: number) => void
  onCollectionDelete: (collectionId: number | undefined) => void
  onCollectionSubCreate: (collectionId: number) => void
  onSubCollectionNameUpdate: (e: React.ChangeEvent<HTMLInputElement>, collectionId: number, subCollectionId: number) => void
  onSubCollectionDelete: (collectionId: number, subCollectionId: number) => void
  onSubCollectionChange: (collectionId: number, subCollectionId: number, markdown: string) => void
}

export function FAQCollectionCard ({
  currentCollection,
  onCollectionNameUpdate,
  onCollectionDelete,
  onCollectionSubCreate,
  onSubCollectionNameUpdate,
  onSubCollectionDelete,
  onSubCollectionChange
}: Props): React.ReactNode {
  return (
    <div className='flex gap-6 p-5 border-2 border-zinc-400'>
      <div className='flex flex-col gap-6 border-r border-1 border-zinc-400 w-fit pr-[10px]'>
        <p className='text-lg'>Collection name</p>
        <div className='flex gap-3'>
          <Input
            id='collectionName'
            type='text'
            name='collectionName'
            value={currentCollection.attributes.collectionName}
            placeholder='Enter collection name'
            className='w-fit'
            onChange={(e) => onCollectionNameUpdate(e, currentCollection.id)}
          />
          <Button onClick={() => onCollectionDelete(currentCollection.id)} variant='destructive'>Delete</Button>
        </div>
        <Button variant='secondary' className='w-fit text-black' onClick={() => onCollectionSubCreate(currentCollection.id)}>Create SubCollection</Button>
      </div>
      <FAQCollectionList
        currentCollection={currentCollection}
        onSubCollectionNameUpdate={onSubCollectionNameUpdate}
        onSubCollectionDelete={onSubCollectionDelete}
        onSubCollectionChange={onSubCollectionChange}
      />
    </div>
  )
}
