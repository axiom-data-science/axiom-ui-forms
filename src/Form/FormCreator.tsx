import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***
import { type IFormValues, type IForm, type IValueChangeFn, type IFormField, type IWizardStep, type IFormSection } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { copyAndAddPathToFields, getFieldsFromFormSection } from ***REMOVED***@/Form/helpers***REMOVED***
import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CaretLeftIcon, CaretRightIcon, ExclamationTriangleIcon, InfoCircledIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { Link, useParams } from ***REMOVED***react-router-dom***REMOVED***

const FormHeader = ({
  form,
  note,
  error

}: {
  form: IForm
  note?: string
  error?: string
}): ReactElement => {
  return (
    <>
        <h2 className=***REMOVED***text-2xl pb-4 font-bold***REMOVED***>{form.label}</h2>
        {
            note !== undefined
              ? <p className=***REMOVED***pb-4***REMOVED***>{note}</p>
              : null
        }
        {
            error !== undefined
              ? <p className=***REMOVED***pb-4 text-rose-800***REMOVED***><ExclamationTriangleIcon className=***REMOVED***inline mr-2***REMOVED*** /> {error}</p>
              : null
        }
        {
            form.description !== undefined
              ? <p className=***REMOVED***pb-4***REMOVED***>{form.description}</p>
              : null
        }
    </>
  )
}

const FormFields = ({
  form,
  fields,
  formValueState,
  onChange,
  className = ***REMOVED***flex flex-col gap-2***REMOVED***
}: {
  form: IForm
  fields?: IFormField[]
  formValueState: [IFormValues, (v: IFormValues) => void]
  onChange?: IValueChangeFn
  className?: string
}): ReactElement => {
  return (
      <>
      {
        fields === undefined || fields.length < 1
          ? ***REMOVED******REMOVED***
          : <div className={className}>
            {
              fields?.map((field) => {
                return (
                  <FieldCreator onChange={onChange} form={form} field={field} key={field.id} formValueState={formValueState} />
                )
              })
            }
        </div>
      }
      </>
  )
}

const FormCreator = ({
  form,
  formValueState,
  note,
  error,
  onChange,
  className
}: {
  form: IForm
  formValueState: [IFormValues, (v: IFormValues) => void]
  note?: string
  error?: string
  onChange?: IValueChangeFn
  className?: string

}): ReactElement => {
  const [activeForm, setActiveForm] = useState<IForm | null>(null)
  useEffect(() => {
    const newForm = copyAndAddPathToFields<IForm>(form)
    setActiveForm(newForm)
  }, [form])
  if (activeForm === null) {
    return <p>Processing</p>
  }

  return (
    <div className={className}>
        <FormHeader form={activeForm} note={note} error={error} />
        <FormSection formSection={activeForm} formValueState={formValueState} form={activeForm} onChange={onChange} />
    </div>
  )
}

const FormSection = ({
  formSection,
  formValueState,
  form,
  onChange
}: {
  formSection?: IFormSection
  formValueState: IFormValueState
  form: IForm
  onChange?: IValueChangeFn

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
            ? <WizardLayout form={form} sections={wizardSteps} formValueState={formValueState} onChange={onChange} />

            : hasPages
              ? <PageLayout form={form} sections={pages} formValueState={formValueState} onChange={onChange} />
              : <FormFields form={form} fields={fields} formValueState={formValueState} onChange={onChange} />
        }
      </>
  )
}

export const WizardNav = ({
  form,
  activeId,
  sections,
  sectionStatus
}: {
  form: IForm
  activeId: string | null
  sections?: IFormSection[]
  sectionStatus: IFormSectionStatus
}): ReactElement => {
  const steps = ((sections ?? []) as IWizardStep[]).sort((a, b) => a.order - b.order)
  return (
    <div className=***REMOVED***flex flex-row gap-1 justify-evenly relative align-middle***REMOVED***>
      <div className=***REMOVED***h-[2px] -m-[1px] top-3 bg-slate-300 absolute left-0 right-0 z-0***REMOVED*** />
      {
      steps.map((p, i) => {
        return (
          <div key={p.id} className=***REMOVED***flex-grow text-center z-10 relative***REMOVED***>
            <Link to={`${p.id}`} className={`${utils.createButtonClass({
              className: `px-8 bg-white z-20 border-none text-sm ${activeId === p.id ? ***REMOVED***bg-slate-600 text-white***REMOVED*** : ***REMOVED***hover:bg-slate-100***REMOVED***}`
            })}`} type=***REMOVED***default***REMOVED***>{p.label}</Link>
            {
              i < steps.length - 1 && steps.length > 1
                ? <span className=***REMOVED***absolute right-0 w-4 h-full bg-white***REMOVED***><CaretRightIcon className=***REMOVED***w-4 h-6 fill-slate-300 stroke-slate-300***REMOVED*** /></span>
                : ***REMOVED******REMOVED***
            }
            <p className=***REMOVED***text-xs text-center mt-4***REMOVED***>{sectionStatus[p.id]?.completed} of {sectionStatus[p.id]?.total} total</p>
            <p className=***REMOVED***text-xs text-center mt-2***REMOVED***>{sectionStatus[p.id]?.requiredCompleted} of {sectionStatus[p.id]?.requiredTotal} required</p>
          </div>
        )
      })
    }</div>
  )
}

