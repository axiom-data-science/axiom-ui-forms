import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import { JSONSchema6 } from 'json-schema'
import { ReactElement, useState } from 'react'
import schema from './oneOfObject.schema.json'

const OneOfObjectSchemaWithOverrides = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as unknown as JSONSchema6)
  const formOverrideState = useState<IFormOverride | undefined>({
    fields: [
        { prop: 'field1' },
      {
        prop: 'transport',
        fields: [
          { prop: 'transport.select_transport', label: 'Transport Type' },
          {
            id: 's3-grid-wrapper',
            type: 'objectWrapper',
            layout: 'grid2',
            conditions: {
              dependsOn: 'transport.select_transport',
              value: 'S3',
            },
            fields: [
              { prop: 'transport.bucket', label: 'Bucket' },
              { prop: 'transport.prefix', label: 'Prefix' },
            ],
          },
          {
            id: 'http-grid-wrapper',
            type: 'objectWrapper',
            layout: 'grid2',
            conditions: {
              dependsOn: 'transport.select_transport',
              value: 'HTTP',
            },
            fields: [
              { prop: 'transport.url', label: 'URL' },
              { prop: 'transport.method', label: 'Method' },
            ],
          },
        ],
      },
    ],
  })

  return (
    <FormWithEditorOverlay
      label="OneOf Object Schema Demo (Overrides)"
      schemaState={schemaState}
      formOverrideState={formOverrideState}
    />
  )
}

export default OneOfObjectSchemaWithOverrides
