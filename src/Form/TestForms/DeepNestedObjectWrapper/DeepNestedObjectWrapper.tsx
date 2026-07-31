import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import schema from ***REMOVED***./schema.json***REMOVED***
import fieldOverrides from ***REMOVED***./fields.json***REMOVED***
import formOverrides from ***REMOVED***./form.json***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { type ReactElement, useState } from ***REMOVED***react***REMOVED***
import { type IFormFieldOverride, type IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const DeepNestedObjectWrapper = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverrides as IFormOverride)

  return (
    <FormWithEditorOverlay
      label="Deep Nested ObjectWrapper"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default DeepNestedObjectWrapper
