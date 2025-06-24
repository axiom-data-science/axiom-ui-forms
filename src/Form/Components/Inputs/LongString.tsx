import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type ITextField, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const LongStringInput = ({ field, onChange, value, className }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ***REMOVED******REMOVED***
  const textField = field as ITextField
  const getValue = (): string => {
    return initialValue !== undefined && initialValue !== null ? String(initialValue) : ***REMOVED******REMOVED***
  }
  return <div>
      <TextArea
        className={className}
        id={field.id}
        testId={field.id}
        label={<FieldLabel {...field} />}
        placeholder={textField.placeholder}
        value={getValue()}
        onChange={(e) => {
          onChange(e)
        }} /></div>
}

export default LongStringInput
