***REMOVED***use client***REMOVED***
import config from ***REMOVED***@/config/environment***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import inputMap from ***REMOVED***@/Form/Components/Inputs/inputMap***REMOVED***
import { useFormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import {
  type ICheckConditionResult,
  type IFieldInputProps,
  type IFormField,
  type IObjectField,
  type IFormValues,
  type IValueChangeFn,
  type IValueType,
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
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
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
  const multiple = field.multiple ?? false
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
  const { formValues, setFormValues, inputOverrides, form } = useFormContext()

  const getNewDefaultElement = (): IValueType | null => {
    if (field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***objectWrapper***REMOVED***) {
      const objField = field as IObjectField
      const newElement: IFormValues = {}
      if (objField.fields) {
        seedNestedDefaults(objField.fields, newElement, { rootFormValues: formValues })
      }
      return newElement as IValueType
    }
    return null
  }
  const defaultOnChange = (v: IValueType[] | undefined): void => {
    const formValuesCopyClean = cleanAndUpdateFormValuesWithFieldValue({
      form,
      field,
      value: v,
      formValues,
    })
    setFormValues(formValuesCopyClean)
    if (typeof onChange === ***REMOVED***function***REMOVED***) {
      onChange(v)
    }
  }

  const initialVal = value !== undefined ? value : getFieldValue(field, formValues)
  const initialValues = Array.isArray(initialVal) ? initialVal : [initialVal]

  if (
    (field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***objectWrapper***REMOVED***) &&
    field.skip_path === true &&
    field.multiple === true
  ) {
    return (
      <div className={`p-4 bg-slate-100${disabled ? ` ${disabledClassName}` : ***REMOVED******REMOVED***}`}>
        <FieldLabel field={field} disabled={disabled} />
        <p className="text-rose-700">
          <ExclamationTriangleIcon className="inline w-4 h-4 mr-2" /> Error with field{***REMOVED*** ***REMOVED***}
          <span className="font-sans p-2 text-xs bg-slate-200">{field.id}</span> Object and wrapper
          fields with multiple true and skip_path true are not supported.
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

const FieldCreator = ({
  field,
  value,
  onChange,
  className = field.type === ***REMOVED***constant***REMOVED*** ? ***REMOVED***hidden***REMOVED*** : undefined,
  disabled,
  defaultClassName = ***REMOVED***flex flex-col gap-8 flex-grow h-full***REMOVED***,
  conditionResult,
}: IFieldCreator): ReactElement | null => {
  const { form, inputOverrides, setFormValues, formValues } = useFormContext()
  const InputComponent = {
    ...inputMap,
    ...(inputOverrides ?? {}),
  }[field.type]

  const defaultOnChange = (v: IValueType | IValueType[] | undefined): void => {
    const formValuesCopyClean = cleanAndUpdateFormValuesWithFieldValue({
      form,
      field,
      value: v,
      formValues,
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
      {InputComponent !== undefined ? (
        <div
          className={utils.makeClassName({
            className,
            defaultClassName,
            extras: [disabled ? disabledClassName : undefined, getFieldWrapperClass(field)],
          })}
        >
          {field.multiple === true ? (
            <MultipleFieldCreator field={field} disabled={disabled} onChange={onChange} />
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
