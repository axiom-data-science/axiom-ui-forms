import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import schema from ***REMOVED***./oneOfObject.schema.json***REMOVED***

const OneOfObjectSchemaWithOverrides = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as unknown as JSONSchema6)
  const formOverrideState = useState<IFormOverride | undefined>({
    fields: [
        { prop: ***REMOVED***field1***REMOVED*** },
      {
        prop: ***REMOVED***transport***REMOVED***,
        fields: [
          { prop: ***REMOVED***transport.select_transport***REMOVED***, label: ***REMOVED***Transport Type***REMOVED*** },
          {
            id: ***REMOVED***s3-grid-wrapper***REMOVED***,
            type: ***REMOVED***objectWrapper***REMOVED***,
            layout: ***REMOVED***grid2***REMOVED***,
            conditions: {
              dependsOn: ***REMOVED***transport.select_transport***REMOVED***,
              value: ***REMOVED***S3***REMOVED***,
            },
            fields: [
              { prop: ***REMOVED***transport.bucket***REMOVED***, label: ***REMOVED***Bucket***REMOVED*** },
              { prop: ***REMOVED***transport.prefix***REMOVED***, label: ***REMOVED***Prefix***REMOVED*** },
            ],
          },
          {
            id: ***REMOVED***http-grid-wrapper***REMOVED***,
            type: ***REMOVED***objectWrapper***REMOVED***,
            layout: ***REMOVED***grid2***REMOVED***,
            conditions: {
              dependsOn: ***REMOVED***transport.select_transport***REMOVED***,
              value: ***REMOVED***HTTP***REMOVED***,
            },
            fields: [
              { prop: ***REMOVED***transport.url***REMOVED***, label: ***REMOVED***URL***REMOVED*** },
              { prop: ***REMOVED***transport.method***REMOVED***, label: ***REMOVED***Method***REMOVED*** },
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
