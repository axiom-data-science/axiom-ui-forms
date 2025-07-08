import FieldLabel, { FieldDescriptionTooltip, FieldLabelText } from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type INumberField, type IFieldInputProps, type IValueType } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Checkbox, Input, Slider } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CheckIcon, Cross2Icon, Pencil1Icon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***

const isValidNumber = (value: string): boolean => {
  if (value === undefined || value === null || value === ***REMOVED******REMOVED***) {
    return false
  }
  const num = Number(value)
  return !isNaN(num) && isFinite(num)
}

const SliderInput = ({
  field,
  value,
  onChange,
  min,
  max,
  step,
  disabled
}: IFieldInputProps & { max: number, min?: number, step?: number }): ReactElement => {
  const [tempValue, setTempValue] = useState<number | undefined>(value !== undefined && value !== null ? +value : undefined)
  const [tempTextValue, setTempTextValue] = useState<string | undefined>(value !== undefined ? String(value) : undefined)
  const [mode, setMode] = useState<***REMOVED***slider***REMOVED*** | ***REMOVED***text***REMOVED***>(***REMOVED***slider***REMOVED***)
  const updateTemp = (value: string | number | undefined): void => {
    if (value !== undefined && isValidNumber(String(value))) {
      setTempValue(+value)
      setTempTextValue(String(value))
    } else {
      setTempTextValue(value !== undefined ? String(value) : undefined)
    }
  }
  useEffect(() => {
    if (value !== tempValue) {
      updateTemp(value !== undefined && value !== null ? +value : undefined)
    }
  }, [value])

  return (<div>
    <FieldLabel
      field={field}
      disabled={disabled}
      value={value}
      onChange={onChange}
      />
    <div className=***REMOVED***flex flex-row gap-4***REMOVED***>
      <Slider
        wrapperClassName=***REMOVED***flex-grow max-w-[400px] mt-1***REMOVED***
        size=***REMOVED***sm***REMOVED***
        disabled={disabled}
        retainUndefinedOnLoad={true}
        value={tempValue}
        min={min ?? 0}
        max={max}
        onChange={(v: number): void => {
          updateTemp(v)
        } }
        onChangeComplete={(v: number): void => {
          updateTemp(v)
          onChange(v)
        } }
        id={field.id}
        testId={field.id}
        step={step ?? ((max - (min ?? 0)) / 100)} />
        <div className=***REMOVED***w-[100px] flex flex-row text-right***REMOVED***>
        {
          mode === ***REMOVED***slider***REMOVED***
            ? <>
              <strong className={`w-[60px]${disabled ? ***REMOVED*** text-slate-400 cursor-not-allowed***REMOVED*** : ***REMOVED******REMOVED***}`}>{tempValue}</strong>
                <Pencil1Icon className={`inline m-1 w-5 h-5 ${disabled ? ***REMOVED*** opacity-50 cursor-not-allowed***REMOVED*** : ***REMOVED***cursor-pointer***REMOVED***}`} onClick={() => {
                  if (disabled) return
                  setMode(***REMOVED***text***REMOVED***)
                }} />
                </>
            : <>
            {
              (
                (tempTextValue !== undefined && tempTextValue !== null) ||
                mode === ***REMOVED***text***REMOVED***
              )

                ? <><Input
              id={`slider-text-${field.id}`}
              disabled={disabled}
              testId={`slider-text-${field.id}`}
              value={tempTextValue !== undefined && tempTextValue !== null ? String(tempTextValue) : ***REMOVED******REMOVED***}
              className=***REMOVED***w-[50px] text-xs text-right***REMOVED***
              size=***REMOVED***xs***REMOVED***
              label={undefined}
              onChange={(e) => {
                updateTemp(e)
              }} />
              <Cross2Icon className={`flex-none inline m-1 w-5 h-5 ${disabled ? ***REMOVED***opacity-50 cursor-not-allowed***REMOVED*** : ***REMOVED***cursor-pointer***REMOVED***}`} color=***REMOVED***red***REMOVED*** onClick={() => {
                if (!disabled) {
                  setMode(***REMOVED***slider***REMOVED***)
                }
              }} />
              <CheckIcon className={`flex-none inline m-1 w-5 h-5 ${(disabled ?? !isValidNumber(String(tempTextValue))) ? ***REMOVED***opacity-50 cursor-not-allowed***REMOVED*** : ***REMOVED***cursor-pointer***REMOVED***}`} color=***REMOVED***green***REMOVED*** onClick={() => {
                if (!disabled && isValidNumber(String(tempTextValue))) {
                  setMode(***REMOVED***slider***REMOVED***)
                  updateTemp(tempTextValue)
                  onChange(tempTextValue)
                }
              }} />
              </>
                : ***REMOVED******REMOVED***
            }
              </>
        }
        </div>
    </div>
  </div>)
}

