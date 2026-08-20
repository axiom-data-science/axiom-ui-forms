import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { Button } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import {
  type IFieldCondition,
  type IFieldConditionOperator,
  type IFieldConditionResult,
  type IFormField,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

type IConditionValueKind = ***REMOVED***string***REMOVED*** | ***REMOVED***number***REMOVED*** | ***REMOVED***boolean***REMOVED***

type FieldOverrideEditorsProps = {
  fieldProp: string
  effectiveType?: IFormField[***REMOVED***type***REMOVED***]
  conditions?: IFormField[***REMOVED***conditions***REMOVED***]
  conditionsSet?: IFormField[***REMOVED***conditionsSet***REMOVED***]
  generalSettings: Record<string, unknown>
  typeSpecificSettings: Record<string, unknown>
  onConditionsChange: (next: IFormField[***REMOVED***conditions***REMOVED***] | undefined) => void
  onConditionsSetChange: (next: IFormField[***REMOVED***conditionsSet***REMOVED***] | undefined) => void
  onGeneralSettingsChange: (next: Record<string, unknown>) => void
  onTypeSpecificSettingsChange: (next: Record<string, unknown>) => void
}

const conditionOperatorOptions: IFieldConditionOperator[] = [***REMOVED***eq***REMOVED***, ***REMOVED***!=***REMOVED***, ***REMOVED***gt***REMOVED***, ***REMOVED***gte***REMOVED***, ***REMOVED***lt***REMOVED***, ***REMOVED***lte***REMOVED***]
const conditionResultOptions: IFieldConditionResult[] = [***REMOVED***include***REMOVED***, ***REMOVED***exclude***REMOVED***, ***REMOVED***enable***REMOVED***, ***REMOVED***disable***REMOVED***]

const getValueKind = (value: unknown): IConditionValueKind => {
  if (typeof value === ***REMOVED***number***REMOVED***) return ***REMOVED***number***REMOVED***
  if (typeof value === ***REMOVED***boolean***REMOVED***) return ***REMOVED***boolean***REMOVED***
  return ***REMOVED***string***REMOVED***
}

const getValueText = (value: unknown): string => {
  if (typeof value === ***REMOVED***string***REMOVED***) return value
  if (typeof value === ***REMOVED***number***REMOVED***) return String(value)
  return ***REMOVED******REMOVED***
}

const getValueBool = (value: unknown): boolean => {
  return typeof value === ***REMOVED***boolean***REMOVED*** ? value : false
}

const parseConditionValue = (
  kind: IConditionValueKind,
  textValue: string,
  boolValue: boolean
): string | number | boolean | undefined => {
  if (kind === ***REMOVED***boolean***REMOVED***) return boolValue
  if (kind === ***REMOVED***number***REMOVED***) {
    if (textValue.trim() === ***REMOVED******REMOVED***) return undefined
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
    value === undefined || value === null || value === ***REMOVED******REMOVED*** || (!keepFalse && value === false)

  if (shouldDelete) {
    delete next[key]
    return next
  }

  next[key] = value
  return next
}

const createTypeSpecificSettingsTemplate = (
  fieldType: IFormField[***REMOVED***type***REMOVED***]
): Record<string, unknown> => {
  switch (fieldType) {
    case ***REMOVED***number***REMOVED***:
      return {
        step: 1,
        canBeNull: false,
      }
    case ***REMOVED***json***REMOVED***:
      return {
        exportAsString: false,
        allowEmpty: true,
      }
    case ***REMOVED***select***REMOVED***:
    case ***REMOVED***stateSelector***REMOVED***:
    case ***REMOVED***selectOrText***REMOVED***:
      return {
        allowNull: true,
        showDescriptionForSelected: false,
      }
    case ***REMOVED***radio***REMOVED***:
      return {
        layout: ***REMOVED***vertical***REMOVED***,
      }
    case ***REMOVED***geometry***REMOVED***:
      return {
        drawEnabled: true,
        drawPolygonEnabled: true,
        drawPathEnabled: true,
        drawPointEnabled: true,
        showCoordinateInput: true,
        height: ***REMOVED***500px***REMOVED***,
      }
    case ***REMOVED***objectList***REMOVED***:
      return {
        keyField: ***REMOVED***id***REMOVED***,
      }
    case ***REMOVED***file_upload***REMOVED***:
    case ***REMOVED***fileUpload***REMOVED***:
      return {
        acceptedFileTypes: [***REMOVED***.csv***REMOVED***],
      }
    default:
      return {}
  }
}

const FieldOverrideEditors = ({
  fieldProp,
  effectiveType,
  conditions,
  conditionsSet,
  generalSettings,
  typeSpecificSettings,
  onConditionsChange,
  onConditionsSetChange,
  onGeneralSettingsChange,
  onTypeSpecificSettingsChange,
}: FieldOverrideEditorsProps): ReactElement => {
  const conditionField =
    typeof conditions?.field === ***REMOVED***string***REMOVED***
      ? conditions.field
      : typeof conditions?.dependsOn === ***REMOVED***string***REMOVED***
        ? conditions.dependsOn
        : ***REMOVED******REMOVED***
  const conditionOperator = conditions?.operator ?? ***REMOVED***eq***REMOVED***
  const conditionResult = conditions?.result ?? ***REMOVED***include***REMOVED***
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

  const conditionRows = Array.isArray(conditionsSet?.conditions) ? conditionsSet.conditions : []

  const updateConditionSetRow = (
    index: number,
    updater: (condition: IFieldCondition) => IFieldCondition
  ): void => {
    const existing = conditionRows[index] ?? {
      field: fieldProp,
      operator: ***REMOVED***eq***REMOVED***,
      result: ***REMOVED***include***REMOVED***,
      value: ***REMOVED******REMOVED***,
    }
    const nextRows = conditionRows.slice()
    nextRows[index] = updater(existing)

    onConditionsSetChange({
      logic: conditionsSet?.logic ?? ***REMOVED***and***REMOVED***,
      result: conditionsSet?.result ?? ***REMOVED***include***REMOVED***,
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
      logic: conditionsSet?.logic ?? ***REMOVED***and***REMOVED***,
      result: conditionsSet?.result ?? ***REMOVED***include***REMOVED***,
      conditions: nextRows,
    })
  }

  const setTypeSpecific = (key: string, value: unknown, keepFalse = false): void => {
    onTypeSpecificSettingsChange(updateRecordValue(typeSpecificSettings, key, value, keepFalse))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="border rounded p-2">
        <h4 className="text-sm font-semibold mb-1">Condition</h4>
        <p className="text-xs text-slate-600 mb-2">Single condition object</p>
        <div className="mb-2 flex items-center gap-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              onConditionsChange({
                field: fieldProp,
                operator: ***REMOVED***eq***REMOVED***,
                value: ***REMOVED******REMOVED***,
                result: ***REMOVED***include***REMOVED***,
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
                  const textValue = kind === ***REMOVED***number***REMOVED*** ? ***REMOVED***0***REMOVED*** : ***REMOVED******REMOVED***
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

          {conditionValueKind === ***REMOVED***boolean***REMOVED*** ? (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={conditionValueBool}
                onChange={(event) => {
                  setSingleConditionValue(***REMOVED***boolean***REMOVED***, ***REMOVED******REMOVED***, event.target.checked)
                }}
              />
              Value is true
            </label>
          ) : (
            <label className="flex flex-col gap-1">
              Value
              <input
                className="border rounded px-2 py-1"
                type={conditionValueKind === ***REMOVED***number***REMOVED*** ? ***REMOVED***number***REMOVED*** : ***REMOVED***text***REMOVED***}
                value={conditionValueText}
                onChange={(event) => {
                  setSingleConditionValue(
                    conditionValueKind,
                    event.target.value,
                    conditionValueBool
                  )
                }}
              />
            </label>
          )}
        </div>
      </div>

      <div className="border rounded p-2">
        <h4 className="text-sm font-semibold mb-1">Condition Set</h4>
        <p className="text-xs text-slate-600 mb-2">Multiple conditions with logic and result</p>
        <div className="mb-2 flex items-center gap-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              onConditionsSetChange({
                logic: ***REMOVED***and***REMOVED***,
                result: ***REMOVED***include***REMOVED***,
                conditions: [{ field: fieldProp, operator: ***REMOVED***eq***REMOVED***, value: ***REMOVED******REMOVED*** }],
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
                logic: ***REMOVED***or***REMOVED***,
                result: ***REMOVED***include***REMOVED***,
                conditions: [{ field: fieldProp, operator: ***REMOVED***eq***REMOVED***, value: ***REMOVED******REMOVED*** }],
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

        <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
          <label className="flex flex-col gap-1">
            Logic
            <select
              className="border rounded px-2 py-1"
              value={conditionsSet?.logic ?? ***REMOVED***and***REMOVED***}
              onChange={(event) => {
                onConditionsSetChange({
                  logic: event.target.value as ***REMOVED***and***REMOVED*** | ***REMOVED***or***REMOVED***,
                  result: conditionsSet?.result ?? ***REMOVED***include***REMOVED***,
                  conditions:
                    conditionRows.length > 0
                      ? conditionRows
                      : [{ field: fieldProp, operator: ***REMOVED***eq***REMOVED***, value: ***REMOVED******REMOVED*** }],
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
              value={conditionsSet?.result ?? ***REMOVED***include***REMOVED***}
              onChange={(event) => {
                onConditionsSetChange({
                  logic: conditionsSet?.logic ?? ***REMOVED***and***REMOVED***,
                  result: event.target.value as IFieldConditionResult,
                  conditions:
                    conditionRows.length > 0
                      ? conditionRows
                      : [{ field: fieldProp, operator: ***REMOVED***eq***REMOVED***, value: ***REMOVED******REMOVED*** }],
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
            const rowField = typeof row.field === ***REMOVED***string***REMOVED*** ? row.field : ***REMOVED******REMOVED***
            const rowOperator = row.operator ?? ***REMOVED***eq***REMOVED***
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
                        const parsed = parseConditionValue(
                          kind,
                          kind === ***REMOVED***number***REMOVED*** ? ***REMOVED***0***REMOVED*** : ***REMOVED******REMOVED***,
                          false
                        )
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

                {rowValueKind === ***REMOVED***boolean***REMOVED*** ? (
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
                      type={rowValueKind === ***REMOVED***number***REMOVED*** ? ***REMOVED***number***REMOVED*** : ***REMOVED***text***REMOVED***}
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
                  {
                    field: fieldProp,
                    operator: ***REMOVED***eq***REMOVED***,
                    value: ***REMOVED******REMOVED***,
                    result: ***REMOVED***include***REMOVED***,
                  } as IFieldCondition,
                ]
                onConditionsSetChange({
                  logic: conditionsSet?.logic ?? ***REMOVED***and***REMOVED***,
                  result: conditionsSet?.result ?? ***REMOVED***include***REMOVED***,
                  conditions: nextRows,
                })
              }}
            >
              Add condition
            </Button>
          </div>
        </div>
      </div>

      <div className="border rounded p-2">
        <h4 className="text-sm font-semibold mb-1">General Settings</h4>
        <p className="text-xs text-slate-600 mb-2">
          Shared settings (description presentation, label style, class name)
        </p>
        <div className="mb-2 flex items-center gap-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              onGeneralSettingsChange({
                descriptionPresentation: ***REMOVED***inline***REMOVED***,
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
              typeof generalSettings.descriptionPresentation === ***REMOVED***string***REMOVED***
                ? generalSettings.descriptionPresentation
                : ***REMOVED******REMOVED***
            }
            onChange={(event) => {
              onGeneralSettingsChange(
                updateRecordValue(generalSettings, ***REMOVED***descriptionPresentation***REMOVED***, event.target.value)
              )
            }}
          >
            <option value="">(none)</option>
            <option value="inline">inline</option>
            <option value="tooltip">tooltip</option>
          </select>
        </label>

        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={generalSettings.boldLabel === true}
            onChange={(event) => {
              onGeneralSettingsChange(
                updateRecordValue(generalSettings, ***REMOVED***boldLabel***REMOVED***, event.target.checked, true)
              )
            }}
          />
          Bold label
        </label>

        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={generalSettings.smallLabel === true}
            onChange={(event) => {
              onGeneralSettingsChange(
                updateRecordValue(generalSettings, ***REMOVED***smallLabel***REMOVED***, event.target.checked, true)
              )
            }}
          />
          Small label
        </label>

        <label className="mt-2 flex flex-col gap-1 text-sm">
          className
          <input
            className="border rounded px-2 py-1"
            value={typeof generalSettings.className === ***REMOVED***string***REMOVED*** ? generalSettings.className : ***REMOVED******REMOVED***}
            onChange={(event) => {
              onGeneralSettingsChange(
                updateRecordValue(generalSettings, ***REMOVED***className***REMOVED***, event.target.value)
              )
            }}
          />
        </label>
      </div>

      <div className="border rounded p-2">
        <h4 className="text-sm font-semibold mb-1">Type Specific Settings</h4>
        <p className="text-xs text-slate-600 mb-2">Settings specific to the selected field type</p>
        <div className="mb-2 flex items-center gap-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => {
              if (effectiveType === undefined) return
              onTypeSpecificSettingsChange(createTypeSpecificSettingsTemplate(effectiveType))
            }}
          >
            Load {effectiveType ?? ***REMOVED***type***REMOVED***} template
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

        {effectiveType === ***REMOVED***number***REMOVED*** ? (
          <div className="grid grid-cols-2 gap-2 text-sm">
            <label className="flex flex-col gap-1">
              Step
              <input
                className="border rounded px-2 py-1"
                type="number"
                value={
                  typeof typeSpecificSettings.step === ***REMOVED***number***REMOVED*** ? typeSpecificSettings.step : ***REMOVED******REMOVED***
                }
                onChange={(event) => {
                  setTypeSpecific(
                    ***REMOVED***step***REMOVED***,
                    event.target.value === ***REMOVED******REMOVED*** ? undefined : Number(event.target.value)
                  )
                }}
              />
            </label>
            <label className="flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                checked={typeSpecificSettings.canBeNull === true}
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***canBeNull***REMOVED***, event.target.checked, true)
                }}
              />
              Can be null
            </label>
            <label className="flex flex-col gap-1">
              Non-null default value
              <input
                className="border rounded px-2 py-1"
                type="number"
                value={
                  typeof typeSpecificSettings.nonNullDefaultValue === ***REMOVED***number***REMOVED***
                    ? typeSpecificSettings.nonNullDefaultValue
                    : ***REMOVED******REMOVED***
                }
                onChange={(event) => {
                  setTypeSpecific(
                    ***REMOVED***nonNullDefaultValue***REMOVED***,
                    event.target.value === ***REMOVED******REMOVED*** ? undefined : Number(event.target.value)
                  )
                }}
              />
            </label>
            <label className="flex items-center gap-2 mt-5">
              <input
                type="checkbox"
                checked={typeSpecificSettings.invertForDisplay === true}
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***invertForDisplay***REMOVED***, event.target.checked, true)
                }}
              />
              Invert for display
            </label>
          </div>
        ) : null}

        {effectiveType === ***REMOVED***json***REMOVED*** ? (
          <div className="grid grid-cols-1 gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={typeSpecificSettings.exportAsString === true}
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***exportAsString***REMOVED***, event.target.checked, true)
                }}
              />
              Export as string
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={typeSpecificSettings.allowEmpty === true}
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***allowEmpty***REMOVED***, event.target.checked, true)
                }}
              />
              Allow empty
            </label>
          </div>
        ) : null}

        {effectiveType === ***REMOVED***select***REMOVED*** ||
        effectiveType === ***REMOVED***stateSelector***REMOVED*** ||
        effectiveType === ***REMOVED***selectOrText***REMOVED*** ? (
          <div className="grid grid-cols-1 gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={typeSpecificSettings.allowNull !== false}
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***allowNull***REMOVED***, event.target.checked, true)
                }}
              />
              Allow null selection
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={typeSpecificSettings.showDescriptionForSelected === true}
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***showDescriptionForSelected***REMOVED***, event.target.checked, true)
                }}
              />
              Show selected option description
            </label>
          </div>
        ) : null}

        {effectiveType === ***REMOVED***radio***REMOVED*** ? (
          <label className="flex flex-col gap-1 text-sm">
            Layout
            <select
              className="border rounded px-2 py-1"
              value={
                typeof typeSpecificSettings.layout === ***REMOVED***string***REMOVED***
                  ? typeSpecificSettings.layout
                  : ***REMOVED***vertical***REMOVED***
              }
              onChange={(event) => {
                setTypeSpecific(***REMOVED***layout***REMOVED***, event.target.value)
              }}
            >
              <option value="vertical">vertical</option>
              <option value="horizontal">horizontal</option>
            </select>
          </label>
        ) : null}

        {effectiveType === ***REMOVED***geometry***REMOVED*** ? (
          <div className="grid grid-cols-1 gap-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={typeSpecificSettings.drawEnabled !== false}
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***drawEnabled***REMOVED***, event.target.checked, true)
                }}
              />
              Draw enabled
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={typeSpecificSettings.drawPolygonEnabled === true}
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***drawPolygonEnabled***REMOVED***, event.target.checked, true)
                }}
              />
              Draw polygon enabled
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={typeSpecificSettings.drawPathEnabled === true}
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***drawPathEnabled***REMOVED***, event.target.checked, true)
                }}
              />
              Draw path enabled
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={typeSpecificSettings.drawPointEnabled === true}
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***drawPointEnabled***REMOVED***, event.target.checked, true)
                }}
              />
              Draw point enabled
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={typeSpecificSettings.showCoordinateInput === true}
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***showCoordinateInput***REMOVED***, event.target.checked, true)
                }}
              />
              Show coordinate input
            </label>
            <label className="flex flex-col gap-1">
              Height
              <input
                className="border rounded px-2 py-1"
                value={
                  typeof typeSpecificSettings.height === ***REMOVED***string***REMOVED*** ? typeSpecificSettings.height : ***REMOVED******REMOVED***
                }
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***height***REMOVED***, event.target.value)
                }}
              />
            </label>
            <label className="flex flex-col gap-1">
              Enabled shapes field
              <input
                className="border rounded px-2 py-1"
                value={
                  typeof typeSpecificSettings.enabledShapesField === ***REMOVED***string***REMOVED***
                    ? typeSpecificSettings.enabledShapesField
                    : ***REMOVED******REMOVED***
                }
                onChange={(event) => {
                  setTypeSpecific(***REMOVED***enabledShapesField***REMOVED***, event.target.value)
                }}
              />
            </label>
            <label className="flex flex-col gap-1">
              Max line string points
              <input
                className="border rounded px-2 py-1"
                type="number"
                value={
                  typeof typeSpecificSettings.maxLineStringPoints === ***REMOVED***number***REMOVED***
                    ? typeSpecificSettings.maxLineStringPoints
                    : ***REMOVED******REMOVED***
                }
                onChange={(event) => {
                  setTypeSpecific(
                    ***REMOVED***maxLineStringPoints***REMOVED***,
                    event.target.value === ***REMOVED******REMOVED*** ? undefined : Number(event.target.value)
                  )
                }}
              />
            </label>
          </div>
        ) : null}

        {effectiveType === ***REMOVED***objectList***REMOVED*** ? (
          <label className="flex flex-col gap-1 text-sm">
            Key Field
            <input
              className="border rounded px-2 py-1"
              value={
                typeof typeSpecificSettings.keyField === ***REMOVED***string***REMOVED***
                  ? typeSpecificSettings.keyField
                  : ***REMOVED******REMOVED***
              }
              onChange={(event) => {
                setTypeSpecific(***REMOVED***keyField***REMOVED***, event.target.value)
              }}
            />
          </label>
        ) : null}

        {effectiveType === ***REMOVED***file_upload***REMOVED*** || effectiveType === ***REMOVED***fileUpload***REMOVED*** ? (
          <label className="flex flex-col gap-1 text-sm">
            Accepted file types
            <input
              className="border rounded px-2 py-1"
              placeholder=".csv, .xlsx, image/*"
              value={
                Array.isArray(typeSpecificSettings.acceptedFileTypes)
                  ? typeSpecificSettings.acceptedFileTypes.join(***REMOVED***, ***REMOVED***)
                  : typeof typeSpecificSettings.acceptedFileTypes === ***REMOVED***string***REMOVED***
                    ? typeSpecificSettings.acceptedFileTypes
                    : ***REMOVED******REMOVED***
              }
              onChange={(event) => {
                const raw = event.target.value.trim()
                if (raw === ***REMOVED******REMOVED***) {
                  setTypeSpecific(***REMOVED***acceptedFileTypes***REMOVED***, undefined)
                  return
                }

                const values = raw
                  .split(***REMOVED***,***REMOVED***)
                  .map((candidate) => candidate.trim())
                  .filter((candidate) => candidate.length > 0)

                setTypeSpecific(***REMOVED***acceptedFileTypes***REMOVED***, values.length <= 1 ? values[0] : values)
              }}
            />
          </label>
        ) : null}

        {effectiveType !== ***REMOVED***number***REMOVED*** &&
        effectiveType !== ***REMOVED***json***REMOVED*** &&
        effectiveType !== ***REMOVED***select***REMOVED*** &&
        effectiveType !== ***REMOVED***stateSelector***REMOVED*** &&
        effectiveType !== ***REMOVED***selectOrText***REMOVED*** &&
        effectiveType !== ***REMOVED***radio***REMOVED*** &&
        effectiveType !== ***REMOVED***geometry***REMOVED*** &&
        effectiveType !== ***REMOVED***objectList***REMOVED*** &&
        effectiveType !== ***REMOVED***file_upload***REMOVED*** &&
        effectiveType !== ***REMOVED***fileUpload***REMOVED*** ? (
          <p className="text-xs text-slate-500">
            No dedicated type-specific settings for this field type yet.
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default FieldOverrideEditors
