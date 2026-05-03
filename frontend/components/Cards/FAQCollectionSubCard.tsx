'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RichTextEditor } from '@/components/RichTextEditor/RichTextEditor'

interface Props {
  currentCollection: FAQSubSemiCollectionElement
  parentCollectionId: number
  onSubCollectionNameUpdate: (e: React.ChangeEvent<HTMLInputElement>, collectionId: number, subCollectionId: number) => void
  onSubCollectionDelete: (collectionId: number, subCollectionId: number) => void
  onSubCollectionChange: (collectionId: number, subCollectionId: number, markdown: string) => void
}

export function FAQCollectionSubCard ({
  currentCollection,
  parentCollectionId,
  onSubCollectionNameUpdate,
  onSubCollectionDelete,
  onSubCollectionChange
}: Props): React.ReactNode {
  return (
    <li className='w-fit border border-zinc-400 gap-[50px] p-3 flex items-start justify-start h-auto'>
      <div className='flex flex-col gap-3 w-fit '>
        <p className='text-lg font-bold'>{currentCollection.collectionElementHeading !== '' ? currentCollection.collectionElementHeading : 'Here should be your sub-collection name'}</p>
        <div className='flex gap-3'>
          <Input
            id='collectionElementHeading'
            type='text'
            name='collectionElementHeading'
            value={currentCollection.collectionElementHeading}
            placeholder='Enter sub-collection name'
            className='w-fit'
            onChange={(e) => onSubCollectionNameUpdate(e, parentCollectionId, currentCollection.id)}
          />
          <Button onClick={() => onSubCollectionDelete(parentCollectionId, currentCollection.id)} variant='destructive'>Delete</Button>
        </div>
      </div>
      <RichTextEditor
        currentCollection={currentCollection}
        parentCollectionId={parentCollectionId}
        collectionId={currentCollection.id}
        onFieldChange={() => { }}
        onMarkDownChange={(value) => onSubCollectionChange(parentCollectionId, currentCollection.id, value)}
        isPages={false}
      />
    </li>
  )
}
