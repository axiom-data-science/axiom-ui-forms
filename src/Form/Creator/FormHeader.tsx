import InlineMarkdown from '@/Form/Components/InlineMarkdown'
import type { IForm } from '@/library'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import React, { type ReactElement } from 'react'
import Markdown from 'react-markdown'

const FormHeader = ({
  form, note, error

}: {
  form: IForm
  note?: string
  error?: string
}): ReactElement => {
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-2xl font-bold'><InlineMarkdown>{form.label}</InlineMarkdown></h2>
      {note !== undefined
        ? <div><InlineMarkdown>{note}</InlineMarkdown></div>
        : null}
      {error !== undefined
        ? <p className='pb-4 text-rose-800'><ExclamationTriangleIcon className='inline mr-2' /> <InlineMarkdown>{error}</InlineMarkdown></p>
        : null}
      {form.description !== undefined
        ? <div><InlineMarkdown>{form.description}</InlineMarkdown></div>
        : null}
    </div>
  )
}

export default FormHeader
