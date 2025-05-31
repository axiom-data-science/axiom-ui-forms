import schema from './LeewayModelConfig.json'
import fieldOverrides from './leewayFieldOverrides'
import formOverride from './leewayFormOverride'
import React, { type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import PTTForm from '@/PTT/PTTForm'

const OilForm = (): ReactElement => {
  return (
    <PTTForm
      label='Leeway Form'
      schema={schema as JSONSchema6}
      fieldOverrides={fieldOverrides}
      formOverride={formOverride}
      />

  )
}

export default OilForm
