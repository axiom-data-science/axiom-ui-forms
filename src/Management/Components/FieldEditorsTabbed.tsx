import React, { type ReactElement } from 'react'
import { Button } from '@axdspub/axiom-ui-utilities'
import {
  type IFieldCondition,
  type IFieldConditionOperator,
  type IFieldConditionResult,
  type IFormField,
} from '@/Form/Creator/FormCreatorTypes'

type IConditionValueKind = 'string' | 'number' | 'boolean'

type IEditableSelectOption = {
  label: string
  value: string | number
}

type FieldEditorsProps = {
  fieldProp: string
  effectiveType?: IFormField['type']
  conditions?: IFormField['conditions']
  conditionsSet?: IFormField['conditionsSet']
  generalSettings: Record<string, unknown>
  typeSpecificSettings: Record<string, unknown>
  onConditionsChange: (next: IFormField['conditions'] | undefined) => void
  onConditionsSetChange: (next: IFormField['conditionsSet'] | undefined) => void
  onGeneralSettingsChange: (next: Record<string, unknown>) => void
  onTypeSpecificSettingsChange: (next: Record<string, unknown>) => void
}

const conditionOperatorOptions: IFieldConditionOperator[] = ['eq', '!=', 'gt', 'gte', 'lt', 'lte']
const conditionResultOptions: IFieldConditionResult[] = ['include', 'exclude', 'enable', 'disable']

const getValueKind = (value: unknown): IConditionValueKind => {
  if (typeof value === 'number') return 'number'
  if (typeof value === 'boolean') return 'boolean'
  return 'string'
}

const getValueText = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  return ''
}

const getValueBool = (value: unknown): boolean => {
  return typeof value === 'boolean' ? value : false
}

const parseConditionValue = (
  kind: IConditionValueKind,
  textValue: string,
  boolValue: boolean
): string | number | boolean | undefined => {
  if (kind === 'boolean') return boolValue
  if (kind === 'number') {
    if (textValue.trim() === '') return undefined
    const parsed = Number(textValue)
    return Number.isFinite(parsed) ? parsed : undefined
  }
  return textValue
}

const updateRecordValue = (
  current: Record<string, unknown>,
  key: string,
  value: unknown,
  keepFalse = false
): Record<string, unknown> => {
  const next = { ...current }
  const shouldDelete =
    value === undefined || value === null || value === '' || (!keepFalse && value === false)

  if (shouldDelete) {
    delete next[key]
    return next
  }

  next[key] = value
  return next
}

const createTypeSpecificSettingsTemplate = (
  fieldType: IFormField['type']
): Record<string, unknown> => {
  switch (fieldType) {
    case 'number':
      return { step: 1, canBeNull: false }
    case 'json':
      return { exportAsString: false, allowEmpty: true }
    case 'select':
      return { allowNull: true }
    case 'radio':
      return { layout: 'vertical' }
    case 'geometry':
      return {
        drawEnabled: true,
        drawPolygonEnabled: true,
        drawPathEnabled: true,
        drawPointEnabled: true,
        showCoordinateInput: true,
        height: '500px',
      }
    case 'objectList':
      return { keyField: 'id' }
    default:
      return {}
  }
}

const coerceSelectOptions = (options: unknown): IEditableSelectOption[] => {
  if (!Array.isArray(options)) return []

  return options
    .map((option) => {
      if (option === null || typeof option !== 'object') return undefined

      const optionLike = option as Record<string, unknown>
      const label = typeof optionLike.label === 'string' ? optionLike.label : ''
      const rawValue = optionLike.value

      if (typeof rawValue !== 'string' && typeof rawValue !== 'number') {
        return undefined
      }

      return {
        label,
        value: rawValue,
      }
    })
    .filter((option): option is IEditableSelectOption => option !== undefined)
}

