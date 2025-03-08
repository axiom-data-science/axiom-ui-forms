import { FieldLabelText } from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { Checkbox } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const BooleanInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : false
  return <Checkbox id={field.id} testId={field.id} label={<FieldLabelText {...field} />} value={Boolean(initialValue)} onChange={(e) => {
    onChange(e)
  }} />
}

export default BooleanInput
