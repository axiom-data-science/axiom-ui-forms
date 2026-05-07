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
      description="Demonstrates complex layout combination: a form with pages where one page contains tabs. The Performance tab embeds an objectWrapper that contains nested tabs (Caching and Compression). This shows the full capability of combining pages, tabs, and objectWrapper."
    />
  )
}

export default TabsInPagesWithWrapper
