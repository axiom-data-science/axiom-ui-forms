import FieldLabel from '@/Form/Components/FieldLabel'
import inputMap from '@/Form/Components/Inputs/inputMap'
import { useFormContext } from '@/Form/Creator/FormContextProvider'
import { type IFieldInputProps, type IFormField, type IValueChangeFn, type IValueType } from '@/Form/Creator/FormCreatorTypes'
import { getFieldValue } from '@/utils/getters'
import { cleanAndUpdateFormValuesWithFieldValue, createOneOfMultipleField, updateFormValuesWithFieldValue } from '@/utils/manipulators'
import { checkCondition } from '@/utils/validators'
import { Button, utils } from '@axdspub/axiom-ui-utilities'
import { CheckIcon, CopyIcon, Cross1Icon, ExclamationTriangleIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import React, { useState, type ReactElement } from 'react'

const disabledClassName = '' // 'opacity-50 pointer-events-none cursor-not-allowed'

interface IFieldCreator {
  field: IFormField
  onChange?: IValueChangeFn
  className?: string
  defaultClassName?: string
  value?: IValueType | IValueType[]
  disabled?: boolean
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
    <div className={`flex flex-col gap-2${disabled ? ` ${disabledClassName}` : ''}`}>
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

            <div className='flex flex-row justify-between w-full p-2'>
              {index > 0 && (
              <DeleteMultiple doDelete={() => {
                const newValues = [...values]
                newValues.splice(index, 1)
                onChange(newValues)
              }} />
              )}
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
                    addValue(structuredClone(value))
                  }}>Duplicate <CopyIcon className='inline ml-2' />
                </Button>
              </div>
            </div>
        </div>
  )
}

const MultipleFieldCreator = ({
  field,
  onChange,
  disabled = false,
  value
}: IFieldCreator): ReactElement => {
  const { formValues, setFormValues, inputOverrides } = useFormContext()
  const defaultOnChange = (v: IValueType[] | undefined): void => {
    const formValuesCopy = updateFormValuesWithFieldValue(field, v, formValues)
    setFormValues(formValuesCopy)
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

  return <div>
    {
      initialValues?.map((value, index) => {
        return <OneOfMultiple
          key={`${field.id}-${index}`}
          InputComponent={InputComponent}
          field={createOneOfMultipleField(field, index)}
          value={value}
          index={index}
          onChange={onChange ?? defaultOnChange}
          values={initialValues}
          disabled={disabled}
          />
      })
    }
  </div>
}

const FieldCreator = ({
  field,
  value,
  onChange,
  className,
  defaultClassName = 'py-2 flex flex-col gap-8 flex-grow h-full'
}: IFieldCreator): ReactElement | null => {
  const { form, inputOverrides, setFormValues, formValues } = useFormContext()
  const InputComponent = {
    ...inputMap,
    ...(inputOverrides ?? {})
  }[field.type]

  const conditionResult = checkCondition(field, formValues)
  let disabled: boolean = false

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
  }

  const defaultOnChange = (v: IValueType | IValueType[] | undefined): void => {
    const formValuesCopyClean = cleanAndUpdateFormValuesWithFieldValue({
      form,
      field,
      value: v,
      formValues
    })
    setFormValues(formValuesCopyClean)
  }
  const onChangeFn = onChange ?? defaultOnChange

  const initialValue = value !== undefined ? value : getFieldValue(field, formValues)

  return InputComponent !== undefined
    ? <div className={utils.makeClassName({
      className,
      defaultClassName,
      extras: disabled ? [disabledClassName] : undefined
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

export default FieldCreator
