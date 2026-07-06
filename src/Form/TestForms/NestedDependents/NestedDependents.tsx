import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import schema from ***REMOVED***./schema.json***REMOVED***
import fieldOverrides from ***REMOVED***./field_overrides.json***REMOVED***
import formOverrides from ***REMOVED***./form.json***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import { IFormFieldOverride, IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const NestedDependents = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverrides as IFormOverride)

  return (
    <FormWithEditorOverlay
      label="ObjectWrapper with Schema Overrides - Product Management"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default NestedDependents
