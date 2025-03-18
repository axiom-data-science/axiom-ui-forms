import { FormSectionContextProvider, useFormSectionContext } from '@/Form/Creator/FormSectionContextProvider'
import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import { type IFormSection, type IValueChangeFn, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import FormSection from '@/Form/Creator/FormSection'
import NavElement from '@/Form/Creator/NavElement'
import { calculateSectionStatus } from '@/Form/helpers'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import React, { type ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { useFormContext } from '@/Form/Creator/FormContextProvider'

const PageNav = ({
  sections,
  level
}: {
  sections?: IFormSection[]
  level: number
}): ReactElement => {
  const { urlNavigable } = useFormContext()
  const { activeId, setActiveId, path } = useFormSectionContext()
  return (
      <div className='flex flex-col  w-[200px]  border-slate-200'>{
        sections?.map(p => {
          return (
            <NavElement
              key={p.id}
              path={path}
              id={p.id}
              navigable={urlNavigable ?? true}
              onClick={() => { setActiveId(p.id) }}
              className={ `border-none rounded-none bg-slate-100 text-sm font-normal text-left ${activeId === p.id ? 'bg-slate-700 text-white' : 'hover:bg-slate-200'}`}
            >{p.label}</NavElement>
          )
        })
      }</div>
  )
}

export interface IPageLayoutProps {
  sections?: IFormSection[]
  onChange?: IValueChangeFn
  level: number
  ContentComponent?: React.FC<{
    level: number
    formSection?: IFormSection
    onChange?: IValueChangeFn
    sectionStatus: IFormSectionStatus
  }>
  NavComponent?: React.FC<{
    sections?: IFormSection[]
    sectionStatus: IFormSectionStatus
    level: number
  }>
  className?: string
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
}

export const ActivePage = ({
  formSection,
  onChange,
  className = 'flex flex-col gap-2 flex-grow',
  level
}: {
  formSection?: IFormSection
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
        <FormSection formSection={formSection} onChange={onChange} level={level + 1} />
      </div>
  )
}

const PageLayout = ({

  sections,
  onChange,
  inputOverrides,
  ContentComponent = ActivePage,
  NavComponent = PageNav,
  className = 'flex flex-row gap-8',
  level
}: IPageLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }

  const { urlNavigable, setFormValues, formValues } = useFormContext()
  const params = (useParams()['*'] ?? '').split('/')
  const path = params.slice(0, level).join('/')
  const id = urlNavigable
    ? (params[level] && params[level] !== '') ? params[level] : (sections[0]?.id ?? null)
    : sections[0]?.id ?? null
  const sectionStatus = calculateSectionStatus(sections, [formValues, setFormValues])
  const formSection = sections?.find(s => s.id === id) ?? sections?.[0]

  return (
      <FormSectionContextProvider path={path} id={id}>
        <div className={className}>
          <NavComponent
            sections={sections}
            sectionStatus={sectionStatus}
            level={level}
            />
          <ContentComponent
            formSection={formSection}
            onChange={onChange}
            sectionStatus={sectionStatus}
            level={level}
            />
        </div>
      </FormSectionContextProvider>
  )
}

export default PageLayout
