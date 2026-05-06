import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type ICompositeValueType, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { useFormContext, useFormValues } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import Page from ***REMOVED***@/Form/Creator/Page***REMOVED***
import TabLayout from ***REMOVED***@/Form/Creator/TabLayout***REMOVED***
import WizardLayout from ***REMOVED***@/Form/Creator/Wizard***REMOVED***
import { evaluateFieldLogicState, type FieldEvaluationContext } from ***REMOVED***@/utils/formEngine***REMOVED***
import { cloneObject } from ***REMOVED***@/utils/manipulators***REMOVED***
import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const ObjectInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const formValues = useFormValues()

  const initialValue = (typeof value === ***REMOVED***object***REMOVED*** ? value ?? {} : {}) as ICompositeValueType
  const objectField = (field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***objectWrapper***REMOVED***) ? (field as any) : undefined
  if (objectField?.tabs !== undefined && objectField.tabs.length) {
    return <TabLayout sections={objectField.tabs} level={0} scopedValue={initialValue} scopedOnChange={onChange} />
  } else if (objectField?.pages !== undefined && objectField.pages.length) {
    return <Page sections={objectField.pages} level={0} />
  } else if (objectField?.wizard_steps !== undefined && objectField.wizard_steps.length) {
    return <WizardLayout sections={objectField.wizard_steps} level={0} />
  } else if (field.type === ***REMOVED***object***REMOVED*** && field.fields !== undefined) {
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
                <FieldCreator
                  disabled={disabled || fieldLogicState.isDisabled}
                  conditionResult={fieldLogicState.conditionResult}
                  onChange={(e) => {
                    if (childField.type === ***REMOVED***object***REMOVED*** && childField.skip_path === true) {
                      onChange(e)
                    } else {
                      const newValue = cloneObject(initialValue)
                      newValue[childField.id] = e
                      onChange(newValue)
                    }
                  }}
                  className={utils.makeClassName({
                    className: fc
                  })}
                  value={(
                    childField.type === ***REMOVED***object***REMOVED*** && childField.skip_path === true
                      ? initialValue
                      : initialValue[childField.id]
                  ) ?? null
                  }
                  field={childField}
                  key={key}
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
