import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import schema from './schema.json'
import fieldOverrides from './fields.json'
import formOverrides from './form.json'
import { type JSONSchema6 } from 'json-schema'
import { type ReactElement, useState } from 'react'
import { type IFormFieldOverride, type IFormOverride } from '@/Form/Creator/FormCreatorTypes'

const DeepNestedObjectWrapper = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverrides as IFormOverride)

  return (
    <FormWithEditorOverlay
      label="Deep Nested ObjectWrapper"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default DeepNestedObjectWrapper
