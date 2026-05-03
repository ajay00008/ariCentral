'use client'

import * as React from 'react'
import { FAQCollectionManager } from '@/components/FAQCollectionManager/FAQCollectionManager'
import {
  createCollectionSubElement,
  createFAQCollectionElement,
  updateFAQCollectionUpdated
} from '@/app/actions'
import cloneDeep from 'lodash.clonedeep'
import { Button } from '@/components/ui/button'
import { useAlertProvider } from '@/providers/AlertProvider'

interface Props {
  faqCollection: FAQCollectionElement[]
}

export function FAQMain ({ faqCollection }: Props): React.ReactNode {
  const { setAlertMessage } = useAlertProvider()
  const [articlesCollection, setArticlesCollection] = React.useState(faqCollection)
  const [originalCollection] = React.useState(faqCollection)
  const [loading, setLoading] = React.useState(false)

  async function handleFAQCollectionElementCreate (): Promise<void> {
    const createdCollectionElement = await createFAQCollectionElement()
    if (createdCollectionElement !== null) {
      setArticlesCollection([
        ...articlesCollection,
        createdCollectionElement
      ])
    }
  }

  async function handleFAQCollectionElementNameUpdate (e: React.ChangeEvent<HTMLInputElement>, collectionId: number): Promise<void> {
    const { value } = e.target
    if (articlesCollection === undefined) return
    const updatedArticles = cloneDeep(articlesCollection)
    const collectionToUpdate: FAQCollectionElement | undefined = Object.values(updatedArticles).find((collection) => collection.id === collectionId)
    if (collectionToUpdate === undefined) return
    collectionToUpdate.attributes.collectionName = value

    setArticlesCollection(updatedArticles)
  }

  async function handleFAQCollectionElementDelete (collectionId: number | undefined): Promise<void> {
    setArticlesCollection(articlesCollection?.filter(it => it.id !== collectionId))
  }

  async function handleFAQCollectionSubElementCreate (collectionId: number): Promise<void> {
    if (articlesCollection === undefined) return
    const updatedArticles = cloneDeep(articlesCollection)
    const foundedCollection: FAQCollectionElement | undefined = Object.values(updatedArticles).find((it) => it.id === collectionId)
    if (foundedCollection === undefined) return
    const collectionSubElement = await createCollectionSubElement(collectionId)
    if (collectionSubElement === null) {
      setAlertMessage('Unable to create sub element.', false)
      return
    }
    const collectionSubElementLastItem = collectionSubElement.attributes.collectionItems.collectionElement[collectionSubElement.attributes.collectionItems.collectionElement.length - 1]
    foundedCollection.attributes.collectionItems.collectionElement.push(collectionSubElementLastItem)

    setArticlesCollection(updatedArticles)
  }

  async function handleFAQCollectionSubElementNameUpdate (e: React.ChangeEvent<HTMLInputElement>, collectionId: number, subCollectionId: number): Promise<void> {
    const { value } = e.target
    if (articlesCollection === undefined) return
    const updatedArticles = cloneDeep(articlesCollection)
    const collectionToUpdate: FAQCollectionElement | undefined = Object.values(updatedArticles).find((collection) => collection.id === collectionId)
    if (collectionToUpdate === undefined) return
    const subCollectionToUpdate = collectionToUpdate.attributes.collectionItems.collectionElement.find(item => item.id === subCollectionId)
    if (subCollectionToUpdate === undefined) return
    subCollectionToUpdate.collectionElementHeading = value

    setArticlesCollection(updatedArticles)
  }

  async function handleFAQCollectionSubElementDelete (collectionId: number, subCollectionId: number): Promise<void> {
    if (articlesCollection === undefined) return
    const updatedArticles = cloneDeep(articlesCollection)
    const collectionToUpdate: FAQCollectionElement | undefined = Object.values(updatedArticles).find((collection) => collection.id === collectionId)
    if (collectionToUpdate === undefined) return
    const subCollectionToUpdateIndex = collectionToUpdate.attributes.collectionItems.collectionElement.findIndex(item => item.id === subCollectionId)
    if (subCollectionToUpdateIndex === undefined) return
    collectionToUpdate.attributes.collectionItems.collectionElement.splice(subCollectionToUpdateIndex, 1)

    setArticlesCollection(updatedArticles)
  }

  async function handleFAQCollectionSubElementChange (collectionId: number, subCollectionId: number, markdown: string): Promise<void> {
    if (articlesCollection === undefined) return
    const updatedArticles = cloneDeep(articlesCollection)
    const collectionToUpdate: FAQCollectionElement | undefined = Object.values(updatedArticles).find((collection) => collection.id === collectionId)
    if (collectionToUpdate === undefined) return
    const subCollectionToUpdateIndex = collectionToUpdate.attributes.collectionItems.collectionElement.findIndex(item => item.id === subCollectionId)
    if (subCollectionToUpdateIndex === undefined) return
    collectionToUpdate.attributes.collectionItems.collectionElement[subCollectionToUpdateIndex].collectionItemMarkdown = markdown

    setArticlesCollection(updatedArticles)
  }

  async function handleUpdateCollection (): Promise<void> {
    setLoading(true)
    const res = await updateFAQCollectionUpdated(articlesCollection, originalCollection)
    if (res === null) {
      setAlertMessage('Unable to update collection.', false)
    } else {
      setAlertMessage('Collection was successfully updated.', true)
    }
    setLoading(false)
  }

  return (
    <div className='flex flex-col pt-[50px] pb-[50px] width-[100%] height-[100%] px-16'>
      {faqCollection !== null && (
        <FAQCollectionManager
          faqCollection={articlesCollection}
          onCollectionCreate={() => { void handleFAQCollectionElementCreate() }}
          onCollectionNameUpdate={(e, collectionId) => { void handleFAQCollectionElementNameUpdate(e, collectionId) }}
          onCollectionDelete={(collectionId) => { void handleFAQCollectionElementDelete(collectionId) }}
          onCollectionSubCreate={(collectionId) => { void handleFAQCollectionSubElementCreate(collectionId) }}
          onSubCollectionNameUpdate={(e, collectionId, subCollectionId) => { void handleFAQCollectionSubElementNameUpdate(e, collectionId, subCollectionId) }}
          onSubCollectionChange={(collectionId, subCollectionId, markdown) => { void handleFAQCollectionSubElementChange(collectionId, subCollectionId, markdown) }}
          onSubCollectionDelete={(collectionId, subCollectionId) => { void handleFAQCollectionSubElementDelete(collectionId, subCollectionId) }}
        />
      )}
      <Button
        type='button'
        title='Update collection with data above'
        disabled={loading}
        className='mt-[100px] p-[30px] disabled:opacity-20'
        onClick={() => {
          void handleUpdateCollection()
        }}
      >
        Update Collection
      </Button>
    </div>
  )
}
