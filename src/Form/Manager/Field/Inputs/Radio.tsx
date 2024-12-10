import { type IFormField, type IRadioField } from '@/Form/FormCreatorTypes'
import FieldLabel from '@/Form/Manager/Field/FieldLabel'
import React, { useState, type ReactElement } from 'react'

const RadioInput = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  const radioField = field as IRadioField
  const [value, setValue] = useState<string>(field.value !== undefined ? String(field.value) : '')
  return (
                 <>
                      <FieldLabel {...radioField} />
                      <div className={`${radioField?.layout === 'vertical' ? 'flex flex-col gap-2' : 'flex flex-row gap-4'}`}>
                           {
                                radioField.options.map((option) => {
                                  return <label key={option.value}>
                                          <input
                                               type='radio'
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
