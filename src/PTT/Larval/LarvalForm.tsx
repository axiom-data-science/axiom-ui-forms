import schema from ***REMOVED***./LarvalFishModelConfig.json***REMOVED***
import fieldOverrides from ***REMOVED***./larvalFieldOverrides***REMOVED***
import formOverride from ***REMOVED***./larvalFormOverride***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import PTTForm from ***REMOVED***@/PTT/PTTForm***REMOVED***

const OilForm = (): ReactElement => {
  return (
    <PTTForm
      label=***REMOVED***Larval Fish Model Form***REMOVED***
      schema={schema as JSONSchema6}
      fieldOverrides={fieldOverrides}
      formOverride={formOverride}
      />

  )
}

export default OilForm
