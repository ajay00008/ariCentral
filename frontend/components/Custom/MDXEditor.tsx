'use client'

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  toolbarPlugin
} from '@mdxeditor/editor'

export interface EditorProps {
  markdown: string
  editorRef: React.ForwardedRef<MDXEditorMethods>
  onChange: (value: string) => void
  onReset: () => void
}

function Editor ({ markdown, editorRef, onChange, onReset }: EditorProps): React.ReactNode {
  return (
    <MDXEditor
      onChange={(e) => onChange(e)}
      ref={editorRef}
      markdown={markdown}
      className='border border-greySeparator'
      plugins={[toolbarPlugin({
        toolbarContents: () => (
          <>
            {' '}
            <UndoRedo />
            <BoldItalicUnderlineToggles />
            <BlockTypeSelect />
            <CreateLink />
            <ListsToggle options={['bullet', 'number']} />
          </>
        )
      }), headingsPlugin(), listsPlugin(), linkPlugin(), linkDialogPlugin()]}
    />
  )
}

export default Editor
