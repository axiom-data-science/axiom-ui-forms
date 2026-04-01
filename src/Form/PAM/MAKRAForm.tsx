import FormWithEditorOverlay from "@/Form/FormWithEditorOverlay"
import { ReactElement, useState } from "react"
import schema from ***REMOVED***./makraSchema.json***REMOVED***
import fieldOverrides from ***REMOVED***./makraFieldOverrides.json***REMOVED***
import formOverride from ***REMOVED***./makraFormOverrides.json***REMOVED***
import { JSONSchema6 } from "json-schema"
import { IFormFieldOverride, IFormOverride } from "@/library"


const MAKRAForm = (): ReactElement => {
    const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
    const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
    const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
    return (
        <FormWithEditorOverlay
            label={***REMOVED***PAM: MAKRA metadata collection form***REMOVED***}
            schemaState={schemaState}
            fieldOverrideState={fieldOverrideState}
            formOverrideState={formOverrideState}
        />
    )
}

export default MAKRAForm