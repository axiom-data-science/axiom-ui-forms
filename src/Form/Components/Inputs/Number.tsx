import FieldLabel, { FieldDescriptionTooltip, FieldLabelText } from '@/Form/Components/FieldLabel'
import { type INumberField, type IFieldInputProps, type IValueType } from '@/Form/Creator/FormCreatorTypes'
import { Checkbox, Input, Slider } from '@axdspub/axiom-ui-utilities'
import { CheckIcon, Cross2Icon, Pencil1Icon } from '@radix-ui/react-icons'
import React, { useEffect, useState, type ReactElement } from 'react'

const isValidNumber = (value: string): boolean => {
  if (value === undefined || value === null || value === '') {
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
  const [mode, setMode] = useState<'slider' | 'text'>('slider')
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
      onChange={(v) => {
        updateTemp(Number(v))
        onChange(v)
      }}
      />
    <div className='flex flex-row gap-4'>
      <Slider
        wrapperClassName='grow max-w-100 mt-1'
        size='sm'
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
        <div className='w-25 flex flex-row text-right'>
        {
          mode === 'slider'
            ? <>
              <strong className={`w-15${disabled ? ' text-slate-400 cursor-not-allowed' : ''}`}>{tempValue}</strong>
                <Pencil1Icon className={`inline m-1 w-5 h-5 ${disabled ? ' opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} onClick={() => {
                  if (disabled) return
                  setMode('text')
                }} />
                </>
            : <>
            {
              (
                (tempTextValue !== undefined && tempTextValue !== null) ||
                mode === 'text'
              )

                ? <><Input
              id={`slider-text-${field.id}`}
              disabled={disabled}
              testId={`slider-text-${field.id}`}
              value={tempTextValue !== undefined && tempTextValue !== null ? String(tempTextValue) : ''}
              className='w-12.5 text-xs text-right'
              size='xs'
              label={undefined}
              onChange={(e) => {
                updateTemp(e)
              }} />
              <Cross2Icon className={`flex-none inline m-1 w-5 h-5 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} color='red' onClick={() => {
                if (!disabled) {
                  setMode('slider')
                }
              }} />
              <CheckIcon className={`flex-none inline m-1 w-5 h-5 ${(disabled ?? !isValidNumber(String(tempTextValue))) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`} color='green' onClick={() => {
                if (!disabled && isValidNumber(String(tempTextValue))) {
                  setMode('slider')
                  updateTemp(tempTextValue)
                  onChange(tempTextValue)
                }
              }} />
              </>
                : ''
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
        value={value !== undefined && value !== null ? String(value) : ''}
        placeholder={field.example ?? ''}
        label={<FieldLabel
            field={field}
            disabled={disabled}
            value={value}
            onChange={onChange}
            />} onChange={(e) => {
              if (e !== undefined && !isNaN(+e) && e !== '') {
                onChange(+e)
                setError(undefined)
              } else {
                if (String(e).length > 0) {
                  setError('Please enter a valid number')
                } else {
                  setError(undefined)
                }
                onChange(undefined)
              }
            }}
          after={error !== undefined && <p className='text-red-500 text-xs py-2'>{error}</p>}

            />
    </>
  )
}

const NumberInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : undefined
  const numberField = field as INumberField
  const isNull = initialValue === undefined || initialValue === null || initialValue === ''
  const [userSelectedNotNull, setUserSelectedNotNull] = useState<boolean>(!isNull)
  const canBeNull = numberField.settings?.canBeNull === true
  const invertForDisplay = numberField.settings?.invertForDisplay === true

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
        min={invertForDisplay ? numberField?.constraints?.max : numberField?.constraints?.min}
        max={max}
        step={numberField?.settings?.step} />
      : <TextInput
        disabled={disabled}
        field={fieldForInput}
        value={initialValue}
        onChange={onChange}
        className='max-w-75'

        />
      }</>
  )

  if (canBeNull) {
    return (
      <div className='flex flex-col gap-2'>
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
