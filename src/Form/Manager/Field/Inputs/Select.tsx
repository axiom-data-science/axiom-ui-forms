import { type IFormField, type ISelectField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Manager/Field/FieldLabel***REMOVED***
import { SelectInput } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const Select = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  const selectField = field as ISelectField
  const [value, setValue] = useState<string>(field.value !== undefined ? String(field.value) : ***REMOVED******REMOVED***)
  return (
                 <SelectInput
                      label={<FieldLabel {...selectField} />}
                      id={selectField.id}
                      testId={selectField.id}
                      value={value}
                      onChange={(e) => {
                        field.value = e?.value
                        setValue(e?.value !== undefined ? String(e?.value) : ***REMOVED******REMOVED***)
                        if (onChange !== undefined) {
                          onChange()
                        }
                      }}
                      options={selectField.options}
                 />
  )
}

export default Select
