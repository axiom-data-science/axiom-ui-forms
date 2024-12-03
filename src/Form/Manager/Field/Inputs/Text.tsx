import { type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Manager/Field/FieldLabel***REMOVED***
import { Input } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const Text = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  return (
                 <Input label={<FieldLabel {...field} />} id={field.id} testId={field.id} value={field.value !== undefined ? String(field.value) : undefined} onChange={(e) => {
                   field.value = e
                   if (onChange !== undefined) {
                     onChange()
                   }
                 }} />
  )
}

export default Text
