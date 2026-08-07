import FormWithEditorOverlay, { FormWithEditorOverlay as FormEditor } from '@/Form/FormWithEditorOverlay'
import { JSONSchema6 } from 'json-schema'
import { ReactElement, useState } from 'react'
import { IForm, IFormFieldOverride, IFormOverride, IFormValues } from '@/Form/Creator/FormCreatorTypes'

const schema = {
    "type": "object",
    "properties": {
        "label": {
            "type": "text",
            "title": "Label"
        },
        "config": {
            "type": "object",
            "allowAdditionalProperties": true
        }
    }
}
const formOverride: IFormOverride = {
    "id": "merge-field-test-form",
    "label": "Merge Field Test Form",
    "fields": [
        {"prop": "label"},
        {"prop": "config", "type": "json"}
    ]
}
const fieldOverrides: IFormFieldOverride[] = []


const JSONWithOtherFields = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides)
  const formOverrideState = useState<IFormOverride | undefined>(formOverride)

  return (
    <>
    <FormWithEditorOverlay
      label="JSON with other fields test form"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
    </>
  )
}

const defaultFormValues: IFormValues = {
    "enabled": false,
    "description": "this is a test",
    "config": {
        "nested": {
            "inner": {
                "test": "hi"
            },
            "inner2": {
                "val": "hello"
            }
        }
    }
}

const initialForm: IForm = {
    "id": "json-with-other-fields-form",
    "label": "JSON with Other Fields Form",
    "fields": [
        {"id": "label", "type": "text"},
        {"id": "enabled", "label": "enable it", "type": "boolean"},
        {"id": "description", "type": "text", "conditions": {
            "field": "enabled",
            "value": true,
            "result": "enable"
        }},
        {"id": "config", "type": "json", "conditions":{
            "field": "enabled",
            "value": true,
            "result": "enable"
        }}
    ]

}

export const JSONWithOtherFieldsForm = (): ReactElement => {
    const [formValues, setFormValue] = useState<IFormValues>(defaultFormValues as IFormValues)
    const [form, setForm] = useState<IForm | undefined>(initialForm)
    return (
        <>
            <FormEditor
                formValueState={[formValues, setFormValue]}
                formState={[form, setForm]}
            />
        </>
    )
}

export default JSONWithOtherFields

