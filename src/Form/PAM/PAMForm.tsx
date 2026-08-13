import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { IFormFieldOverride } from ***REMOVED***@/library***REMOVED***
import { type IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { pamSchema, pamForm } from ***REMOVED***./config***REMOVED***

const PAMForm = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(pamSchema)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState<IFormOverride | undefined>(pamForm)

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
