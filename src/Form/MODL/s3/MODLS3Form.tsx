import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import schema from './schema.json'
import fieldOverrides from './field_overrides.json'
import formOverride from './form.json'
import { JSONSchema6 } from 'json-schema'
import { IFormFieldOverride, IFormOverride } from '@/Form/Creator/FormCreatorTypes'

const MODLForm = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
  return (
    <FormWithEditorOverlay
      label={'MODL Form'}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default MODLForm
