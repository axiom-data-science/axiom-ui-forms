import { IFormValues, type IFieldInputProps, type IFormSection, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import FormFields from '@/Form/Creator/FormFields'
import PageLayout from '@/Form/Creator/Page'
import TabLayout from '@/Form/Creator/TabLayout'
import WizardLayout from '@/Form/Creator/Wizard'
import React, { ReactNode, type ReactElement } from 'react'

const FormSection = ({
  formSection,
  onChange,
  level = 0,
  inputOverrides,
  SubmitButton
}: {
  formSection?: IFormSection
  onChange?: IValueChangeFn
  level?: number
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
  SubmitButton?: React.FC<{ formValues: IFormValues }> | ReactNode

}): ReactElement => {
  if (formSection === undefined) {
    return <></>
  }
  const pages = (formSection?.pages ?? []).slice()
  const fields = (formSection?.fields ?? []).slice()
  const wizardSteps = (formSection?.wizard_steps ?? []).slice()
  const tabs = (formSection?.tabs ?? []).slice()
  const hasPages = pages.length > 0
  const hasFields = fields.length > 0
  const hasWizardSteps = wizardSteps.length > 0
  const hasTabs = tabs.length > 0
  if (hasPages && hasFields) {
    pages.unshift({
      id: 'default',
      label: 'Default',
      fields
    })
  }
  if ((hasPages || hasFields || hasTabs) && hasWizardSteps) {
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
          ? <WizardLayout sections={wizardSteps} onChange={onChange} level={level} SubmitButton={SubmitButton} />

          : hasPages
            ? <PageLayout sections={pages} onChange={onChange} level={level} />
            : hasTabs
              ? <TabLayout sections={tabs} onChange={onChange} level={level} />
              : <FormFields
                fields={fields} onChange={onChange}
                className={level === 0 ? 'flex flex-col gap-8' : undefined}

              />
      }
    </>
  )
}

export default FormSection
