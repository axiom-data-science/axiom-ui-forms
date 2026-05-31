import { IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { FormWithEditorOverlay } from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***

const form: IForm = {
  id: ***REMOVED***objectWrapper***REMOVED***,
  label: ***REMOVED***Object wrapper test***REMOVED***,
  fields: [
    {
      id: ***REMOVED***wrapper***REMOVED***,
      label: ***REMOVED***Wrapper object***REMOVED***,
      type: ***REMOVED***objectWrapper***REMOVED***,
      fields: [
        {
          id: ***REMOVED***field1***REMOVED***,
          label: ***REMOVED***Field 1***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
        },
        {
          id: ***REMOVED***field2***REMOVED***,
          label: ***REMOVED***Field 2***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
        },
      ],
    },
  ],
}

const ObjectWrapper = (): ReactElement => {
  const formState = useState<IForm | undefined>(form)

  return <FormWithEditorOverlay formState={formState} />
}

export default ObjectWrapper
