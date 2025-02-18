import inputMap from '@/Form/Components/Inputs/inputMap'
import { type IFormValues, type IFieldInputProps, type IFormField, type IValueChangeFn, type IValueType, type IForm } from '@/Form/FormCreatorTypes'
import { checkCondition, cleanUnusedDependenciesFromFormValues, getFieldValue, getPathFromField } from '@/Form/helpers'
import { Button, utils } from '@axdspub/axiom-ui-utilities'
import { CheckIcon, CopyIcon, Cross1Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { set } from 'lodash'
import React, { useState, type ReactElement } from 'react'

interface IFieldCreator {
  field: IFormField
  form: IForm
  onChange?: IValueChangeFn
  className?: string
  defaultClassName?: string
  value?: IValueType | IValueType[]
  formValueState: [IFormValues, (v: IFormValues) => void]
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
  form,
  value,
  index,
  onChange,
  values,
  formValueState

}: {
  InputComponent: React.FC<IFieldInputProps>
  field: IFormField
  form: IForm
  value: IValueType
  index: number
  onChange: (v: IValueType[] | undefined) => void
  values: IValueType[]
  formValueState: [IFormValues, (v: IFormValues) => void]

}): ReactElement => {
  const addValue = (v: IValueType | null): void => {
    const newValues = [...values]
    newValues.splice(index + 1, 0, v)
    onChange(newValues)
  }

  return (
    <div className='flex flex-col gap-2'>
          <InputComponent
          formValueState={formValueState}
          form={form}
          field={{
            ...field,
            required: false,
            label: index > 0 ? null : field.label,
            id: `${field.id}-${index}`
          }}
          value={value}
          onChange={(v) => {
            const newValues = [...values]
            newValues[index] = String(v)
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
              <div className='ml-auto flex gap-2'>
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

const MultipleFieldCreator = ({ form, field, onChange, value, formValueState }: IFieldCreator): ReactElement => {
  const [formValues, setFormValues] = formValueState
  const defaultOnChange = (v: IValueType[] | undefined): void => {
    const formValuesCopy = structuredClone(formValues)
    set(formValuesCopy, getPathFromField(field), v)
    setFormValues(formValuesCopy)
  }

  const initialVal = value !== undefined ? value : getFieldValue(field, formValues)
  const initialValues = (initialVal !== undefined ? (Array.isArray(initialVal) ? initialVal : [initialVal]) : [null])

  /* const initialValues = (
    formValues[getPathFromField(field)] !== undefined
      ? Array.isArray(formValues[getPathFromField(field)])
        ? formValues[getPathFromField(field)]
        : [formValues[getPathFromField(field)]]
      : [null]
  ) as IValueType[] */

  const InputComponent = inputMap[field.type]

  return <div>
    {
      initialValues?.map((value, index) => {
        return <OneOfMultiple
          formValueState={formValueState}
          key={`${field.id}-${index}`}
          InputComponent={InputComponent}
          form={form}
          field={field}
          value={value}
          index={index}
          onChange={onChange ?? defaultOnChange}
          values={initialValues}
          />
      })
    }
  </div>
}

const FieldCreator = ({
  field,
  form,
  value,
  onChange,
  className,
  defaultClassName = 'py-2 flex flex-col gap-8',
  formValueState
}: IFieldCreator): ReactElement | null => {
  const [formValues, setFormValues] = formValueState
  const InputComponent = inputMap[field.type]

  const updateFormValues = (v: IFormValues): void => {
    setFormValues(cleanUnusedDependenciesFromFormValues(form, v))
  }

  if (!checkCondition(field, formValues)) {
    return null
  }

  const defaultOnChange = (v: IValueType | IValueType[] | undefined): void => {
    const formValuesCopy = structuredClone(formValues)
    set(formValuesCopy, getPathFromField(field), v)
    updateFormValues(formValuesCopy)
  }
  const initialValue = value !== undefined ? value : getFieldValue(field, formValues)
  return InputComponent !== undefined
    ? <div className={utils.makeClassName({
      className,
      defaultClassName
    })}>{
      field.multiple === true
        ? <MultipleFieldCreator field={field} form={form} onChange={onChange} value={initialValue} formValueState={formValueState} />
        : <InputComponent field={field} form={form} onChange={onChange ?? defaultOnChange} value={Array.isArray(initialValue) ? initialValue[0] : initialValue} formValueState={formValueState} />

    }</div>
    : <p>No component definition for {field.type} ({field.id})</p>
}

export default FieldCreator
