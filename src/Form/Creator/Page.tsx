import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import { type IFormValueState, type IForm, type IFormSection, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import FormSection from '@/Form/Creator/FormSection'
import NavElement from '@/Form/Creator/NavElement'
import { calculateSectionStatus } from '@/Form/helpers'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState, type ReactElement } from 'react'
import { useParams } from 'react-router-dom'

const PageNav = ({
  form,
  sections,
  activeIdState,
  level
}: {
  form: IForm
  sections?: IFormSection[]
  activeIdState: [string | null, (v: string | null) => void]
  level: number
}): ReactElement => {
  const [activeId, setActiveState] = activeIdState
  const params = (useParams()['*'] ?? '').split('/')
  const path = params.slice(0, level).join('/')
  return (
      <div className='flex flex-col  w-[200px]  border-slate-200'>{
        sections?.map(p => {
          return (
            <NavElement
              key={p.id}
              path={path}
              id={p.id}
              navigable={form?.settings?.url_navigable ?? true}
              onClick={() => { setActiveState(p.id) }}
              className={ `border-none rounded-none bg-slate-100 text-sm font-normal text-left ${activeId === p.id ? 'bg-slate-700 text-white' : 'hover:bg-slate-200'}`}
            >{p.label}</NavElement>
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
    activeIdState: [string | null, (v: string | null) => void]
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
    activeIdState: [string | null, (v: string | null) => void]
    sectionStatus: IFormSectionStatus
    level: number
  }>
  className?: string
}

export const ActivePage = ({
  activeIdState,
  form,
  formValueState,
  formSection,
  onChange,
  className = 'flex flex-col gap-2 flex-grow',
  level
}: {
  activeIdState: [string | null, (v: string | null) => void]
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
  const activeIdState = useState<string | null>(form?.settings?.url_navigable
    ? params[level] ?? sections[0]?.id ?? null
    : sections[0]?.id ?? null
  )

  const [sectionStatus, setSectionStatus] = useState<IFormSectionStatus>(calculateSectionStatus(sections, formValueState))
  useEffect(() => {
    setSectionStatus(calculateSectionStatus(sections, formValueState))
  }, [formValueState, sections])

  const [formSection, setFormSection] = useState<IFormSection | undefined>(sections?.find(s => s.id === activeIdState[0]) ?? sections?.[0])
  useEffect(() => {
    setFormSection(sections?.find(s => s.id === activeIdState[0]) ?? sections?.[0])
  }, [activeIdState[0]])

  useEffect(() => {
    if (form?.settings?.url_navigable === true && params[level] !== activeIdState[0]) {
      activeIdState[1](params[level] ?? sections[0]?.id ?? null)
    }
  }, [useParams()['*']])
  return (
      <div className={className}>
        <NavComponent
          form={form}
          sections={sections}
          sectionStatus={sectionStatus}
          activeIdState={activeIdState}
          level={level}
          />
        <ContentComponent
          activeIdState={activeIdState}
          formSection={formSection}
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
