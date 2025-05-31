import oilSchema from ***REMOVED***./OpenOilModelConfig.json***REMOVED***
import oilFieldOverrides from ***REMOVED***./oilFieldOverrides***REMOVED***
import oilFormOverride from ***REMOVED***./oilFormOverride***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import PTTForm from ***REMOVED***@/PTT/PTTForm***REMOVED***

const OilForm = (): ReactElement => {
  return (
    <PTTForm
      label=***REMOVED***OpenOil Form***REMOVED***
      schema={oilSchema as JSONSchema6}
      fieldOverrides={oilFieldOverrides}
      formOverride={oilFormOverride}
      />

  )
}

export default OilForm
