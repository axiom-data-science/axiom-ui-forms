import FormWithEditorOverlay from "@/Form/FormWithEditorOverlay"
import form from "./form.json"
import { ReactElement, useState } from "react"
import { IFormOverride } from "@/Form/Creator/FormCreatorTypes"

const TabsInPagesWithWrapper = (): ReactElement => {
  const formOverrideState = useState<IFormOverride | undefined>(form as IFormOverride)
  
  return (
    <FormWithEditorOverlay
      label="Tabs in Pages with Wrapper - Application Settings"
      formOverrideState={formOverrideState}
    />
  )
}

export default TabsInPagesWithWrapper
