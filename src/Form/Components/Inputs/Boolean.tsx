import { FieldLabelText } from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { Checkbox } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const BooleanInput = ({ field, onChange }: IFieldInputProps): ReactElement => {
  const [formValues] = useAtom(formValuesAtom)
  return <Checkbox id={field.id} testId={field.id} label={<FieldLabelText {...field} />} value={Boolean(formValues[field.id])} onChange={(e) => {
    onChange(e)
  }} />
}

export default BooleanInput