export const ConditionEditor = ({
  fieldProp,
  conditions,
  onConditionsChange,
}: Pick<FieldEditorsProps, 'fieldProp' | 'conditions' | 'onConditionsChange'>): ReactElement => {
  const conditionField =
    typeof conditions?.field === 'string'
      ? conditions.field
      : typeof conditions?.dependsOn === 'string'
        ? conditions.dependsOn
        : ''
  const conditionOperator = conditions?.operator ?? 'eq'
  const conditionResult = conditions?.result ?? 'include'
  const conditionValueKind = getValueKind(conditions?.value)
  const conditionValueText = getValueText(conditions?.value)
  const conditionValueBool = getValueBool(conditions?.value)

  const setSingleConditionValue = (
    kind: IConditionValueKind,
    valueText: string,
    valueBool: boolean
  ): void => {
    const nextValue = parseConditionValue(kind, valueText, valueBool)
    onConditionsChange({
      field: conditionField,
      operator: conditionOperator,
      result: conditionResult,
      value: nextValue,
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-slate-600">Single condition object</p>
      <div className="flex items-center gap-2">
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            onConditionsChange({
              field: fieldProp,
              operator: 'eq',
              value: '',
              result: 'include',
            })
          }}
        >
          Use eq template
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            onConditionsChange(undefined)
          }}
        >
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2 text-sm">
        <label className="flex flex-col gap-1">
          Field
          <input
            className="border rounded px-2 py-1"
            value={conditionField}
            onChange={(event) => {
              onConditionsChange({
                field: event.target.value,
                operator: conditionOperator,
                result: conditionResult,
                value: conditions?.value,
              })
            }}
          />
        </label>
        <div className="grid grid-cols-3 gap-2">
          <label className="flex flex-col gap-1">
            Operator
            <select
              className="border rounded px-2 py-1"
              value={conditionOperator}
              onChange={(event) => {
                onConditionsChange({
                  field: conditionField,
                  operator: event.target.value as IFieldConditionOperator,
                  result: conditionResult,
                  value: conditions?.value,
                })
              }}
            >
              {conditionOperatorOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Result
            <select
              className="border rounded px-2 py-1"
              value={conditionResult}
              onChange={(event) => {
                onConditionsChange({
                  field: conditionField,
                  operator: conditionOperator,
                  result: event.target.value as IFieldConditionResult,
                  value: conditions?.value,
                })
              }}
            >
              {conditionResultOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Value Type
            <select
              className="border rounded px-2 py-1"
              value={conditionValueKind}
              onChange={(event) => {
                const kind = event.target.value as IConditionValueKind
                const textValue = kind === 'number' ? '0' : ''
                const boolValue = false
                setSingleConditionValue(kind, textValue, boolValue)
              }}
            >
              <option value="string">string</option>
              <option value="number">number</option>
              <option value="boolean">boolean</option>
            </select>
          </label>
        </div>

        {conditionValueKind === 'boolean' ? (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={conditionValueBool}
              onChange={(event) => {
                setSingleConditionValue('boolean', '', event.target.checked)
              }}
            />
            Value is true
          </label>
        ) : (
          <label className="flex flex-col gap-1">
            Value
            <input
              className="border rounded px-2 py-1"
              type={conditionValueKind === 'number' ? 'number' : 'text'}
              value={conditionValueText}
              onChange={(event) => {
                setSingleConditionValue(conditionValueKind, event.target.value, conditionValueBool)
              }}
            />
          </label>
        )}
      </div>
    </div>
  )
}

