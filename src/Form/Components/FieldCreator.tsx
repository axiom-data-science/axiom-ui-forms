"use client";
import config from '@/config/environment'
import FieldLabel from '@/Form/Components/FieldLabel'
import inputMap from '@/Form/Components/Inputs/inputMap'
import { useFormContext } from '@/Form/Creator/FormContextProvider'
import { type ICheckConditionResult, type IFieldInputProps, type IFormField, type IValueChangeFn, type IValueType } from '@/Form/Creator/FormCreatorTypes'
import { getFieldValue, makeJsonPath } from '@/utils/getters'
import { cleanAndUpdateFormValuesWithFieldValue, cloneObject, createOneOfMultipleField } from '@/utils/manipulators'
import { checkCondition } from '@/utils/validators'
import { Button, utils } from '@axdspub/axiom-ui-utilities'
import { CheckIcon, CopyIcon, Cross1Icon, ExclamationTriangleIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState, type ReactElement } from 'react'

const SHOW_DEBUG = config.SHOW_DEBUG
const disabledClassName = '' // 'opacity-50 pointer-events-none cursor-not-allowed'

interface IFieldCreator {
  field: IFormField
  onChange?: IValueChangeFn
  className?: string
  defaultClassName?: string
  value?: IValueType | IValueType[]
  disabled?: boolean
  conditionResult?: ICheckConditionResult
}

const toolButtonClass = 'border-white hover:border-single hover:border-1 hover:border-slate-400'

const DeleteMultiple = ({
  doDelete
}: {
  doDelete: () => void
}): ReactElement => {
  const [confirm, setConfirm] = useState(false)

  return (
    <>
      {
        confirm
          ? <p className='flex flex-row gap-2 text-sm'><span className='text-slate-600'>Deleting: </span> Are you sure?
            <Button size='xs' type='submit'
              onClick={() => {
                doDelete()
                setConfirm(false)
              }}>Yes <CheckIcon className='inline ml-2' />
            </Button>
            <Button size='xs' type='alert'
              onClick={() => {
                setConfirm(false)
              }}>Cancel <Cross1Icon className='inline ml-2' />
            </Button>
          </p>
          : <Button size='xs' className={toolButtonClass} onClick={() => { setConfirm(true) }}>
            Delete <TrashIcon className='inline ml-2 fill-white' />
          </Button>
      }
    </>
  )
}

const getFieldWrapperClass = (field: IFormField): string => {
  const cl = []
  const level = field.level ?? 0
  const type = field.type
  const multiple = field.multiple ?? false
  if ((type === 'object' && level > 1) || multiple) {
    cl.push('p-4')
    if (level > 0) {
      cl.push(level % 2 ? 'bg-slate-200' : 'bg-slate-100')
    }
  }
  return cl.join(' ')
}

const OneOfMultiple = ({
  InputComponent,
  field,
  value,
  index,
  onChange,
  values,
  disabled = false

}: {
  InputComponent: React.FC<IFieldInputProps>
  field: IFormField
  value: IValueType
  index: number
  onChange: (v: IValueType[] | undefined) => void
  values: IValueType[]
  disabled?: boolean
}): ReactElement => {
  const addValue = (v: IValueType | null): void => {
    const newValues = [...values]
    newValues.splice(index + 1, 0, v)
    onChange(newValues)
  }

  return (
    <div className={`flex flex-col gap-2${disabled ? ` ${disabledClassName}` : ''} py-2 ${getFieldWrapperClass(field)}`} data-testid={`field-${field.id}-${index}`}>
      <InputComponent
        field={field}
        value={value}
        disabled={disabled}
        onChange={(v) => {
          const newValues = [...values]
          newValues[index] = v as IValueType
          onChange(newValues)
        }}
      />
      <div className='flex flex-row w-full p-2 gap-4'>

        <div className='flex gap-2'>
          <Button
            size='xs'
            className={toolButtonClass}
            onClick={() => {
              addValue(null)
            }}>Add <PlusIcon className='inline ml-2' /></Button>
          <Button
            size='xs'
            className={toolButtonClass}
            onClick={() => {
              addValue(cloneObject(value))
            }}>Duplicate <CopyIcon className='inline ml-2' />
          </Button>
        </div>
        {index > 0 && (
          <DeleteMultiple doDelete={() => {
            const newValues = [...values]
            newValues.splice(index, 1)
            onChange(newValues)
          }} />
        )}
      </div>
    </div>
  )
}

