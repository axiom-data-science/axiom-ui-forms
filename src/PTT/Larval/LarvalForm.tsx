import schema from './LarvalFishModelConfig.json'
import fieldOverrides from './larvalFieldOverrides'
import formOverride from './larvalFormOverride'
import React, { type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import PTTForm from '@/PTT/PTTForm'

const OilForm = (): ReactElement => {
  return (
    <PTTForm
      label='Larval Fish Model Form'
      schema={schema as JSONSchema6}
      fieldOverrides={fieldOverrides}
      formOverride={formOverride}
      />

  )
}

export default OilForm
