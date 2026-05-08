import {
  FieldDescriptionText,
  FieldDescriptionTooltip,
  FieldLabelText,
} from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { Checkbox } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const BooleanInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : false
  const descriptionPresentation = (field.settings as {descriptionPresentation?: string} | undefined)?.descriptionPresentation ?? 'default'
  return (
    <Checkbox
      id={field.id}
      testId={field.id}
      disabled={disabled}
      value={Boolean(initialValue)}
      onChange={(e) => {
        onChange(e)
      }}
      label={
        <>
          <FieldLabelText field={field} disabled={disabled} value={value} onChange={onChange} />{' '}
          {descriptionPresentation === 'inline' || descriptionPresentation === 'default' ? (
            <span className="ml-1">
              <FieldDescriptionTooltip field={field} disabled={disabled} />
            </span>
          ) : (
            <FieldDescriptionText field={field} disabled={disabled} />
          )}
        </>
      }
    />
  )
}

export default BooleanInput
