import { FieldLabelText } from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import formValuesAtom from '@/state/formValuesAtom'
import { Checkbox } from '@axdspub/axiom-ui-utilities'
import { useAtom } from 'jotai'
import React, { type ReactElement } from 'react'

const BooleanInput = ({ field, onChange }: IFieldInputProps): ReactElement => {
  const [formValues] = useAtom(formValuesAtom)
  return <Checkbox id={field.id} testId={field.id} label={<FieldLabelText {...field} />} value={Boolean(formValues[field.id])} onChange={(e) => {
    onChange(e)
  }} />
}

export default BooleanInput
