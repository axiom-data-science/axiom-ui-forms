import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import { type IFormValueState, type IForm, type IFormSection, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import FormSection from '@/Form/Creator/FormSection'
import { calculateSectionStatus } from '@/Form/helpers'
import { utils } from '@axdspub/axiom-ui-utilities'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState, type ReactElement } from 'react'
import { useParams, Link } from 'react-router-dom'

const PageNav = ({
  form,
  sections,
  activeId,
  level
}: {
  form: IForm
  sections?: IFormSection[]
  activeId: string | null
  level: number
}): ReactElement => {
  const params = (useParams()['*'] ?? '').split('/')
  const path = params.slice(0, level).join('/')
  return (
      <div className='flex flex-col  w-[200px]  border-slate-200'>{
        sections?.map(p => {
          return (
            <Link to={`${path !== '' ? `${path}/` : ''}${p.id}`} key={p.id} className={`${utils.createButtonClass({
              className: `border-none rounded-none bg-slate-100 text-sm font-normal text-left ${activeId === p.id ? 'bg-slate-700 text-white' : 'hover:bg-slate-200'}`
            })}`} type='default'>{p.label}</Link>
          )
        })
      }</div>
  )
}

export interface IPageLayoutProps {
  form: IForm
  sections?: IFormSection[]
  formValueState: IFormValueState
  onChange?: IValueChangeFn
  level: number
  ContentComponent?: React.FC<{
    activeId: string | null
    form: IForm
    level: number
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
    level: number
  }>
  className?: string
}

export const ActivePage = ({
  activeId,
  form,
  formValueState,
  formSection,
  onChange,
  className = 'flex flex-col gap-2 flex-grow',
  level
}: {
  activeId: string | null
  form: IForm
  formSection?: IFormSection
  formValueState: IFormValueState
  onChange?: IValueChangeFn
  className?: string
  level: number
}): ReactElement => {
  return (
      <div className={className}>
              {
          formSection?.description !== undefined
            ? <p className='pb-4 border-b border-slate-200 text-sm'><InfoCircledIcon className='inline-block' /> {formSection.description}</p>
            : ''
        }
        <FormSection formSection={formSection} formValueState={formValueState} form={form} onChange={onChange} level={level + 1} />
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
  className = 'flex flex-row gap-8',
  level
}: IPageLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }

  const params = useParams()['*']?.split('/') ?? []
  const activeId = params[level] ?? sections[0]?.id ?? null
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
          level={level}
          />
        <ContentComponent
          activeId={activeId}
          formSection={sections?.find(s => s.id === activeId) ?? sections?.[0]}
          form={form}
          formValueState={formValueState}
          onChange={onChange}
          sectionStatus={sectionStatus}
          level={level}
          />
      </div>
  )
}

export default PageLayout
