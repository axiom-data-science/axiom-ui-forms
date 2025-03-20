import { FieldLabelText } from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { Checkbox, Tooltip } from '@axdspub/axiom-ui-utilities'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import React, { type ReactElement } from 'react'

const BooleanInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : false
  return <Checkbox id={field.id} testId={field.id} label={<><FieldLabelText {...field} /> {
    field.description !== undefined
      ? <Tooltip content={field.description}><InfoCircledIcon /></Tooltip>
      : ''
  }</>} value={Boolean(initialValue)} onChange={(e) => {
    onChange(e)
  }} />
}

export default BooleanInput
