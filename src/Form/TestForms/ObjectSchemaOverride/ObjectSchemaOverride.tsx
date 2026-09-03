import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import schema from ***REMOVED***./schema.json***REMOVED***
import formOverride from ***REMOVED***./form.json***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { IFormFieldOverride, IFormOverride } from ***REMOVED***@/library***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***

const ObjectSchemaOverride = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>([] as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
   const [formValues, setFormValues] = useAtom(formValuesAtom)
  return (
    <FormWithEditorOverlay
      label={***REMOVED***Test: Override schema object with some fields nested in objectwrappers and no parent***REMOVED***}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      formValueState={[formValues, setFormValues]}
    />
  )
}


export default ObjectSchemaOverride
