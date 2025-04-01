import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import Markdown from ***REMOVED***react-markdown***REMOVED***

const InlineMarkdown = ({ children }: { children: string | null | undefined }): ReactElement => {
  return <Markdown components={{
    p: ({ children }) => <>{children}</>
  }}>{children}</Markdown>
}

export default InlineMarkdown
