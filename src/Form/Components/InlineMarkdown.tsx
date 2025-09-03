import { OpenInNewWindowIcon } from '@radix-ui/react-icons'
import React, { type ReactElement } from 'react'
import Markdown from 'react-markdown'

const InlineMarkdown = ({ children }: { children: string | null | undefined }): ReactElement => {
  return <Markdown components={{
    p: ({ children }) => <>{children}</>,
    a: ({ children, href }) => {
      const isExternal = href?.match(/^http/)
      return (
      <a href={href} target={isExternal ? '_blank' : undefined} rel="noopener noreferrer" className="text-blue-500 hover:underline">{children}{isExternal ? <OpenInNewWindowIcon className='inline ml-1' /> : ''}</a>
      )
    },
    ul: ({ children }) => <ul className="list-disc list-inside ml-4 my-2">{children}</ul>,
  }}>{children}</Markdown>
}

export default InlineMarkdown
