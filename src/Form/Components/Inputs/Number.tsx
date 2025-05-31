import FieldLabel, { FieldDescriptionTooltip, FieldLabelText } from '@/Form/Components/FieldLabel'
import { type INumberField, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { Checkbox, Input, Slider } from '@axdspub/axiom-ui-utilities'
import { CheckIcon, Cross2Icon, Pencil1Icon } from '@radix-ui/react-icons'
import React, { useState, type ReactElement } from 'react'

const isValidNumber = (value: string): boolean => {
  if (value === undefined || value === null || value === '') {
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
  const [mode, setMode] = useState<'slider' | 'text'>('slider')

  return (<div>
    <FieldLabel {...field} />
    <div className='flex flex-row gap-4'>
      <Slider
        className='flex-grow max-w-[400px] mt-1'
        size='sm'
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
        <div className='w-[100px] flex flex-row text-right'>
        {
          mode === 'slider'
            ? <>
              <strong className='w-[60px]'>{tempValue}</strong>
                <Pencil1Icon className='inline m-1 w-5 h-5  cursor-pointer' onClick={() => {
                  setMode('text')
                }} />
                </>
            : <>
              <Input
              id={`slider-text-${field.id}`}
              testId={`slider-text-${field.id}`}
              value={tempTextValue !== undefined && tempTextValue !== null ? String(tempTextValue) : ''}
              className='w-[50px] text-xs text-right'
              size='xs'
              label={undefined}
              onChange={(e) => {
                updateTemp(e)
              }} />
              <Cross2Icon className='flex-none inline w-5 h-5 m-1 cursor-pointer' color='red' onClick={() => {
                setMode('slider')
              }} />
              <CheckIcon className={`flex-none inline w-5 h-5 m-1 ${isValidNumber(String(tempTextValue)) ? 'cursor-pointer' : 'opacity-50'}`} color='green' onClick={() => {
                if (isValidNumber(String(tempTextValue))) {
                  setMode('slider')
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

const TextInput = ({ field, onChange, value, className }: IFieldInputProps): ReactElement => {
  const [error, setError] = useState<string | undefined>(undefined)

  return (
    <>
    <Input
        id={field.id}
        testId={field.id}
        error={error}
        className={className}
        value={value !== undefined && value !== null ? String(value) : ''}
        label={<FieldLabel {...field} />} onChange={(e) => {
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
        }} />
    {error !== undefined && <p className='text-red-500 text-xs py-2'>{error}</p>}
    </>
  )
}

const NumberInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ''
  const numberField = field as INumberField
  const isNull = initialValue === undefined || initialValue === null || initialValue === ''
  const [userSelectedNotNull, setUserSelectedNotNull] = useState<boolean>(!isNull)
  const canBeNull = numberField.settings?.canBeNull === true

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
        field={fieldForInput}
        value={initialValue}
        onChange={onChange}
        min={numberField?.constraints?.min}
        max={max}
        step={numberField?.settings?.step} />
      : <TextInput
        field={fieldForInput}
        value={initialValue}
        onChange={onChange}
        className='max-w-[300px]'

        />
      }</>
  )

  if (canBeNull) {
    return (
      <div className='flex flex-col gap-2'>
        <Checkbox
          id={`${field.id}-null`}
          testId={`${field.id}-null`}
          label={<><FieldLabelText {...field}
          /> <FieldDescriptionTooltip {...field} /></>}
          value={userSelectedNotNull}
          onChange={(e) => {
            setUserSelectedNotNull(!userSelectedNotNull)
            if (!e) {
              onChange(undefined)
            } else {
              onChange(numberField?.settings?.nonNullDefaultValue ?? numberField?.defaultValue ?? value ?? 0)
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
