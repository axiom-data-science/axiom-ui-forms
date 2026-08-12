import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import schema from './schema.json'
import fieldOverrides from './fields.json'
import formOverrides from './form.json'
import { JSONSchema6 } from 'json-schema'
import { ReactElement, useState } from 'react'
import { IFormFieldOverride, IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import { Button } from '@axdspub/axiom-ui-utilities'

const FormWithPagesAndSubmitButton = ():ReactElement => {
      const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverrides as IFormOverride)

  return (
    <FormWithEditorOverlay
      label="Form With Pages And Submit Button"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      SubmitButton={<Button type='submit' onClick={()=>{
        alert('subminted')
      }}>Submint for good!</Button>}
    />
  )

}

export default FormWithPagesAndSubmitButton