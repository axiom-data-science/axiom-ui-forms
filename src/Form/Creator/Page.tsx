import { FormSectionContextProvider, useFormSectionContext } from '@/Form/Creator/FormSectionContextProvider'
import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import { type IFormSection, type IValueChangeFn, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import FormSection from '@/Form/Creator/FormSection'
import NavElement from '@/Form/Creator/NavElement'
import { calculateSectionStatus } from '@/utils/validators'
import { Cross2Icon, DropdownMenuIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState, type ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { useFormContext } from '@/Form/Creator/FormContextProvider'
import InlineMarkdown from '@/Form/Components/InlineMarkdown'
import { useAtom } from 'jotai'
import layoutAtom from '@/utils/responsive/layoutState'
import { Button } from '@axdspub/axiom-ui-utilities'

const PageNav = ({
  sections,
  level
}: {
  sections?: IFormSection[]
  level: number
}): ReactElement => {
  const [layout] = useAtom(layoutAtom)
  const { urlNavigable } = useFormContext()
  const { activeId, setActiveId, path } = useFormSectionContext()
  return (
    layout.size === 'sm' || layout.size === 'md'
      ? <PageNavMobile sections={sections} level={level} />
      : <div className='flex flex-col w-[200px]  border-slate-200'>{
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

const PageNavMobile = ({
  sections,
  level
}: {
  sections?: IFormSection[]
  level: number
}): ReactElement => {
  const [active, setActive] = useState(false)
  const { activeId, setActiveId, path } = useFormSectionContext()
  const { urlNavigable } = useFormContext()

  useEffect(() => {
    setActive(false)
  }, [activeId])

  return <div className='relative'><Button
  type='default'
  size='sm'
  className='bg-slate-600 text-white border-none p-2'
  onClick={() => {
    setActive(!active)
  }}
  >
    {
      active
        ? <Cross2Icon className='inline' />
        : <DropdownMenuIcon className='inline w-6 h-6' />
    }
  </Button>

        {
          active
            ? <><div className='bg-white bg-opacity-40 fixed top-0 left-0 right-0 bottom-0 z-40' onClick={() => { setActive(false) }}></div>
              <div className='fixed top-0 left-0 right-0 bottom-0 flex flex-col bg-white z-50 gap-2 p-4 m-8 shadow-lg'>
                <div>
                <Cross2Icon className='cursor-pointer w-6 h-6' onClick={() => { setActive(false) }} />
                  </div>

              {
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
              }
              </div>
              </>
            : <></>
        }
      </div>
}

export interface INavProps {
  sections: IFormSection[]
  sectionStatus: IFormSectionStatus
  level: number
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
  NavComponent?: React.FC<INavProps>
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
            ? <p className=' text-sm'><InfoCircledIcon className='inline -mt-1' /> <InlineMarkdown>{formSection.description}</InlineMarkdown></p>
            : ''
        }
        <FormSection formSection={formSection} onChange={onChange} level={level + 1} />
      </div>
  )
}

const PageLayout = (props: IPageLayoutProps): ReactElement => {
  if (props.sections === undefined) {
    return <></>
  }
  const { urlNavigable } = useFormContext()
  const params = (useParams()['*'] ?? '').split('/')
  const path = params.slice(0, props.level).join('/')
  const id = urlNavigable
    ? (params[props.level] && params[props.level] !== '') ? params[props.level] : (props.sections[0]?.id ?? null)
    : props.sections[0]?.id ?? null

  return (
    <FormSectionContextProvider path={path} id={id}>
      <PageLayoutContent {...props} />
    </FormSectionContextProvider>
  )
}

const PageLayoutContent = ({

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

  const { setFormValues, formValues } = useFormContext()
  const sectionStatus = calculateSectionStatus(sections, [formValues, setFormValues])
  const { activeId } = useFormSectionContext()
  const formSection = sections?.find(s => s.id === activeId) ?? sections?.[0]

  return (

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
  )
}

export default PageLayout
