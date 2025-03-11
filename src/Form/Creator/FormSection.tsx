import { type IFieldInputProps, type IForm, type IFormSection, type IFormValueState, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import FormFields from '@/Form/Creator/FormFields'
import PageLayout from '@/Form/Creator/Page'
import WizardLayout from '@/Form/Creator/Wizard'
import React, { type ReactElement } from 'react'

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
      id: 'default',
      label: 'Default',
      fields
    })
  }
  if ((hasPages || hasFields) && hasWizardSteps) {
    wizardSteps.unshift({
      id: 'default',
      order: -10,
      label: 'Default',
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
