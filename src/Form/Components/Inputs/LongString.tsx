import FieldLabel from '@/Form/Components/FieldLabel'
import { type ITextField, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { useDebounceCallback } from '@/utils/helpers'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const LongStringInput = ({
  field,
  onChange,
  value,
  className,
  disabled,
}: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ''
  const textField = field as ITextField
  const getValue = (): string => {
    return initialValue !== undefined && initialValue !== null ? String(initialValue) : ''
  }
  const debounced = useDebounceCallback(onChange, 200)
  return (
    <div>
      <TextArea
        className={className}
        id={field.id}
        testId={field.id}
        disabled={disabled}
        label={<FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />}
        placeholder={textField.placeholder ?? textField.example ?? ''}
        value={getValue()}
        onChange={debounced}
      />
    </div>
  )
}

export default LongStringInput
