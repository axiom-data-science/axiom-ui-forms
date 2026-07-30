import {
  IForm,
  IFormValues,
  type IFieldInputProps,
  type IFormSection,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormFields from ***REMOVED***@/Form/Creator/FormFields***REMOVED***
import PageLayout from ***REMOVED***@/Form/Creator/Page***REMOVED***
import TabLayout from ***REMOVED***@/Form/Creator/TabLayout***REMOVED***
import WizardLayout from ***REMOVED***@/Form/Creator/Wizard***REMOVED***
import React, { memo, ReactNode, type ReactElement } from ***REMOVED***react***REMOVED***

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
      id: ***REMOVED***default***REMOVED***,
      label: ***REMOVED***Default***REMOVED***,
      fields,
    })
  }
  if ((hasPages || hasFields || hasTabs) && hasWizardSteps) {
    wizardSteps.unshift({
      id: ***REMOVED***default***REMOVED***,
      order: -10,
      label: ***REMOVED***Default***REMOVED***,
      pages,
      fields,
    })
  }
  return (
    <>
      {hasWizardSteps ? (
        <WizardLayout sections={wizardSteps} level={level} SubmitButton={SubmitButton} />
      ) : hasPages ? (
        <PageLayout sections={pages} level={level} />
      ) : hasTabs ? (
        <TabLayout sections={tabs} level={level} />
      ) : (
        <FormFields
          fields={fields}
          className={level === 0 ? ***REMOVED***flex flex-col gap-8***REMOVED*** : undefined}
          layout={(formSection as any)?.layout}
        />
      )}
    </>
  )
}

export default memo(FormSection)
