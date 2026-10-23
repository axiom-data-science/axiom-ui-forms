import {
  FormNavigationDepthProvider,
  FormSectionContextProvider,
  useFormNavigationDepth,
  useFormSectionContext,
} from '@/Form/Creator/FormSectionContextProvider'
import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import { type IFormSection, type IFieldInputProps, IFormValues, type ICompositeValueType } from '@/Form/Creator/FormCreatorTypes'
import FormSection from '@/Form/Creator/FormSection'
import NavElement from '@/Form/Creator/NavElement'
import { calculateSectionStatus } from '@/utils/validators'
import { Cross2Icon, DropdownMenuIcon } from '@radix-ui/react-icons'
import React, { memo, ReactNode, useEffect, useState, type ReactElement } from 'react'
import { useFormContext, useFormValues } from '@/Form/Creator/FormContextProvider'
import { useFormUrlNavigation } from '@/Form/Creator/FormUrlNavigation'
import { useAtom } from 'jotai'
import layoutAtom from '@/utils/responsive/layoutState'
import { Button } from '@axdspub/axiom-ui-utilities'
import FieldLabel from '@/Form/Components/FieldLabel'
import { ScopedActiveSection } from '@/Form/Creator/TabLayout'
import { WizardNavSmall } from '@/Form/Creator/Wizard'
import { findSectionForFieldPath, useFieldNavigationRequest } from '@/Form/Creator/FieldNavigationContext'

const PageNav = ({
  sections,
  level
}: {
  sections?: IFormSection[]
  level: number
}): ReactElement => {
  const [layout] = useAtom(layoutAtom)
  const { activeId, setActiveId, urlNavigable } = useFormSectionContext()
  return (
    layout.size === 'sm' || layout.size === 'md'
      ? <PageNavMobile sections={sections} level={level} />
      : <div className='flex flex-col min-w-[20%] w-70 max-w-70 flex-none  border-slate-200'>{
        sections?.map(p => {
          return (
            <NavElement
              key={p.id}
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
  const { activeId, setActiveId, urlNavigable } = useFormSectionContext()

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

export interface IPageLayoutProps {
  sections?: IFormSection[]
  level: number
  ContentComponent?: React.FC<{
    level: number
    formSection?: IFormSection
    sectionStatus: IFormSectionStatus
  }>
  NavComponent?: React.FC<INavProps>
  className?: string
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
  SubmitButton?: React.FC<{ formValues: IFormValues }> | ReactNode
  scopedValue?: ICompositeValueType
  scopedOnChange?: (v: ICompositeValueType) => void,
    SmallNavComponent?: React.FC<{
      level: number
      sections?: IFormSection[]
      sectionStatus: IFormSectionStatus
      className?: string
      SubmitButton?: React.FC<{ formValues: IFormValues }> | ReactNode
    }>
}

export const ActivePage = ({
  formSection,
  className = 'flex flex-col gap-2 grow h-full max-w-full',
  level
}: {
  formSection?: IFormSection
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
                descriptionPresentation: 'tooltip',
                ...formSection.settings
              }
            }}
              textClassName={`${formSection?.settings?.boldDescription ? 'font-bold' : 'font-normal'}`}

            />

          </div>
          : ''
      }
      <FormSection formSection={formSection} level={level + 1} />
    </div>
  )
}

// Backwards compatibility alias - use ScopedActiveSection from TabLayout
export const ScopedActivePage = ScopedActiveSection

const PageLayout = (props: IPageLayoutProps): ReactElement => {
  if (props.sections === undefined) {
    return <></>
  }
  const { form, urlNavigable } = useFormContext()
  const navigationDepth = useFormNavigationDepth()
  const { getSectionId } = useFormUrlNavigation()
  const maxNestedDepth = form.settings?.url_navigation_depth ?? 1
  const canNavigateUrl = (urlNavigable ?? true) &&
    navigationDepth !== undefined &&
    navigationDepth <= maxNestedDepth
  const id = canNavigateUrl
    ? getSectionId(form.id, navigationDepth) ?? (props.sections[0]?.id ?? null)
    : props.sections[0]?.id ?? null

  return (
    <FormSectionContextProvider path="" id={id} formId={form.id} level={props.level} navigationDepth={navigationDepth} urlNavigable={canNavigateUrl}>
      <FormNavigationDepthProvider depth={navigationDepth === undefined ? undefined : navigationDepth + 1}>
        <PageLayoutContent {...props} />
      </FormNavigationDepthProvider>
    </FormSectionContextProvider>
  )
}

const PageLayoutContent = ({
  sections,
  inputOverrides,
  ContentComponent = ActivePage,
  NavComponent = PageNav,
  SmallNavComponent = WizardNavSmall,
  className = 'flex flex-row gap-8 grow max-w-full',
  level,
  SubmitButton,
  scopedValue,
  scopedOnChange
}: IPageLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }

  const formValues = useFormValues()
  const sectionStatus = calculateSectionStatus(sections, formValues)
  const { activeId, setActiveId } = useFormSectionContext()
  const navigationRequest = useFieldNavigationRequest()
  useEffect(() => {
    if (navigationRequest === undefined) return
    const targetSection = findSectionForFieldPath(sections, navigationRequest.path)
    if (targetSection !== undefined) {
      setActiveId(targetSection.id)
    }
  }, [sections, setActiveId, navigationRequest])
  const formSection = sections?.find(s => s.id === activeId) ?? sections?.[0]
  const useScoped = scopedValue !== undefined && scopedOnChange !== undefined

  return (
    <div className='flex flex-col gap-4 grow h-full'>
    <div className={className}>
      <NavComponent
        sections={sections}
        sectionStatus={sectionStatus}
        level={level}
      />
      {useScoped && formSection ? (
        <ScopedActivePage
          formSection={formSection}
          scopedValue={scopedValue}
          scopedOnChange={scopedOnChange}
          level={level}
        />
      ) : (
        <ContentComponent
          formSection={formSection}
          sectionStatus={sectionStatus}
          level={level}
        />
      )}
    </div>
    {
      level === 0 &&
    
      <SmallNavComponent
        sections={sections}
        sectionStatus={sectionStatus}
        level={level}
        SubmitButton={SubmitButton}
      />
    }
    </div>
  )
}

export default memo(PageLayout)
