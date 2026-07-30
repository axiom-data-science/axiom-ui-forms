import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import { JSONSchema6 } from 'json-schema'
import { ReactElement, useState } from 'react'
import schema from './anyOfObject.schema.json'

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
    fields: [{ prop: 'processor' }],
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
