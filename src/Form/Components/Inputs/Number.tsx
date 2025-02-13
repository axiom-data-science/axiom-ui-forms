import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import { Input } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const NumberInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ''
  return <div>
      <Input
        id={field.id}
        testId={field.id}
        value={initialValue !== undefined && initialValue !== null ? String(initialValue) : ''}
        label={<FieldLabel {...field} />} onChange={(e) => {
          if (e !== undefined && !isNaN(+e)) {
            onChange(+e)
          } else {
            onChange(undefined)
          }
        }} /></div>
}

export default NumberInput
