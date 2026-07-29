import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { SelectInput } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const SingleSelectInput = ({
  field,
  onChange,
  value,
  disabled,
  className,
}: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ''

  if (field.type === 'select' && field.options !== undefined) {
    return (
      <>
        <SelectInput
          id={field.id}
          className={className}
          label={<FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />}
          testId={field.id}
          options={field.options.map((option) => (
              {
                label: option.label,
                value: option.value
              }
            )
          )}
          includePrompt={field?.settings?.allowNull !== false}
          value={initialValue !== undefined && initialValue !== null ? String(initialValue) : ''}
          onChange={(e) => {
            onChange(e?.value)
          }}
        />
        {
          field?.settings?.showDescriptionForSelected && field.options.find((option) => option.value === value)?.description && (
            <FieldLabel
              field={{
                ...field,
                label: '',
                description: field.options.find((option) => option.value === value)?.description
              }}
              disabled={disabled}
            />
          )
        }
      </>
    )
  }
  return <p>Field config for {field.id} is missing &apos;options&apos;</p>
}

export default SingleSelectInput
