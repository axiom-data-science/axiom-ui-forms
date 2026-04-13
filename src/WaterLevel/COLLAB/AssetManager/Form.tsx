import React, { useState, type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { type IFormOverride, type IFormFieldOverride, IForm } from '@/Form/Creator/FormCreatorTypes'
import { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'

import config from './config.json'
import config_wizard from './config-wizard.json'

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
