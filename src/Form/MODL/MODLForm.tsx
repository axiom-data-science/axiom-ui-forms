import FormWithEditorOverlay from "@/Form/FormWithEditorOverlay"
import { ReactElement, useState } from "react"
import schema from ***REMOVED***./schema.json***REMOVED***
import fieldOverrides from ***REMOVED***./field_overrides.json***REMOVED***
import formOverride from ***REMOVED***./form.json***REMOVED***
import { JSONSchema6 } from "json-schema"
import { IFormFieldOverride, IFormOverride } from "@/library"


const MODLForm = (): ReactElement => {
    const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
    const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
    const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
    return (
        <FormWithEditorOverlay
            label={***REMOVED***MODL Form***REMOVED***}
            schemaState={schemaState}
            fieldOverrideState={fieldOverrideState}
            formOverrideState={formOverrideState}
        />
    )
}

export default MODLForm