export const ConditionSetEditor = ({
  fieldProp,
  conditionsSet,
  onConditionsSetChange,
}: Pick<
  FieldEditorsProps,
  'fieldProp' | 'conditionsSet' | 'onConditionsSetChange'
>): ReactElement => {
  const conditionRows = Array.isArray(conditionsSet?.conditions) ? conditionsSet.conditions : []

  const updateConditionSetRow = (
    index: number,
    updater: (condition: IFieldCondition) => IFieldCondition
  ): void => {
    const existing = conditionRows[index] ?? {
      field: fieldProp,
      operator: 'eq',
      value: '',
    }
    const nextRows = conditionRows.slice()
    nextRows[index] = updater(existing)

    onConditionsSetChange({
      logic: conditionsSet?.logic ?? 'and',
      result: conditionsSet?.result ?? 'include',
      newDefaultValue: conditionsSet?.newDefaultValue,
      conditions: nextRows,
    })
  }

  const removeConditionSetRow = (index: number): void => {
    const nextRows = conditionRows.filter((_, idx) => idx !== index)
    if (nextRows.length === 0) {
      onConditionsSetChange(undefined)
      return
    }

    onConditionsSetChange({
      logic: conditionsSet?.logic ?? 'and',
      result: conditionsSet?.result ?? 'include',
      newDefaultValue: conditionsSet?.newDefaultValue,
      conditions: nextRows,
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-slate-600">Multiple conditions with logic and result</p>
      <div className="flex items-center gap-2">
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            onConditionsSetChange({
              logic: 'and',
              result: 'include',
              conditions: [{ field: fieldProp, operator: 'eq', value: '' }],
            })
          }}
        >
          Use and template
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            onConditionsSetChange({
              logic: 'or',
              result: 'include',
              conditions: [{ field: fieldProp, operator: 'eq', value: '' }],
            })
          }}
        >
          Use or template
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            onConditionsSetChange(undefined)
          }}
        >
          Clear
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <label className="flex flex-col gap-1">
          Logic
          <select
            className="border rounded px-2 py-1"
            value={conditionsSet?.logic ?? 'and'}
            onChange={(event) => {
              onConditionsSetChange({
                logic: event.target.value as 'and' | 'or',
                result: conditionsSet?.result ?? 'include',
                newDefaultValue: conditionsSet?.newDefaultValue,
                conditions:
                  conditionRows.length > 0
                    ? conditionRows
                    : [{ field: fieldProp, operator: 'eq', value: '' }],
              })
            }}
          >
            <option value="and">and</option>
            <option value="or">or</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          Result
          <select
            className="border rounded px-2 py-1"
            value={conditionsSet?.result ?? 'include'}
            onChange={(event) => {
              onConditionsSetChange({
                logic: conditionsSet?.logic ?? 'and',
                result: event.target.value as IFieldConditionResult,
                newDefaultValue: conditionsSet?.newDefaultValue,
                conditions:
                  conditionRows.length > 0
                    ? conditionRows
                    : [{ field: fieldProp, operator: 'eq', value: '' }],
              })
            }}
          >
            {conditionResultOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        {conditionRows.map((row, index) => {
          const rowField = typeof row.field === 'string' ? row.field : ''
          const rowOperator = row.operator ?? 'eq'
          const rowValueKind = getValueKind(row.value)
          const rowValueText = getValueText(row.value)
          const rowValueBool = getValueBool(row.value)

          return (
            <div key={`${index}-${rowField}`} className="border rounded p-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <label className="flex flex-col gap-1">
                  Field
                  <input
                    className="border rounded px-2 py-1"
                    value={rowField}
                    onChange={(event) => {
                      updateConditionSetRow(index, (existing) => ({
                        ...existing,
                        field: event.target.value,
                      }))
                    }}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  Operator
                  <select
                    className="border rounded px-2 py-1"
                    value={rowOperator}
                    onChange={(event) => {
                      updateConditionSetRow(index, (existing) => ({
                        ...existing,
                        operator: event.target.value as IFieldConditionOperator,
                      }))
                    }}
                  >
                    {conditionOperatorOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1">
                  Value Type
                  <select
                    className="border rounded px-2 py-1"
                    value={rowValueKind}
                    onChange={(event) => {
                      const kind = event.target.value as IConditionValueKind
                      const parsed = parseConditionValue(kind, kind === 'number' ? '0' : '', false)
                      updateConditionSetRow(index, (existing) => ({
                        ...existing,
                        value: parsed,
                      }))
                    }}
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                  </select>
                </label>
              </div>

              {rowValueKind === 'boolean' ? (
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={rowValueBool}
                    onChange={(event) => {
                      updateConditionSetRow(index, (existing) => ({
                        ...existing,
                        value: event.target.checked,
                      }))
                    }}
                  />
                  Value is true
                </label>
              ) : (
                <label className="mt-2 flex flex-col gap-1 text-sm">
                  Value
                  <input
                    className="border rounded px-2 py-1"
                    type={rowValueKind === 'number' ? 'number' : 'text'}
                    value={rowValueText}
                    onChange={(event) => {
                      const parsed = parseConditionValue(
                        rowValueKind,
                        event.target.value,
                        rowValueBool
                      )
                      updateConditionSetRow(index, (existing) => ({
                        ...existing,
                        value: parsed,
                      }))
                    }}
                  />
                </label>
              )}

              <div className="mt-2">
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    removeConditionSetRow(index)
                  }}
                >
                  Remove condition
                </Button>
              </div>
            </div>
          )
        })}

        <div>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              const nextRows = [
                ...conditionRows,
                { field: fieldProp, operator: 'eq', value: '' } as IFieldCondition,
              ]
              onConditionsSetChange({
                logic: conditionsSet?.logic ?? 'and',
                result: conditionsSet?.result ?? 'include',
                newDefaultValue: conditionsSet?.newDefaultValue,
                conditions: nextRows,
              })
            }}
          >
            Add condition
          </Button>
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        New Default Value
        <input
          className="border rounded px-2 py-1"
          placeholder="Value to set when condition result applies"
          value={
            conditionsSet?.newDefaultValue !== undefined
              ? typeof conditionsSet.newDefaultValue === 'string'
                ? conditionsSet.newDefaultValue
                : JSON.stringify(conditionsSet.newDefaultValue)
              : ''
          }
          onChange={(event) => {
            onConditionsSetChange({
              logic: conditionsSet?.logic ?? 'and',
              result: conditionsSet?.result ?? 'include',
              newDefaultValue: event.target.value || undefined,
              conditions: conditionRows.length > 0 ? conditionRows : [],
            })
          }}
        />
      </label>
    </div>
  )
}

