import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import schema from ***REMOVED***./oneOfObject.schema.json***REMOVED***
import { IForm, IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const OneOfObjectSchema = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as unknown as JSONSchema6)

  return (
    <FormWithEditorOverlay
      label="OneOf Object Schema Demo"
      schemaState={schemaState}
    />
  )
}

export const OneOfObjectSchemaSingleProp = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as unknown as JSONSchema6)
  const formOverrideState = useState<IFormOverride | undefined>({
    fields: [{ prop: ***REMOVED***field1***REMOVED*** }, { prop: ***REMOVED***transport***REMOVED*** }],
  })

  return (
    <FormWithEditorOverlay
      label="OneOf Object Schema Demo"
      schemaState={schemaState}
      formOverrideState={formOverrideState}
    />
  )
}


export default OneOfObjectSchema
