import FieldLabel from '@/Form/Components/FieldLabel'
import { type ITextField, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const LongStringInput = ({ field, onChange, value, className, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ''
  const textField = field as ITextField
  const getValue = (): string => {
    return initialValue !== undefined && initialValue !== null ? String(initialValue) : ''
  }
  return <div>
      <TextArea
        className={className}
        id={field.id}
        testId={field.id}
        label={<FieldLabel field={field} disabled={disabled} />}
        placeholder={textField.placeholder}
        value={getValue()}
        onChange={(e) => {
          onChange(e)
        }} /></div>
}

export default LongStringInput
