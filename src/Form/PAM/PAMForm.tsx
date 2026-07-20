import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import { IFormFieldOverride } from '@/library'
import { pamSchema, pamForm } from './config'

const PAMForm = (): ReactElement => {
  const schemaState = useState(pamSchema)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState(pamForm)

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
