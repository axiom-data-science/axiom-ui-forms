import InlineMarkdown from ***REMOVED***@/Form/Components/InlineMarkdown***REMOVED***
import type { IForm } from ***REMOVED***@/library***REMOVED***
import { ExclamationTriangleIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import Markdown from ***REMOVED***react-markdown***REMOVED***

const FormHeader = ({
  form, note, error

}: {
  form: IForm
  note?: string
  error?: string
}): ReactElement => {
  return (
    <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
      <h2 className=***REMOVED***text-2xl font-bold***REMOVED***>{form.label}</h2>
      {note !== undefined
        ? <Markdown>{note}</Markdown>
        : null}
      {error !== undefined
        ? <p className=***REMOVED***pb-4 text-rose-800***REMOVED***><ExclamationTriangleIcon className=***REMOVED***inline mr-2***REMOVED*** /> <InlineMarkdown>{error}</InlineMarkdown></p>
        : null}
      {form.description !== undefined
        ? <Markdown>{form.description}</Markdown>
        : null}
    </div>
  )
}

export default FormHeader
