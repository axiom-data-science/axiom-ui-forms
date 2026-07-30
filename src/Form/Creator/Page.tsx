import { FormSectionContextProvider, useFormSectionContext } from ***REMOVED***@/Form/Creator/FormSectionContextProvider***REMOVED***
import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormSection, type IFieldInputProps, IFormValues, type ICompositeValueType } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import NavElement from ***REMOVED***@/Form/Creator/NavElement***REMOVED***
import { calculateSectionStatus } from ***REMOVED***@/utils/validators***REMOVED***
import { Cross2Icon, DropdownMenuIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { memo, ReactNode, useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***
import { useFormContext, useFormValues } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import layoutAtom from ***REMOVED***@/utils/responsive/layoutState***REMOVED***
import { Button } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { ScopedActiveSection } from ***REMOVED***@/Form/Creator/TabLayout***REMOVED***
import { WizardNavSmall } from ***REMOVED***@/Form/Creator/Wizard***REMOVED***

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
    layout.size === ***REMOVED***sm***REMOVED*** || layout.size === ***REMOVED***md***REMOVED***
      ? <PageNavMobile sections={sections} level={level} />
      : <div className=***REMOVED***flex flex-col min-w-[20%] w-70 max-w-70 flex-none  border-slate-200***REMOVED***>{
        sections?.map(p => {
          return (
            <NavElement
              key={p.id}
              path={path}
              id={p.id}
              navigable={urlNavigable ?? true}
              onClick={() => { setActiveId(p.id) }}
              className={`border-none rounded-none bg-slate-100 text-sm font-normal justify-start whitespace-break-spaces py-2 h-auto ${activeId === p.id ? ***REMOVED***bg-slate-700 hover:bg-slate-800 text-white hover:text-white ***REMOVED*** : ***REMOVED***hover:bg-slate-200***REMOVED***}`}
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

  return <div className=***REMOVED***relative***REMOVED***><Button
    type=***REMOVED***default***REMOVED***
    size=***REMOVED***sm***REMOVED***
    className=***REMOVED***bg-none  border-none p-2***REMOVED***
    onClick={() => {
      setActive(!active)
    }}
  >
    <div className=***REMOVED***-mr-6 -ml-2***REMOVED***>{
      active
        ? <Cross2Icon className=***REMOVED***inline***REMOVED*** />
        : <DropdownMenuIcon className=***REMOVED***inline w-8 h-8 rotate-180***REMOVED*** />
    }
    </div>
  </Button>

    {
      active
        ? <><div className=***REMOVED***bg-slate-400 bg-opacity-40 fixed top-0 left-0 right-0 bottom-0 z-40***REMOVED*** onClick={() => { setActive(false) }}></div>
          <div className=***REMOVED***fixed left-0 top-0 bottom-0 flex flex-col bg-white z-50 w-[60%] gap-2 p-4 shadow-lg animate-slide-in***REMOVED***>
            <div>
              <DropdownMenuIcon className=***REMOVED***float-left cursor-pointer w-8 h-8***REMOVED*** onClick={() => { setActive(false) }} />
              <Cross2Icon className=***REMOVED***cursor-pointer w-6 h-6 float-right***REMOVED*** onClick={() => { setActive(false) }} />
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
                    className={`border-none rounded-none bg-slate-100 text-sm font-normal text-left ${activeId === p.id ? ***REMOVED***bg-slate-700 text-white***REMOVED*** : ***REMOVED***hover:bg-slate-200***REMOVED***}`}
                  >{p.label}</NavElement>
                )
              })
            }
          </div>
        </>
        : <div className=***REMOVED***flex flex-col gap-2 mt-4***REMOVED***>
          {
            sections?.map(p => {
              return (
                <NavElement
                  key={p.id}
                  path={path}
                  id={p.id}
                  navigable={urlNavigable ?? true}
                  onClick={() => { setActiveId(p.id) }}
                  className={***REMOVED***p-2 text-center border-none***REMOVED***}
                ><span className={`block w-4 h-4 rounded-full ${activeId === p.id ? ***REMOVED***bg-black***REMOVED*** : ***REMOVED***bg-white border-2 border-slate-400***REMOVED***}`}>&nbsp;</span></NavElement>
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
  className = ***REMOVED***flex flex-col gap-2 grow h-full max-w-full***REMOVED***,
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
          ? <div className=***REMOVED***mb-4***REMOVED***>
            <FieldLabel field={{
              ...formSection,
              description: null,
              label: formSection.description,
              type: ***REMOVED***text***REMOVED***,
              settings: {
                descriptionPresentation: ***REMOVED***tooltip***REMOVED***,
                ...formSection.settings
              }
            }}
              textClassName={`${formSection?.settings?.boldDescription ? ***REMOVED***font-bold***REMOVED*** : ***REMOVED***font-normal***REMOVED***}`}

            />

          </div>
          : ***REMOVED******REMOVED***
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
  const { urlNavigable } = useFormContext()

  const url = new URL(window.location.href)
  const parts = url.pathname.split(***REMOVED***/***REMOVED***)
  const formParts = parts.slice(parts.length - props.level, parts.length)

  const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  const path = params.slice(0, props.level).join(***REMOVED***/***REMOVED***)
  const id = urlNavigable
    ? (params[props.level] && params[props.level] !== ***REMOVED******REMOVED***) ? params[props.level] : (props.sections[0]?.id ?? null)
    : props.sections[0]?.id ?? null

  return (
    <FormSectionContextProvider path={path} id={id}>
      <PageLayoutContent {...props} />
    </FormSectionContextProvider>
  )
}

const PageLayoutContent = ({
  sections,
  inputOverrides,
  ContentComponent = ActivePage,
  NavComponent = PageNav,
  SmallNavComponent = WizardNavSmall,
  className = ***REMOVED***flex flex-row gap-8 grow max-w-full***REMOVED***,
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
  const { activeId } = useFormSectionContext()
  const formSection = sections?.find(s => s.id === activeId) ?? sections?.[0]
  const useScoped = scopedValue !== undefined && scopedOnChange !== undefined

  return (
    <div className=***REMOVED***flex flex-col gap-4 grow h-full***REMOVED***>
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
