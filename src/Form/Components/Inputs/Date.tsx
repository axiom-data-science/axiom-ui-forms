import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps, type ITextField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { useDebounceCallback } from ***REMOVED***@/utils/helpers***REMOVED***
import { DatePicker, Input } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const DateInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined && value !== null ? String(value) : ***REMOVED******REMOVED***
  const textField = field as ITextField
  return (
    <div>
      <DatePicker
        id={field.id}
        disabled={disabled}
        testId={field.id}
        variant="outline"
        value={initialValue}
        placeholder={textField.placeholder ?? textField.example ?? ***REMOVED******REMOVED***}
        label={<FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />}
        onChange={(e) => {
          return e !== undefined ? onChange(e.toISOString().split(***REMOVED***T***REMOVED***)[0]) : onChange(undefined)
        }}
      />
    </div>
  )
}

export default DateInput
