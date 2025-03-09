import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormValueState, type IForm, type IFormSection, type IValueChangeFn } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import NavElement from ***REMOVED***@/Form/Creator/NavElement***REMOVED***
import { calculateSectionStatus } from ***REMOVED***@/Form/helpers***REMOVED***
import { InfoCircledIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***

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
  const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  const path = params.slice(0, level).join(***REMOVED***/***REMOVED***)
  return (
      <div className=***REMOVED***flex flex-col  w-[200px]  border-slate-200***REMOVED***>{
        sections?.map(p => {
          return (
            <NavElement
              key={p.id}
              path={path}
              id={p.id}
              navigable={form?.settings?.url_navigable ?? true}
              onClick={() => { setActiveState(p.id) }}
              className={ `border-none rounded-none bg-slate-100 text-sm font-normal text-left ${activeId === p.id ? ***REMOVED***bg-slate-700 text-white***REMOVED*** : ***REMOVED***hover:bg-slate-200***REMOVED***}`}
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
  className = ***REMOVED***flex flex-col gap-2 flex-grow***REMOVED***,
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
            ? <p className=***REMOVED***pb-4 border-b border-slate-200 text-sm***REMOVED***><InfoCircledIcon className=***REMOVED***inline-block***REMOVED*** /> {formSection.description}</p>
            : ***REMOVED******REMOVED***
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
  className = ***REMOVED***flex flex-row gap-8***REMOVED***,
  level
}: IPageLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }

  const params = useParams()[***REMOVED*******REMOVED***]?.split(***REMOVED***/***REMOVED***) ?? []
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
  }, [useParams()[***REMOVED*******REMOVED***]])
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
