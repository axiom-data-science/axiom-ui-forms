import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import { IFormFieldOverride } from ***REMOVED***@/library***REMOVED***
import { PAM_CONFIGS, type PamType } from ***REMOVED***./config***REMOVED***

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
