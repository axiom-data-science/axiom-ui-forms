import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import { atom, useAtomValue } from 'jotai'

import { type JSONSchema6 } from 'json-schema'
import { IFormFieldOverride } from '@/library'
import { type IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import project_form from './project_form.json'
import project_schema from './project_schema.json'
import site_form from './site_form.json'
import site_schema from './site_schema.json'
import deployment_form from './deployment_form.json'
import deployment_schema from './deployment_schema.json'
import { Button } from '@axdspub/axiom-ui-utilities'
import { validateAgainstSchema } from '@/utils/schemaToFormHelpers'
import { getFormPayload } from '@/utils/getters'
import { useFormContext, useFormValues } from '@/Form/Creator/FormContextProvider'
import { useSetAtom } from 'jotai'
import { resolveRefs } from '@/utils/resolveRefs'

const errorAtom = atom<string[]>([])


const SubmitButton = ({schema}: {schema: JSONSchema6}): ReactElement => {
  const { form } = useFormContext()
  const formValues = useFormValues()
  const payload = getFormPayload(formValues, form)
  const setErrors = useSetAtom(errorAtom)
  const resolvedSchema = resolveRefs(schema ?? {})
  return (
    <Button
      type="submit"
      onClick={()=>{
        const newErrors = validateAgainstSchema(
          resolvedSchema,
          payload
        )
        console.log(newErrors)
        setErrors(newErrors.length === 0 ? [] : newErrors.map((error) => error.message))
      }}
    >
      Submit
    </Button>
  )
}


const TugboatForm = ({
  formOverride,
  schema
}:{
  formOverride: IFormOverride,
  schema: JSONSchema6
}):ReactElement => {

  const schemaState = useState<JSONSchema6 | undefined>(schema as unknown as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState<IFormOverride | undefined>(formOverride)
  const errors = useAtomValue(errorAtom)

  return (
    <div>
      {errors.length > 0 && (
        <div className='px-10 pt-8'>
          {errors.map((error, index) => (
            <p key={index} style={{ color: 'red' }}>{error}</p>
          ))}
        </div>
      )}
    <FormWithEditorOverlay
      label={schema.title ?? 'NA'}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      SubmitButton={(props)=>{
        return (
        <SubmitButton schema={schemaState[0] ?? {}} />
        )
      }}


    />
    
    </div>
  )
}

export const TugboatProject = (): ReactElement => {
  return (
    <TugboatForm
      formOverride={project_form as IFormOverride}
      schema={project_schema as JSONSchema6}
    />
  )
}

export const TugboatSite = (): ReactElement => {



  return (
    <TugboatForm
      formOverride={site_form as IFormOverride}
      schema={site_schema as unknown as JSONSchema6}
    />
  )
}

export const TugboatDeployment = (): ReactElement => {

  return (
    <TugboatForm
      formOverride={deployment_form as IFormOverride}
      schema={deployment_schema as unknown as JSONSchema6}
    />
  )
}

