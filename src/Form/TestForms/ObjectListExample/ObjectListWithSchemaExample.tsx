import { IFormFieldOverride, IFormOverride } from "@/Form/Creator/FormCreatorTypes"
import FormWithEditorOverlay from "@/Form/FormWithEditorOverlay"
import { JSONSchema6 } from "json-schema"
import { ReactElement, useState } from "react"

const fieldOverrides = [] as IFormFieldOverride[]
const schema = {
    "type": "object",
    "properties": {
        "list": {
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "name": {
                        "title": "Name",
                        "description": "Name of the item",
                        "type": "string"
                    },
                    "value": {
                        "title": "Value",
                        "description": "Value of the item",
                        "type": "number"
                    }
                },
                "required": ["name", "value"]
            }
        }
    }
} as JSONSchema6
const formOverride = {
    "fields": [
        {
            "prop": "list", 
            "label": "List" , 
            "type": "objectList", 
            "settings": {
                "keyField": "name",
                "showInitialObject": true,
                "excludeKeyFieldFromValue": true
            },
            "fields": [
                {
                    "id": "wrapper",
                    "type": "objectWrapper",
                    "layout": "grid2",
                    "fields": [
                        {"prop": "name"},
                        {"prop": "value"}
                    ]
                }
            ]
        }
    ]
} as IFormOverride

const ObjectListWithSchemaExample = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
  return (
    <FormWithEditorOverlay
      label={***REMOVED***Test: Object list with schema backing***REMOVED***}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

const keyValueSchema = {
    "type": "object",
    "properties": {
        "list": {
            "type": "object",
            "additionalProperties": {
                "type": "string"
            }
        }
    }
} as JSONSchema6

const keyValueFormOverride = {
    "fields": [
        {
            "prop": "list",
            "label": "List",
            "type": "objectList",
            "settings": {
                "keyField": "key",
                "valueField": "value"
            },
            "fields": [
                {
                    "id": "key",
                    "type": "text",
                    "label": "Key",
                    "description": "Object key"
                },
                {
                    "id": "value",
                    "type": "text",
                    "label": "Value",
                    "description": "Object value"
                }
            ]
        }
    ]
} as IFormOverride

export const ObjectListKeyValueWithSchemaExample = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(keyValueSchema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(keyValueFormOverride as IFormOverride)
  return (
    <>
    <FormWithEditorOverlay
      label={***REMOVED***Test: Object list key-value with schema backing***REMOVED***}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
    </>
  )
}


export default ObjectListWithSchemaExample
