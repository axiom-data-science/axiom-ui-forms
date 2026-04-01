import FormWithEditorOverlay from "@/Form/FormWithEditorOverlay"
import { ReactElement, useState } from "react"
import schema from ***REMOVED***./tethisSchema.json***REMOVED***
import fieldOverrides from ***REMOVED***./tethisFieldOverrides.json***REMOVED***
import formOverride from ***REMOVED***./tethisFormOverrides.json***REMOVED***
import { JSONSchema6 } from "json-schema"
import { IFormFieldOverride, IFormOverride } from "@/library"


const TethisForm = (): ReactElement => {
    const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
    const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
    const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
    return (
        <FormWithEditorOverlay
            label={***REMOVED***TETHIS Form***REMOVED***}
            schemaState={schemaState}
            fieldOverrideState={fieldOverrideState}
            formOverrideState={formOverrideState}
        />
    )
}

export default TethisForm