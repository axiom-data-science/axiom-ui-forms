import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import { SelectInput } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const SingleSelectInput = ({ field, onChange }: IFieldInputProps): ReactElement => {
  if (field.type === 'select' && field.options !== undefined) {
    return <SelectInput
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

export default SingleSelectInput
