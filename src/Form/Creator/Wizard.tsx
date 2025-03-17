import { calculateSectionStatus } from ***REMOVED***@/Form/helpers***REMOVED***
import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IForm, type IFormSection, type IWizardStep } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type IPageLayoutProps, ActivePage } from ***REMOVED***@/Form/Creator/Page***REMOVED***
import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CaretRightIcon, CaretLeftIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***
import NavElement from ***REMOVED***@/Form/Creator/NavElement***REMOVED***
import { FormSectionContextProvider, useFormSectionContext } from ***REMOVED***@/Form/Creator/FormSectionContextProvider***REMOVED***

export const WizardNav = ({
  form,
  sections,
  sectionStatus,
  level
}: {
  form: IForm
  sections?: IFormSection[]
  sectionStatus: IFormSectionStatus
  level: number
}): ReactElement => {
  const steps = ((sections ?? []) as IWizardStep[]).sort((a, b) => a.order - b.order)
  const { activeId, setActiveId, path } = useFormSectionContext()

  return (
      <div className=***REMOVED***relative***REMOVED***>
        <div className=***REMOVED***h-[2px] top-5 bg-slate-300 absolute left-0 right-0 z-0***REMOVED*** />
        <div className=***REMOVED***flex flex-row gap-1***REMOVED***>
        {
        steps.map((p, i) => {
          return (
            <div key={p.id} className=***REMOVED***flex-grow first:flex-shrink last:flex-shrink text-center first:text-left first:ml-4 last:text-right last:mr-4 z-10 relative***REMOVED***>
              <NavElement
                path={path}
                id={p.id}
                navigable={form?.settings?.url_navigable ?? true}
                className={`px-8 bg-white z-20 border-none text-sm ${activeId === p.id ? ***REMOVED***bg-slate-600 text-white***REMOVED*** : ***REMOVED***hover:bg-slate-100***REMOVED***}`}
                onClick={() => { setActiveId(p.id) }}
              >
                {p.label}
              </NavElement>
              {
                i < steps.length - 1 && steps.length > 1
                  ? <span className=***REMOVED***hidden absolute right-0 top-2 w-4 h-full bg-white***REMOVED***><CaretRightIcon className=***REMOVED***w-4 h-6 fill-slate-300 stroke-slate-300***REMOVED*** /></span>
                  : ***REMOVED******REMOVED***
              }
              <p className=***REMOVED***text-xs mt-4***REMOVED***>{sectionStatus[p.id]?.completed} of {sectionStatus[p.id]?.total} total</p>
              <p className=***REMOVED***text-xs mt-2***REMOVED***>{sectionStatus[p.id]?.requiredCompleted} of {sectionStatus[p.id]?.requiredTotal} required</p>
            </div>
          )
        })
      }</div>
      </div>
  )
}

export const WizardNavSmall = ({
  form,
  sections,
  sectionStatus,
  level
}: {
  form: IForm
  sections?: IFormSection[]
  sectionStatus: IFormSectionStatus
  level: number
}): ReactElement => {
  const { activeId, setActiveId, path } = useFormSectionContext()
  const steps = ((sections ?? []) as IWizardStep[]).sort((a, b) => a.order - b.order)
  const stepsMap = Object.fromEntries(steps.map(p => [p.id, p]))
  const currentStep = stepsMap[activeId ?? ***REMOVED******REMOVED***] ?? steps[0]
  const currentIndex = steps.indexOf(currentStep)
  const nextIndex = currentIndex + 1
  const prevIndex = currentIndex - 1
  // const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  // const path = params.slice(0, level).join(***REMOVED***/***REMOVED***)
  return (
      <div className=***REMOVED***flex flex-row gap-4 justify-end***REMOVED***>{
        prevIndex >= 0
          ? <NavElement
              className=***REMOVED***px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700***REMOVED***
              path={path}
              id={steps[prevIndex].id}
              navigable={form?.settings?.url_navigable ?? true}
              onClick={() => { setActiveId(steps[prevIndex].id) }}
              >
                <CaretLeftIcon className=***REMOVED***inline***REMOVED*** /> Previous
            </NavElement>
          : <span className={utils.createButtonClass({
            className: ***REMOVED***px-4 bg-white border-none text-sm text-slate-400***REMOVED***
          })}>Previous</span>
        }
        {
          nextIndex < steps.length
            ? <NavElement
                path={path}
                id={steps[nextIndex].id}
                navigable={form?.settings?.url_navigable ?? true}
                className=***REMOVED***px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700***REMOVED***
                onClick={() => { setActiveId(steps[nextIndex].id) }}
                >
                  Next <CaretRightIcon className=***REMOVED***inline***REMOVED*** />
              </NavElement>
            : <span className={utils.createButtonClass({
              className: ***REMOVED***px-4 bg-white border-none text-sm text-slate-400***REMOVED***
            })}>Next</span>
        }
      </div>
  )
}

export interface IWizardLayoutProps extends IPageLayoutProps {
  SmallNavComponent?: React.FC<{
    form: IForm
    level: number
    sections?: IFormSection[]
    sectionStatus: IFormSectionStatus
    className?: string
  }>
}

const WizardLayout = ({
  form,
  sections,
  formValueState,
  onChange,
  ContentComponent = ActivePage,
  NavComponent = WizardNav,
  SmallNavComponent = WizardNavSmall,
  className = ***REMOVED***flex flex-col gap-16 pt-8***REMOVED***,
  inputOverrides,
  level
}: IWizardLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }
  const params = useParams()[***REMOVED*******REMOVED***]?.split(***REMOVED***/***REMOVED***)?.filter(d => d !== ***REMOVED******REMOVED***) ?? []
  const id = form?.settings?.url_navigable
    ? params[level] ?? sections[0]?.id ?? null
    : sections[0]?.id ?? null

  const formSection = sections?.find(s => s.id === id) ?? sections?.[0]
  const sectionStatus = calculateSectionStatus(sections, formValueState)

  return (
    <FormSectionContextProvider path={params.slice(0, level).join(***REMOVED***/***REMOVED***)} id={id}>
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
            sectionStatus={sectionStatus}
            onChange={onChange}
            level={level}
            />
        <SmallNavComponent
          form={form}
          sections={sections}
          sectionStatus={sectionStatus}
          level={level}
          />
      </div>
      </FormSectionContextProvider>
  )
}

export default WizardLayout
