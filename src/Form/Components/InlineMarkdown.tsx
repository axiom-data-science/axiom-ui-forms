import React, { type ReactElement } from 'react'
import Markdown from 'react-markdown'

const InlineMarkdown = ({ children }: { children: string | null | undefined }): ReactElement => {
  return <Markdown components={{
    p: ({ children }) => <>{children}</>
  }}>{children}</Markdown>
}

export default InlineMarkdown
