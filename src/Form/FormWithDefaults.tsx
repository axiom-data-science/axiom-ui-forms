import { FormCreator } from ***REMOVED***@/Form***REMOVED***
import { type IForm, type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import React, { type ReactElement, useState } from ***REMOVED***react***REMOVED***

const form: IForm = {
  label: ***REMOVED***Form with preset defaults***REMOVED***,
  id: ***REMOVED***hasDefaults***REMOVED***,
  description: ***REMOVED***This form has preset default values for the fields***REMOVED***,
  fields: [
    {
      type: ***REMOVED***text***REMOVED***,
      id: ***REMOVED***name***REMOVED***,
      label: ***REMOVED***Name***REMOVED***,
      defaultValue: ***REMOVED***John Doe***REMOVED***
    },
    {
      type: ***REMOVED***long_text***REMOVED***,
      id: ***REMOVED***description***REMOVED***,
      label: ***REMOVED***Description***REMOVED***,
      defaultValue: ***REMOVED***This is a long string***REMOVED***
    },
    {
      type: ***REMOVED***text***REMOVED***,
      id: ***REMOVED***mult***REMOVED***,
      label: ***REMOVED***A list***REMOVED***,
      defaultValue: [***REMOVED***First***REMOVED***, ***REMOVED***Second***REMOVED***, ***REMOVED***Third***REMOVED***],
      multiple: true
    },
    {
      type: ***REMOVED***number***REMOVED***,
      id: ***REMOVED***num***REMOVED***,
      label: ***REMOVED***A number***REMOVED***,
      defaultValue: 10
    },
    {
      type: ***REMOVED***geometry***REMOVED***,
      id: ***REMOVED***geom***REMOVED***,
      label: ***REMOVED***A geometry***REMOVED***,
      defaultValue: {
        coordinates: [
          -120,
          34
        ],
        type: ***REMOVED***Point***REMOVED***
      }
    },
    {
      type: ***REMOVED***object***REMOVED***,
      id: ***REMOVED***obj***REMOVED***,
      label: ***REMOVED***Object Wrapper***REMOVED***,
      fields: [
        {
          id: ***REMOVED***ob-wrap***REMOVED***,
          type: ***REMOVED***object***REMOVED***,
          layout: ***REMOVED***horizontal***REMOVED***,
          skip_path: true,
          fields: [
            {
              id: ***REMOVED***val1***REMOVED***,
              label: ***REMOVED***Value 1***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              defaultValue: ***REMOVED***Value 1 Default***REMOVED***
            },
            {
              id: ***REMOVED***val2***REMOVED***,
              label: ***REMOVED***Value 2***REMOVED***,
              type: ***REMOVED***number***REMOVED***,
              defaultValue: 42
            }
          ]

        }
      ]

    }
  ]
}

const FormWithDefaults = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div className=***REMOVED***p-20 flex-col gap-10***REMOVED***>
        <FormCreator form={form} formValueState={formValueState} />
        <pre className=***REMOVED***p-10 bg-slate-100 text-sm font-mono***REMOVED***>
            {JSON.stringify(formValueState[0], null, 2)}
        </pre>
    </div>
  )
}

export default FormWithDefaults
