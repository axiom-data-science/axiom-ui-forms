import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import schema from './schema.json'
import formOverride from './form.json'
import { JSONSchema6 } from 'json-schema'
import { IFormFieldOverride, IFormOverride } from '@/library'
import formValuesAtom from '@/state/formValuesAtom'
import { useAtom } from 'jotai'

const ObjectSchemaOverride = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>([] as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
   const [formValues, setFormValues] = useAtom(formValuesAtom)
  return (
    <FormWithEditorOverlay
      label={'Test: Override schema object with some fields nested in objectwrappers and no parent'}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      formValueState={[formValues, setFormValues]}
    />
  )
}


export default ObjectSchemaOverride
