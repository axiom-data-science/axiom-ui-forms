import React, { type ReactElement } from 'react'
import Markdown from 'react-markdown'

const InlineMarkdown = ({ children }: { children: string | null | undefined }): ReactElement => {
  return <Markdown components={{
    p: ({ children }) => <>{children}</>,
    a: ({ children, href }) => <a href={href} target={href?.match(/^http/) ? '_blank' : undefined} rel="noopener noreferrer" className="text-blue-500 hover:underline">{children}</a>
  }}>{children}</Markdown>
}

export default InlineMarkdown
