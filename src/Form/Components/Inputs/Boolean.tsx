import { FieldLabelText } from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Checkbox, Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { InfoCircledIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const BooleanInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : false
  return <Checkbox id={field.id} testId={field.id} label={<><FieldLabelText {...field} /> {
    field.description !== undefined
      ? <Tooltip content={field.description}><InfoCircledIcon /></Tooltip>
      : ***REMOVED******REMOVED***
  }</>} value={Boolean(initialValue)} onChange={(e) => {
    onChange(e)
  }} />
}

export default BooleanInput
