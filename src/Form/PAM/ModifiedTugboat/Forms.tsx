import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import omit from 'lodash/omit'
import { type JSONSchema6 } from 'json-schema'
import { IFormFieldOverride } from '@/library'
import { type IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import project_form from './project_form.json'
import project_schema from './project_schema.json'
import site_form from './site_form.json'
import site_schema from './site_schema.json'
import deployment_form from './deployment_form.json'
import deployment_schema from './deployment_schema.json'

export const TugboatProject = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(omit(project_schema,'$schema') as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState<IFormOverride | undefined>(omit(project_form,'$schema') as IFormOverride)

  return (
    <FormWithEditorOverlay
      label="Modified tugboat project"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export const TugboatSite = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(omit(site_schema,'$schema') as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState<IFormOverride | undefined>(omit(site_form,'$schema') as IFormOverride)

  return (
    <FormWithEditorOverlay
      label="Modified tugboat site"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export const TugboatDeployment = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(omit(deployment_schema,'$schema') as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState<IFormOverride | undefined>(omit(deployment_form,'$schema') as IFormOverride)

  return (
    <FormWithEditorOverlay
      label="Modified tugboat deployment"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

