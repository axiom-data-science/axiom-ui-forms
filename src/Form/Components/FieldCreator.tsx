import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import inputMap from ***REMOVED***@/Form/Components/Inputs/inputMap***REMOVED***
import { useFormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { type IFieldInputProps, type IFormField, type IValueChangeFn, type IValueType } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { getFieldValue } from ***REMOVED***@/utils/getters***REMOVED***
import { cleanAndUpdateFormValuesWithFieldValue, createOneOfMultipleField, updateFormValuesWithFieldValue } from ***REMOVED***@/utils/manipulators***REMOVED***
import { checkCondition } from ***REMOVED***@/utils/validators***REMOVED***
import { Button, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CheckIcon, CopyIcon, Cross1Icon, ExclamationTriangleIcon, PlusIcon, TrashIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

interface IFieldCreator {
  field: IFormField
  onChange?: IValueChangeFn
  className?: string
  defaultClassName?: string
  value?: IValueType | IValueType[]
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
  value,
  index,
  onChange,
  values

}: {
  InputComponent: React.FC<IFieldInputProps>
  field: IFormField
  value: IValueType
  index: number
  onChange: (v: IValueType[] | undefined) => void
  values: IValueType[]
}): ReactElement => {
  const addValue = (v: IValueType | null): void => {
    const newValues = [...values]
    newValues.splice(index + 1, 0, v)
    onChange(newValues)
  }

  return (
    <div className=***REMOVED***flex flex-col gap-2***REMOVED***>
          <InputComponent
          field={field}
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
              <div className=***REMOVED***flex gap-2***REMOVED***>
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
  field,
  onChange,
  value
}: IFieldCreator): ReactElement => {
  const { formValues, setFormValues, inputOverrides } = useFormContext()
  const defaultOnChange = (v: IValueType[] | undefined): void => {
    const formValuesCopy = updateFormValuesWithFieldValue(field, v, formValues)
    setFormValues(formValuesCopy)
  }

  const initialVal = value !== undefined ? value : getFieldValue(field, formValues)
  const initialValues = Array.isArray(initialVal) ? initialVal : [initialVal]

  if (field.type === ***REMOVED***object***REMOVED*** && field.skip_path === true && field.multiple === true) {
    return <div className=***REMOVED***p-4 bg-slate-100***REMOVED***>
      <FieldLabel {...field} />
      <p className=***REMOVED***text-rose-700***REMOVED***><ExclamationTriangleIcon className=***REMOVED***inline w-4 h-4 mr-2***REMOVED*** /> Error with field <span className=***REMOVED***font-sans p-2 text-xs bg-slate-200***REMOVED***>{field.id}</span> Object fields with multiple true and skip_path true are not supported.</p>
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
  defaultClassName = ***REMOVED***py-2 flex flex-col gap-8 flex-grow h-full***REMOVED***
}: IFieldCreator): ReactElement | null => {
  const { form, inputOverrides, setFormValues, formValues } = useFormContext()
  const InputComponent = {
    ...inputMap,
    ...(inputOverrides ?? {})
  }[field.type]

  if (!checkCondition(field, formValues)) {
    return null
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
      defaultClassName
    })}>{
      field.multiple === true
        ? <MultipleFieldCreator
            field={field}
            onChange={onChange}
          />
        : <InputComponent
            field={field}
            onChange={onChangeFn}
            value={Array.isArray(initialValue) ? initialValue[0] : initialValue}
          />

    }</div>
    : <div>
        <p className=***REMOVED***font-bold mb-2***REMOVED***><ExclamationTriangleIcon className=***REMOVED***inline***REMOVED*** /> {field.label ?? ***REMOVED******REMOVED***}</p>
        <p className=***REMOVED***p-4 text-sm bg-slate-100***REMOVED***>No component definition for <span className=***REMOVED***text-rose-800 font-mono text-xs bg-slate-300 p-2***REMOVED***>type</span><span className=***REMOVED***p-2 bg-slate-700 text-white font-mono text-xs***REMOVED***>{field.type}</span> at <span className=***REMOVED***text-rose-800 font-mono text-xs bg-slate-300 p-2***REMOVED***>id</span><span className=***REMOVED***p-2 bg-slate-700 text-white font-mono text-xs***REMOVED***>{field.id}</span></p>
      </div>
}

export default FieldCreator
