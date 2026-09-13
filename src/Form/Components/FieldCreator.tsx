'use client'
import config from '@/config/environment'
import FieldLabel from '@/Form/Components/FieldLabel'
import inputMap from '@/Form/Components/Inputs/inputMap'
import { useFormContext, useFormValues } from '@/Form/Creator/FormContextProvider'
import { ScopedFormContextProvider, useScopedFormContext } from '@/Form/Creator/ScopedFormContext'
import {
  type ICheckConditionResult,
  type IFieldInputProps,
  type IFormField,
  type IObjectField,
  type IFormValues,
  type IValueChangeFn,
  type IValueType,
  type ICompositeValueType,
} from '@/Form/Creator/FormCreatorTypes'
import { seedNestedDefaults } from '@/utils/formEngine'
import { evaluateConditionStateUpdate } from '@/utils/formEngine/conditionLogic'
import errorRenderer from '@/utils/errorRenderer'
import { getFieldValue, getFields, makeJsonPath } from '@/utils/getters'
import {
  cleanAndUpdateFormValuesWithFieldValue,
  cloneObject,
  createOneOfMultipleField,
} from '@/utils/manipulators'
import { checkCondition } from '@/utils/validators'
import { Button, utils } from '@axdspub/axiom-ui-utilities'
import {
  CheckIcon,
  CopyIcon,
  Cross1Icon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
} from '@radix-ui/react-icons'
import { error } from 'ajv/dist/vocabularies/applicator/dependencies'
import { get as lodashGet, set as lodashSet } from 'lodash-es'
import React, { useCallback, useEffect, useRef, useState, type ReactElement } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

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

