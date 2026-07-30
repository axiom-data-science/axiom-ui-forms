import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'
import { IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import { JSONSchema6 } from 'json-schema'
import { ReactElement, useState } from 'react'
import schema from './anyOfObject.schema.json'

const AnyOfObjectSchemaWithOverrides = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as unknown as JSONSchema6)
  const formOverrideState = useState<IFormOverride | undefined>({
    fields: [
      {
        prop: 'processor',
        tabs: [
          {
            id: 'split-tab',
            label: 'Split Processor (Grid)',
            fields: [
              {
                id: 'split-wrapper',
                type: 'objectWrapper',
                layout: 'grid2',
                label: '',
                fields: [
                  { prop: 'processor.source_variable'},
                  { prop: 'processor.separator' }
                ],
              },
            ],
          },
          {
            id: 'drop-tab',
            label: 'Drop Processor (Grid)',
            fields: [
              {
                id: 'drop-wrapper',
                type: 'objectWrapper',
                layout: 'grid2',
                fields: [{ prop: 'processor.column_names' }],
              },
            ],
          },
        ],
      },
    ],
  })

  return (
    <FormWithEditorOverlay
      label="AnyOf Object Schema Demo (Overrides)"
      schemaState={schemaState}
      formOverrideState={formOverrideState}
    />
  )
}

export default AnyOfObjectSchemaWithOverrides
