import ActiveIdProvider, { ActiveIDContext } from ***REMOVED***@/Form/Creator/ActiveIdProvider***REMOVED***
import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormValueState, type IForm, type IFormSection, type IValueChangeFn, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import NavElement from ***REMOVED***@/Form/Creator/NavElement***REMOVED***
import { calculateSectionStatus } from ***REMOVED***@/Form/helpers***REMOVED***
import { InfoCircledIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { useContext, type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***

const PageNav = ({
  form,
  sections,
  level
}: {
  form: IForm
  sections?: IFormSection[]
  level: number
}): ReactElement => {
  const { activeId, setActiveId, path } = useContext(ActiveIDContext)
  return (
      <div className=***REMOVED***flex flex-col  w-[200px]  border-slate-200***REMOVED***>{
        sections?.map(p => {
          return (
            <NavElement
              key={p.id}
              path={path}
              id={p.id}
              navigable={form?.settings?.url_navigable ?? true}
              onClick={() => { setActiveId?.(p.id) }}
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
    form: IForm
    level: number
    inputOverrides?: Record<string, React.FC<IFieldInputProps>>
    formSection?: IFormSection
    formValueState: IFormValueState
    onChange?: IValueChangeFn
    sectionStatus: IFormSectionStatus
  }>
  NavComponent?: React.FC<{
    form: IForm
    sections?: IFormSection[]
    sectionStatus: IFormSectionStatus
    level: number
  }>
  className?: string
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
}

export const ActivePage = ({
  form,
  formValueState,
  formSection,
  inputOverrides,
  onChange,
  className = ***REMOVED***flex flex-col gap-2 flex-grow***REMOVED***,
  level
}: {
  form: IForm
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
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
        <FormSection formSection={formSection} formValueState={formValueState} inputOverrides={inputOverrides} form={form} onChange={onChange} level={level + 1} />
      </div>
  )
}

const PageLayout = ({
  form,
  sections,
  formValueState,
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

  const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  const path = params.slice(0, level).join(***REMOVED***/***REMOVED***)
  const id = form?.settings?.url_navigable
    ? (params[level] && params[level] !== ***REMOVED******REMOVED***) ? params[level] : (sections[0]?.id ?? null)
    : sections[0]?.id ?? null
  const sectionStatus = calculateSectionStatus(sections, formValueState)
  const formSection = sections?.find(s => s.id === id) ?? sections?.[0]

  return (
      <ActiveIdProvider path={path} id={id}>
        <div className={className}>
          <NavComponent
            form={form}
            sections={sections}
            sectionStatus={sectionStatus}
            level={level}
            />
          <ContentComponent
            formSection={formSection}
            inputOverrides={inputOverrides}
            form={form}
            formValueState={formValueState}
            onChange={onChange}
            sectionStatus={sectionStatus}
            level={level}
            />
        </div>
      </ActiveIdProvider>
  )
}

export default PageLayout
