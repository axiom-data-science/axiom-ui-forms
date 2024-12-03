import { type IFormField } from '@/Form/FormCreatorTypes'
import FieldLabel from '@/Form/Manager/Field/FieldLabel'
import { Input } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const Text = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  return (
                 <Input label={<FieldLabel {...field} />} id={field.id} testId={field.id} value={field.value !== undefined ? String(field.value) : undefined} onChange={(e) => {
                   field.value = e
                   if (onChange !== undefined) {
                     onChange()
                   }
                 }} />
  )
}

export default Text
