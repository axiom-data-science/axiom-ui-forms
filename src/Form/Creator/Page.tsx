import { FormSectionContextProvider, useFormSectionContext } from ***REMOVED***@/Form/Creator/FormSectionContextProvider***REMOVED***
import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormSection, type IValueChangeFn, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import NavElement from ***REMOVED***@/Form/Creator/NavElement***REMOVED***
import { calculateSectionStatus } from ***REMOVED***@/utils/validators***REMOVED***
import { Cross2Icon, DropdownMenuIcon, InfoCircledIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***
import { useFormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import InlineMarkdown from ***REMOVED***@/Form/Components/InlineMarkdown***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import layoutAtom from ***REMOVED***@/utils/responsive/layoutState***REMOVED***
import { Button } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***

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
      : <div className=***REMOVED***flex flex-col w-[200px]  border-slate-200***REMOVED***>{
        sections?.map(p => {
          return (
            <NavElement
              key={p.id}
              path={path}
              id={p.id}
              navigable={urlNavigable ?? true}
              onClick={() => { setActiveId(p.id) }}
              className={ `border-none rounded-none bg-slate-100 text-sm font-normal text-left ${activeId === p.id ? ***REMOVED***bg-slate-700 text-white***REMOVED*** : ***REMOVED***hover:bg-slate-200***REMOVED***}`}
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
                      className={ `border-none rounded-none bg-slate-100 text-sm font-normal text-left ${activeId === p.id ? ***REMOVED***bg-slate-700 text-white***REMOVED*** : ***REMOVED***hover:bg-slate-200***REMOVED***}`}
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
  className = ***REMOVED***flex flex-col gap-2 flex-grow***REMOVED***,
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
            ? <p className=***REMOVED*** text-sm***REMOVED***><InfoCircledIcon className=***REMOVED***inline -mt-1***REMOVED*** /> <InlineMarkdown>{formSection.description}</InlineMarkdown></p>
            : ***REMOVED******REMOVED***
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
  onChange,
  inputOverrides,
  ContentComponent = ActivePage,
  NavComponent = PageNav,
  className = ***REMOVED***flex flex-row gap-8***REMOVED***,
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
