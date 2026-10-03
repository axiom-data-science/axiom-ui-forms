import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import omit from 'lodash/omit'
import { type JSONSchema6 } from 'json-schema'
import { IFormFieldOverride } from '@/library'
import { IForm, IFormValues, type IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import project_form from './project_form.json'
import project_schema from './project_schema.json'
import site_form from './site_form.json'
import site_schema from './site_schema.json'
import deployment_form from './deployment_form.json'
import deployment_schema from './deployment_schema.json'
import { Button } from '@axdspub/axiom-ui-utilities'
import { overridesAndSchemaToFormObject, validateAgainstSchema } from '@/utils/schemaToFormHelpers'
import { getFormPayload } from '@/utils/getters'
import { useFormContext, useFormValues } from '@/Form/Creator/FormContextProvider'


const SubmitButton = (): ReactElement => {
  const { form, schema } = useFormContext()
const formValues = useFormValues()
const payload = getFormPayload(formValues, form)
  return (
    <Button
      type="submit"
      onClick={()=>{
        const valid = validateAgainstSchema(
          schema ?? {},
          payload
        )
        console.log(valid)
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

  return (
    <div>
    <FormWithEditorOverlay
      label={schema.title ?? 'NA'}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      SubmitButton={(props)=>{
        return (
        <SubmitButton />
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

