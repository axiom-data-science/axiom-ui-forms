import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import formValuesAtom from '@/state/formValuesAtom'
import { Input } from '@axdspub/axiom-ui-utilities'
import { useAtom } from 'jotai'
import React, { type ReactElement } from 'react'

const StringInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const [formValues] = useAtom(formValuesAtom)
  const initialValue = value !== undefined ? value : formValues[field.id] !== undefined ? String(formValues[field.id]) : ''
  return <div>
      <Input
        id={field.id}
        testId={field.id}
        value={initialValue !== undefined && initialValue !== null ? String(initialValue) : ''}
        label={<FieldLabel {...field} />} onChange={(e) => {
          onChange(e)
        }} /></div>
}

export default StringInput
