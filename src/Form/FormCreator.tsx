import FieldCreator from '@/Form/Components/FieldCreator'
import { type IFormValues, type IForm, type IValueChangeFn, type IFormField, type IWizardStep, type IFormSection } from '@/Form/FormCreatorTypes'
import { copyAndAddPathToFields } from '@/Form/helpers'
import { utils } from '@axdspub/axiom-ui-utilities'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
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
    pages.push({
      id: 'default',
      label: 'Default',
      fields
    })
  }
  if ((hasPages || hasFields) && hasWizardSteps) {
    wizardSteps.push({
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
  activeId
}: {
  form: IForm
  activeId: string | null
}): ReactElement => {
  return (
    <div className='flex flex-row gap-1 justify-evenly'>{
      form?.wizard_steps?.map(p => {
        return (
          <Link to={`${p.id}`} key={p.id} className={`${utils.createButtonClass({
            className: `flex-grow text-center border-none text-sm hover:bg-slate-100${activeId === p.id ? ' bg-slate-100' : ''}`
          })}`} type='default'>{p.label}</Link>
        )
      })
    }</div>
  )
}

export interface IWizardLayoutProps {
  form: IForm
  sections?: IWizardStep[]
  formValueState: IFormValueState
  onChange?: IValueChangeFn
  ContentComponent?: React.FC<{
    activeId: string | null
    form: IForm
    formValueState: IFormValueState
    onChange?: IValueChangeFn
  }>
  NavComponent?: React.FC<{
    form: IForm
    Step: string | null
  }>
  className?: string
}

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
  className = 'flex flex-col gap-4'
}: IPageLayoutProps): ReactElement => {
  const activeId = useParams().step ?? form?.wizard_steps?.[0]?.id ?? null
  return (
    <div className={className}>
      <NavComponent form={form} sections={sections} activeId={activeId} />
      <ContentComponent activeId={activeId} formSection={sections?.find(s => s.id === activeId) ?? sections?.[0]} form={form} formValueState={formValueState} onChange={onChange} />
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
  return (
    <div className='flex flex-col gap-1 w-[200px]'>{
      sections?.map(p => {
        return (
          <Link to={`${p.id}`} key={p.id} className={`${utils.createButtonClass({
            className: `border-none text-sm hover:bg-slate-100 text-left${activeId === p.id ? ' bg-slate-100' : ''}`
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
  }>
  NavComponent?: React.FC<{
    form: IForm
    sections?: IFormSection[]
    activeId: string | null
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
  const activeId = useParams().page ?? form?.pages?.[0]?.id ?? null
  return (
    <div className={className}>
      <NavComponent form={form} sections={sections} activeId={activeId} />
      <ContentComponent activeId={activeId} formSection={sections?.find(s => s.id === activeId) ?? sections?.[0]} form={form} formValueState={formValueState} onChange={onChange} />
    </div>
  )
}

export default FormCreator
