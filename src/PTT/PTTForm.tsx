import React, { useState, type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { type IFormOverride, type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'
import { useAtom } from 'jotai'
import rootFieldAtom from '@/PTT/rootFieldAtom'
import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'

const PTTForm = ({
  label,
  schema,
  formOverride,
  fieldOverrides
}: {
  label: string
  schema: JSONSchema6
  formOverride: IFormOverride
  fieldOverrides: IFormFieldOverride[]
}): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema)
  const fieldOverrideState = useState(fieldOverrides)
  const rootFieldOverrideState = useAtom(rootFieldAtom)

  const formOverrideState = useState<IFormOverride | undefined>(formOverride)

  return (
    <FormWithEditorOverlay
      label={label}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      rootFieldOverrideState={rootFieldOverrideState}
      />

  )
}

export default PTTForm
