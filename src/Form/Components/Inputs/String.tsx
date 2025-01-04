import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { Input } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const StringInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ***REMOVED******REMOVED***
  return <div>
      <Input
        id={field.id}
        testId={field.id}
        value={initialValue !== undefined && initialValue !== null ? String(initialValue) : ***REMOVED******REMOVED***}
        label={<FieldLabel {...field} />} onChange={(e) => {
          onChange(e)
        }} /></div>
}

export default StringInput