export const GeneralSettingsEditor = ({
  generalSettings,
  onGeneralSettingsChange,
}: Pick<FieldEditorsProps, 'generalSettings' | 'onGeneralSettingsChange'>): ReactElement => {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-slate-600">
        Shared settings (description presentation, label style, class name)
      </p>
      <div className="flex items-center gap-2">
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            onGeneralSettingsChange({
              descriptionPresentation: 'inline',
              boldLabel: false,
              smallLabel: false,
            })
          }}
        >
          Use display template
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            onGeneralSettingsChange({})
          }}
        >
          Clear
        </Button>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Description Presentation
        <select
          className="border rounded px-2 py-1"
          value={
            typeof generalSettings.descriptionPresentation === 'string'
              ? generalSettings.descriptionPresentation
              : ''
          }
          onChange={(event) => {
            onGeneralSettingsChange(
              updateRecordValue(generalSettings, 'descriptionPresentation', event.target.value)
            )
          }}
        >
          <option value="">(none)</option>
          <option value="inline">inline</option>
          <option value="tooltip">tooltip</option>
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={generalSettings.boldLabel === true}
          onChange={(event) => {
            onGeneralSettingsChange(
              updateRecordValue(generalSettings, 'boldLabel', event.target.checked, true)
            )
          }}
        />
        Bold label
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={generalSettings.smallLabel === true}
          onChange={(event) => {
            onGeneralSettingsChange(
              updateRecordValue(generalSettings, 'smallLabel', event.target.checked, true)
            )
          }}
        />
        Small label
      </label>

      <label className="flex flex-col gap-1 text-sm">
        className
        <input
          className="border rounded px-2 py-1"
          value={typeof generalSettings.className === 'string' ? generalSettings.className : ''}
          onChange={(event) => {
            onGeneralSettingsChange(
              updateRecordValue(generalSettings, 'className', event.target.value)
            )
          }}
        />
      </label>
    </div>
  )
}

export const TypeSpecificSettingsEditor = ({
  effectiveType,
  typeSpecificSettings,
  onTypeSpecificSettingsChange,
}: Pick<
  FieldEditorsProps,
  'effectiveType' | 'typeSpecificSettings' | 'onTypeSpecificSettingsChange'
>): ReactElement => {
  const setTypeSpecific = (key: string, value: unknown, keepFalse = false): void => {
    onTypeSpecificSettingsChange(updateRecordValue(typeSpecificSettings, key, value, keepFalse))
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-slate-600">Settings specific to the selected field type</p>
      <div className="flex items-center gap-2">
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            if (effectiveType === undefined) return
            onTypeSpecificSettingsChange(createTypeSpecificSettingsTemplate(effectiveType))
          }}
        >
          Load {effectiveType ?? 'type'} template
        </Button>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            onTypeSpecificSettingsChange({})
          }}
        >
          Clear
        </Button>
      </div>

      {effectiveType === 'number' ? (
        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="flex flex-col gap-1">
            Step
            <input
              className="border rounded px-2 py-1"
              type="number"
              value={typeof typeSpecificSettings.step === 'number' ? typeSpecificSettings.step : ''}
              onChange={(event) => {
                setTypeSpecific(
                  'step',
                  event.target.value === '' ? undefined : Number(event.target.value)
                )
              }}
            />
          </label>
          <label className="flex items-center gap-2 mt-5">
            <input
              type="checkbox"
              checked={typeSpecificSettings.canBeNull === true}
              onChange={(event) => {
                setTypeSpecific('canBeNull', event.target.checked, true)
              }}
            />
            Can be null
          </label>
        </div>
      ) : null}

      {effectiveType === 'json' ? (
        <div className="grid grid-cols-1 gap-2 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={typeSpecificSettings.exportAsString === true}
              onChange={(event) => {
                setTypeSpecific('exportAsString', event.target.checked, true)
              }}
            />
            Export as string
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={typeSpecificSettings.allowEmpty === true}
              onChange={(event) => {
                setTypeSpecific('allowEmpty', event.target.checked, true)
              }}
            />
            Allow empty
          </label>
        </div>
      ) : null}

      {effectiveType === 'select' ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={typeSpecificSettings.allowNull !== false}
            onChange={(event) => {
              setTypeSpecific('allowNull', event.target.checked, true)
            }}
          />
          Allow null selection
        </label>
      ) : null}

      {effectiveType === 'radio' ? (
        <label className="flex flex-col gap-1 text-sm">
          Layout
          <select
            className="border rounded px-2 py-1"
            value={
              typeof typeSpecificSettings.layout === 'string'
                ? typeSpecificSettings.layout
                : 'vertical'
            }
            onChange={(event) => {
              setTypeSpecific('layout', event.target.value)
            }}
          >
            <option value="vertical">vertical</option>
            <option value="horizontal">horizontal</option>
          </select>
        </label>
      ) : null}
    </div>
  )
}

