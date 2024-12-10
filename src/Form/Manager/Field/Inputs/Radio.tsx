import { type IFormField, type IRadioField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Manager/Field/FieldLabel***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const RadioInput = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  const radioField = field as IRadioField
  const [value, setValue] = useState<string>(field.value !== undefined ? String(field.value) : ***REMOVED******REMOVED***)
  return (
                 <>
                      <FieldLabel {...radioField} />
                      <div className={`${radioField?.layout === ***REMOVED***vertical***REMOVED*** ? ***REMOVED***flex flex-col gap-2***REMOVED*** : ***REMOVED***flex flex-row gap-4***REMOVED***}`}>
                           {
                                radioField.options.map((option) => {
                                  return <label key={option.value}>
                                          <input
                                               type=***REMOVED***radio***REMOVED***
                                               name={radioField.id}
                                               value={option.value}
                                               onChange={(e) => {
                                                 field.value = e.target.value
                                                 setValue(e.target.value)
                                                 onChange()
                                               }}
                                               checked={value === option.value}
                                          /> {option.label}</label>
                                })
                           }
                      </div>
                 </>
  )
}

export default RadioInput
