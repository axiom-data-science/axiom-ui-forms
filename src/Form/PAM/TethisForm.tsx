import FormWithEditorOverlay from "@/Form/FormWithEditorOverlay"
import { ReactElement, useState } from "react"
import schema from './tethisSchema.json'
import fieldOverrides from './tethisFieldOverrides.json'
import formOverride from './tethisFormOverrides.json'
import { JSONSchema6 } from "json-schema"
import { IFormFieldOverride, IFormOverride } from "@/library"


const TethisForm = (): ReactElement => {
    const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
    const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
    const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
    return (
        <FormWithEditorOverlay
            label={'TETHIS Form'}
            schemaState={schemaState}
            fieldOverrideState={fieldOverrideState}
            formOverrideState={formOverrideState}
        />
    )
}

export default TethisForm