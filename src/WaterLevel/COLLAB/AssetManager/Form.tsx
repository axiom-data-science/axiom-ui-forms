import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { type IFormOverride, type IFormFieldOverride, IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { FormWithEditorOverlay } from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***

import config from ***REMOVED***./config.json***REMOVED***
import config_wizard from ***REMOVED***./config-wizard.json***REMOVED***

const configMap: Record<string, IForm> = {
  wizard: config_wizard as IForm,
}

const AssetForm = ({ configKey }: { configKey?: string } = {}): ReactElement => {
  const [form, setForm] = useState<IForm | undefined>(
    (configKey && configMap[configKey] ? configMap[configKey] : config) as IForm
  )
  return <FormWithEditorOverlay formState={[form, setForm]} />
}

export default AssetForm
