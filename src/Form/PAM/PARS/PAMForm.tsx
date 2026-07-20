import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import { IFormFieldOverride } from '@/library'
import { PAM_CONFIGS, type PamType } from './config'

interface PAMFormProps {
  pamType: PamType
}

const PAMForm = ({ pamType }: PAMFormProps): ReactElement => {
  const { schema, form, label } = PAM_CONFIGS[pamType]
  const schemaState = useState(schema)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState(form)

  return (
    <FormWithEditorOverlay
      label={label}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default PAMForm
