import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import { IFormFieldOverride } from ***REMOVED***@/library***REMOVED***
import { pamSchema, pamForm } from ***REMOVED***./config***REMOVED***

const PAMForm = (): ReactElement => {
  const schemaState = useState(pamSchema)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState(pamForm)

  return (
    <FormWithEditorOverlay
      label="PAM"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default PAMForm
