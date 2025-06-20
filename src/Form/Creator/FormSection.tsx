import { type IFieldInputProps, type IFormSection, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import FormFields from '@/Form/Creator/FormFields'
import PageLayout from '@/Form/Creator/Page'
import WizardLayout from '@/Form/Creator/Wizard'
import React, { type ReactElement } from 'react'

const FormSection = ({
  formSection,
  onChange,
  level = 0,
  inputOverrides
}: {
  formSection?: IFormSection
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
              ? <WizardLayout sections={wizardSteps} onChange={onChange} level={level} />

              : hasPages
                ? <PageLayout sections={pages} onChange={onChange} level={level} />
                : <FormFields
                  fields={fields} onChange={onChange}
                  className={level === 0 ? 'flex flex-col gap-2' : undefined}

                  />
          }
        </>
  )
}

export default FormSection
