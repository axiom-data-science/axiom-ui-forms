import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import schema from ***REMOVED***./schema.json***REMOVED***
import fieldOverrides from ***REMOVED***./fields.json***REMOVED***
import formOverrides from ***REMOVED***./form.json***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import { IFormFieldOverride, IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Button } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***

const FormWithPagesAndSubmitButton = ():ReactElement => {
      const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverrides as IFormOverride)

  return (
    <FormWithEditorOverlay
      label="Form With Pages And Submit Button"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      SubmitButton={<Button type=***REMOVED***submit***REMOVED*** onClick={()=>{
        alert(***REMOVED***subminted***REMOVED***)
      }}>Submint for good!</Button>}
    />
  )

}

export default FormWithPagesAndSubmitButton