import FieldCreator from '@/Form/Components/FieldCreator'
import FieldLabel from '@/Form/Components/FieldLabel'
import { type ICompositeValueType, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { useFormContext, useFormValues } from '@/Form/Creator/FormContextProvider'
import Page from '@/Form/Creator/Page'
import TabLayout from '@/Form/Creator/TabLayout'
import WizardLayout from '@/Form/Creator/Wizard'
import { evaluateFieldLogicState, type FieldEvaluationContext } from '@/utils/formEngine'
import { cloneObject } from '@/utils/manipulators'
import { utils } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const ObjectInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const formValues = useFormValues()

  const initialValue = (typeof value === 'object' ? value ?? {} : {}) as ICompositeValueType
  const objectField = (field.type === 'object' || field.type === 'objectWrapper') ? (field as any) : undefined
  if (objectField?.tabs !== undefined && objectField.tabs.length) {
    return <TabLayout sections={objectField.tabs} level={0} scopedValue={initialValue} scopedOnChange={onChange} />
  } else if (objectField?.pages !== undefined && objectField.pages.length) {
    return <Page sections={objectField.pages} level={0} />
  } else if (objectField?.wizard_steps !== undefined && objectField.wizard_steps.length) {
    return <WizardLayout sections={objectField.wizard_steps} level={0} />
  } else if (field.type === 'object' && field.fields !== undefined) {
    const cl = `${field.layout === 'horizontal'
      ? 'flex md:flex-row sm:flex-col gap-4 sm:gap-2'
      : field.layout === 'grid4'
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
        : field.layout === 'grid3'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : field.layout === 'grid2'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
            : 'flex flex-col gap-4'
      }`
    const fc = field.layout === 'horizontal'
      ? 'flex-1'
      : ''

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
        <div className={`${cl}${disabled ? ' opacity-70 cursor-not-allowed' : ''}`}>
          {
            field.fields.map((childField) => {
              const key = (field.path ?? [field.id]).concat(childField.id).join('.')

              // Evaluate field logic using ROOT context (not nested object)
              // This fixes the bug where conditions were only checked for multiple=true
              // and used the wrong context
              const fieldLogicState = evaluateFieldLogicState(childField, evaluationContext)

              return (
                <FieldCreator
                  disabled={disabled || fieldLogicState.isDisabled}
                  conditionResult={fieldLogicState.conditionResult}
                  onChange={(e) => {
                    if (childField.type === 'object' && childField.skip_path === true) {
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
                    childField.type === 'object' && childField.skip_path === true
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
