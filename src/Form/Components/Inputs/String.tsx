import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps, type ITextField } from '@/Form/Creator/FormCreatorTypes'
import { useDebounceCallback } from '@/utils/helpers'
import { Input } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const StringInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined && value !== null ? String(value) : ''
  const textField = field as ITextField
  const debounced = useDebounceCallback(onChange, 200)
  return (
    <div>
      <Input
        id={field.id}
        disabled={disabled}
        testId={field.id}
        variant="outline"
        value={initialValue}
        placeholder={textField.placeholder ?? textField.example ?? ''}
        label={<FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />}
        onChange={debounced}
      />
    </div>
  )
}

export default StringInput
