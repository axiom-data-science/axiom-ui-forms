import { type IFormField, type ISelectField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Manager/Field/FieldLabel***REMOVED***
import { SelectInput } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

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
