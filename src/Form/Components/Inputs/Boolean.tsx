import { FieldDescriptionText, FieldDescriptionTooltip, FieldLabelText } from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { Checkbox } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const BooleanInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : false
  return <Checkbox id={field.id} testId={field.id} disabled={disabled} label={<><FieldLabelText field={field} disabled={disabled} value={value} onChange={onChange} /> {
    (field.settings?.descriptionPresentation === 'inline' || field.settings?.descriptionPresentation === undefined)
      ? <FieldDescriptionTooltip field={field} disabled={disabled} />
      : <FieldDescriptionText field={field} disabled={disabled} />
  }</>} value={Boolean(initialValue)} onChange={(e) => {
    onChange(e)
  }}
  />
}

export default BooleanInput
