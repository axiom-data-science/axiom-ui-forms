import { FormWithEditorOverlay } from "@/Form/FormWithEditorOverlay"
import form from "./form.json"
import { ReactElement, useState } from "react"
import { IForm } from "@/Form/Creator/FormCreatorTypes"

const ObjectListExample = (): ReactElement => {
  const formState = useState<IForm | undefined>(form as IForm)
  
  return (
    <FormWithEditorOverlay
      formState={formState}
    />
  )
}

const nestedObjectListForm: IForm = {
  "id": "nested-object-list-form",
  "label": "Nested Object List Form",
  "fields": [
    {
      "id": "nestedList",
      "label": "Nested List",
      "type": "objectList",
      "settings": {
        "keyField": "name",
        "showInitialObject": true,
        "valueField": "value"
      },
      "fields": [
        {
          "id": "wrapper",
          "label": "Item",
          "type": "objectWrapper",
          "fields": [
            {
              "id": "name",
              "label": "Name",
              "type": "text"
            },
            {
              "id": "value",
              "label": "Value",
              "type": "objectList",
              "settings": {
                "keyField": "name",
                "showInitialObject": true,
                "excludeKeyFieldFromValue": true
              },
              "fields": [
                {
                  "id": "name",
                  "label": "Sub Name",
                  "type": "text"
                },
                {
                  "id": "value",
                  "label": "Sub Value",
                  "type": "text"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

export const NestedObjectListExample = (): ReactElement => {
  const formState = useState<IForm | undefined>(nestedObjectListForm)
  return (
    <FormWithEditorOverlay
      formState={formState}
    />
  )
}

export default ObjectListExample
