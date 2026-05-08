import { FormContextProvider } from '@/Form/Creator/FormContextProvider'
import { type IForm, type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import React, { useState, type ReactElement } from 'react'

const NestedDataTest = (): ReactElement => {
  const form: IForm = {
    id: 'nested-data-test',
    label: 'Nested Data Test',
    fields: [
      {
        id: 'nested-data-test-field',
        label: 'Nested Data Field',
        type: 'text'
      },
      {
        id: 'nested-data-multi-object',
        label: 'Nested Multi Object',
        type: 'object',
        multiple: true,
        fields: [
          {
            id: 'nested-data-multi-object-field-1',
            label: 'Nested Object Field 1',
            type: 'text'
          },
          {
            id: 'nested-data-multi-object-field-2',
            label: 'Nested Object Field 2',
            type: 'number'
          }
        ]
      }
    ]
  }

  const [formValues, setFormValues] = useState<IFormValues>({})

  return (
    <FormContextProvider 
      form={form}
      formValues={formValues}
      setFormValues={setFormValues}
    >
      <div className='p-20'>
          <p>This is a nested data test.</p>
      </div>
    </FormContextProvider>
  )
}
export default NestedDataTest
