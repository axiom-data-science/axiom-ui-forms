import { FormContext } from '@/Form/Creator/FormContextProvider'
import { type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import React, { useState, type ReactElement } from 'react'

const NestedDataTest = (): ReactElement => {
  const form: IForm = {
    id: 'nested-data-test',
    label: 'Nested Data Test',
    fields: [
      {
        id: 'nested-data-test-field',
        label: 'Nested Data Field',
        type: 'text',
        value: ''
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
            type: 'text',
            value: ''
          },
          {
            id: 'nested-data-multi-object-field-2',
            label: 'Nested Object Field 2',
            type: 'number',
            value: 0
          }
        ]
      }
    ]
  }

  const [formValues, setFormValues] = useState<IFormValues>({})

  return (
    <FormContext.Provider value={{
      form,
      formValues,
      setFormValues
    }}>
    <div className='p-20'>
        <p>This is a nested data test.</p>
    </div>
    </FormContext.Provider>
  )
}
export default NestedDataTest
