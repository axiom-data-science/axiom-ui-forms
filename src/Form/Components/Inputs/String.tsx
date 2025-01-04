import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import { Input } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const StringInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ''
  return <div>
      <Input
        id={field.id}
        testId={field.id}
        value={initialValue !== undefined && initialValue !== null ? String(initialValue) : ''}
        label={<FieldLabel {...field} />} onChange={(e) => {
          onChange(e)
        }} /></div>
}

export default StringInput
