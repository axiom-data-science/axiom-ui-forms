import FormWithEditorOverlay from "@/Form/FormWithEditorOverlay"
import form from "./form.json"
import { ReactElement, useState } from "react"
import { IFormOverride } from "@/Form/Creator/FormCreatorTypes"

const ObjectListExample = (): ReactElement => {
  const formOverrideState = useState<IFormOverride | undefined>(form as IFormOverride)
  
  return (
    <FormWithEditorOverlay
      label="ObjectList Example - Infrastructure Configuration"
      formOverrideState={formOverrideState}
    />
  )
}

export default ObjectListExample
