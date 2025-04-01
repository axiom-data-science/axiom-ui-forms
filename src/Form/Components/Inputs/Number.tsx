import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type INumberField, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Input, Slider } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CheckIcon, Cross2Icon, Pencil1Icon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const isValidNumber = (value: string): boolean => {
  if (value === undefined || value === null || value === ***REMOVED******REMOVED***) {
    return false
  }
  const num = Number(value)
  return !isNaN(num) && isFinite(num)
}

const SliderInput = ({ field, value, onChange, min, max, step }: IFieldInputProps & { max: number, min?: number, step?: number }): ReactElement => {
  const updateTemp = (value: string | number | undefined): void => {
    if (value !== undefined && isValidNumber(String(value))) {
      setTempValue(+value)
      setTempTextValue(String(value))
    } else {
      setTempTextValue(value !== undefined ? String(value) : undefined)
    }
  }
  const [tempValue, setTempValue] = useState<number>(value !== undefined && value !== null ? +value : 0)
  const [tempTextValue, setTempTextValue] = useState<string | undefined>(value !== undefined ? String(value) : undefined)
  const [mode, setMode] = useState<***REMOVED***slider***REMOVED*** | ***REMOVED***text***REMOVED***>(***REMOVED***slider***REMOVED***)

  return (<div>
    <FieldLabel {...field} />
    <div className=***REMOVED***flex flex-row gap-4***REMOVED***>
      <Slider
        className=***REMOVED***flex-grow max-w-[400px] mt-1***REMOVED***
        size=***REMOVED***sm***REMOVED***
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
              <strong className=***REMOVED***w-[60px]***REMOVED***>{tempValue}</strong>
                <Pencil1Icon className=***REMOVED***inline m-1 w-5 h-5  cursor-pointer***REMOVED*** onClick={() => {
                  setMode(***REMOVED***text***REMOVED***)
                }} />
                </>
            : <>
              <Input
              id={`slider-text-${field.id}`}
              testId={`slider-text-${field.id}`}
              value={tempTextValue !== undefined && tempTextValue !== null ? String(tempTextValue) : ***REMOVED******REMOVED***}
              className=***REMOVED***w-[50px] text-xs text-right***REMOVED***
              size=***REMOVED***xs***REMOVED***
              label={undefined}
              onChange={(e) => {
                updateTemp(e)
              }} />
              <Cross2Icon className=***REMOVED***flex-none inline w-5 h-5 m-1 cursor-pointer***REMOVED*** color=***REMOVED***red***REMOVED*** onClick={() => {
                setMode(***REMOVED***slider***REMOVED***)
              }} />
              <CheckIcon className={`flex-none inline w-5 h-5 m-1 ${isValidNumber(String(tempTextValue)) ? ***REMOVED***cursor-pointer***REMOVED*** : ***REMOVED***opacity-50***REMOVED***}`} color=***REMOVED***green***REMOVED*** onClick={() => {
                if (isValidNumber(String(tempTextValue))) {
                  setMode(***REMOVED***slider***REMOVED***)
                  updateTemp(tempTextValue)
                  onChange(tempTextValue)
                }
              }} />
              </>
        }
        </div>
    </div>
  </div>)
}

const TextInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const [error, setError] = useState<string | undefined>(undefined)

  return (
    <>
    <Input
        id={field.id}
        testId={field.id}
        error={error}
        value={value !== undefined && value !== null ? String(value) : ***REMOVED******REMOVED***}
        label={<FieldLabel {...field} />} onChange={(e) => {
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
        }} />
    {error !== undefined && <p className=***REMOVED***text-red-500 text-xs py-2***REMOVED***>{error}</p>}
    </>
  )
}

const NumberInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ***REMOVED******REMOVED***
  const numberField = field as INumberField

  const max = numberField?.constraints?.max
  return (
    <div>{
    max !== undefined
      ? <SliderInput
        field={field}
        value={initialValue}
        onChange={onChange}
        min={numberField?.constraints?.min}
        max={max}
        step={numberField?.settings?.step} />
      : <TextInput
        field={field}
        value={initialValue}
        onChange={onChange} />
      }</div>
  )
}

export default NumberInput
