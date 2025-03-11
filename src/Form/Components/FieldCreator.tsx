import inputMap from ***REMOVED***@/Form/Components/Inputs/inputMap***REMOVED***
import { type IFormValues, type IFieldInputProps, type IFormField, type IValueChangeFn, type IValueType, type IForm, type IFormValueState } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { checkCondition, cleanUnusedDependenciesFromFormValues, getFieldValue, getPathFromField } from ***REMOVED***@/Form/helpers***REMOVED***
import { Button, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CheckIcon, CopyIcon, Cross1Icon, ExclamationTriangleIcon, PlusIcon, TrashIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { set } from ***REMOVED***lodash***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

interface IFieldCreator {
  field: IFormField
  form: IForm
  onChange?: IValueChangeFn
  className?: string
  defaultClassName?: string
  value?: IValueType | IValueType[]
  formValueState: IFormValueState
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
}

const toolButtonClass = ***REMOVED***border-white hover:border-single hover:border-1 hover:border-slate-400***REMOVED***

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
          ? <p className=***REMOVED***flex flex-row gap-2 text-sm***REMOVED***><span className=***REMOVED***text-slate-600***REMOVED***>Deleting: </span> Are you sure?
              <Button size=***REMOVED***xs***REMOVED*** type=***REMOVED***submit***REMOVED***
                onClick={() => {
                  doDelete()
                  setConfirm(false)
                }}>Yes <CheckIcon className=***REMOVED***inline ml-2***REMOVED*** />
              </Button>
              <Button size=***REMOVED***xs***REMOVED*** type=***REMOVED***alert***REMOVED***
                onClick={() => {
                  setConfirm(false)
                }}>Cancel <Cross1Icon className=***REMOVED***inline ml-2***REMOVED*** />
              </Button>
            </p>
          : <Button size=***REMOVED***xs***REMOVED*** className={toolButtonClass} onClick={() => { setConfirm(true) }}>
              Delete <TrashIcon className=***REMOVED***inline ml-2 fill-white***REMOVED*** />
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
    <div className=***REMOVED***flex flex-col gap-2***REMOVED***>
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
            newValues[index] = v as IValueType
            onChange(newValues)
          }}
        />

            <div className=***REMOVED***flex flex-row justify-between w-full p-2***REMOVED***>
              {index > 0 && (
              <DeleteMultiple doDelete={() => {
                const newValues = [...values]
                newValues.splice(index, 1)
                onChange(newValues)
              }} />
              )}
              <div className=***REMOVED***ml-auto flex gap-2***REMOVED***>
                <Button
                size=***REMOVED***xs***REMOVED***
                className={toolButtonClass}
                onClick={() => {
                  addValue(null)
                }}>Add <PlusIcon className=***REMOVED***inline ml-2***REMOVED*** /></Button>
                <Button
                  size=***REMOVED***xs***REMOVED***
                  className={toolButtonClass}
                  onClick={() => {
                    addValue(structuredClone(value))
                  }}>Duplicate <CopyIcon className=***REMOVED***inline ml-2***REMOVED*** />
                </Button>
              </div>
            </div>
        </div>
  )
}

const MultipleFieldCreator = ({
  form,
  field,
  onChange,
  value,
  formValueState,
  inputOverrides
}: IFieldCreator): ReactElement => {
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

  const InputComponent = {
    ...inputMap,
    ...(inputOverrides ?? {})
  }[field.type]

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
  defaultClassName = ***REMOVED***py-2 flex flex-col gap-8***REMOVED***,
  formValueState,
  inputOverrides
}: IFieldCreator): ReactElement | null => {
  const [formValues, setFormValues] = formValueState
  const InputComponent = {
    ...inputMap,
    ...(inputOverrides ?? {})
  }[field.type]

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
        ? <MultipleFieldCreator
            field={field}
            form={form}
            onChange={onChange}
            value={initialValue}
            formValueState={formValueState}
            inputOverrides={inputOverrides}
          />
        : <InputComponent
            field={field}
            form={form}
            onChange={onChange ?? defaultOnChange}
            value={Array.isArray(initialValue) ? initialValue[0] : initialValue}
            formValueState={formValueState}
            inputOverrides={inputOverrides}
          />

    }</div>
    : <div>
        <p className=***REMOVED***font-bold mb-2***REMOVED***><ExclamationTriangleIcon className=***REMOVED***inline***REMOVED*** /> {field.label ?? ***REMOVED******REMOVED***}</p>
        <p className=***REMOVED***p-4 text-sm bg-slate-100***REMOVED***>No component definition for <span className=***REMOVED***text-rose-800 font-mono text-xs bg-slate-300 p-2***REMOVED***>type</span><span className=***REMOVED***p-2 bg-slate-700 text-white font-mono text-xs***REMOVED***>{field.type}</span> at <span className=***REMOVED***text-rose-800 font-mono text-xs bg-slate-300 p-2***REMOVED***>id</span><span className=***REMOVED***p-2 bg-slate-700 text-white font-mono text-xs***REMOVED***>{field.id}</span></p>
      </div>
}

export default FieldCreator
