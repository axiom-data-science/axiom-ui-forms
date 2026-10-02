import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { IFormFieldOverride } from '@/library'
import { type IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import form from './form.json'
import schema from './schema.json'

const PARSForm = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as unknown as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState<IFormOverride | undefined>(form as IFormOverride)

  return (
    <FormWithEditorOverlay
      label="PAM"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default PARSForm
