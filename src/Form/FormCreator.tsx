import FieldCreator from '@/Form/Components/FieldCreator'
import { type IFormValues, type IForm, type IValueChangeFn, type IFormField, type IWizardStep, type IFormSection } from '@/Form/FormCreatorTypes'
import { copyAndAddPathToFields, getFieldsFromFormSection } from '@/Form/helpers'
import { utils } from '@axdspub/axiom-ui-utilities'
import { CaretLeftIcon, CaretRightIcon, ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState, type ReactElement } from 'react'
import { Link, useParams } from 'react-router-dom'

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
        <h2 className='text-2xl pb-4 font-bold'>{form.label}</h2>
        {
            note !== undefined
              ? <p className='pb-4'>{note}</p>
              : null
        }
        {
            error !== undefined
              ? <p className='pb-4 text-rose-800'><ExclamationTriangleIcon className='inline mr-2' /> {error}</p>
              : null
        }
        {
            form.description !== undefined
              ? <p className='pb-4'>{form.description}</p>
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
  className = 'flex flex-col gap-2'
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
          ? ''
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
    <div className='flex flex-row gap-1 justify-evenly relative align-middle'>
      <div className='h-[2px] -m-[1px] top-3 bg-slate-300 absolute left-0 right-0 z-0' />
      {
      steps.map((p, i) => {
        return (
          <div key={p.id} className='flex-grow text-center z-10 relative'>
            <Link to={`${p.id}`} className={`${utils.createButtonClass({
              className: `px-8 bg-white z-20 border-none text-sm ${activeId === p.id ? 'bg-slate-600 text-white' : 'hover:bg-slate-100'}`
            })}`} type='default'>{p.label}</Link>
            {
              i < steps.length - 1 && steps.length > 1
                ? <span className='absolute right-0 w-4 h-full bg-white'><CaretRightIcon className='w-4 h-6 fill-slate-300 stroke-slate-300' /></span>
                : ''
            }
            <p className='text-xs text-center mt-4'>{sectionStatus[p.id]?.completed} of {sectionStatus[p.id]?.total} total</p>
            <p className='text-xs text-center mt-2'>{sectionStatus[p.id]?.requiredCompleted} of {sectionStatus[p.id]?.requiredTotal} required</p>
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
  const currentStep = stepsMap[activeId ?? ''] ?? steps[0]
  const currentIndex = steps.indexOf(currentStep)
  const nextIndex = currentIndex + 1
  const prevIndex = currentIndex - 1
  return (
    <div className='flex flex-row gap-4 justify-end'>{
      prevIndex >= 0
        ? <Link to={`${steps[prevIndex].id}`} className={utils.createButtonClass({
          className: 'px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700'
        })} type='default'><CaretLeftIcon className='inline' /> Previous</Link>
        : <span className={utils.createButtonClass({
          className: 'px-4 bg-white border-none text-sm text-slate-400'
        })}>Previous</span>
      }
      {
        nextIndex < steps.length
          ? <Link to={`${steps[nextIndex].id}`} className={utils.createButtonClass({
            className: 'px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700'
          })} type='default'>Next <CaretRightIcon className='inline' /></Link>
          : <span className={utils.createButtonClass({
            className: 'px-4 bg-white border-none text-sm text-slate-400'
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
  return val !== undefined && val !== null && val !== ''
}

const calculateSectionStatus = (sections: IFormSection[], formValueState: IFormValueState): IFormSectionStatus => {
  const [formValues] = formValueState
  return Object.fromEntries(sections.map(s => {
    const fields = getFieldsFromFormSection(s).filter(f => f.type !== 'object')
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
  className = 'flex flex-col gap-2 flex-grow'
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
  className = 'flex flex-col gap-16 pt-8'
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
  const path = params.step ? `${params.step}/` : ''
  return (
    <div className='flex flex-col  w-[200px]  border-slate-200'>{
      sections?.map(p => {
        return (
          <Link to={`${path}${p.id}`} key={p.id} className={`${utils.createButtonClass({
            className: `border-none rounded-none bg-slate-100 text-sm font-normal text-left ${activeId === p.id ? 'bg-slate-700 text-white' : 'hover:bg-slate-200'}`
          })}`} type='default'>{p.label}</Link>
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
  className = 'flex flex-col gap-2 flex-grow'
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
          ? <p className='pb-4 border-b border-slate-200 text-sm'><InfoCircledIcon className='inline-block' /> {formSection.description}</p>
          : ''
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
  className = 'flex flex-row gap-8'
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
