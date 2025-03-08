import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Input } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const NumberInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ***REMOVED******REMOVED***
  return <div>
      <Input
        id={field.id}
        testId={field.id}
        value={initialValue !== undefined && initialValue !== null ? String(initialValue) : ***REMOVED******REMOVED***}
        label={<FieldLabel {...field} />} onChange={(e) => {
          if (e !== undefined && !isNaN(+e)) {
            onChange(+e)
          } else {
            onChange(undefined)
          }
        }} /></div>
}

export default NumberInput
