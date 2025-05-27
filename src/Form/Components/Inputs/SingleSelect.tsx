import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { SelectInput } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const SingleSelectInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ''

  if (field.type === 'select' && field.options !== undefined) {
    return <SelectInput
        id={field.id}
        label={<FieldLabel {...field} />}
        testId={field.id}
        options={field.options}
        includePrompt = {field?.settings?.allowNull !== false}
        value={initialValue !== undefined && initialValue !== null ? String(initialValue) : ''}
        onChange={(e) => {
          onChange(e?.value)
        }}
      />
  }
  return <p>Field config for {field.id} is missing &apos;options&apos;</p>
}

export default SingleSelectInput
