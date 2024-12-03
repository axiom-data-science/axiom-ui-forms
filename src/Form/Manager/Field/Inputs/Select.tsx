import { type IFormField, type ISelectField } from '@/Form/FormCreatorTypes'
import FieldLabel from '@/Form/Manager/Field/FieldLabel'
import { SelectInput } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const Select = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  const selectField = field as ISelectField
  return (
                 <SelectInput
                      label={<FieldLabel {...selectField} />}
                      id={selectField.id}
                      testId={selectField.id}
                      value={field.value !== undefined ? String(field.value) : undefined}
                      onChange={(e) => {
                        field.value = e?.value
                        if (onChange !== undefined) {
                          onChange()
                        }
                      }}
                      options={selectField.options}
                 />
  )
}

export default Select
