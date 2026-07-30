import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import { JSONSchema6 } from 'json-schema'
import { ReactElement, useState } from 'react'
import schema from './oneOfSimple.schema.json'

const OneOfSimpleSchema = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const formOverrideState = useState<IFormOverride | undefined>({
    fields: [{ prop: 'mode' }],
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
