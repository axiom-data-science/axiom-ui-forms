import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps, type ITextField } from '@/Form/Creator/FormCreatorTypes'
import { createTextFieldDebounce } from '@/utils/helpers'
import { Input } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const StringInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = (value !== undefined && value !== null) ? String(value) : ''
  const textField = field as ITextField
  const debounced = createTextFieldDebounce(onChange, 200)
  return <div>
      <Input
        id={field.id}
        disabled={disabled}
        testId={field.id}
        value={initialValue}
        placeholder={textField.placeholder}
        label={<FieldLabel
            field={field}
            disabled={disabled}
            value={value}
            onChange={onChange}
          />
        } onChange={debounced} /></div>
}

export default StringInput
