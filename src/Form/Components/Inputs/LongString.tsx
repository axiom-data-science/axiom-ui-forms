import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const LongStringInput = ({ field, onChange }: IFieldInputProps): ReactElement => {
  const [formValues] = useAtom(formValuesAtom)
  return <div>
      <TextArea id={field.id} testId={field.id} label={<FieldLabel {...field} />} value={formValues[field.id] !== undefined ? String(formValues[field.id]) : ***REMOVED******REMOVED***} onChange={(e) => {
        onChange(e)
      }} /></div>
}

export default LongStringInput
