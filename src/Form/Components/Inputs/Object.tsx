import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type ICompositeValueType, type IFieldInputProps, type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { useFormContext, useFormValues } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import Page from ***REMOVED***@/Form/Creator/Page***REMOVED***
import TabLayout from ***REMOVED***@/Form/Creator/TabLayout***REMOVED***
import WizardLayout from ***REMOVED***@/Form/Creator/Wizard***REMOVED***
import { evaluateFieldLogicState, type FieldEvaluationContext } from ***REMOVED***@/utils/formEngine***REMOVED***
import { cloneObject } from ***REMOVED***@/utils/manipulators***REMOVED***
import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement, useMemo, useCallback, memo } from ***REMOVED***react***REMOVED***

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

const ObjectFieldItem = memo(({ childField, disabled = false, isParentSkipPath, initialValue, onChange, fieldLogicState, fc }: IObjectFieldItemProps) => {
  const key = childField.id
  
  if (isParentSkipPath) {
    return (
      <FieldCreator
        disabled={disabled || fieldLogicState.isDisabled}
        conditionResult={fieldLogicState.conditionResult}
        className={utils.makeClassName({
          className: fc
        })}
        field={childField}
        key={key}
      />
    )
  } else {
    const handleChange = useCallback((e: any) => {
      if ((childField.type === ***REMOVED***object***REMOVED*** || childField.type === ***REMOVED***objectWrapper***REMOVED***) && childField.skip_path === true) {
        onChange(e)
      } else {
        const newValue = cloneObject(initialValue)
        newValue[childField.id] = e
        onChange(newValue)
      }
    }, [childField, initialValue, onChange])

    return (
      <FieldCreator
        disabled={disabled || fieldLogicState.isDisabled}
        conditionResult={fieldLogicState.conditionResult}
        onChange={handleChange}
        className={utils.makeClassName({
          className: fc
        })}
        value={(
          (childField.type === ***REMOVED***object***REMOVED*** || childField.type === ***REMOVED***objectWrapper***REMOVED***) && childField.skip_path === true
            ? initialValue
            : initialValue[childField.id]
        ) ?? null
        }
        field={childField}
        key={key}
      />
    )
  }
})
ObjectFieldItem.displayName = ***REMOVED***ObjectFieldItem***REMOVED***

const ObjectInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const formValues = useFormValues()

  // Memoize initialValue so it doesn***REMOVED***t change reference on every render
  const initialValue = useMemo(() => 
    (typeof value === ***REMOVED***object***REMOVED*** ? value ?? {} : {}) as ICompositeValueType,
    [value]
  )

  const objectField = (field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***objectWrapper***REMOVED***) ? (field as any) : undefined

  // objectWrapper enforces skip_path: true — its children live in the parent scope.
  // However, when objectWrapper is nested in an objectList, we need scoped rendering
  // to keep field values within the list item scope.
  // Detect this by checking if we have both value and onChange (indicating scoped context).
  const isSkipPath = field.type === ***REMOVED***objectWrapper***REMOVED*** || objectField?.skip_path === true
  const hasEffectiveOnChange = typeof onChange === ***REMOVED***function***REMOVED***
  const hasMeaningfulValue = value !== null && value !== undefined && Object.keys(value as object).length > 0
  const shouldUseScopedRenderingDespiteSkipPath = hasEffectiveOnChange && hasMeaningfulValue

  if (objectField?.tabs !== undefined && objectField.tabs.length) {
    return (
      <div>
        {field.label !== undefined
          ? <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
          : null}
        {isSkipPath && !shouldUseScopedRenderingDespiteSkipPath
          ? <TabLayout sections={objectField.tabs} level={0} />
          : <TabLayout sections={objectField.tabs} level={0} scopedValue={initialValue} scopedOnChange={onChange} />}
      </div>
    )
  } else if (objectField?.pages !== undefined && objectField.pages.length) {
    return (
      <div>
        {field.label !== undefined
          ? <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
          : null}
        {isSkipPath && !shouldUseScopedRenderingDespiteSkipPath
          ? <Page sections={objectField.pages} level={0} />
          : <Page sections={objectField.pages} level={0} scopedValue={initialValue} scopedOnChange={onChange} />}
      </div>
    )
  } else if (objectField?.wizard_steps !== undefined && objectField.wizard_steps.length) {
    return (
      <div>
        {field.label !== undefined
          ? <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
          : null}
        {isSkipPath && !shouldUseScopedRenderingDespiteSkipPath
          ? <WizardLayout sections={objectField.wizard_steps} level={0} />
          : <WizardLayout sections={objectField.wizard_steps} level={0} scopedValue={initialValue} scopedOnChange={onChange} />}
      </div>
    )
  } else if ((field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***objectWrapper***REMOVED***) && field.fields !== undefined) {
    const cl = `${field.layout === ***REMOVED***horizontal***REMOVED***
      ? ***REMOVED***flex md:flex-row sm:flex-col gap-4 sm:gap-2***REMOVED***
      : field.layout === ***REMOVED***grid4***REMOVED***
        ? ***REMOVED***grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4***REMOVED***
        : field.layout === ***REMOVED***grid3***REMOVED***
          ? ***REMOVED***grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4***REMOVED***
          : field.layout === ***REMOVED***grid2***REMOVED***
            ? ***REMOVED***grid grid-cols-1 md:grid-cols-2 gap-4***REMOVED***
            : ***REMOVED***flex flex-col gap-4***REMOVED***
      }`
    const fc = field.layout === ***REMOVED***horizontal***REMOVED***
      ? ***REMOVED***flex-1***REMOVED***
      : ***REMOVED******REMOVED***
    
    const isParentSkipPath = field.skip_path === true || (field as any).type === ***REMOVED***objectWrapper***REMOVED***

    // Use formEngine for consistent condition evaluation
    // Always pass ROOT formValues context, not the nested object
    const evaluationContext: FieldEvaluationContext = {
      rootFormValues: formValues,
      fieldPath: field.path
    }

    return (
      <div>
        {
          field.label !== undefined
            ? <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
            : null
        }
        <div className={`${cl}${disabled ? ***REMOVED*** opacity-70 cursor-not-allowed***REMOVED*** : ***REMOVED******REMOVED***}`}>
          {
            field.fields.map((childField) => {
              const key = (field.path ?? [field.id]).concat(childField.id).join(***REMOVED***.***REMOVED***)

              // Evaluate field logic using ROOT context (not nested object)
              // This fixes the bug where conditions were only checked for multiple=true
              // and used the wrong context
              const fieldLogicState = evaluateFieldLogicState(childField, evaluationContext)

              return (
                <ObjectFieldItem
                  key={key}
                  childField={childField}
                  disabled={disabled}
                  isParentSkipPath={isParentSkipPath}
                  initialValue={initialValue}
                  onChange={onChange}
                  fieldLogicState={fieldLogicState}
                  fc={fc}
                  evaluationContext={evaluationContext}
                />
              )
            })
          }
        </div>
      </div>
    )
  }
  return <p>Field config for {field.id} is missing &apos;fields&apos;</p>
}

export default ObjectInput
