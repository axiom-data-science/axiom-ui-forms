import schema from './HABConfig.json'
import fieldOverrides from './habFieldOverrides'
import formOverride from './habFormOverride'
import React, { type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import PTTForm from '@/PTT/PTTForm'

const HABForm = (): ReactElement => {
  return (
    <PTTForm
      label='Harmful Algal Bloom Form'
      schema={schema as JSONSchema6}
      fieldOverrides={fieldOverrides}
      formOverride={formOverride}
      />

  )
}

export default HABForm
