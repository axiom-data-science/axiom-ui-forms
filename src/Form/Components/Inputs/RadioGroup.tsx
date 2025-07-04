import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { RadioGroup } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const RadioInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ***REMOVED******REMOVED***

  if (field.type === ***REMOVED***radio***REMOVED*** && field.options !== undefined) {
    return <RadioGroup
        id={field.id}
        label={<FieldLabel
          field={field}
          disabled={disabled}
          value={value}
          onChange={onChange}
        />}
        testId={field.id}
        options={field.options}
        value={initialValue !== undefined && initialValue !== null ? String(initialValue) : ***REMOVED******REMOVED***}
        onChange={(e) => {
          onChange(e?.value)
        }}
      />
  }
  return <p>Field config for {field.id} is missing &apos;options&apos;</p>
}

export default RadioInput
