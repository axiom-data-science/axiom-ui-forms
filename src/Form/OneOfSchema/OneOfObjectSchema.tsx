import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { JSONSchema6 } from 'json-schema'
import { ReactElement, useState } from 'react'
import schema from './oneOfObject.schema.json'
import { IForm, IFormOverride } from '@/Form/Creator/FormCreatorTypes'

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
    fields: [{ prop: 'field1' }, { prop: 'transport' }],
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