export const WizardNavSmall = ({
  form,
  activeId,
  sections,
  sectionStatus
}: {
  form: IForm
  activeId: string | null
  sections?: IFormSection[]
  sectionStatus: IFormSectionStatus
}): ReactElement => {
  const steps = ((sections ?? []) as IWizardStep[]).sort((a, b) => a.order - b.order)
  const stepsMap = Object.fromEntries(steps.map(p => [p.id, p]))
  const currentStep = stepsMap[activeId ?? ***REMOVED******REMOVED***] ?? steps[0]
  const currentIndex = steps.indexOf(currentStep)
  const nextIndex = currentIndex + 1
  const prevIndex = currentIndex - 1
  return (
    <div className=***REMOVED***flex flex-row gap-4 justify-end***REMOVED***>{
      prevIndex >= 0
        ? <Link to={`${steps[prevIndex].id}`} className={utils.createButtonClass({
          className: ***REMOVED***px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700***REMOVED***
        })} type=***REMOVED***default***REMOVED***><CaretLeftIcon className=***REMOVED***inline***REMOVED*** /> Previous</Link>
        : <span className={utils.createButtonClass({
          className: ***REMOVED***px-4 bg-white border-none text-sm text-slate-400***REMOVED***
        })}>Previous</span>
      }
      {
        nextIndex < steps.length
          ? <Link to={`${steps[nextIndex].id}`} className={utils.createButtonClass({
            className: ***REMOVED***px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700***REMOVED***
          })} type=***REMOVED***default***REMOVED***>Next <CaretRightIcon className=***REMOVED***inline***REMOVED*** /></Link>
          : <span className={utils.createButtonClass({
            className: ***REMOVED***px-4 bg-white border-none text-sm text-slate-400***REMOVED***
          })}>Next</span>
      }
    </div>
  )
}

export interface IWizardLayoutProps extends IPageLayoutProps {
  SmallNavComponent?: React.FC<{
    form: IForm
    sections?: IFormSection[]
    activeId: string | null
    sectionStatus: IFormSectionStatus
    className?: string
  }>
}

const testField = (field: IFormField, formValues: IFormValues): boolean => {
  const val = formValues[field.id]
  return val !== undefined && val !== null && val !== ***REMOVED******REMOVED***
}

const calculateSectionStatus = (sections: IFormSection[], formValueState: IFormValueState): IFormSectionStatus => {
  const [formValues] = formValueState
  return Object.fromEntries(sections.map(s => {
    const fields = getFieldsFromFormSection(s).filter(f => f.type !== ***REMOVED***object***REMOVED***)
    const total = fields.length
    const completed = fields.filter(f => testField(f, formValues)).length
    const required = fields.filter(f => f.required)
    const requiredTotal = required.length
    const requiredCompleted = required.filter(f => testField(f, formValues)).length
    const valid = requiredTotal === requiredCompleted
    return [s.id, { completed, total, requiredTotal, requiredCompleted, valid }]
  }))
}

export type IFormSectionStatus = Record<string, {
  completed: number
  total: number
  requiredTotal: number
  requiredCompleted: number
  valid: boolean
}>

export const ActiveWizardPage = ({
  activeId,
  form,
  wizardSteps,
  formValueState,
  onChange,
  className = ***REMOVED***flex flex-col gap-2 flex-grow***REMOVED***
}: {
  activeId: string | null
  form: IForm
  wizardSteps: IWizardStep[]
  formValueState: [IFormValues, (v: IFormValues) => void]
  onChange?: IValueChangeFn
  className?: string
}): ReactElement => {
  return (
    <FormSection formSection={wizardSteps?.find(p => p.id === activeId)} formValueState={formValueState} form={form} onChange={onChange} />
  )
}

