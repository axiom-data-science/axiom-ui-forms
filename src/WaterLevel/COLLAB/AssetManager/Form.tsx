import React, { useState, type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { type IFormOverride, type IFormFieldOverride, IForm } from '@/Form/Creator/FormCreatorTypes'
import {FormWithEditorOverlay} from '@/Form/FormWithEditorOverlay'

import config from './config.json'

const AssetForm = (): ReactElement => {
    const [form, setForm] = useState<IForm | undefined>(config as IForm)
    return (
        <FormWithEditorOverlay
            formState={[form, setForm]}
        />

    )
}

export default AssetForm
