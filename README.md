React library that allows:
- Creation of forms using a JSON config file
- Creation of forms from a JSON Schema, with selective overrides using JSON config

Schema conversion is currently typed against `JSONSchema6` from the `json-schema` package. The converter supports common object, string, number, boolean, enum, array, and date/time format keywords. Schema `required` properties are copied to the generated field definitions. JSON Schema keywords that are not represented by the form model: `if`/`then`/`else`, `readOnly`, and `writeOnly`


.

# [Editable examples](https://axiom-ui-forms.srv.axds.co/)
# [More examples](https://axiom-ui-forms.srv.axds.co/all-forms)

## Create a form using a config

Test form config [here](https://axiom-ui-forms.srv.axds.co/). Note: currently, forms with wizards or pages require that the parent route includes `*` (only tested with `react-router-dom@7`). Todo: make url navigation on form optional.

```json
{
    "id": "example",
    "label": "Example form",
    "description": "This is just an example",
    "fields": [
        {
            "id": "title",
            "type": "text",
            "label": "Title"
        },
        {
            "id": "description",
            "type": "long_text",
            "label": "Description"
        },
         {
            "id": "favorites",
            "type": "text",
            "label": "List your favorite things",
           "multiple": true
        },
        {
            "id": "agree",
            "type": "boolean",
            "label": "Do you agree?"
        },
        {
            "id": "signature",
            "type": "text",
            "label": "Sign your name then",
            "conditions": { "dependsOn": "agree" }
        }
    ]
}
```

```ts
import React, {type ReactElement} from ***REMOVED***react***REMOVED***
import { FormCreator, type IForm, type IFormValues } from ***REMOVED***@axdspub/axiom-ui-forms***REMOVED***

export default ExampleForm = ({formConfig}: {formConfig: IForm}): ReactElement => {
    const formValueState = React.useState<IFormValues>({})
    const [formValues] = formValueState
    useEffect(()=>{
        // respond to change in formValues
    },[formValues])

    return (
        <FormCreator form={formConfig} formValueState={formValueState} />
    )
}

```

## Config to create a form with wizard steps using config. 
Example [here](https://axiom-ui-forms.srv.axds.co/?tab=config&form=uQAEYmlkZ2V4YW1wbGVlbGFiZWxsRXhhbXBsZSBmb3Jta2Rlc2NyaXB0aW9ud1RoaXMgaXMganVzdCBhbiBleGFtcGxlbHdpemFyZF9zdGVwc4O5AARiaWRlaW50cm9lbGFiZWxsSW50cm9kdWN0aW9uZW9yZGVyAGZmaWVsZHOCuQADYmlkZXRpdGxlZHR5cGVkdGV4dGVsYWJlbGVUaXRsZbkAA2JpZGtkZXNjcmlwdGlvbmR0eXBlaWxvbmdfdGV4dGVsYWJlbGtEZXNjcmlwdGlvbrkABGJpZGNtYXBlbGFiZWxmU3RlcCAyZW9yZGVyAWZmaWVsZHOBuQADYmlkY21hcGR0eXBlZ2dlb2pzb25lbGFiZWxoTG9jYXRpb265AARiaWRlYWJvdXRlbGFiZWxuQWJvdXQgeW91cnNlbGZlb3JkZXICZXBhZ2VzgrkAA2JpZGlmYXZvcml0ZXNlbGFiZWxpRmF2b3JpdGVzZmZpZWxkc4G5AARiaWRuZmF2b3JpdGVzX2xpc3RkdHlwZWR0ZXh0ZWxhYmVseBlMaXN0IHlvdXIgZmF2b3JpdGUgdGhpbmdzaG11bHRpcGxl9bkAA2JpZGRzaWduZWxhYmVsaVNpZ25hdHVyZWZmaWVsZHOCuQADYmlkZWFncmVlZHR5cGVnYm9vbGVhbmVsYWJlbG1EbyB5b3UgYWdyZWU%2FuQADYmlkaXNpZ25hdHVyZWR0eXBlZHRleHRlbGFiZWxzU2lnbiB5b3VyIG5hbWUgdGhlbg%3D%3D).

```json
{
    "id": "example",
    "label": "Example form",
    "description": "This is just an example",
    "wizard_steps":[
      {
        "id":"intro",
        "label":"Introduction",
        "order": 0,
        "fields":[
            {
              "id": "title",
              "type": "text",
              "label": "Title"
          },
          {
              "id": "description",
              "type": "long_text",
              "label": "Description"
          }
        ]

      },
      {
        "id": "map",
        "label": "Step 2",
        "order": 1,
        "fields": [
          {
            "id": "map",
            "type": "geojson",
            "label": "Location"
          }
        ]
      },
      {
        "id": "about",
        "label": "About yourself",
        "order": 2,
        "pages":[
          {
            "id": "favorites",
            "label": "Favorites",
            "fields": [
                {
                  "id": "favorites_list",
                  "type": "text",
                  "label": "List your favorite things",
                  "multiple": true
                }
            ]
          },
          {
            "id":"sign",
            "label": "Signature",
            "fields": [
              {
                  "id": "agree",
                  "type": "boolean",
                  "label": "Do you agree?"
              },
              {
                  "id": "signature",
                  "type": "text",
                  "label": "Sign your name then"
              }
            ]
          }
        ]

      }

    ]
}

```


# Create a form using a schema

Test schema to form [here](https://axiom-ui-forms.srv.axds.co/schema-to-form)

```json
{
  "$id": "/test/schema",
  "type": "object",
  "properties": {
    "label": {
      "type": "string",
      "maxLength": 100
    },
    "description": {
      "type": "string"
    },
    "agree": {
      "type": "boolean"
    },
    "signature": {
        "type": "string"
    }
  }
}

```


```json
{
  "$id": "/test/schema",
  "type": "object",
  "required": [
    "label",
    "description",
    "agree"
  ],
  "properties": {
    "label": {
      "type": "string",
      "maxLength": 100
    },
    "description": {
      "type": "string"
    },
    "agree": {
      "type": "boolean"
    }
  }
}
```



```ts
import React, {type ReactElement} from ***REMOVED***react***REMOVED***
import { FormCreator, type IForm, type IFormValues } from ***REMOVED***@axdspub/axiom-ui-forms***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***

export default ExampleForm = ({schema}:{schema: JSONSchema6 }): ReactElement => {
    const formValueState = React.useState<IFormValues>({})
    const [formValues] = formValueState
    useEffect(()=>{
        // respond to change in formValues
    },[formValues])
    const errors = validateSchema(schema)
    const formConfig = errors === null
        ? schemaToFormObject(schema)
        : null

    return (
        <>{
            errors !== null
                ? <p>Schema errors: {{errors}}</p>
                : <SchemaFormCreator form={formConfig} formValueState={formValueState} >
        }</>
        
    )

}

```


# Create a form using a schema, and modify it with a form config

```ts
import { SchemaFormCreator } from ***REMOVED***@axdspub/axiom-ui-forms***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***


const schema: JSONSchema6 = {
  properties: {
    text_field: {

    },
    numeric_field: {

    }

  }
}

const fieldOverrides: IFieldOverride[] = [
  {
    prop: ***REMOVED***text_field***REMOVED***,
    label: ***REMOVED***This is my text field***REMOVED***
  }
]

```


# Field definitions
## These can be used to create a form config, or as partials to override a schema

### root (all fields share these properties)

```json
{
    "id": "fieldId",
    "label": "Field label",
    "description": "Field description",
    "multiple": false,
    "required": true,
    "conditions": {
        "dependsOn": "other_field_id",
        "value": "val"
    },
    "defaultValue": "initial value",
    "settings": {}
    
}
```

## Input types

The following values are registered in the default input map:

| Type | Notes |
| --- | --- |
| `text` | Single-line text input |
| `long_text` | Long text input |
| `longText` | Compatibility alias for `long_text` |
| `number` | Numeric input |
| `json` | JSON text input |
| `boolean` | Boolean checkbox input |
| `select` | Single select input; use `options` |
| `radio` | Radio group; use `options` |
| `object` | Nested object input; use `fields` |
| `objectWrapper` | Layout-only nested field wrapper |
| `oneOf` | One-of schema/config input |
| `geojson` | GeoJSON input |
| `geometry` | Geometry input |
| `datetime` | Date and time input |
| `date` | Date input |
| `time` | Time input |
| `constant` | Constant value input |
| `stateSelector` | State selector input |
| `fileUpload` | File upload input |
| `file_upload` | Compatibility alias for `fileUpload` |
| `selectOrText` | Select input with a text fallback |

`objectList` is also supported, but is handled specially by the field creator and is therefore not part of `inputMap`

## String fields

### `type:text`
single line text field

```json
{
  "placeholder": "Example of field response"
}    
```

## Enum select fields

### `type:select` and `type:radio`

```json
{
    "options": [
        {
            "label": "Option 1",
            "value": "option_1"
        },
        {
            "label": "Option 2",
            "value": "option_2"
        }
    ]
}
```


## Boolean fields

### `type:boolean`
Checkbox field.


## number fields

### `type:number`

## date and time

### `type:date`
```json
{
    "constraints": {
        "minDate": "2023-02-01",
        "maxDate": "2024-06-01"
    }
}
```

### `type:objectList`
An object list uses one child field as a unique key and stores keyed values instead of an array. `settings.keyField` is required. The key field must be a non-multiple, non-object, non-number, and non-boolean child field.

```json
{
  "id": "settings",
  "type": "objectList",
  "label": "Settings",
  "settings": {
    "keyField": "key",
    "valueField": "value",
    "excludeKeyFieldFromValue": true
  },
  "fields": [
    { "id": "key", "type": "text", "label": "Name" },
    { "id": "value", "type": "text", "label": "Value" }
  ]
}
```

With `keyField` and `valueField`, the resulting value is shaped like `{ "setting-name": "setting-value" }`. Omit `valueField` for keyed objects containing the remaining child fields. `onlyShowKeyUntilUniqueEntered` controls when the remaining fields are shown, and `showInitialObject` controls whether an initial object row is displayed. Duplicate keys are rejected by the input.

### `type:time`
```json
{
    "constraints": {
        "minTime": "02:00:00",
        "maxTime": "18:30:00"
    }
}
```

### `type:datetime`
```json
{
    "constraints": {
        "minDateTime": "2023-02-01T00:00:00Z",
        "maxDateTime": "2024-06-01T00:00:00Z"
    }
}
```


### `type:object`
- `skip_path`: if `true`, `id` is not used to create path to child fields in output. Can not be `true` if `multiple` is `true`
- `fields`: array of child fields
- `layout`: type of layout for child form elements. Not fully supported yet.
```json
{
    "skip_path": true,
    "layout": "horizontal",
    "fields": [
        
    ]
}
```

# Field overrides
Field overrides must contain a `prop` property. This normally references an existing property from a schema. Nested paths and array-item paths using `[]` are supported. An override-only field is UI-only by default when a schema has properties; set `destPath` or `excludeFromPayload: false` when it should be included in the submitted payload.

# Form overrides
Form overrides can define `wizard_steps`, `pages`, `tabs`, and nested `fields`.

## wizard_steps
These create a wizard interface
```json
"wizard_steps": [
    {
        "id":"first_step",
        "order": 1,
        "label": "First step",
        "fields": [],
        "pages": []
    },
    {
        "id":"second_step",
        "order": 2,
        "label": "Second step",
        "fields": [],
        "pages": []
    }
]
```

## pages
```json
"pages": [
  {
    "id": "details",
    "label": "Details",
    "fields": [
      { "prop": "description", "label": "Additional details" }
    ]
  }
]
```

`tabs` uses the same shape as `pages`, with each tab containing an `id`, `label`, and `fields` array. `objectWrapper` can be used when layout is needed without adding another data path.




# Tests
Uses vitest. Install vitest vscode plugin for extras

```node
npm run test
```



# Testing build locally

```bash
npm i spa-http-server -g
npm run build
cd dist
http-server --push-state -p 8091 -o
```

# Publish version to NPM

```bash
npm login --scope=@axdspub
npm publish --access public
```