export const MultipleFieldCreator = ({
  field,
  onChange,
  disabled = false,
  value
}: IFieldCreator): ReactElement => {
  const { formValues, setFormValues, inputOverrides, form } = useFormContext()
  const defaultOnChange = (v: IValueType[] | undefined): void => {
    const formValuesCopyClean = cleanAndUpdateFormValuesWithFieldValue({
      form,
      field,
      value: v,
      formValues
    })
    setFormValues(formValuesCopyClean)
    if (typeof onChange === 'function') {
      onChange(v)
    }
  }

  const initialVal = value !== undefined ? value : getFieldValue(field, formValues)
  const initialValues = Array.isArray(initialVal) ? initialVal : [initialVal]

  if (field.type === 'object' && field.skip_path === true && field.multiple === true) {
    return <div className={`p-4 bg-slate-100${disabled ? ` ${disabledClassName}` : ''}`}>
      <FieldLabel field={field} disabled={disabled} />
      <p className='text-rose-700'><ExclamationTriangleIcon className='inline w-4 h-4 mr-2' /> Error with field <span className='font-sans p-2 text-xs bg-slate-200'>{field.id}</span> Object fields with multiple true and skip_path true are not supported.</p>
    </div>
  }

  const InputComponent = {
    ...inputMap,
    ...(inputOverrides ?? {})
  }[field.type]

  return <div className='flex flex-col divide-y-2 divide-opacity-50 divide-slate-400 divide-dashed'>
    {
      initialValues?.map((va, index) => {
        return <div key={`${field.id}-${index}`}>{
          SHOW_DEBUG && <><span className='text-red-500'>{makeJsonPath(field)}</span><span className='text-green-500'>{makeJsonPath(createOneOfMultipleField(field, index))}</span></>
        }<OneOfMultiple
            key={`${field.id}-${index}`}
            InputComponent={InputComponent}
            field={createOneOfMultipleField(field, index)}
            value={va}
            index={index}
            onChange={defaultOnChange}
            values={initialValues}
            disabled={disabled}
          /></div>
      })
    }
  </div>
}

const FieldCreator = ({
  field,
  value,
  onChange,
  className = field.type === 'constant' ? 'hidden' : undefined,
  disabled,
  defaultClassName = 'flex flex-col gap-8 flex-grow h-full',
  conditionResult
}: IFieldCreator): ReactElement | null => {
  const { form, inputOverrides, setFormValues, formValues } = useFormContext()
  const InputComponent = {
    ...inputMap,
    ...(inputOverrides ?? {})
  }[field.type]

  const defaultOnChange = (v: IValueType | IValueType[] | undefined): void => {
    const formValuesCopyClean = cleanAndUpdateFormValuesWithFieldValue({
      form,
      field,
      value: v,
      formValues
    })
    setFormValues(formValuesCopyClean)
    if (typeof onChange === 'function') {
      onChange(v)
    }
  }
  const onChangeFn = defaultOnChange

  /* useEffect(() => {
    const fieldValue = getFieldValue(field, formValues)
    if (
      !(
        (value === undefined || value === null) && (fieldValue === undefined || fieldValue === null)
      ) &&
        value !== fieldValue
    ) {
      onChangeFn(value)
    }
  }, [value]) */

  conditionResult = conditionResult ?? checkCondition(field, formValues)

  if (
    (conditionResult.pass && conditionResult.result === 'exclude') ||
    (!conditionResult.pass && conditionResult.result === 'include')
  ) {
    return null
  } else if (
    (conditionResult.result === 'disable' && conditionResult.pass) ||
    (conditionResult.result === 'enable' && !conditionResult.pass)
  ) {
    disabled = true
  } else if (conditionResult.result === 'enable' && conditionResult.pass) {
    disabled = false
  }
  /* if (conditionResult.pass && conditionResult.newDefaultValue !== undefined) {
    if (value !== conditionResult.newDefaultValue) {
      value = conditionResult.newDefaultValue
      console.log('tester: setting newDefaultValue', field.id, value, getFieldValue(field, formValues))
      return <FieldCreator
        field={field}
        value={value}
        onChange={onChange}
        className={className}
        defaultClassName={defaultClassName}
        disabled={disabled}
        conditionResult={{ ...conditionResult, newDefaultValue: undefined }}
      />
    }
  } */

  const fieldValue = getFieldValue(field, formValues)
  const initialValue = value !== undefined ? value : fieldValue

  return <>
    {
      InputComponent !== undefined
        ? <div className={utils.makeClassName({
          className,
          defaultClassName,
          extras: [
            disabled ? disabledClassName : undefined,
            getFieldWrapperClass(field)
          ]
        })}>{
            field.multiple === true
              ? <MultipleFieldCreator
                field={field}
                disabled={disabled}
                onChange={onChange}
              />
              : <InputComponent
                field={field}
                disabled={disabled}
                onChange={onChangeFn}
                value={Array.isArray(initialValue) ? initialValue[0] : initialValue}
              />

          }</div>
        : <div>
          <p className='font-bold mb-2'><ExclamationTriangleIcon className='inline' /> {field.label ?? ''}</p>
          <p className='p-4 text-sm bg-slate-100'>No component definition for <span className='text-rose-800 font-mono text-xs bg-slate-300 p-2'>type</span><span className='p-2 bg-slate-700 text-white font-mono text-xs'>{field.type}</span> at <span className='text-rose-800 font-mono text-xs bg-slate-300 p-2'>id</span><span className='p-2 bg-slate-700 text-white font-mono text-xs'>{field.id}</span></p>
        </div>
    }
  </>
}

export default FieldCreator
