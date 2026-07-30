import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import schema from ***REMOVED***./oneOfSimple.schema.json***REMOVED***

const OneOfSimpleSchema = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const formOverrideState = useState<IFormOverride | undefined>({
    fields: [{ prop: ***REMOVED***mode***REMOVED*** }],
  })

  return (
    <FormWithEditorOverlay
      label="OneOf Simple Schema Demo"
      schemaState={schemaState}
      formOverrideState={formOverrideState}
    />
  )
}

export default OneOfSimpleSchema
