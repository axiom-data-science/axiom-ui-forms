import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import schema from './schema.json'
import fieldOverrides from './fields.json'
import formOverride from './form.json'
import { JSONSchema6 } from 'json-schema'
import { IFormFieldOverride, IFormOverride } from '@/library'

const ArrayWithTabs = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
  return (
    <FormWithEditorOverlay
      label={'Test: Array with tabs layout for array item fields'}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default ArrayWithTabs
