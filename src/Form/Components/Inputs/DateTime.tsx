import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps, type ITextField } from '@/Form/Creator/FormCreatorTypes'
import { useDebounceCallback } from '@/utils/helpers'
import { DatePicker, Input } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const DateTimeInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined && value !== null ? String(value) : ''
  const textField = field as ITextField
  return (
    <div>
      <DatePicker
        id={field.id}
        disabled={disabled}
        testId={field.id}
        variant="outline"
        value={initialValue}
        placeholder={textField.placeholder ?? textField.example ?? ''}
        label={<FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />}
        onChange={(e) => {
          return e !== undefined ? onChange(e.toISOString().split('T')[0]) : onChange(undefined)
        }}
      />
    </div>
  )
}

export default DateTimeInput
