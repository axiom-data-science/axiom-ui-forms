import { type IFieldInputProps, type IForm, type IFormSection, type IFormValueState, type IValueChangeFn } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormFields from ***REMOVED***@/Form/Creator/FormFields***REMOVED***
import PageLayout from ***REMOVED***@/Form/Creator/Page***REMOVED***
import WizardLayout from ***REMOVED***@/Form/Creator/Wizard***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const FormSection = ({
  formSection,
  formValueState,
  form,
  onChange,
  level = 0,
  inputOverrides
}: {
  formSection?: IFormSection
  formValueState: IFormValueState
  form: IForm
  onChange?: IValueChangeFn
  level?: number
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>

}): ReactElement => {
  if (formSection === undefined) {
    return <></>
  }
  const pages = (formSection?.pages ?? []).slice()
  const fields = (formSection?.fields ?? []).slice()
  const wizardSteps = (formSection?.wizard_steps ?? []).slice()
  const hasPages = pages.length > 0
  const hasFields = fields.length > 0
  const hasWizardSteps = wizardSteps.length > 0
  if (hasPages && hasFields) {
    pages.unshift({
      id: ***REMOVED***default***REMOVED***,
      label: ***REMOVED***Default***REMOVED***,
      fields
    })
  }
  if ((hasPages || hasFields) && hasWizardSteps) {
    wizardSteps.unshift({
      id: ***REMOVED***default***REMOVED***,
      order: -10,
      label: ***REMOVED***Default***REMOVED***,
      pages,
      fields
    })
  }
  return (
        <>
          {
            hasWizardSteps
              ? <WizardLayout form={form} sections={wizardSteps} formValueState={formValueState} onChange={onChange} level={level} inputOverrides={inputOverrides} />

              : hasPages
                ? <PageLayout form={form} sections={pages} formValueState={formValueState} onChange={onChange} level={level} inputOverrides={inputOverrides} />
                : <FormFields form={form} fields={fields} formValueState={formValueState} onChange={onChange} inputOverrides={inputOverrides} />
          }
        </>
  )
}

export default FormSection
