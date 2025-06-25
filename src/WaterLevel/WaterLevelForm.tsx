import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { type IFormOverride, type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***

import schema from ***REMOVED***./waterLevelSchema.json***REMOVED***
import fieldOverrides from ***REMOVED***./fieldOverrides.json***REMOVED***
import formOverride from ***REMOVED***./formOverrides.json***REMOVED***
import StationSearch from ***REMOVED***@/WaterLevel/StationSearch***REMOVED***
import { QueryClient, QueryClientProvider } from ***REMOVED***@tanstack/react-query***REMOVED***

const queryClient = new QueryClient()

const WaterLevelForm = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)

  return (
    <QueryClientProvider client={queryClient}>
    <FormWithEditorOverlay
      inputOverrides={{
        ***REMOVED***custom:station_search***REMOVED***: StationSearch
      }}
      label="Water Level Form"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      />
      </QueryClientProvider>

  )
}

export default WaterLevelForm
