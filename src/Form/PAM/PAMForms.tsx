import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { IFormFieldOverride, IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

import projectSchema from ***REMOVED***./project.json***REMOVED***
import siteSchema from ***REMOVED***./site.json***REMOVED***
import siteSchemaOverrideForm from ***REMOVED***./siteSchemaOverrideForm.json***REMOVED***


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