const TextInput = ({ field, onChange, value, className, disabled }: IFieldInputProps): ReactElement => {
  const [error, setError] = useState<string | undefined>(undefined)

  return (
    <>
    <Input
        id={field.id}
        testId={field.id}
        error={error}
        className={className}
        value={value !== undefined && value !== null ? String(value) : ***REMOVED******REMOVED***}
        label={<FieldLabel
            field={field}
            disabled={disabled}
            value={value}
            onChange={onChange}
            />} onChange={(e) => {
              if (e !== undefined && !isNaN(+e) && e !== ***REMOVED******REMOVED***) {
                onChange(+e)
                setError(undefined)
              } else {
                if (String(e).length > 0) {
                  setError(***REMOVED***Please enter a valid number***REMOVED***)
                } else {
                  setError(undefined)
                }
                onChange(undefined)
              }
            }}
          after={error !== undefined && <p className=***REMOVED***text-red-500 text-xs py-2***REMOVED***>{error}</p>}

            />
    </>
  )
}

const NumberInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : undefined
  const numberField = field as INumberField
  const isNull = initialValue === undefined || initialValue === null || initialValue === ***REMOVED******REMOVED***
  const [userSelectedNotNull, setUserSelectedNotNull] = useState<boolean>(!isNull)
  const canBeNull = numberField.settings?.canBeNull === true

  const myOnChange = (v: IValueType | IValueType[] | undefined): void => {
    onChange(v)
  }

  const max = numberField?.constraints?.max
  const fieldForInput = canBeNull
    ? {
        ...field,
        label: undefined,
        description: undefined
      }
    : field
  const el = (
    <>{
    max !== undefined
      ? <SliderInput
        disabled={disabled}

        field={fieldForInput}
        value={initialValue}
        onChange={myOnChange}
        min={numberField?.constraints?.min}
        max={max}
        step={numberField?.settings?.step} />
      : <TextInput
        disabled={disabled}
        field={fieldForInput}
        value={initialValue}
        onChange={onChange}
        className=***REMOVED***max-w-[300px]***REMOVED***

        />
      }</>
  )

  if (canBeNull) {
    return (
      <div className=***REMOVED***flex flex-col gap-2***REMOVED***>
        <Checkbox
          disabled={disabled}
          id={`${field.id}-null`}
          testId={`${field.id}-null`}
          label={<><FieldLabelText
              field={field}
              disabled={disabled}
              onChange={onChange}
          /> <FieldDescriptionTooltip field={field} disabled={disabled} /></>}
          value={userSelectedNotNull}
          onChange={(e) => {
            setUserSelectedNotNull(!userSelectedNotNull)
            if (!e) {
              onChange(undefined)
            } else {
              onChange(numberField?.settings?.nonNullDefaultValue ?? numberField?.defaultValue ?? value ?? undefined)
            }
          }} />
        {userSelectedNotNull ? el : <></>}
      </div>
    )
  } else {
    return el
  }
}

export default NumberInput
