import { IFormValues, type IFieldInputProps, type IFormSection, type IValueChangeFn } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormFields from ***REMOVED***@/Form/Creator/FormFields***REMOVED***
import PageLayout from ***REMOVED***@/Form/Creator/Page***REMOVED***
import WizardLayout from ***REMOVED***@/Form/Creator/Wizard***REMOVED***
import React, { ReactNode, type ReactElement } from ***REMOVED***react***REMOVED***

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
  SubmitButton?: React.FC<{formValues: IFormValues}> | ReactNode

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
              ? <WizardLayout sections={wizardSteps} onChange={onChange} level={level} SubmitButton={SubmitButton} />

              : hasPages
                ? <PageLayout sections={pages} onChange={onChange} level={level} />
                : <FormFields
                  fields={fields} onChange={onChange}
                  className={level === 0 ? ***REMOVED***flex flex-col gap-8***REMOVED*** : undefined}

                  />
          }
        </>
  )
}

export default FormSection
