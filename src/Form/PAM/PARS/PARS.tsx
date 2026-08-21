import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { IFormFieldOverride } from ***REMOVED***@/library***REMOVED***
import { type IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import form from ***REMOVED***./form.json***REMOVED***
import schema from ***REMOVED***./schema.json***REMOVED***

const PARSForm = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState<IFormOverride | undefined>(form as IFormOverride)

  return (
    <FormWithEditorOverlay
      label="PAM"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default PARSForm
