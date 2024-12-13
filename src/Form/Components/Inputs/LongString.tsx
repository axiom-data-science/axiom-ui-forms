import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import formValuesAtom from '@/state/formValuesAtom'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import { useAtom } from 'jotai'
import React, { type ReactElement } from 'react'

const LongStringInput = ({ field, onChange }: IFieldInputProps): ReactElement => {
  const [formValues] = useAtom(formValuesAtom)
  return <div>
      <TextArea id={field.id} testId={field.id} label={<FieldLabel {...field} />} value={formValues[field.id] !== undefined ? String(formValues[field.id]) : ''} onChange={(e) => {
        onChange(e)
      }} /></div>
}

export default LongStringInput
