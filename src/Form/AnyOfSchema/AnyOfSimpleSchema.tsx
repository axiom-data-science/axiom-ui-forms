import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import schema from ***REMOVED***./anyOfSimple.schema.json***REMOVED***

const AnyOfSimpleSchema = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const formOverrideState = useState<IFormOverride | undefined>({
    fields: [{ prop: ***REMOVED***channels***REMOVED*** }],
  })

  return (
    <FormWithEditorOverlay
      label="AnyOf Simple Schema Demo"
      schemaState={schemaState}
      formOverrideState={formOverrideState}
    />
  )
}

export default AnyOfSimpleSchema