const WizardLayout = ({
  form,
  sections,
  formValueState,
  onChange,
  ContentComponent = ActivePage,
  NavComponent = WizardNav,
  SmallNavComponent = WizardNavSmall,
  className = ***REMOVED***flex flex-col gap-16 pt-8***REMOVED***
}: IWizardLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }
  const activeId = useParams().step ?? form?.wizard_steps?.[0]?.id ?? null
  const [sectionStatus, setSectionStatus] = useState<IFormSectionStatus>(calculateSectionStatus(sections, formValueState))
  useEffect(() => {
    setSectionStatus(calculateSectionStatus(sections, formValueState))
  }, [formValueState, sections])

  const formSection = sections?.find(s => s.id === activeId) ?? sections?.[0]

  return (
    <div className={className}>
      <NavComponent
          form={form}
          sections={sections}
          activeId={activeId}
          sectionStatus={sectionStatus}
        />
      <ContentComponent
          activeId={activeId}
          formSection={formSection}
          form={form}
          formValueState={formValueState}
          sectionStatus={sectionStatus}
          onChange={onChange}
          />
      <SmallNavComponent
        form={form}
        sections={sections}
        activeId={activeId}
        sectionStatus={sectionStatus}
        />
    </div>
  )
}

const PageNav = ({
  form,
  sections,
  activeId
}: {
  form: IForm
  sections?: IFormSection[]
  activeId: string | null
}): ReactElement => {
  const params = useParams()
  const path = params.step ? `${params.step}/` : ***REMOVED******REMOVED***
  return (
    <div className=***REMOVED***flex flex-col  w-[200px]  border-slate-200***REMOVED***>{
      sections?.map(p => {
        return (
          <Link to={`${path}${p.id}`} key={p.id} className={`${utils.createButtonClass({
            className: `border-none rounded-none bg-slate-100 text-sm font-normal text-left ${activeId === p.id ? ***REMOVED***bg-slate-700 text-white***REMOVED*** : ***REMOVED***hover:bg-slate-200***REMOVED***}`
          })}`} type=***REMOVED***default***REMOVED***>{p.label}</Link>
        )
      })
    }</div>
  )
}

type IFormValueState = [IFormValues, (v: IFormValues) => void]

interface IPageLayoutProps {
  form: IForm
  sections?: IFormSection[]
  formValueState: IFormValueState
  onChange?: IValueChangeFn
  ContentComponent?: React.FC<{
    activeId: string | null
    form: IForm
    formSection?: IFormSection
    formValueState: IFormValueState
    onChange?: IValueChangeFn
    sectionStatus: IFormSectionStatus
  }>
  NavComponent?: React.FC<{
    form: IForm
    sections?: IFormSection[]
    activeId: string | null
    sectionStatus: IFormSectionStatus
  }>
  className?: string
}

const ActivePage = ({
  activeId,
  form,
  formValueState,
  formSection,
  onChange,
  className = ***REMOVED***flex flex-col gap-2 flex-grow***REMOVED***
}: {
  activeId: string | null
  form: IForm
  formSection?: IFormSection
  formValueState: IFormValueState
  onChange?: IValueChangeFn
  className?: string
}): ReactElement => {
  return (
    <div className={className}>
            {
        formSection?.description !== undefined
          ? <p className=***REMOVED***pb-4 border-b border-slate-200 text-sm***REMOVED***><InfoCircledIcon className=***REMOVED***inline-block***REMOVED*** /> {formSection.description}</p>
          : ***REMOVED******REMOVED***
      }
      <FormSection formSection={formSection} formValueState={formValueState} form={form} onChange={onChange} />
    </div>
  )
}

const PageLayout = ({
  form,
  sections,
  formValueState,
  onChange,
  ContentComponent = ActivePage,
  NavComponent = PageNav,
  className = ***REMOVED***flex flex-row gap-8***REMOVED***
}: IPageLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }

  const params = useParams()
  const activeId = params.page ?? params.page2 ?? sections[0]?.id ?? null
  const [sectionStatus, setSectionStatus] = useState<IFormSectionStatus>(calculateSectionStatus(sections, formValueState))
  useEffect(() => {
    setSectionStatus(calculateSectionStatus(sections, formValueState))
  }, [formValueState, sections])
  return (
    <div className={className}>
      <NavComponent
        form={form}
        sections={sections}
        activeId={activeId}
        sectionStatus={sectionStatus}
        />
      <ContentComponent
        activeId={activeId}
        formSection={sections?.find(s => s.id === activeId) ?? sections?.[0]}
        form={form}
        formValueState={formValueState}
        onChange={onChange}
        sectionStatus={sectionStatus}
        />
    </div>
  )
}

export default FormCreator
