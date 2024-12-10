import { type IFormField } from '@/Form/FormCreatorTypes'
import { Checkbox } from '@axdspub/axiom-ui-utilities'
import React, { useState, type ReactElement } from 'react'

const BooleanInput = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  const [value, setValue] = useState<boolean>(field.value === true)
  return (
                 <Checkbox
                    id={field.id}
                    testId={field.id}
                    label={<strong>{field.label}</strong>}
                    className='font-bold'
                    value={value}
                    onChange={(e) => {
                      field.value = e
                      setValue(e)
                      onChange()
                    }} />
  )
}

export default BooleanInput
