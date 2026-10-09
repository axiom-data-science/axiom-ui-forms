import { IFormFieldOverride, IFormOverride } from "@/Form/Creator/FormCreatorTypes"
import FormWithEditorOverlay from "@/Form/FormWithEditorOverlay"
import { JSONSchema6 } from "json-schema"
import { ReactElement, useState } from "react"

const fieldOverrides = [] as IFormFieldOverride[]
const schema = {
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "title": "Title"
        },
        "list": {
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "name": {
                        "title": "Name (from schema)",
                        "description": "Name of the item",
                        "type": "string"
                    },
                    "value": {
                        "title": "Value (from schema)",
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
        {"prop": "title"},
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
                    "label": "Item",
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
      label={'Test: Object list with schema backing'}
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
      label={'Test: Object list key-value with schema backing'}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
    </>
  )
}


const erddapVariableMetadataSchema = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "title": "ERDDAP Variable Metadata",
    "type": "object",
    "additionalProperties": true,
    "properties": {
        "dataset_id": {
            "title": "Dataset ID",
            "description": "ERDDAP dataset ID of the parent MODL dataset.",
            "type": "string"
        },
        "variables": {
            "title": "Variables",
            "type": "object",
            "additionalProperties": {
                "type": "object",
                "properties": {
                    "variable_name": {
                        "title": "Variable Name",
                        "description": "Name of the ERDDAP data variable or dimension.",
                        "type": "string"
                    },
                    "_CoordinateAxisType": {
                        "title": "Coordinate Axis Type",
                        "type": "string"
                    },
                    "_FillValue": {
                        "title": "Fill Value",
                        "description": "Numeric value used to represent missing data.",
                        "type": "number"
                    },
                    "actual_range": {
                        "title": "Actual Range",
                        "description": "Minimum and maximum values; ERDDAP supplies these as a comma-separated pair.",
                        "type": "array",
                        "items": { "type": "number" },
                        "minItems": 2,
                        "maxItems": 2
                    },
                    "axis": {
                        "title": "Axis",
                        "type": "string",
                        "enum": ["X", "Y", "Z", "T"]
                    },
                    "colorBarMaximum": {
                        "title": "Color Bar Maximum",
                        "type": "number"
                    },
                    "colorBarMinimum": {
                        "title": "Color Bar Minimum",
                        "type": "number"
                    },
                    "ioos_category": {
                        "title": "IOOS Category",
                        "type": "string"
                    },
                    "long_name": {
                        "title": "Long Name",
                        "type": "string"
                    },
                    "point_spacing": {
                        "title": "Point Spacing",
                        "type": "string",
                        "enum": ["even", "uneven"]
                    },
                    "standard_name": {
                        "title": "Standard Name",
                        "type": "string"
                    },
                    "time_origin": {
                        "title": "Time Origin",
                        "type": "string"
                    },
                    "units": {
                        "title": "Units",
                        "type": "string"
                    }
                },
                "required": ["variable_name"]
            }
        }
    },
    "required": ["dataset_id"]
} as JSONSchema6

const erddapVariableMetadataFormOverride = {
    "fields": [
        {"prop": "dataset_id"},
        {
            "prop": "variables",
            "type": "objectList",
            "settings": {
                "keyField": "variable_name",
                "showInitialObject": true
            },
            "fields": [
                {
                    "id": "wrapper",
                    "label": "",
                    "type": "objectWrapper",
                    "tabs": [
                        {
                            "id": "general",
                            "label": "General",
                            "layout": "grid2",
                            "fields": [
                                { "prop": "variable_name", "settings": { "descriptionPresentation":"tooltip"} },
                                { "prop": "units", "settings": { "descriptionPresentation":"tooltip"} },
                                { "prop": "standard_name", "settings": { "descriptionPresentation":"tooltip"} },
                                { "prop": "long_name", "settings": { "descriptionPresentation":"tooltip"} },
                                { "prop": "ioos_category", "label": "IOOS Category", "settings": { "descriptionPresentation":"tooltip"} },
                                { "prop": "axis", "settings": { "descriptionPresentation":"tooltip"} }
                            ]
                        },
                        {
                            "id": "additional",
                            "label": "Additional",
                            "layout": "grid2",
                            "fields": [
                                { "prop": "_CoordinateAxisType", "settings": { "descriptionPresentation":"tooltip"} },
                                { "prop": "_FillValue", "settings": { "descriptionPresentation":"tooltip"} },
                                { "prop": "actual_range", "settings": { "descriptionPresentation":"tooltip"} },
                                { "prop": "colorBarMaximum", "settings": { "descriptionPresentation":"tooltip"} },
                                { "prop": "colorBarMinimum", "settings": { "descriptionPresentation":"tooltip"} },
                                { "prop": "point_spacing", "settings": { "descriptionPresentation":"tooltip"} },
                                { "prop": "time_origin", "settings": { "descriptionPresentation":"tooltip"} }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
} as IFormOverride

export const ERDDAPVariableMetadataExample = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(erddapVariableMetadataSchema)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides)
  const formOverrideState = useState<IFormOverride | undefined>(erddapVariableMetadataFormOverride)
  return (
    <FormWithEditorOverlay
      label={'Test: ERDDAP variable metadata schema'}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )
}

export default ObjectListWithSchemaExample
