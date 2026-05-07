import { FormWithEditorOverlay } from "@/Form/FormWithEditorOverlay"
import form from "./formWithSelectAsKeyField.json"
import { ReactElement, useState } from "react"
import { IForm } from "@/Form/Creator/FormCreatorTypes"

const ObjectListExampleWithSelectAsKeyField = (): ReactElement => {
  const formState = useState<IForm | undefined>(form as IForm)
  
  return (
    <FormWithEditorOverlay
      formState={formState}
    />
  )
}

export default ObjectListExampleWithSelectAsKeyField
