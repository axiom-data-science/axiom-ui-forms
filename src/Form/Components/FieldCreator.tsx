import inputMap from ***REMOVED***@/Form/Components/Inputs/inputMap***REMOVED***
import { type IFieldInputProps, type IFormField, type IValueChangeFn, type IValueType } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { getFieldValue, getPathFromField } from ***REMOVED***@/Form/helpers***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { Button, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CheckIcon, CopyIcon, Cross1Icon, PlusIcon, TrashIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
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

const MultipleFieldCreator = ({ field, onChange, value }: IFieldCreator): ReactElement => {
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  const defaultOnChange = (v: IValueType[] | undefined): void => {
    formValues[getPathFromField(field)] = v
    setFormValues(structuredClone(formValues))
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
          key={`${field.id}-${index}`}
          InputComponent={InputComponent}
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
  value,
  onChange,
  className,
  defaultClassName = ***REMOVED***py-5 flex flex-col gap-8***REMOVED***
}: IFieldCreator): ReactElement => {
  const InputComponent = inputMap[field.type]
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  const defaultOnChange = (v: IValueType | IValueType[] | undefined): void => {
    formValues[getPathFromField(field)] = v
    setFormValues(structuredClone(formValues))
  }
  const initialValue = value !== undefined ? value : getFieldValue(field, formValues)
  return InputComponent !== undefined
    ? <div className={utils.makeClassName({
      className,
      defaultClassName
    })}>{
      field.multiple === true
        ? <MultipleFieldCreator field={field} onChange={onChange} value={initialValue} />
        : <InputComponent field={field} onChange={onChange ?? defaultOnChange} value={Array.isArray(initialValue) ? initialValue[0] : initialValue} />

    }</div>
    : <p>No component definition for {field.type} ({field.id})</p>
}

export default FieldCreator
