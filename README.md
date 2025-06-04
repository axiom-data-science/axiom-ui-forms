React library that allows:
- Creation of forms using a json config file
- Creation of forms using a [json schema draft 7](https://json-schema.org/draft-07/json-schema-release-notes), with selective overrides using json config
- To do: 
    - allow addition of new form types and UI components by consuming library
    - allow schema version 4 and draft 6
    - support schema `required`
    - support version 7 `if`/`then`/`else`
    - support version 7 `readOnly`
    - support version 7 `writeOnly`


.

# [Examples](https://axiom-ui-forms.srv.axds.co/)

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
      "type": "boolean",
    },
    "signature": {
        "type": "string"
    }
  }
}

```

Coming soon...
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
  },
  "dependentSchemas": {
    "agree": {
      "properties": {
        "signature": {
          "type": "string",
          "maxLength": 100
        }
      }
    }
  }
}
```



```ts
import React, {type ReactElement} from ***REMOVED***react***REMOVED***
import { FormCreator, type IForm, type IFormValues } from ***REMOVED***@axdspub/axiom-ui-forms***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***

export default ExampleForm = ({schema}:{schema: JSONSchema7 }): ReactElement => {
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
                : <FormCreator form={formConfig} formValueState={} >
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



# Testing build locally

```bash
npm i spa-http-server -g
npm run build
cd build
http-server --push-state -p 8091 -o
```

# Publish version to NPM

```bash
npm login --scope=@axdspub
npm publish --access public
```
