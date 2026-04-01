import FormWithEditorOverlay from "@/Form/FormWithEditorOverlay"
import { ReactElement, useState } from "react"
import schema from './makraSchema.json'
import fieldOverrides from './makraFieldOverrides.json'
import formOverride from './makraFormOverrides.json'
import { JSONSchema6 } from "json-schema"
import { IFormFieldOverride, IFormOverride } from "@/library"


const MAKRAForm = (): ReactElement => {
    const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
    const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
    const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
    return (
        <FormWithEditorOverlay
            label={'MAKRA Form'}
            schemaState={schemaState}
            fieldOverrideState={fieldOverrideState}
            formOverrideState={formOverrideState}
        />
    )
}

export default MAKRAForm