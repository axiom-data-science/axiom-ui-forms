import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***
import schema from ***REMOVED***./schema.json***REMOVED***
import formOverrides from ***REMOVED***./formOverrides***REMOVED***
import { type IFormOverride } from ***REMOVED***@/library***REMOVED***

const PlatformsMetadata = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const formOverridesState = useState<IFormOverride | undefined>(formOverrides)

  return (
        <FormWithEditorOverlay
            schemaState={schemaState}
            formOverrideState={formOverridesState}
            label=***REMOVED***Platform Metadata Form***REMOVED***
            />
  )
}

export default PlatformsMetadata
