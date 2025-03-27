import { type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { InfoCircledIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import Markdown from ***REMOVED***react-markdown***REMOVED***

export const MarkdownText = ({ children }: { children: string | null | undefined }): ReactElement => {
  return <Markdown components={{
    p: ({ children }) => <>{children}</>
  }}>{children}</Markdown>
}

export const FieldDescriptionTooltip = (field: IFormField): ReactElement => {
  return (
    field.description !== undefined
      ? <Tooltip content={field.description}><InfoCircledIcon /></Tooltip>
      : <></>
  )
}

export const FieldLabelText = (field: IFormField): ReactElement => {
  return (
    <strong><MarkdownText>{field.label}</MarkdownText> { field.required === true ? <span className=***REMOVED***text-red-500***REMOVED***>*</span> : ***REMOVED******REMOVED***}</strong>
  )
}

export const FieldDescriptionText = (field: IFormField): ReactElement => {
  return (
    <>{
      field.description !== undefined
        ? <p className=***REMOVED***text-xs py-2***REMOVED***><MarkdownText>{field.description}</MarkdownText></p>
        : ***REMOVED******REMOVED***
    }</>
  )
}

const FieldLabel = (field: IFormField): ReactElement => {
  return <>
    <p><FieldLabelText {...field} /></p>
    <FieldDescriptionText {...field} />

  </>
}

export default FieldLabel
