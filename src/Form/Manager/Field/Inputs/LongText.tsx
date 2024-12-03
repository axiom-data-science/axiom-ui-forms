import { type IFormField } from '@/Form/FormCreatorTypes'
import FieldLabel from '@/Form/Manager/Field/FieldLabel'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const LongText = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  return (
        <TextArea
            label={<FieldLabel {...field} />}
            id={field.id}
            testId={field.id}
            value={field.value !== undefined ? String(field.value) : undefined}
            onChange={(e) => {
              field.value = e
              onChange()
            }}
        />
  )
}

export default LongText
