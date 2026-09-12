import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import schema from ***REMOVED***./schema.json***REMOVED***
import fieldOverrides from ***REMOVED***./fields.json***REMOVED***
import formOverride from ***REMOVED***./form.json***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { IFormFieldOverride, IFormOverride } from ***REMOVED***@/library***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***

const SchemaWithOverridesAndEmbeddedObjectWrapperInArray = (): ReactElement => {
  const formValueState = useAtom(formValuesAtom)
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
  return (
    <FormWithEditorOverlay
      label={***REMOVED***Test: Schema with overrides and embedded object wrapper in array items***REMOVED***}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      formValueState={formValueState}
    />
  )
}

export default SchemaWithOverridesAndEmbeddedObjectWrapperInArray
