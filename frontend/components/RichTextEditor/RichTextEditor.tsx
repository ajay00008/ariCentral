'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { MDXEditorMethods } from '@mdxeditor/editor'
import { type EditorProps } from '../Custom/MDXEditor'
import '../../app/(main)/faq/markdown-updated.css'
import '@mdxeditor/editor/style.css'

const EditorComp = dynamic(async () => await import('../Custom/MDXEditor'), { ssr: false })

export const ForwardRefEditor = React.forwardRef<MDXEditorMethods, EditorProps>((props, ref) => <EditorComp {...props} editorRef={ref} />)

ForwardRefEditor.displayName = 'ForwardRefEditor'

interface Props {
  currentCollection?: FAQSubSemiCollectionElement
  collectionId?: number
  parentCollectionId?: number
  isPages: boolean
  contentField?: string
  onFieldChange: (collectionId: number, subCollectionId: number, markdown: string) => void
  onMarkDownChange: (markdown: string) => void
}

export function RichTextEditor ({ parentCollectionId, collectionId, currentCollection, isPages, contentField, onFieldChange, onMarkDownChange }: Props): React.ReactNode {
  if (!isPages && (currentCollection === undefined || collectionId === undefined || parentCollectionId === undefined)) return null
  const [content, setContent] = React.useState(currentCollection?.collectionItemMarkdown ?? '')
  const [pagesContent, setPagesContent] = React.useState(contentField ?? '')
  const [renderKey, setRenderKey] = React.useState(0)
  const mkRef = React.useRef<MDXEditorMethods | null>(null)
  const markdownClassStyle = isPages !== undefined
    ? 'flex flex-col gap-[100px] items-center justify-center markdown markdown-admin'
    : 'flex flex-col gap-[100px] items-center justify-center markdown'

  function handleEditorChange (value: string): void {
    if (isPages === undefined) {
      setContent(value)
      onFieldChange(parentCollectionId as number, collectionId as number, value)
    } else {
      setPagesContent(value)
      onMarkDownChange(value)
    }
  }

  function handleResetFormatting (): void {
    const plainText = content
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      .replace(/~~(.*?)~~/g, '$1')
      .replace(/#+\s?(.*)/g, '$1')
      .replace(/>\s?(.*)/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      .replace(/-|\*|\+|\d+\./g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/---|\*\*\*/g, '')
      .replace(/<u>(.*?)<\/u>/g, '$1')
      .replace(/<\/?[^>]+(>|$)/g, '')
      .trim()

    handleEditorChange(plainText)
    setRenderKey(prev => prev + 1)
  }

  return (
    <div key={renderKey} className='w-full h-auto'>
      <div className={markdownClassStyle}>
        <ForwardRefEditor
          markdown={isPages ? pagesContent : content}
          editorRef={mkRef}
          onChange={handleEditorChange}
          onReset={handleResetFormatting}
        />
      </div>
    </div>
  )
}
