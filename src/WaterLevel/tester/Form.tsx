import React, { useState, type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { type IFormOverride, type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'
import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'

import schema from './schema.json'
import fieldOverrides from './fieldOverrides.json'
import formOverride from './formOverrides.json'

const TestForm = (): ReactElement => {
    const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
    const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
    const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)

    return (
        <FormWithEditorOverlay
            label="Water Level Form (COLLAB schema)"
            schemaState={schemaState}
            //fieldOverrideState={fieldOverrideState}
            //formOverrideState={formOverrideState}
            urlNavigable={false}
        />

    )
}

export default TestForm
