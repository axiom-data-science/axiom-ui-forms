***REMOVED***use client***REMOVED***
import config from ***REMOVED***@/config/environment***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import inputMap from ***REMOVED***@/Form/Components/Inputs/inputMap***REMOVED***
import { useFormContext, useFormValues } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import {
  type ICheckConditionResult,
  type IFieldInputProps,
  type IFormField,
  type IObjectField,
  type IFormValues,
  type IValueChangeFn,
  type IValueType,
  type ICompositeValueType,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { seedNestedDefaults } from ***REMOVED***@/utils/formEngine***REMOVED***
import errorRenderer from ***REMOVED***@/utils/errorRenderer***REMOVED***
import { getFieldValue, makeJsonPath } from ***REMOVED***@/utils/getters***REMOVED***
import {
  cleanAndUpdateFormValuesWithFieldValue,
  cloneObject,
  createOneOfMultipleField,
} from ***REMOVED***@/utils/manipulators***REMOVED***
import { checkCondition } from ***REMOVED***@/utils/validators***REMOVED***
import { Button, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import {
  CheckIcon,
  CopyIcon,
  Cross1Icon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
} from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { error } from ***REMOVED***ajv/dist/vocabularies/applicator/dependencies***REMOVED***
import React, { useCallback, useEffect, useRef, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { ErrorBoundary } from ***REMOVED***react-error-boundary***REMOVED***

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

const DeleteMultiple = ({ doDelete }: { doDelete: () => void }): ReactElement => {
  const [confirm, setConfirm] = useState(false)

  return (
    <>
      {confirm ? (
        <p className="flex flex-row gap-2 text-sm">
          <span className="text-slate-600">Deleting: </span> Are you sure?
          <Button
            size="xs"
            type="submit"
            onClick={() => {
              doDelete()
              setConfirm(false)
            }}
          >
            Yes <CheckIcon className="inline ml-2" />
          </Button>
          <Button
            size="xs"
            type="alert"
            onClick={() => {
              setConfirm(false)
            }}
          >
            Cancel <Cross1Icon className="inline ml-2" />
          </Button>
        </p>
      ) : (
        <Button
          size="xs"
          className={toolButtonClass}
          onClick={() => {
            setConfirm(true)
          }}
        >
          Delete <TrashIcon className="inline ml-2 fill-white" />
        </Button>
      )}
    </>
  )
}

const getFieldWrapperClass = (field: IFormField): string => {
  const cl = []
  const level = field.level ?? 0
  const type = field.type
  const multiple = field.type === ***REMOVED***object***REMOVED*** ? (field.multiple ?? false) : false
  if (((type === ***REMOVED***object***REMOVED*** || type === ***REMOVED***objectWrapper***REMOVED***) && level > 1) || multiple) {
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
  disabled = false,
  getNewDefaultElement,
}: {
  InputComponent: React.FC<IFieldInputProps>
  field: IFormField
  value: IValueType
  index: number
  onChange: (v: IValueType[] | undefined) => void
  values: IValueType[]
  disabled?: boolean
  getNewDefaultElement?: () => IValueType | null
}): ReactElement => {
  const addValue = (v: IValueType | null): void => {
    const newValues = [...values]
    newValues.splice(index + 1, 0, v)
    onChange(newValues)
  }

  return (
    <div
      className={`flex flex-col gap-2${disabled ? ` ${disabledClassName}` : ***REMOVED******REMOVED***} py-2 ${getFieldWrapperClass(field)}`}
      data-testid={`field-${field.id}-${index}`}
    >
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
      <div className="flex flex-row w-full p-2 gap-4">
        <div className="flex gap-2">
          <Button
            size="xs"
            className={toolButtonClass}
            onClick={() => {
              addValue(getNewDefaultElement ? getNewDefaultElement() : null)
            }}
          >
            Add <PlusIcon className="inline ml-2" />
          </Button>
          <Button
            size="xs"
            className={toolButtonClass}
            onClick={() => {
              addValue(cloneObject(value))
            }}
          >
            Duplicate <CopyIcon className="inline ml-2" />
          </Button>
        </div>
        {index > 0 && (
          <DeleteMultiple
            doDelete={() => {
              const newValues = [...values]
              newValues.splice(index, 1)
              onChange(newValues)
            }}
          />
        )}
      </div>
    </div>
  )
}

export const MultipleFieldCreator = ({
  field,
  onChange,
  disabled = false,
  value,
}: IFieldCreator): ReactElement => {
  const { setFormValues, inputOverrides, form, onChange: contextOnChange } = useFormContext()
  const formValues = useFormValues()
  const formValuesRef = useRef(formValues)
  formValuesRef.current = formValues

  const getNewDefaultElement = (): IValueType | null => {
    if (field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***objectWrapper***REMOVED***) {
      const objField = field as IObjectField
      const newElement: IFormValues = {}
      if (objField.fields) {
        seedNestedDefaults(objField.fields, newElement, { rootFormValues: formValues })
      }
      objField.tabs?.forEach(tab => {
        if (tab.fields) {
          seedNestedDefaults(tab.fields, newElement, { rootFormValues: formValues })
        }
      })
      return newElement as IValueType
    }
    return null
  }
  const defaultOnChange = useCallback((v: IValueType[] | undefined): void => {
    const formValuesCopyClean = cleanAndUpdateFormValuesWithFieldValue({
      form,
      field,
      value: v,
      formValues: formValuesRef.current,
    })
    setFormValues(formValuesCopyClean)
    const notifyFn = onChange ?? contextOnChange
    if (typeof notifyFn === ***REMOVED***function***REMOVED***) {
      notifyFn(v)
    }
  }, [form, field, setFormValues, onChange, contextOnChange])

  const initialVal = value !== undefined ? value : getFieldValue(field, formValues)
  const initialValues = Array.isArray(initialVal) ? initialVal : [initialVal]

  if (
    field.type === ***REMOVED***object***REMOVED*** &&
    field.skip_path === true &&
    field.multiple === true
  ) {
    return (
      <div className={`p-4 bg-slate-100${disabled ? ` ${disabledClassName}` : ***REMOVED******REMOVED***}`}>
        <FieldLabel field={field} disabled={disabled} />
        <p className="text-rose-700">
          <ExclamationTriangleIcon className="inline w-4 h-4 mr-2" /> Error with field{***REMOVED*** ***REMOVED***}
          <span className="font-sans p-2 text-xs bg-slate-200">{field.id}</span> Object fields
          with multiple true and skip_path true are not supported.
        </p>
      </div>
    )
  }

  const InputComponent = {
    ...inputMap,
    ...(inputOverrides ?? {}),
  }[field.type]

  return (
    <div className="flex flex-col divide-y-2 divide-opacity-50 divide-slate-400 divide-dashed">
      {initialValues?.map((va, index) => {
        return (
          <div key={`${field.id}-${index}`}>
            {SHOW_DEBUG && (
              <>
                <span className="text-red-500">{makeJsonPath(field)}</span>
                <span className="text-green-500">
                  {makeJsonPath(createOneOfMultipleField(field, index))}
                </span>
              </>
            )}
            <OneOfMultiple
              key={`${field.id}-${index}`}
              InputComponent={InputComponent}
              field={createOneOfMultipleField(field, index)}
              value={va}
              index={index}
              onChange={defaultOnChange}
              values={initialValues}
              disabled={disabled}
              getNewDefaultElement={getNewDefaultElement}
            />
          </div>
        )
      })}
    </div>
  )
}

export const ObjectListCreator = ({
  field,
  onChange,
  disabled = false,
  value,
}: IFieldCreator): ReactElement => {
  const { setFormValues, inputOverrides, form, onChange: contextOnChange } = useFormContext()
  const formValues = useFormValues()
  const formValuesRef = useRef(formValues)
  formValuesRef.current = formValues

  const objListField = field as any // IObjectListField
  const keyField = objListField.settings?.keyField

  if (!keyField) {
    return (
      <div className="p-4 bg-slate-100">
        <FieldLabel field={field} disabled={disabled} />
        <p className="text-rose-700">
          <ExclamationTriangleIcon className="inline w-4 h-4 mr-2" /> Error: objectList field{***REMOVED*** ***REMOVED***}
          <span className="font-sans p-2 text-xs bg-slate-200">{field.id}</span> requires settings.keyField
        </p>
      </div>
    )
  }

  const getNewDefaultElement = (): IValueType | null => {
    const newElement: IFormValues = {}
    if (objListField.fields) {
      seedNestedDefaults(objListField.fields, newElement, { rootFormValues: formValues })
    }
    return newElement as IValueType
  }

  const defaultOnChange = useCallback((updatedObj: ICompositeValueType): void => {
    const formValuesCopyClean = cleanAndUpdateFormValuesWithFieldValue({
      form,
      field,
      value: updatedObj,
      formValues: formValuesRef.current,
    })
    setFormValues(formValuesCopyClean)
    const notifyFn = onChange ?? contextOnChange
    if (typeof notifyFn === ***REMOVED***function***REMOVED***) {
      notifyFn(updatedObj)
    }
  }, [form, field, setFormValues, onChange, contextOnChange])

  const objValue = (typeof value === ***REMOVED***object***REMOVED*** && value !== null && !Array.isArray(value)) ? value as ICompositeValueType : {}

  const InputComponent = {
    ...inputMap,
    ...(inputOverrides ?? {}),
  }[field.type]

  return (
    <div className={`p-4 bg-slate-100${disabled ? ` ${disabledClassName}` : ***REMOVED******REMOVED***}`}>
      <FieldLabel field={field} disabled={disabled} />
      <div className="flex flex-col divide-y-2 divide-opacity-50 divide-slate-400 divide-dashed">
        {Object.entries(objValue).map(([currentKey, itemValue]) => (
          <div key={currentKey} className={`flex flex-col gap-2 py-2 ${getFieldWrapperClass(field)}`}>
            <div className="flex flex-col gap-4">
              {objListField.fields?.map((childField: IFormField) => {
                const key = `${field.id}-${currentKey}-${childField.id}`
                
                // For skip_path fields (objectWrapper or object with skip_path=true),
                // children don***REMOVED***t nest under the field ID - they stay flat at itemValue level
                const isSkipPath = childField.type === ***REMOVED***objectWrapper***REMOVED*** || (childField as any).skip_path === true
                
                const childValue = typeof itemValue === ***REMOVED***object***REMOVED*** && itemValue !== null && !Array.isArray(itemValue)
                  ? isSkipPath 
                    ? (itemValue as ICompositeValueType)  // Pass entire itemValue for skip_path fields
                    : (itemValue as ICompositeValueType)[childField.id]
                  : isSkipPath
                    ? itemValue
                    : null

                return (
                  <FieldCreator
                    key={key}
                    field={childField}
                    disabled={disabled}
                    value={childValue ?? null}
                    onChange={(newChildValue) => {
                      // For skip_path fields, the onChange value is the entire merged object
                      // For normal fields, it***REMOVED***s just the value for that field
                      let newItemValue: ICompositeValueType
                      if (isSkipPath) {
                        newItemValue = typeof newChildValue === ***REMOVED***object***REMOVED*** && newChildValue !== null 
                          ? cloneObject(newChildValue)
                          : {}
                      } else {
                        newItemValue = cloneObject(itemValue ?? {})
                        newItemValue[childField.id] = newChildValue
                      }

                      // If this is the key field, update the key if it changed
                      if (childField.id === keyField) {
                        const newKey = String(newItemValue[keyField] ?? ***REMOVED******REMOVED***)
                        if (newKey !== currentKey) {
                          const newObjValue = cloneObject(objValue)
                          delete newObjValue[currentKey]
                          newObjValue[newKey] = newItemValue
                          defaultOnChange(newObjValue)
                          return
                        }
                      }

                      // Otherwise just update the value
                      const newObjValue = cloneObject(objValue)
                      newObjValue[currentKey] = newItemValue
                      defaultOnChange(newObjValue)
                    }}
                  />
                )
              })}
            </div>
            <div className="flex flex-row w-full p-2 gap-4">
              <div className="flex gap-2">
                <Button
                  size="xs"
                  className={toolButtonClass}
                  onClick={() => {
                    const newKey = String(new Date().getTime())
                    const newObjValue = cloneObject(objValue)
                    newObjValue[newKey] = getNewDefaultElement()
                    defaultOnChange(newObjValue)
                  }}
                >
                  Add <PlusIcon className="inline ml-2" />
                </Button>
                <Button
                  size="xs"
                  className={toolButtonClass}
                  onClick={() => {
                    const newKey = String(new Date().getTime())
                    const newObjValue = cloneObject(objValue)
                    newObjValue[newKey] = cloneObject(itemValue)
                    defaultOnChange(newObjValue)
                  }}
                >
                  Duplicate <CopyIcon className="inline ml-2" />
                </Button>
              </div>
              {Object.keys(objValue).length > 1 && (
                <DeleteMultiple
                  doDelete={() => {
                    const newObjValue = cloneObject(objValue)
                    delete newObjValue[currentKey]
                    defaultOnChange(newObjValue)
                  }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      {Object.keys(objValue).length === 0 && (
        <Button
          size="sm"
          onClick={() => {
            const newKey = String(new Date().getTime())
            const newObjValue: ICompositeValueType = {}
            newObjValue[newKey] = getNewDefaultElement()
            defaultOnChange(newObjValue)
          }}
          className="mt-4"
        >
          Add First Item <PlusIcon className="inline ml-2" />
        </Button>
      )}
    </div>
  )
}

const FieldCreator = ({
  field,
  value,
  onChange,
  className = field.type === ***REMOVED***constant***REMOVED*** ? ***REMOVED***hidden***REMOVED*** : undefined,
  disabled,
  defaultClassName = ***REMOVED***flex flex-col gap-8 flex-grow h-full***REMOVED***,
  conditionResult,
}: IFieldCreator): ReactElement | null => {
  const { form, inputOverrides, setFormValues, onChange: contextOnChange } = useFormContext()
  const formValues = useFormValues()
  const formValuesRef = useRef(formValues)
  formValuesRef.current = formValues
  
  // Check for special field types before looking up in inputMap
  const isObjectList = field.type === ***REMOVED***objectList***REMOVED***
  const isMultiple = (field as any).multiple === true
  
  const InputComponent = !isObjectList && !isMultiple ? {
    ...inputMap,
    ...(inputOverrides ?? {}),
  }[field.type] : undefined

  const defaultOnChange = useCallback((v: IValueType | IValueType[] | undefined): void => {
    const formValuesCopyClean = cleanAndUpdateFormValuesWithFieldValue({
      form,
      field,
      value: v,
      formValues: formValuesRef.current,
    })
    setFormValues(formValuesCopyClean)
    const notifyFn = onChange ?? contextOnChange
    if (typeof notifyFn === ***REMOVED***function***REMOVED***) {
      notifyFn(v)
    }
  }, [form, field, setFormValues, onChange, contextOnChange])
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

  return (
    <ErrorBoundary
      fallbackRender={({ error }: { error: Error }) => {
        const err = errorRenderer({ error, resetErrorBoundary: () => {} })
        return (
          <div>
            <p>{field.label ?? field.id}</p>
            {err}
          </div>
        )
      }}
    >
      {InputComponent !== undefined || isObjectList || isMultiple ? (
        <div
          className={utils.makeClassName({
            className,
            defaultClassName,
            extras: [disabled ? disabledClassName : undefined, getFieldWrapperClass(field)],
          })}
        >
          {isMultiple ? (
            <MultipleFieldCreator field={field} disabled={disabled} onChange={onChange} value={initialValue} />
          ) : isObjectList ? (
            <ObjectListCreator field={field} disabled={disabled} onChange={onChange} value={initialValue} />
          ) : (
            <InputComponent
              field={field}
              disabled={disabled}
              onChange={onChangeFn}
              value={Array.isArray(initialValue) ? initialValue[0] : initialValue}
            />
          )}
        </div>
      ) : (
        <div>
          <p className="font-bold mb-2">
            <ExclamationTriangleIcon className="inline" /> {field.label ?? ***REMOVED******REMOVED***}
          </p>
          <p className="p-4 text-sm bg-slate-100">
            No component definition for{***REMOVED*** ***REMOVED***}
            <span className="text-rose-800 font-mono text-xs bg-slate-300 p-2">type</span>
            <span className="p-2 bg-slate-700 text-white font-mono text-xs">
              {field.type}
            </span> at <span className="text-rose-800 font-mono text-xs bg-slate-300 p-2">id</span>
            <span className="p-2 bg-slate-700 text-white font-mono text-xs">{field.id}</span>
          </p>
        </div>
      )}
    </ErrorBoundary>
  )
}

export default FieldCreator
