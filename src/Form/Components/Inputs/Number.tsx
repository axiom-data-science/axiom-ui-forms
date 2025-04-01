import FieldLabel from '@/Form/Components/FieldLabel'
import { type INumberField, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { Input, Slider } from '@axdspub/axiom-ui-utilities'
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

const TextInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const [error, setError] = useState<string | undefined>(undefined)

  return (
    <>
    <Input
        id={field.id}
        testId={field.id}
        error={error}
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
