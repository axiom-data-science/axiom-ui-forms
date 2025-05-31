import oilSchema from './OpenOilModelConfig.json'
import oilFieldOverrides from './oilFieldOverrides'
import oilFormOverride from './oilFormOverride'
import React, { type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import PTTForm from '@/PTT/PTTForm'

const OilForm = (): ReactElement => {
  return (
    <PTTForm
      label='OpenOil Form'
      schema={oilSchema as JSONSchema6}
      fieldOverrides={oilFieldOverrides}
      formOverride={oilFormOverride}
      />

  )
}

export default OilForm
