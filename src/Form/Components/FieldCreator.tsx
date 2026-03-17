"use client";
import config from ***REMOVED***@/config/environment***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import inputMap from ***REMOVED***@/Form/Components/Inputs/inputMap***REMOVED***
import { useFormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { type ICheckConditionResult, type IFieldInputProps, type IFormField, type IValueChangeFn, type IValueType } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { getFieldValue, makeJsonPath } from ***REMOVED***@/utils/getters***REMOVED***
import { cleanAndUpdateFormValuesWithFieldValue, cloneObject, createOneOfMultipleField } from ***REMOVED***@/utils/manipulators***REMOVED***
import { checkCondition } from ***REMOVED***@/utils/validators***REMOVED***
import { Button, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CheckIcon, CopyIcon, Cross1Icon, ExclamationTriangleIcon, PlusIcon, TrashIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***

const SHOW_DEBUG = config.SHOW_DEBUG
const disabledClassName = ***REMOVED******REMOVED*** // ***REMOVED***opacity-50 pointer-events-none cursor-not-allowed***REMOVED***

interface IFieldCreator {
  field: IFormField
  onChange?: IValueChangeFn
  className?: string
  defaultClassName?: string
  value?: IValueType | IValueType[]
  disabled?: boolean
  conditionResult?: ICheckConditionResult
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

const getFieldWrapperClass = (field: IFormField): string => {
  const cl = []
  const level = field.level ?? 0
  const type = field.type
  const multiple = field.multiple ?? false
  if ((type === ***REMOVED***object***REMOVED*** && level > 1) || multiple) {
    cl.push(***REMOVED***p-4***REMOVED***)
    if (level > 0) {
      cl.push(level % 2 ? ***REMOVED***bg-slate-200***REMOVED*** : ***REMOVED***bg-slate-100***REMOVED***)
    }
  }
  return cl.join(***REMOVED*** ***REMOVED***)
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
    <div className={`flex flex-col gap-2${disabled ? ` ${disabledClassName}` : ***REMOVED******REMOVED***} py-2 ${getFieldWrapperClass(field)}`} data-testid={`field-${field.id}-${index}`}>
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
      <div className=***REMOVED***flex flex-row w-full p-2 gap-4***REMOVED***>

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
              addValue(cloneObject(value))
            }}>Duplicate <CopyIcon className=***REMOVED***inline ml-2***REMOVED*** />
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
    if (typeof onChange === ***REMOVED***function***REMOVED***) {
      onChange(v)
    }
  }

  const initialVal = value !== undefined ? value : getFieldValue(field, formValues)
  const initialValues = Array.isArray(initialVal) ? initialVal : [initialVal]

  if (field.type === ***REMOVED***object***REMOVED*** && field.skip_path === true && field.multiple === true) {
    return <div className={`p-4 bg-slate-100${disabled ? ` ${disabledClassName}` : ***REMOVED******REMOVED***}`}>
      <FieldLabel field={field} disabled={disabled} />
      <p className=***REMOVED***text-rose-700***REMOVED***><ExclamationTriangleIcon className=***REMOVED***inline w-4 h-4 mr-2***REMOVED*** /> Error with field <span className=***REMOVED***font-sans p-2 text-xs bg-slate-200***REMOVED***>{field.id}</span> Object fields with multiple true and skip_path true are not supported.</p>
    </div>
  }

  const InputComponent = {
    ...inputMap,
    ...(inputOverrides ?? {})
  }[field.type]

  return <div className=***REMOVED***flex flex-col divide-y-2 divide-opacity-50 divide-slate-400 divide-dashed***REMOVED***>
    {
      initialValues?.map((va, index) => {
        return <div key={`${field.id}-${index}`}>{
          SHOW_DEBUG && <><span className=***REMOVED***text-red-500***REMOVED***>{makeJsonPath(field)}</span><span className=***REMOVED***text-green-500***REMOVED***>{makeJsonPath(createOneOfMultipleField(field, index))}</span></>
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
  className = field.type === ***REMOVED***constant***REMOVED*** ? ***REMOVED***hidden***REMOVED*** : undefined,
  disabled,
  defaultClassName = ***REMOVED***flex flex-col gap-8 flex-grow h-full***REMOVED***,
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
    if (typeof onChange === ***REMOVED***function***REMOVED***) {
      onChange(v)
    }
  }
  const onChangeFn = defaultOnChange



  conditionResult = conditionResult ?? checkCondition(field, formValues)

  if (
    (conditionResult.pass && conditionResult.result === ***REMOVED***exclude***REMOVED***) ||
    (!conditionResult.pass && conditionResult.result === ***REMOVED***include***REMOVED***)
  ) {
    return null
  } else if (
    (conditionResult.result === ***REMOVED***disable***REMOVED*** && conditionResult.pass) ||
    (conditionResult.result === ***REMOVED***enable***REMOVED*** && !conditionResult.pass)
  ) {
    disabled = true
  } else if (conditionResult.result === ***REMOVED***enable***REMOVED*** && conditionResult.pass) {
    disabled = false
  }


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
          <p className=***REMOVED***font-bold mb-2***REMOVED***><ExclamationTriangleIcon className=***REMOVED***inline***REMOVED*** /> {field.label ?? ***REMOVED******REMOVED***}</p>
          <p className=***REMOVED***p-4 text-sm bg-slate-100***REMOVED***>No component definition for <span className=***REMOVED***text-rose-800 font-mono text-xs bg-slate-300 p-2***REMOVED***>type</span><span className=***REMOVED***p-2 bg-slate-700 text-white font-mono text-xs***REMOVED***>{field.type}</span> at <span className=***REMOVED***text-rose-800 font-mono text-xs bg-slate-300 p-2***REMOVED***>id</span><span className=***REMOVED***p-2 bg-slate-700 text-white font-mono text-xs***REMOVED***>{field.id}</span></p>
        </div>
    }
  </>
}

export default FieldCreator
