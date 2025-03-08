import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const LongStringInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ''
  const getValue = (): string => {
    return initialValue !== undefined && initialValue !== null ? String(initialValue) : ''
  }
  return <div>
      <TextArea
        id={field.id}
        testId={field.id}
        label={<FieldLabel {...field} />}
        value={getValue()}
        onChange={(e) => {
          onChange(e)
        }} /></div>
}

export default LongStringInput
