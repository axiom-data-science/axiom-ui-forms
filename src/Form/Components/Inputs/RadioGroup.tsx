import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import { RadioGroup } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const RadioInput = ({ field, onChange }: IFieldInputProps): ReactElement => {
  if (field.type === 'radio' && field.options !== undefined) {
    return <RadioGroup
        id={field.id}
        label={<FieldLabel {...field} />}
        testId={field.id}
        options={field.options}
        onChange={(e) => {
          onChange(e?.value)
        }}
      />
  }
  return <p>Field config for {field.id} is missing &apos;options&apos;</p>
}

export default RadioInput
