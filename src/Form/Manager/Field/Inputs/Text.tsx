import { type IFormField } from '@/Form/FormCreatorTypes'
import FieldLabel from '@/Form/Manager/Field/FieldLabel'
import { Input } from '@axdspub/axiom-ui-utilities'
import React, { useState, type ReactElement } from 'react'

const Text = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  const [value, setValue] = useState<string>(field.value !== undefined ? String(field.value) : '')
  return (
                 <Input label={<FieldLabel {...field} />} id={field.id} testId={field.id} value={value} onChange={(e) => {
                   field.value = e
                   setValue(e !== undefined ? String(e) : '')
                   onChange()
                 }} />
  )
}

export default Text
