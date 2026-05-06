import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import schema from ***REMOVED***./schema.json***REMOVED***
import fieldOverrides from ***REMOVED***./fields.json***REMOVED***
import formOverride from ***REMOVED***./form.json***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { IFormFieldOverride, IFormOverride } from ***REMOVED***@/library***REMOVED***

const OverrideOfSchemaArray = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
  return (
    <FormWithEditorOverlay
      label={***REMOVED***Test: Override of schema array field with form/field overrides***REMOVED***}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default OverrideOfSchemaArray
