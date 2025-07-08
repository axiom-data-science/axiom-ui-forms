import { FormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { type IForm, type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const NestedDataTest = (): ReactElement => {
  const form: IForm = {
    id: ***REMOVED***nested-data-test***REMOVED***,
    label: ***REMOVED***Nested Data Test***REMOVED***,
    fields: [
      {
        id: ***REMOVED***nested-data-test-field***REMOVED***,
        label: ***REMOVED***Nested Data Field***REMOVED***,
        type: ***REMOVED***text***REMOVED***
      },
      {
        id: ***REMOVED***nested-data-multi-object***REMOVED***,
        label: ***REMOVED***Nested Multi Object***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        multiple: true,
        fields: [
          {
            id: ***REMOVED***nested-data-multi-object-field-1***REMOVED***,
            label: ***REMOVED***Nested Object Field 1***REMOVED***,
            type: ***REMOVED***text***REMOVED***
          },
          {
            id: ***REMOVED***nested-data-multi-object-field-2***REMOVED***,
            label: ***REMOVED***Nested Object Field 2***REMOVED***,
            type: ***REMOVED***number***REMOVED***
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
    <div className=***REMOVED***p-20***REMOVED***>
        <p>This is a nested data test.</p>
    </div>
    </FormContext.Provider>
  )
}
export default NestedDataTest
