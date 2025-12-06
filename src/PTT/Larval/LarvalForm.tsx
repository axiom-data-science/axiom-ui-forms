import schema from ***REMOVED***./LarvalFishModelConfig.json***REMOVED***
import larvalFieldOverrides from ***REMOVED***./larvalFieldOverrides***REMOVED***
import formOverride from ***REMOVED***./larvalFormOverride***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import PTTForm from ***REMOVED***@/PTT/PTTForm***REMOVED***
import { FormCreator } from ***REMOVED***@/Form***REMOVED***
import { schemaToFormObject } from ***REMOVED***@/utils/schemaToFormHelpers***REMOVED***
import { SchemaFormCreator } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import fieldOverrides from ***REMOVED***@/PTT/fieldOverrides***REMOVED***

const OilForm = (): ReactElement => {
  return (
    <PTTForm
      label=***REMOVED***Larval Fish Model Form***REMOVED***
      schema={schema as JSONSchema6}
      fieldOverrides={larvalFieldOverrides}
      formOverride={formOverride}
      />

  )
}
const LarvalForm = (): ReactElement => {
  return <div className=***REMOVED***p-20***REMOVED***><SchemaFormCreator
    schema={schema as JSONSchema6}
    formFieldOverrides={[larvalFieldOverrides, fieldOverrides]}
    formOverrides={[formOverride]}
    label=***REMOVED***Larval Fish Model Form***REMOVED***
  />
  </div>
}

export default LarvalForm
