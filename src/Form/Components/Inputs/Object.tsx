import FieldCreator from '@/Form/Components/FieldCreator'
import FieldLabel from '@/Form/Components/FieldLabel'
import {
  type ICompositeValueType,
  type IFieldInputProps,
  type IFormField,
} from '@/Form/Creator/FormCreatorTypes'
import { useFormContext, useFormValues } from '@/Form/Creator/FormContextProvider'
import Page from '@/Form/Creator/Page'
import TabLayout from '@/Form/Creator/TabLayout'
import WizardLayout from '@/Form/Creator/Wizard'
import { evaluateFieldLogicState, type FieldEvaluationContext } from '@/utils/formEngine'
import { cloneObject } from '@/utils/manipulators'
import { getLayoutClassName, getFieldFlexClass } from '@/utils/layoutHelpers'
import { utils } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement, useMemo, useCallback, memo } from 'react'

interface IObjectFieldItemProps {
  childField: IFormField
  disabled: boolean
  isParentSkipPath: boolean
  initialValue: ICompositeValueType
  onChange: (value: ICompositeValueType) => void
  fieldLogicState: any
  fc: string
  evaluationContext: FieldEvaluationContext
}

const ObjectFieldItem = memo(
  ({
    childField,
    disabled = false,
    isParentSkipPath,
    initialValue,
    onChange,
    fieldLogicState,
    fc,
  }: IObjectFieldItemProps) => {
    const key = childField.id

    if (isParentSkipPath) {
      return (
        <FieldCreator
          disabled={disabled || fieldLogicState.isDisabled}
          conditionResult={fieldLogicState.conditionResult}
          className={utils.makeClassName({
            className: fc,
          })}
          field={childField}
          key={key}
        />
      )
    } else {
      const handleChange = useCallback(
        (e: any) => {
          if (
            (childField.type === 'object' || childField.type === 'objectWrapper') &&
            childField.skip_path === true
          ) {
            onChange(e)
          } else {
            const newValue = cloneObject(initialValue)
            newValue[childField.id] = e
            onChange(newValue)
          }
        },
        [childField, initialValue, onChange]
      )

      return (
        <FieldCreator
          disabled={disabled || fieldLogicState.isDisabled}
          conditionResult={fieldLogicState.conditionResult}
          onChange={handleChange}
          className={utils.makeClassName({
            className: fc,
          })}
          value={
            ((childField.type === 'object' || childField.type === 'objectWrapper') &&
            childField.skip_path === true
              ? initialValue
              : initialValue[childField.id]) ?? null
          }
          field={childField}
          key={key}
        />
      )
    }
  }
)
ObjectFieldItem.displayName = 'ObjectFieldItem'

const ObjectInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const formValues = useFormValues()
  const settingsClassName = field?.settings?.className

  const objectField =
    field.type === 'object' || field.type === 'objectWrapper' ? (field as any) : undefined

  // objectWrapper enforces skip_path: true — its children live in the parent scope.
  // However, when objectWrapper is nested in an objectList, we need scoped rendering
  // to keep field values within the list item scope.
  // Detect this by checking if we have both value and onChange (indicating scoped context).
  const isSkipPath = field.type === 'objectWrapper' || objectField?.skip_path === true
  const hasEffectiveOnChange = typeof onChange === 'function'

  // When rendering skip_path containers in scoped mode but no explicit scoped value is supplied
  // (common in root form rendering), hydrate from root formValues so tab/page switches keep values.
  const initialValue = useMemo(() => {
    if (isSkipPath && hasEffectiveOnChange && value === undefined) {
      return formValues as ICompositeValueType
    }
    return (typeof value === 'object' ? (value ?? {}) : {}) as ICompositeValueType
  }, [formValues, hasEffectiveOnChange, isSkipPath, value])

  // Scoped rendering is required when an explicit scoped value is supplied
  // (e.g. array/objectList item context). For root skip_path wrappers, `value`
  // is typically undefined and we should render non-scoped so nested tabs read
  // directly from live form context.
  const shouldUseScopedRenderingDespiteSkipPath = hasEffectiveOnChange && value !== undefined

  if (objectField?.tabs !== undefined && objectField.tabs.length) {
    return (
      <div>
        {field.label !== undefined ? (
          <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
        ) : null}
        {isSkipPath && !shouldUseScopedRenderingDespiteSkipPath ? (
          <TabLayout sections={objectField.tabs} level={0} />
        ) : (
          <TabLayout
            sections={objectField.tabs}
            level={0}
            scopedValue={initialValue}
            scopedOnChange={onChange}
          />
        )}
      </div>
    )
  } else if (objectField?.pages !== undefined && objectField.pages.length) {
    return (
      <div>
        {field.label !== undefined ? (
          <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
        ) : null}
        {isSkipPath && !shouldUseScopedRenderingDespiteSkipPath ? (
          <Page sections={objectField.pages} level={0} />
        ) : (
          <Page
            sections={objectField.pages}
            level={0}
            scopedValue={initialValue}
            scopedOnChange={onChange}
          />
        )}
      </div>
    )
  } else if (objectField?.wizard_steps !== undefined && objectField.wizard_steps.length) {
    return (
      <div>
        {field.label !== undefined ? (
          <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
        ) : null}
        {isSkipPath && !shouldUseScopedRenderingDespiteSkipPath ? (
          <WizardLayout sections={objectField.wizard_steps} level={0} />
        ) : (
          <WizardLayout
            sections={objectField.wizard_steps}
            level={0}
            scopedValue={initialValue}
            scopedOnChange={onChange}
          />
        )}
      </div>
    )
  } else if (
    (field.type === 'object' || field.type === 'objectWrapper') &&
    field.fields !== undefined
  ) {
    const cl = getLayoutClassName(field.layout as any)
    const fc = getFieldFlexClass(field.layout as any)

    // When onChange is provided we're in a scoped context (e.g. inside an array item).
    // In that case children must propagate changes through onChange rather than writing
    // directly to root formValues, so we cannot use the skip_path rendering shortcut.
    const isParentSkipPath =
      (field.skip_path === true || (field as {type:string}).type === 'objectWrapper') &&
      !shouldUseScopedRenderingDespiteSkipPath

    // Use formEngine for consistent condition evaluation
    // Always pass ROOT formValues context, not the nested object
    const evaluationContext: FieldEvaluationContext = {
      rootFormValues: formValues,
      fieldPath: field.path,
    }

    return (
      <div>
        {field.label !== undefined ? (
          <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
        ) : null}
        <div className={`${cl}${disabled ? ' opacity-70 cursor-not-allowed' : ''}`}>
          {field.fields.map((childField) => {
            const key = (field.path ?? [field.id]).concat(childField.id).join('.')

            // Evaluate field logic using ROOT context (not nested object)
            // This fixes the bug where conditions were only checked for multiple=true
            // and used the wrong context
            const fieldLogicState = evaluateFieldLogicState(childField, evaluationContext)

            return (
              <ObjectFieldItem
                key={key}
                childField={childField}
                disabled={disabled ?? false}
                isParentSkipPath={isParentSkipPath}
                initialValue={initialValue}
                onChange={onChange}
                fieldLogicState={fieldLogicState}
                fc={fc}
                evaluationContext={evaluationContext}
              />
            )
          })}
        </div>
      </div>
    )
  }
  return <p>Field config for {field.id} is missing &apos;fields&apos;</p>
}

export default ObjectInput
