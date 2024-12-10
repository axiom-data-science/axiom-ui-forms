import { type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Manager/Field/FieldLabel***REMOVED***
import { Input } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const Text = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  const [value, setValue] = useState<string>(field.value !== undefined ? String(field.value) : ***REMOVED******REMOVED***)
  return (
                 <Input label={<FieldLabel {...field} />} id={field.id} testId={field.id} value={value} onChange={(e) => {
                   field.value = e
                   setValue(e !== undefined ? String(e) : ***REMOVED******REMOVED***)
                   onChange()
                 }} />
  )
}

export default Text
