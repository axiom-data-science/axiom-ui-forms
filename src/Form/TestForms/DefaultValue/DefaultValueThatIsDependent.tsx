import FormWithEditorOverlay from "@/Form/FormWithEditorOverlay"
import schema from "./schema.json"
import fieldOverrides from "./fields.json"
import formOverride from "./form.json"
import { JSONSchema6 } from "json-schema"
import { ReactElement, useState } from "react"
import { IFormFieldOverride, IFormOverride } from "@/Form/Creator/FormCreatorTypes"

const DefaultValueThatIsDependent = (): ReactElement => {
      const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
  return (
    <FormWithEditorOverlay
      label={***REMOVED***Test: Override of schema array field with form/field overrides***REMOVED***}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
    />
  )

}

export default DefaultValueThatIsDependent