const DeleteMultiple = ({ doDelete }: { doDelete: () => void }): ReactElement => {
  const [confirm, setConfirm] = useState(false)

  return (
    <>
      {confirm ? (
        <p className="flex flex-row gap-2 items-center">
          <span><span className="text-slate-600">Deleting: </span> Are you sure?</span>
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
  const multiple = field.type === 'object' ? (field.multiple ?? false) : false
  
  if (((type === 'object' || type === 'objectWrapper') && level > 1) || multiple) {
    cl.push('p-4')
    if (level > 0) {
      cl.push(level % 2 ? 'bg-slate-200' : 'bg-slate-100')
    }
  }
  const settingsClassName = field.settings?.className
  return utils.makeClassName({
    defaultClassName: cl.join(' '),
    className: settingsClassName ? settingsClassName : undefined

  })
  //return cl.join(' ')
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
      className={`flex flex-col gap-2${disabled ? ` ${disabledClassName}` : ''} py-2 ${getFieldWrapperClass(field)}`}
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
    if (field.type === 'object' || field.type === 'objectWrapper') {
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
    if (typeof notifyFn === 'function') {
      notifyFn(v)
    }
  }, [form, field, setFormValues, onChange, contextOnChange])

  const initialVal = value !== undefined ? value : getFieldValue(field, formValues)
  let initialValues = Array.isArray(initialVal) ? initialVal : [initialVal]
  
  // If array is empty and field is an object, initialize with one empty object
  // so the user can see the field controls
  if (initialValues.length === 0 && (field.type === 'object' || field.type === 'objectWrapper')) {
    initialValues = [getNewDefaultElement()]
  }

  if (
    field.type === 'object' &&
    field.skip_path === true &&
    field.multiple === true
  ) {
    return (
      <div className={`p-4 bg-slate-100${disabled ? ` ${disabledClassName}` : ''}`}>
        <FieldLabel field={field} disabled={disabled} />
        <p className="text-rose-700">
          <ExclamationTriangleIcon className="inline w-4 h-4 mr-2" /> Error with field{' '}
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

  // pendingItems is an array so each pending entry has a stable tempKey that cannot be overwritten.
  // Items live here until the keyField is filled with a unique value, at which point they are
  // committed to formValues.
  const [pendingItems, setPendingItems] = useState<Array<{ tempKey: string; data: ICompositeValueType }>>([])
  // itemErrors maps item keys (tempKey for pending, currentKey for committed) to error messages
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({})

  const objListField = field as any // IObjectListField
  const keyField = objListField.settings?.keyField
  const valueField = objListField.settings?.valueField as string | undefined
  const onlyShowKeyUntilUniqueEntered =
    objListField.settings?.onlyShowKeyUntilUniqueEntered === true
  const showInitialObject = objListField.settings?.showInitialObject === true
  const excludeKeyFieldFromValue =
    objListField.settings?.excludeKeyFieldFromValue === true
  const didInitializeInitialObject = useRef(false)

  if (!keyField) {
    return (
      <div className="p-4 bg-slate-100">
        <FieldLabel field={field} disabled={disabled} />
        <p className="text-rose-700">
          <ExclamationTriangleIcon className="inline w-4 h-4 mr-2" /> Error: objectList field{' '}
          <span className="font-sans p-2 text-xs bg-slate-200">{field.id}</span> requires settings.keyField
        </p>
      </div>
    )
  }

  if (
    valueField !== undefined &&
    !getFields(objListField.fields).some((f: IFormField) => f.id === valueField)
  ) {
    return (
      <div className="p-4 bg-slate-100">
        <FieldLabel field={field} disabled={disabled} />
        <p className="text-rose-700">
          <ExclamationTriangleIcon className="inline w-4 h-4 mr-2" /> Error: objectList field{' '}
          <span className="font-sans p-2 text-xs bg-slate-200">{field.id}</span> has settings.valueField
          that does not point at a valid field
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
    // When nested/scoped onChange is provided, let parent scope own the update.
    // Writing globally here can reset nested objectList pending rows.
    if (typeof onChange === 'function') {
      onChange(updatedObj)
      return
    }

    const formValuesCopyClean = cleanAndUpdateFormValuesWithFieldValue({
      form,
      field,
      value: updatedObj,
      formValues: formValuesRef.current,
    })
    setFormValues(formValuesCopyClean)

    if (typeof contextOnChange === 'function') {
      contextOnChange(updatedObj)
    }
  }, [form, field, setFormValues, onChange, contextOnChange])

  const objValue = (typeof value === 'object' && value !== null && !Array.isArray(value)) ? value as ICompositeValueType : {}

  const toStoredItemValue = useCallback(
    (keyValue: string, itemData: ICompositeValueType): IValueType | IValueType[] | undefined => {
      if (valueField === undefined) {
        const storedItem = cloneObject(itemData)
        delete (storedItem as any)._id
        if (!excludeKeyFieldFromValue) {
          return storedItem
        }
        delete storedItem[keyField]
        return storedItem
      }
      const mappedValue = lodashGet(itemData, valueField)
      if (mappedValue !== undefined) {
        return mappedValue as IValueType | IValueType[]
      }
      // Preserve existing key/value entries when value field is missing from edited object.
      return objValue[keyValue]
    },
    [excludeKeyFieldFromValue, keyField, objValue, valueField]
  )

  const toRenderableItemValue = useCallback(
    (currentKey: string, item: IValueType | IValueType[] | undefined): ICompositeValueType => {
      if (valueField !== undefined) {
        const renderable = {
          [keyField]: currentKey,
        } as ICompositeValueType
        lodashSet(renderable, valueField, item)
        return renderable
      }

      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        const objectItem = cloneObject(item) as ICompositeValueType
        if (objectItem[keyField] === undefined) {
          objectItem[keyField] = currentKey
        }
        return objectItem
      }

      return {
        [keyField]: currentKey,
      } as ICompositeValueType
    },
    [keyField, valueField]
  )

  // Returns true if keyValue is already used by a committed item (excluding excludeCommittedKey)
  // or by another pending item (excluding excludeTempKey).
  const isKeyDuplicate = (keyValue: string, options?: { excludeCommittedKey?: string; excludeTempKey?: string }): boolean => {
    const { excludeCommittedKey, excludeTempKey } = options ?? {}
    if (keyValue !== excludeCommittedKey && keyValue in objValue) return true
    return pendingItems.some(p =>
      p.tempKey !== excludeTempKey &&
      keyValue !== '' &&
      String(p.data[keyField] ?? '') === keyValue
    )
  }

  // Helper: recursively mark keyField as required within field hierarchy
  const markKeyFieldRequired = (f: IFormField): IFormField => {
    if (f.id === keyField) {
      return { ...f, required: true }
    }
    
    // For container fields with nested fields, recursively process them
    if ((f.type === 'objectWrapper' || (f as any).skip_path === true) && f.type !== 'objectList') {
      const fAsAny = f as any
      const updates: Record<string, any> = {}
      let updated = false
      
      // List of properties that can contain field collections (fields or array of objects with fields)
      const fieldContainers = ['fields', 'tabs', 'pages', 'wizard_steps']
      
      for (const containerProp of fieldContainers) {
        if (fAsAny[containerProp]) {
          const container = fAsAny[containerProp]
          
          // If it's an array of objects with fields property, process each
          if (Array.isArray(container) && container[0]?.fields !== undefined) {
            const processedContainer = container.map((item: any) => {
              const processedFields = item.fields.map((cf: IFormField) => markKeyFieldRequired(cf))
              if (processedFields.some((pf: IFormField, i: number) => pf !== item.fields[i])) {
                return { ...item, fields: processedFields }
              }
              return item
            })
            if (processedContainer.some((item: any, i: number) => item !== container[i])) {
              updates[containerProp] = processedContainer
              updated = true
            }
          }
          // If it's a direct array of fields, process it
          else if (Array.isArray(container) && container[0]?.id !== undefined) {
            const processedFields = container.map((cf: IFormField) => markKeyFieldRequired(cf))
            if (processedFields.some((pf: IFormField, i: number) => pf !== container[i])) {
              updates[containerProp] = processedFields
              updated = true
            }
          }
        }
      }
      
      if (updated) {
        return { ...(f as any), ...updates } as IFormField
      }
    }
    
    return f
  }

  // Commit a pending item to formValues once its keyField has a unique value.
  // If the key is a duplicate, show an error and keep the item in pending state.
  const commitPendingItem = (tempKey: string, itemData: ICompositeValueType, keyValue: string): void => {
    if (isKeyDuplicate(keyValue, { excludeTempKey: tempKey })) {
      setItemErrors(prev => ({
        ...prev,
        [tempKey]: `"${keyValue}" is already in use. Each ${keyField} must be unique.`
      }))
      setPendingItems(prev => prev.map(p => p.tempKey === tempKey ? { ...p, data: itemData } : p))
      return
    }
    setItemErrors(prev => {
      const next = { ...prev }
      delete next[tempKey]
      return next
    })
    const newObjValue = cloneObject(objValue)
    newObjValue[keyValue] = toStoredItemValue(keyValue, itemData)
    defaultOnChange(newObjValue)
    setPendingItems(prev => prev.filter(p => p.tempKey !== tempKey))
  }

  // Combine committed (formValues) and pending (local) items for rendering
  const allItems: Array<{ currentKey: string; itemValue: ICompositeValueType; isPending: boolean }> = [
    ...Object.entries(objValue).map(([k, v]) => ({ currentKey: k, itemValue: toRenderableItemValue(k, v), isPending: false })),
    ...pendingItems.map(p => ({ currentKey: p.tempKey, itemValue: p.data, isPending: true })),
  ]

  const createPendingItem = (itemOverride?: ICompositeValueType): {
    tempKey: string
    data: ICompositeValueType
  } => {
    const tempKey = String(new Date().getTime())
    const newItem =
      itemOverride !== undefined
        ? cloneObject(itemOverride)
        : ((getNewDefaultElement() ?? {}) as ICompositeValueType)
    ;(newItem as any)._id = tempKey
    return { tempKey, data: newItem }
  }

  useEffect(() => {
    if (didInitializeInitialObject.current || !showInitialObject) {
      return
    }

    const hasCommittedItems = Object.keys(objValue).length > 0
    const hasPendingItems = pendingItems.length > 0
    if (hasCommittedItems || hasPendingItems) {
      didInitializeInitialObject.current = true
      return
    }

    const firstPending = createPendingItem()
    setPendingItems([firstPending])
    didInitializeInitialObject.current = true
  }, [objValue, pendingItems, showInitialObject])

  const shouldShowOnlyKeyField = ({
    currentKey,
    itemValue,
    isPending,
  }: {
    currentKey: string
    itemValue: ICompositeValueType
    isPending: boolean
  }): boolean => {
    if (!onlyShowKeyUntilUniqueEntered) {
      return false
    }

    const keyValue = String(itemValue[keyField] ?? '')
    if (keyValue === '') {
      return true
    }

    if (!isPending && keyValue === currentKey) {
      return false
    }

    const hasDuplicate = isPending
      ? isKeyDuplicate(keyValue, { excludeTempKey: currentKey })
      : isKeyDuplicate(keyValue, { excludeCommittedKey: currentKey })

    return hasDuplicate
  }

  const InputComponent = {
    ...inputMap,
    ...(inputOverrides ?? {}),
  }[field.type]

  return (
    <div className={`p-4 bg-slate-100${disabled ? ` ${disabledClassName}` : ''}`}>
      <FieldLabel field={field} disabled={disabled} />
      <div className="flex flex-col divide-y-2 divide-opacity-50 divide-slate-400 divide-dashed">
        {allItems.map(({ currentKey, itemValue, isPending }) => {
          // Use _id for stable React key if it exists, otherwise fallback to currentKey
          const itemId = (itemValue as any)?._id || currentKey
          const itemError = itemErrors[currentKey]
          const showOnlyKeyField = shouldShowOnlyKeyField({
            currentKey,
            itemValue,
            isPending,
          })
          const fieldsToRender = showOnlyKeyField
            ? objListField.fields?.filter((childField: IFormField) => childField.id === keyField)
            : objListField.fields
          
          return (
            <div key={itemId} className={`flex flex-col gap-2 py-2 ${getFieldWrapperClass(field)}`}>
            {itemError && (
              <p className="text-rose-700 text-sm flex items-center gap-1">
                <ExclamationTriangleIcon className="inline w-4 h-4 shrink-0" /> {itemError}
              </p>
            )}
            <div className="flex flex-col gap-4">
              {fieldsToRender?.map((childField: IFormField) => {
                const key = `${field.id}-${itemId}-${childField.id}`
                
                // For skip_path fields (objectWrapper or object with skip_path=true),
                // children don't nest under the field ID - they stay flat at itemValue level
                const isSkipPath = childField.type === 'objectWrapper' || (childField as any).skip_path === true
                
                const childValue = typeof itemValue === 'object' && itemValue !== null && !Array.isArray(itemValue)
                  ? isSkipPath 
                    ? (itemValue as ICompositeValueType)  // Pass entire itemValue for skip_path fields
                    : (itemValue as ICompositeValueType)[childField.id]
                  : isSkipPath
                    ? itemValue
                    : null

                // Mark keyField as required in UI even if not required in config
                // (recursively handles nested fields like objectWrapper)
                const fieldToRender = markKeyFieldRequired(childField)

                const fieldElement = (
                  <FieldCreator
                    key={key}
                    field={fieldToRender}
                    disabled={disabled}
                    value={childValue ?? null}
                    onChange={(newChildValue) => {
                      // For skip_path fields, the onChange value is the entire merged object
                      // For normal fields, it's just the value for that field
                      let newItemValue: ICompositeValueType
                      if (isSkipPath) {
                        newItemValue = typeof newChildValue === 'object' && newChildValue !== null 
                          ? cloneObject(newChildValue)
                          : {}
                      } else {
                        newItemValue = cloneObject(itemValue ?? {})
                        newItemValue[childField.id] = newChildValue
                      }

                      const newKeyValue = String(newItemValue[keyField] ?? '')

                      if (isPending) {
                        if (newKeyValue !== '') {
                          commitPendingItem(currentKey, newItemValue, newKeyValue)
                        } else {
                          setPendingItems(prev => prev.map(p => p.tempKey === currentKey ? { ...p, data: newItemValue } : p))
                        }
                        return
                      }

                      // Check if the keyField value has changed or if there's an existing error
                      const hasKeyFieldChange = keyField !== undefined && 
                        (newItemValue[keyField] !== (itemValue as ICompositeValueType)?.[keyField])
                      
                      if ((hasKeyFieldChange || itemError !== undefined) && newKeyValue !== '' && newKeyValue !== currentKey) {
                        if (isKeyDuplicate(newKeyValue, { excludeCommittedKey: currentKey })) {
                          setItemErrors(prev => ({
                            ...prev,
                            [currentKey]: `"${newKeyValue}" is already in use. Each ${keyField} must be unique.`
                          }))
                          // Update data under the existing key without renaming
                          const newObjValue = cloneObject(objValue)
                          newObjValue[currentKey] = toStoredItemValue(currentKey, newItemValue)
                          defaultOnChange(newObjValue)
                          return
                        }
                        setItemErrors(prev => {
                          const next = { ...prev }
                          delete next[currentKey]
                          return next
                        })
                        const newObjValue = cloneObject(objValue)
                        delete newObjValue[currentKey]
                        newObjValue[newKeyValue] = toStoredItemValue(newKeyValue, newItemValue)
                        defaultOnChange(newObjValue)
                        return
                      }

                      // Check if there's an error and the value is no longer a duplicate (e.g., reverted to original key)
                      if (itemError !== undefined && !isKeyDuplicate(newKeyValue, { excludeCommittedKey: currentKey })) {
                        setItemErrors(prev => {
                          const next = { ...prev }
                          delete next[currentKey]
                          return next
                        })
                      }

                      // Otherwise just update the value
                      const newObjValue = cloneObject(objValue)
                      newObjValue[currentKey] = toStoredItemValue(currentKey, newItemValue)
                      defaultOnChange(newObjValue)
                    }}
                  />
                )

                // For skip_path fields, wrap with scoped context to pass itemValue down
                if (isSkipPath) {
                  return (
                    <ScopedFormContextProvider
                      key={key}
                      value={{
                        scopedValue: childValue as ICompositeValueType,
                        scopedOnChange: (newValue: ICompositeValueType) => {
                          const newKeyValue = String(newValue[keyField] ?? '')

                          if (isPending) {
                            if (newKeyValue !== '') {
                              commitPendingItem(currentKey, newValue, newKeyValue)
                            } else {
                              setPendingItems(prev => prev.map(p => p.tempKey === currentKey ? { ...p, data: newValue } : p))
                            }
                            return
                          }

                          // Check if the keyField value has changed in the scoped value or if there's an existing error
                          const oldKeyValue = String((childValue as ICompositeValueType)?.[keyField] ?? '')
                          const hasKeyFieldChange = newKeyValue !== oldKeyValue
                          
                          if ((hasKeyFieldChange || itemError !== undefined) && newKeyValue !== '' && newKeyValue !== currentKey) {
                            if (isKeyDuplicate(newKeyValue, { excludeCommittedKey: currentKey })) {
                              setItemErrors(prev => ({
                                ...prev,
                                [currentKey]: `"${newKeyValue}" is already in use. Each ${keyField} must be unique.`
                              }))
                              const newObjValue = cloneObject(objValue)
                              newObjValue[currentKey] = toStoredItemValue(currentKey, newValue)
                              defaultOnChange(newObjValue)
                              return
                            }
                            setItemErrors(prev => {
                              const next = { ...prev }
                              delete next[currentKey]
                              return next
                            })
                            const newObjValue = cloneObject(objValue)
                            delete newObjValue[currentKey]
                            newObjValue[newKeyValue] = toStoredItemValue(newKeyValue, newValue)
                            defaultOnChange(newObjValue)
                            return
                          }
                          
                          // Check if there's an error and the value is no longer a duplicate (e.g., reverted to original key)
                          if (itemError !== undefined && !isKeyDuplicate(newKeyValue, { excludeCommittedKey: currentKey })) {
                            setItemErrors(prev => {
                              const next = { ...prev }
                              delete next[currentKey]
                              return next
                            })
                          }
                          
                          // Otherwise just update the value
                          const newObjValue = cloneObject(objValue)
                          newObjValue[currentKey] = toStoredItemValue(currentKey, newValue)
                          defaultOnChange(newObjValue)
                        }
                      }}
                    >
                      {fieldElement}
                    </ScopedFormContextProvider>
                  )
                }

                return fieldElement
              })}
            </div>
            <div className="flex flex-row w-full p-2 gap-4">
              <div className="flex gap-2">
                <Button
                  size="xs"
                  className={toolButtonClass}
                  onClick={() => {
                    const pendingItem = createPendingItem()
                    setPendingItems(prev => [...prev, pendingItem])
                  }}
                >
                  Add <PlusIcon className="inline ml-2" />
                </Button>
                <Button
                  size="xs"
                  className={toolButtonClass}
                  onClick={() => {
                    const newItem = cloneObject(itemValue) as ICompositeValueType
                    // Clear keyField so the duplicate starts without a key (pending state)
                    delete newItem[keyField]
                    const pendingItem = createPendingItem(newItem)
                    setPendingItems(prev => [...prev, pendingItem])
                  }}
                >
                  Duplicate <CopyIcon className="inline ml-2" />
                </Button>
              </div>
              {(allItems.length > 1) && (
                <DeleteMultiple
                  doDelete={() => {
                    setItemErrors(prev => {
                      const next = { ...prev }
                      delete next[currentKey]
                      return next
                    })
                    if (isPending) {
                      setPendingItems(prev => prev.filter(p => p.tempKey !== currentKey))
                    } else {
                      const newObjValue = cloneObject(objValue)
                      delete newObjValue[currentKey]
                      defaultOnChange(newObjValue)
                    }
                  }}
                />
              )}
            </div>
            </div>
          )
        })}
      </div>
      {allItems.length === 0 && (
        <Button
          size="sm"
          onClick={() => {
            const pendingItem = createPendingItem()
            setPendingItems([pendingItem])
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
  className = field.type === 'constant' ? 'hidden' : undefined,
  disabled,
  defaultClassName = 'flex flex-col gap-8 grow h-full',
  conditionResult,
}: IFieldCreator): ReactElement | null => {
  const { form, inputOverrides, setFormValues, onChange: contextOnChange } = useFormContext()
  const formValues = useFormValues()
  const formValuesRef = useRef(formValues)
  formValuesRef.current = formValues
  
  // Check if we're in a scoped rendering context
  const scopedContext = useScopedFormContext()
  
  // Check for special field types before looking up in inputMap
  const isObjectList = field.type === 'objectList'
  const isMultiple = (field as any).multiple === true
  
  const InputComponent = !isObjectList && !isMultiple ? {
    ...inputMap,
    ...(inputOverrides ?? {}),
  }[field.type] as React.ComponentType<IFieldInputProps> : undefined

  const defaultOnChange = useCallback((v: IValueType | IValueType[] | undefined): void => {
    // If we're in a scoped context, update the scoped value instead of global formValues
    if (scopedContext) {
      const newScopedValue = cloneObject(scopedContext.scopedValue)
      newScopedValue[field.id] = v
      scopedContext.scopedOnChange(newScopedValue)
    } else {
      // Otherwise, update global formValues
      const formValuesCopyClean = cleanAndUpdateFormValuesWithFieldValue({
        form,
        field,
        value: v,
        formValues: formValuesRef.current,
      })
      setFormValues(formValuesCopyClean)
    }
    
    const notifyFn = onChange ?? contextOnChange
    if (typeof notifyFn === 'function') {
      notifyFn(v)
    }
  }, [form, field, setFormValues, onChange, contextOnChange])
  
  // If onChange was provided (scoped rendering context), use that directly
  // Otherwise use defaultOnChange which updates formValues
  const onChangeFn = onChange ? onChange : defaultOnChange

  conditionResult = conditionResult ?? checkCondition(field, formValues)

  const fieldValue = getFieldValue(field, formValues)
  
  // Evaluate all condition-related state changes (exclude/include, disable/enable, newDefaultValue)
  const conditionStateUpdate = evaluateConditionStateUpdate(
    conditionResult,
    field,
    fieldValue,
    form,
    formValues,
    disabled
  )

  // Apply newDefaultValue to formValues if conditions are met and value hasn't been user-modified.
  // MUST be before any early returns to satisfy the Rules of Hooks.
  useEffect(() => {
    if (conditionStateUpdate.shouldUpdateFormValue && conditionStateUpdate.newFormValues !== undefined) {
      setFormValues(conditionStateUpdate.newFormValues)
    }
  }, [conditionStateUpdate.shouldUpdateFormValue, conditionStateUpdate.newFormValues, setFormValues])

  // If field should be excluded by condition, return null (field not rendered).
  // This early return is AFTER all hooks above.
  if (conditionStateUpdate.isExcluded) {
    return null
  }

  // Apply disabled state from condition
  disabled = conditionStateUpdate.disabledState.disabled

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
            InputComponent && <InputComponent
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
            <ExclamationTriangleIcon className="inline" /> {field.label ?? ''}
          </p>
          <p className="p-4 text-sm bg-slate-100">
            No component definition for{' '}
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
