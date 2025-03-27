import { type IFormField } from '@/Form/Creator/FormCreatorTypes'
import { Tooltip } from '@axdspub/axiom-ui-utilities'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import React, { type ReactElement } from 'react'
import Markdown from 'react-markdown'

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
    <strong><MarkdownText>{field.label}</MarkdownText> { field.required === true ? <span className='text-red-500'>*</span> : ''}</strong>
  )
}

export const FieldDescriptionText = (field: IFormField): ReactElement => {
  return (
    <>{
      field.description !== undefined
        ? <p className='text-xs py-2'><MarkdownText>{field.description}</MarkdownText></p>
        : ''
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
