import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { type JSONSchema6 } from 'json-schema'
import React, { useState, type ReactElement } from 'react'

const MeditorForm = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>({})

  return (
        <FormWithEditorOverlay
            schemaState={schemaState}
            label='Meditor Form'
            />
  )
}

export default MeditorForm
