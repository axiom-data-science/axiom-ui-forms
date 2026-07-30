import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import schema from ***REMOVED***./anyOfObject.schema.json***REMOVED***

const AnyOfObjectSchema = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as unknown as JSONSchema6)

  return (
    <FormWithEditorOverlay
      label="AnyOf Object Schema Demo"
      schemaState={schemaState}
    />
  )
}

export const AnyOfObjectSchemaSingleProp = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as unknown as JSONSchema6)
  const formOverrideState = useState<IFormOverride | undefined>({
    fields: [{ prop: ***REMOVED***processor***REMOVED*** }],
  })

  return (
    <FormWithEditorOverlay
      label="AnyOf Object Schema Demo"
      schemaState={schemaState}
      formOverrideState={formOverrideState}
    />
  )
}

export default AnyOfObjectSchema
