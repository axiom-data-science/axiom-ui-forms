import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type ITextField, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { createTextFieldDebounce } from ***REMOVED***@/utils/helpers***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const LongStringInput = ({ field, onChange, value, className, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ***REMOVED******REMOVED***
  const textField = field as ITextField
  const getValue = (): string => {
    return initialValue !== undefined && initialValue !== null ? String(initialValue) : ***REMOVED******REMOVED***
  }
  const debounced = createTextFieldDebounce(onChange, 200)
  return <div>
      <TextArea
        className={className}
        id={field.id}
        testId={field.id}
        label={<FieldLabel
          field={field}
          disabled={disabled}
          value={value}
          onChange={onChange}
        />}
        placeholder={textField.placeholder}
        value={getValue()}
        onChange={debounced} /></div>
}

export default LongStringInput
