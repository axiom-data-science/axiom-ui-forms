import schema from './LarvalFishModelConfig.json'
import larvalFieldOverrides from './larvalFieldOverrides'
import formOverride from './larvalFormOverride'
import React, { type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import PTTForm from '@/PTT/PTTForm'
import { FormCreator } from '@/Form'
import { schemaToFormObject } from '@/utils/schemaToFormHelpers'
import { SchemaFormCreator } from '@/Form/Creator/FormCreator'
import fieldOverrides from '@/PTT/fieldOverrides'

const LarvalForm = (): ReactElement => {
  return (
    <PTTForm
      label='Larval Fish Model Form'
      schema={schema as JSONSchema6}
      fieldOverrides={larvalFieldOverrides}
      formOverride={formOverride}
      />

  )
}


export default LarvalForm
