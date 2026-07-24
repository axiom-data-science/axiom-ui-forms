import { FormWithEditorOverlay } from "@/Form/FormWithEditorOverlay"
import form from "./form-key-value.json"
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

export default ObjectListExample
