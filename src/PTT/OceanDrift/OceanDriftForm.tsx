import schema from './OceanDriftModelConfig.json'
import fieldOverrides from './oceanDriftFieldOverrides'
import formOverride from './oceanDriftFormOverride'
import React, { type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import PTTForm from '@/PTT/PTTForm'

const OilForm = (): ReactElement => {
  return (
    <PTTForm
      label='Ocean Drift Model Form'
      schema={schema as JSONSchema6}
      fieldOverrides={fieldOverrides}
      formOverride={formOverride}
      />

  )
}

export default OilForm
