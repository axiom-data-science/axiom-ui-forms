import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { RadioGroup } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const RadioInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ''

  if (field.type === 'radio' && field.options !== undefined) {
    return <RadioGroup
        id={field.id}
        label={<FieldLabel field={field} disabled={disabled} />}
        testId={field.id}
        options={field.options}
        value={initialValue !== undefined && initialValue !== null ? String(initialValue) : ''}
        onChange={(e) => {
          onChange(e?.value)
        }}
      />
  }
  return <p>Field config for {field.id} is missing &apos;options&apos;</p>
}

export default RadioInput
