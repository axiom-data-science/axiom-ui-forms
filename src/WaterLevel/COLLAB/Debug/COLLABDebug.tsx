import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { IFormFieldOverride, IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import { JSONSchema6 } from 'json-schema'
import { ReactElement, useState } from 'react'
import form from './form.json'
import fields from './fields.json'
import schema from './schema.json'

const COLLABDebug = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fields as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(form as IFormOverride)

  return (
    <FormWithEditorOverlay
      label="Water Level Form (COLLAB schema): from spreadsheet"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default COLLABDebug
