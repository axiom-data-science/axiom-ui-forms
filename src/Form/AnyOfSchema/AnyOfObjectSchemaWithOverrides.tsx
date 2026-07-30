import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import schema from ***REMOVED***./anyOfObject.schema.json***REMOVED***

const AnyOfObjectSchemaWithOverrides = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as unknown as JSONSchema6)
  const formOverrideState = useState<IFormOverride | undefined>({
    fields: [
      {
        prop: ***REMOVED***processor***REMOVED***,
        tabs: [
          {
            id: ***REMOVED***split-tab***REMOVED***,
            label: ***REMOVED***Split Processor (Grid)***REMOVED***,
            fields: [
              {
                id: ***REMOVED***split-wrapper***REMOVED***,
                type: ***REMOVED***objectWrapper***REMOVED***,
                layout: ***REMOVED***grid2***REMOVED***,
                label: ***REMOVED******REMOVED***,
                fields: [
                  { prop: ***REMOVED***processor.source_variable***REMOVED***},
                  { prop: ***REMOVED***processor.separator***REMOVED*** }
                ],
              },
            ],
          },
          {
            id: ***REMOVED***drop-tab***REMOVED***,
            label: ***REMOVED***Drop Processor (Grid)***REMOVED***,
            fields: [
              {
                id: ***REMOVED***drop-wrapper***REMOVED***,
                type: ***REMOVED***objectWrapper***REMOVED***,
                layout: ***REMOVED***grid2***REMOVED***,
                fields: [{ prop: ***REMOVED***processor.column_names***REMOVED*** }],
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
