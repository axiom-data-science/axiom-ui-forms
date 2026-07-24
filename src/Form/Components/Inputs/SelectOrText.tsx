import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import SingleSelectInput from ***REMOVED***@/Form/Components/Inputs/SingleSelect***REMOVED***
import StringInput from ***REMOVED***@/Form/Components/Inputs/String***REMOVED***
import { ISelectField, IValueChangeFn, IValueType, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { SelectInput } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const SelectOrTextInput = ({
  field,
  onChange,
  value,
  disabled,
  className,
}: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ***REMOVED******REMOVED***
  const selectField = field as ISelectField
  const options = selectField.options !== undefined ? selectField.options : []
  if(options.length && !options.find((option) => option.value === ***REMOVED***other***REMOVED***)) {
    options.push({ label: ***REMOVED***Other***REMOVED***, value: ***REMOVED***other***REMOVED*** })
  }
  const otherOption = options.find((option) => String(option.value).toLowerCase() === ***REMOVED***other***REMOVED***)
  const checkInputShouldBeActive = (value: string | null | undefined): boolean => {
    if(String(value) !== ***REMOVED******REMOVED*** && value !== undefined && value !== null && (String(value).toLowerCase() === ***REMOVED***other***REMOVED*** || !options.find((option) => option.value === value))) {
      return true
    }
    return false
  }
  const [inputActive, setInputActive] = useState<boolean>(checkInputShouldBeActive(initialValue as string | null | undefined))
  const onChangeSelect: IValueChangeFn = (v) => {
    const shouldInputBeActive = checkInputShouldBeActive(String(v))
    setInputActive(shouldInputBeActive)
    if (v === ***REMOVED******REMOVED*** || shouldInputBeActive === true) {
      onChange(***REMOVED******REMOVED***)
    } else {
      onChange(v)
    }
}

  if (options.length > 0) {
    return (
      <div className=***REMOVED***flex flex-col gap-2***REMOVED***>
        <SingleSelectInput
          field={{
            ...field,
            type: ***REMOVED***select***REMOVED***,
            options
          }}
          onChange={onChangeSelect}
          value={inputActive ? otherOption?.value : initialValue}
          disabled={disabled}
          className={className}
        />
        {inputActive && (
            <StringInput
              field={{
                ...field,
                type: ***REMOVED***text***REMOVED***,
                label: ***REMOVED******REMOVED***
              }}
              onChange={onChange}
              value={initialValue}
              disabled={disabled}
              className={className}
              />
        )}
      </div>
    )
  }
  return <p>Field config for {field.id} is missing &apos;options&apos;</p>
}

export default SelectOrTextInput
