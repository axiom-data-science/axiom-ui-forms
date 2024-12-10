import { type IFormField } from '@/Form/FormCreatorTypes'
import FieldLabel from '@/Form/Manager/Field/FieldLabel'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import React, { useState, type ReactElement } from 'react'

const LongText = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  const [value, setValue] = useState<string>(field.value !== undefined ? String(field.value) : '')
  return (
        <TextArea
            label={<FieldLabel {...field} />}
            id={field.id}
            testId={field.id}
            value={value}
            onChange={(e) => {
              field.value = e
              setValue(e !== undefined ? String(e) : '')
              onChange()
            }}
        />
  )
}

export default LongText
