import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { IFormFieldOverride, IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import form from ***REMOVED***./form.json***REMOVED***
import fields from ***REMOVED***./fields.json***REMOVED***
import schema from ***REMOVED***./schema.json***REMOVED***

const COLLABDebug = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fields as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(form as IFormOverride)

  return (
    <FormWithEditorOverlay
      label="Water Level Form (COLLAB schema): from spreadsheet"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default COLLABDebug
