import { FormSectionContextProvider, useFormSectionContext } from ***REMOVED***@/Form/Creator/FormSectionContextProvider***REMOVED***
import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormSection, type IValueChangeFn, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import NavElement from ***REMOVED***@/Form/Creator/NavElement***REMOVED***
import { calculateSectionStatus } from ***REMOVED***@/Form/helpers***REMOVED***
import { InfoCircledIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***
import { useFormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***

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
      <div className=***REMOVED***flex flex-col  w-[200px]  border-slate-200***REMOVED***>{
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
            ? <p className=***REMOVED***pb-4 border-b border-slate-200 text-sm***REMOVED***><InfoCircledIcon className=***REMOVED***inline-block***REMOVED*** /> {formSection.description}</p>
            : ***REMOVED******REMOVED***
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
  className = ***REMOVED***flex flex-row gap-8***REMOVED***,
  level
}: IPageLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }

  const { urlNavigable, setFormValues, formValues } = useFormContext()
  const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  const path = params.slice(0, level).join(***REMOVED***/***REMOVED***)
  const id = urlNavigable
    ? (params[level] && params[level] !== ***REMOVED******REMOVED***) ? params[level] : (sections[0]?.id ?? null)
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
