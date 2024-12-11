import { type IFormField, type ISelectField } from '@/Form/FormCreatorTypes'
import Text from '@/Form/Manager/Field/Inputs/Text'
import { type ISelectProps, type ITextInputProps, SelectInput } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const Select = ({ field, onChange, InputComponent }: { field: IFormField, onChange: () => void, InputComponent?: React.FC<ISelectProps> }): ReactElement => {
  const selectField = field as ISelectField
  const SelectComponent = InputComponent ?? SelectInput
  return <Text field={field} onChange={onChange} InputComponent={(props: ITextInputProps): ReactElement => {
    return <SelectComponent {...props} options={selectField.options} onChange={(op) => {
      const value = op?.value !== undefined ? String(op.value) : ''
      props.onChange?.(value)
    }} />
  }} />
}

export default Select
