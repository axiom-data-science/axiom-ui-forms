import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { type IFormOverride, type IFormFieldOverride, IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import {FormWithEditorOverlay} from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***

import config from ***REMOVED***./config.json***REMOVED***

const AssetForm = (): ReactElement => {
    const [form, setForm] = useState<IForm | undefined>(config as IForm)
    return (
        <FormWithEditorOverlay
            formState={[form, setForm]}
        />

    )
}

export default AssetForm
