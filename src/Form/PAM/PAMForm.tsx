import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { IFormFieldOverride } from '@/library'
import { type IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import { pamSchema, pamForm } from './config'

const PAMForm = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(pamSchema)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState<IFormOverride | undefined>(pamForm)

  return (
    <FormWithEditorOverlay
      label="PAM"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default PAMForm
