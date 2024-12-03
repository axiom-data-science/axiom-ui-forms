import { type IFormField } from '@/Form/FormCreatorTypes'
import { Checkbox } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const BooleanInput = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  return (
                 <Checkbox
                    id={field.id}
                    testId={field.id}
                    label={<strong>{field.label}</strong>}
                    className='font-bold'
                    value={field.value === true}
                    onChange={(e) => {
                      field.value = e
                      onChange()
                    }} />
  )
}

export default BooleanInput
