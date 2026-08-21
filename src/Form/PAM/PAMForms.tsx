import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { IFormFieldOverride, IFormOverride } from '@/Form/Creator/FormCreatorTypes'

import projectSchema from './project.json'
import siteSchema from './site.json'
import siteSchemaOverrideForm from './siteSchemaOverrideForm.json'


const ProjectForm = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(projectSchema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState<IFormOverride | undefined>(undefined)

  return (
    <FormWithEditorOverlay
      label="PAM Project"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

const SiteForm = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(siteSchema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>([])
  const formOverrideState = useState<IFormOverride | undefined>(siteSchemaOverrideForm as IFormOverride)

  return (
    <FormWithEditorOverlay
    debug={true}
      label="PAM Site"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}



export { ProjectForm, SiteForm }
