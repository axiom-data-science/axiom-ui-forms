"use client";
import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const MeditorForm = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>({})

  return (
        <FormWithEditorOverlay
            schemaState={schemaState}
            label=***REMOVED***Meditor Form***REMOVED***
            />
  )
}

export default MeditorForm
