import {
  IForm,
  IFormValues,
  type IFieldInputProps,
  type IFormSection,
} from '@/Form/Creator/FormCreatorTypes'
import FormFields from '@/Form/Creator/FormFields'
import PageLayout from '@/Form/Creator/Page'
import TabLayout from '@/Form/Creator/TabLayout'
import WizardLayout from '@/Form/Creator/Wizard'
import { useFormValues } from '@/utils/formEngine/index'
import React, { memo, ReactNode, type ReactElement } from 'react'

const FormSection = ({
  formSection,
  level = 0,
  inputOverrides,
  SubmitButton,
}: {
  formSection?: IFormSection | IForm
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
      fields,
    })
  }
  if ((hasPages || hasFields || hasTabs) && hasWizardSteps) {
    wizardSteps.unshift({
      id: 'default',
      order: -10,
      label: 'Default',
      pages,
      fields,
    })
  }
  return (
    <>
      {hasWizardSteps ? (
        <WizardLayout sections={wizardSteps} level={level} SubmitButton={SubmitButton} />
      ) : hasPages ? (
        <PageLayout sections={pages} level={level} SubmitButton={SubmitButton} />
      ) : hasTabs ? (
        <TabLayout sections={tabs} level={level} SubmitButton={SubmitButton} />
      ) : (
        <>
        <FormFields
          fields={fields}
          className={level === 0 ? 'flex flex-col gap-8' : undefined}
          layout={(formSection as any)?.layout}
          SubmitButton={SubmitButton}
        />

        </>
      )}
    </>
  )
}

export default memo(FormSection)
