import { FormSectionContextProvider, useFormSectionContext } from '@/Form/Creator/FormSectionContextProvider'
import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import { type IFormSection, type IValueChangeFn, type IFieldInputProps, IFormValues } from '@/Form/Creator/FormCreatorTypes'
import FormSection from '@/Form/Creator/FormSection'
import NavElement from '@/Form/Creator/NavElement'
import { calculateSectionStatus } from '@/utils/validators'
import { Cross2Icon, DropdownMenuIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import React, { ReactNode, useEffect, useState, type ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { useFormContext } from '@/Form/Creator/FormContextProvider'
import InlineMarkdown from '@/Form/Components/InlineMarkdown'
import { useAtom } from 'jotai'
import layoutAtom from '@/utils/responsive/layoutState'
import { Button, Tabs } from '@axdspub/axiom-ui-utilities'
import FieldLabel, { FieldLabelText } from '@/Form/Components/FieldLabel'

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
      : <div className='flex flex-col w-50  border-slate-200'>{
        sections?.map(p => {
          return (
            <NavElement
              key={p.id}
              path={path}
              id={p.id}
              navigable={urlNavigable ?? true}
              onClick={() => { setActiveId(p.id) }}
              className={`border-none rounded-none bg-slate-100 text-sm font-normal justify-start whitespace-break-spaces py-2 h-auto ${activeId === p.id ? 'bg-slate-700 hover:bg-slate-800 text-white hover:text-white ' : 'hover:bg-slate-200'}`}
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
    className='bg-none  border-none p-2'
    onClick={() => {
      setActive(!active)
    }}
  >
    <div className='-mr-6 -ml-2'>{
      active
        ? <Cross2Icon className='inline' />
        : <DropdownMenuIcon className='inline w-8 h-8 rotate-180' />
    }
    </div>
  </Button>

    {
      active
        ? <><div className='bg-slate-400 bg-opacity-40 fixed top-0 left-0 right-0 bottom-0 z-40' onClick={() => { setActive(false) }}></div>
          <div className='fixed left-0 top-0 bottom-0 flex flex-col bg-white z-50 w-[60%] gap-2 p-4 shadow-lg animate-slide-in'>
            <div>
              <DropdownMenuIcon className='float-left cursor-pointer w-8 h-8' onClick={() => { setActive(false) }} />
              <Cross2Icon className='cursor-pointer w-6 h-6 float-right' onClick={() => { setActive(false) }} />
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
                    className={`border-none rounded-none bg-slate-100 text-sm font-normal text-left ${activeId === p.id ? 'bg-slate-700 text-white' : 'hover:bg-slate-200'}`}
                  >{p.label}</NavElement>
                )
              })
            }
          </div>
        </>
        : <div className='flex flex-col gap-2 mt-4'>
          {
            sections?.map(p => {
              return (
                <NavElement
                  key={p.id}
                  path={path}
                  id={p.id}
                  navigable={urlNavigable ?? true}
                  onClick={() => { setActiveId(p.id) }}
                  className={'p-2 text-center border-none'}
                ><span className={`block w-4 h-4 rounded-full ${activeId === p.id ? 'bg-black' : 'bg-white border-2 border-slate-400'}`}>&nbsp;</span></NavElement>
              )
            })
          }

        </div>
    }
  </div>
}

export interface INavProps {
  sections: IFormSection[]
  sectionStatus: IFormSectionStatus
  level: number
  SubmitButton?: React.FC<{ formValues: IFormValues }> | ReactNode
}

export interface ITabLayoutProps {
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
  SubmitButton?: React.FC<{ formValues: IFormValues }> | ReactNode
}

export const ActiveTab = ({
  formSection,
  onChange,
  className = 'flex flex-col gap-2 grow h-full',
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
          ? <div className='mb-4'>
            <FieldLabel field={{
              ...formSection,
              description: null,
              label: formSection.description,
              type: 'text',
              settings: {
                descriptionPresentation: 'tooltip'
              }
            }}
              textClassName='font-normal'

            />

          </div>
          : ''
      }
      <FormSection formSection={formSection} onChange={onChange} level={level + 1} />
    </div>
  )
}

const TabLayout = (props: ITabLayoutProps): ReactElement => {
  if (props.sections === undefined) {
    return <></>
  }
  const { urlNavigable } = useFormContext()

  const url = new URL(window.location.href)
  const parts = url.pathname.split('/')
  const formParts = parts.slice(parts.length - props.level, parts.length)

  const params = (useParams()['*'] ?? '').split('/')
  const path = params.slice(0, props.level).join('/')
  const id = urlNavigable
    ? (params[props.level] && params[props.level] !== '') ? params[props.level] : (props.sections[0]?.id ?? null)
    : props.sections[0]?.id ?? null

  console.log(props)
  console.log('Form parts:', formParts, 'Level:', props.level, 'Params:', params.join(','))

  return (
    <FormSectionContextProvider path={path} id={id}>
      <TabLayoutContent {...props} />
    </FormSectionContextProvider>
  )
}

const TabLayoutContent = ({

  sections,
  onChange,
  inputOverrides,
  ContentComponent = ActiveTab,
  className = 'flex flex-row gap-8 grow',
  level
}: ITabLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }

  const { formValues } = useFormContext()
  const sectionStatus = calculateSectionStatus(sections, formValues)

  return (

    <div className={className}>
      <Tabs
        tabs={sections.map(s => {
          return {
            id: s.id,
            label: s.label ?? s.id,
            content: <ContentComponent
              formSection={s}
              onChange={onChange}
              sectionStatus={sectionStatus}
              level={level}
            />
          }
        })}
      />

    </div>
  )
}

export default TabLayout