export const SelectOptionsEditor = ({
  options,
  onOptionsChange,
}: {
  options: unknown
  onOptionsChange: (next: IEditableSelectOption[] | undefined) => void
}): ReactElement => {
  const normalizedOptions = coerceSelectOptions(options)

  const setOptions = (next: IEditableSelectOption[]): void => {
    onOptionsChange(next.length > 0 ? next : undefined)
  }

  const updateOption = (
    index: number,
    updater: (existing: IEditableSelectOption) => IEditableSelectOption
  ): void => {
    const next = normalizedOptions.map((option, currentIndex) =>
      currentIndex === index ? updater(option) : option
    )
    setOptions(next)
  }

  return (
    <div className="flex flex-col gap-2 border rounded p-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Options</h4>
        <Button
          size="xs"
          variant="ghost"
          onClick={() => {
            setOptions([
              ...normalizedOptions,
              {
                label: `Option ${normalizedOptions.length + 1}`,
                value: '',
              },
            ])
          }}
        >
          Add option
        </Button>
      </div>

      {normalizedOptions.length === 0 ? (
        <p className="text-xs text-slate-600">No options yet. Add at least one option.</p>
      ) : null}

      {normalizedOptions.map((option, index) => {
        const isNumberValue = typeof option.value === 'number'

        return (
          <div key={`${index}-${option.label}`} className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <label className="flex flex-col gap-1 text-sm">
              Label
              <input
                className="border rounded px-2 py-1"
                value={option.label}
                onChange={(event) => {
                  updateOption(index, (existing) => ({
                    ...existing,
                    label: event.target.value,
                  }))
                }}
              />
            </label>

            <div className="flex flex-col gap-1 text-sm">
              <label className="flex flex-col gap-1">
                Value
                <input
                  className="border rounded px-2 py-1"
                  type={isNumberValue ? 'number' : 'text'}
                  value={String(option.value)}
                  onChange={(event) => {
                    const nextValue = isNumberValue
                      ? event.target.value === ''
                        ? 0
                        : Number(event.target.value)
                      : event.target.value

                    updateOption(index, (existing) => ({
                      ...existing,
                      value: nextValue,
                    }))
                  }}
                />
              </label>
              <Button
                size="xs"
                variant="outline"
                onClick={() => {
                  setOptions(normalizedOptions.filter((_, currentIndex) => currentIndex !== index))
                }}
              >
                Remove
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const ConstraintsEditor = ({
  effectiveType,
  constraints = {},
  onConstraintsChange,
}: {
  effectiveType?: IFormField['type']
  constraints?: Record<string, unknown>
  onConstraintsChange: (next: Record<string, unknown>) => void
}): ReactElement => {
  const updateConstraint = (key: string, value: unknown): void => {
    const next = { ...constraints }
    if (value === undefined || value === null || value === '') {
      delete next[key]
    } else {
      next[key] = value
    }
    onConstraintsChange(next)
  }

  const type = effectiveType as string | undefined

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-slate-600">Constraints specific to the selected field type</p>

      {type === 'string' || type === 'long_text' ? (
        <div className="grid grid-cols-1 gap-2 text-sm">
          <label className="flex flex-col gap-1">
            Min Length
            <input
              className="border rounded px-2 py-1"
              type="number"
              value={typeof constraints.minLength === 'number' ? constraints.minLength : ''}
              onChange={(event) => {
                updateConstraint(
                  'minLength',
                  event.target.value === '' ? undefined : Number(event.target.value)
                )
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            Max Length
            <input
              className="border rounded px-2 py-1"
              type="number"
              value={typeof constraints.maxLength === 'number' ? constraints.maxLength : ''}
              onChange={(event) => {
                updateConstraint(
                  'maxLength',
                  event.target.value === '' ? undefined : Number(event.target.value)
                )
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            Pattern (Regex)
            <input
              className="border rounded px-2 py-1"
              placeholder="e.g., ^[0-9]+$"
              value={typeof constraints.pattern === 'string' ? constraints.pattern : ''}
              onChange={(event) => {
                updateConstraint('pattern', event.target.value)
              }}
            />
          </label>
        </div>
      ) : null}

      {type === 'number' ? (
        <div className="grid grid-cols-1 gap-2 text-sm">
          <label className="flex flex-col gap-1">
            Min Value
            <input
              className="border rounded px-2 py-1"
              type="number"
              value={typeof constraints.min === 'number' ? constraints.min : ''}
              onChange={(event) => {
                updateConstraint(
                  'min',
                  event.target.value === '' ? undefined : Number(event.target.value)
                )
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            Max Value
            <input
              className="border rounded px-2 py-1"
              type="number"
              value={typeof constraints.max === 'number' ? constraints.max : ''}
              onChange={(event) => {
                updateConstraint(
                  'max',
                  event.target.value === '' ? undefined : Number(event.target.value)
                )
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            Exclusive Min
            <input
              className="border rounded px-2 py-1"
              type="number"
              value={typeof constraints.exclusiveMin === 'number' ? constraints.exclusiveMin : ''}
              onChange={(event) => {
                updateConstraint(
                  'exclusiveMin',
                  event.target.value === '' ? undefined : Number(event.target.value)
                )
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            Exclusive Max
            <input
              className="border rounded px-2 py-1"
              type="number"
              value={typeof constraints.exclusiveMax === 'number' ? constraints.exclusiveMax : ''}
              onChange={(event) => {
                updateConstraint(
                  'exclusiveMax',
                  event.target.value === '' ? undefined : Number(event.target.value)
                )
              }}
            />
          </label>
        </div>
      ) : null}

      {type === 'array' || type === 'objectList' ? (
        <div className="grid grid-cols-1 gap-2 text-sm">
          <label className="flex flex-col gap-1">
            Min Items
            <input
              className="border rounded px-2 py-1"
              type="number"
              value={typeof constraints.minItems === 'number' ? constraints.minItems : ''}
              onChange={(event) => {
                updateConstraint(
                  'minItems',
                  event.target.value === '' ? undefined : Number(event.target.value)
                )
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            Max Items
            <input
              className="border rounded px-2 py-1"
              type="number"
              value={typeof constraints.maxItems === 'number' ? constraints.maxItems : ''}
              onChange={(event) => {
                updateConstraint(
                  'maxItems',
                  event.target.value === '' ? undefined : Number(event.target.value)
                )
              }}
            />
          </label>
        </div>
      ) : null}

      {type === 'date' || type === 'datetime' ? (
        <div className="grid grid-cols-1 gap-2 text-sm">
          <label className="flex flex-col gap-1">
            Min Date
            <input
              className="border rounded px-2 py-1"
              type="date"
              value={typeof constraints.minDate === 'string' ? constraints.minDate : ''}
              onChange={(event) => {
                updateConstraint('minDate', event.target.value)
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            Max Date
            <input
              className="border rounded px-2 py-1"
              type="date"
              value={typeof constraints.maxDate === 'string' ? constraints.maxDate : ''}
              onChange={(event) => {
                updateConstraint('maxDate', event.target.value)
              }}
            />
          </label>
        </div>
      ) : null}

      {!type || type === 'string' || type === 'number' ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={constraints.required === true}
            onChange={(event) => {
              updateConstraint('required', event.target.checked || undefined)
            }}
          />
          Required
        </label>
      ) : null}
    </div>
  )
}
