"use client";
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { type IFormOverride, type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import rootFieldAtom from ***REMOVED***@/PTT/rootFieldAtom***REMOVED***
import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***

const PTTForm = ({
  label,
  schema,
  formOverride,
  fieldOverrides
}: {
  label: string
  schema: JSONSchema6
  formOverride: IFormOverride
  fieldOverrides: IFormFieldOverride[]
}): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema)
  const fieldOverrideState = useState(fieldOverrides)
  const rootFieldOverrideState = useAtom(rootFieldAtom)

  const formOverrideState = useState<IFormOverride | undefined>(formOverride)

  return (
    <FormWithEditorOverlay
      label={label}
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      rootFieldOverrideState={rootFieldOverrideState}
      />

  )
}

export default PTTForm
