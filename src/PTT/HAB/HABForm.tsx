import schema from ***REMOVED***./HABConfig.json***REMOVED***
import fieldOverrides from ***REMOVED***./habFieldOverrides***REMOVED***
import formOverride from ***REMOVED***./habFormOverride***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import PTTForm from ***REMOVED***@/PTT/PTTForm***REMOVED***

const HABForm = (): ReactElement => {
  return (
    <PTTForm
      label=***REMOVED***Harmful Algal Bloom Form***REMOVED***
      schema={schema as JSONSchema6}
      fieldOverrides={fieldOverrides}
      formOverride={formOverride}
      />

  )
}

export default HABForm
