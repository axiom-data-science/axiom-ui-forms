import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import { IFormFieldOverride, IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const schema = {
    "type": "object",
    "properties": {
        "latitude": {
            "type": "number",
            "title": "Latitude (from schema)"
        },
        "longitude": {
            "type": "number",
            "title": "Longitude (from schema)" 
        }
    }
}
const formOverride: IFormOverride = {
    "id": "merge-field-test-form",
    "label": "Merge Field Test Form",
    "fields": [
        {"prop": "latitude", "type": "number"},
        {"prop": "longitude", "type": "number"}
    ]
}
const fieldOverrides: IFormFieldOverride[] = [
    {"prop": "latitude", "placeholder": "Enter latitude"},
    {"prop": "longitude",  "placeholder": "Enter longitude"},
]



const MergeFieldTestForm = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides)
  const formOverrideState = useState<IFormOverride | undefined>(formOverride)

  return (
    <>
    <FormWithEditorOverlay
      label="Merge Field Test Form"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
    </>
  )
}

export default MergeFieldTestForm
