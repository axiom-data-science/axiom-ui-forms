import { calculateSectionStatus } from ***REMOVED***@/Form/helpers***REMOVED***
import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IForm, type IFormSection, type IWizardStep } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type IPageLayoutProps, ActivePage } from ***REMOVED***@/Form/Creator/Page***REMOVED***
import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CaretRightIcon, CaretLeftIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams, Link } from ***REMOVED***react-router-dom***REMOVED***

export const WizardNav = ({
  form,
  activeId,
  sections,
  sectionStatus,
  level
}: {
  form: IForm
  activeId: string | null
  sections?: IFormSection[]
  sectionStatus: IFormSectionStatus
  level: number
}): ReactElement => {
  const steps = ((sections ?? []) as IWizardStep[]).sort((a, b) => a.order - b.order)
  const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  const path = params.slice(0, level).join(***REMOVED***/***REMOVED***)
  return (
      <div className=***REMOVED***flex flex-row gap-1 justify-evenly relative align-middle***REMOVED***>
        <div className=***REMOVED***h-[2px] -m-[1px] top-3 bg-slate-300 absolute left-0 right-0 z-0***REMOVED*** />
        {
        steps.map((p, i) => {
          return (
            <div key={p.id} className=***REMOVED***flex-grow text-center z-10 relative***REMOVED***>
              <Link to={`${path !== ***REMOVED******REMOVED*** ? `${path}/` : ***REMOVED******REMOVED***}${p.id}`} className={`${utils.createButtonClass({
                className: `px-8 bg-white z-20 border-none text-sm ${activeId === p.id ? ***REMOVED***bg-slate-600 text-white***REMOVED*** : ***REMOVED***hover:bg-slate-100***REMOVED***}`
              })}`} type=***REMOVED***default***REMOVED***>{p.label}</Link>
              {
                i < steps.length - 1 && steps.length > 1
                  ? <span className=***REMOVED***absolute right-0 w-4 h-full bg-white***REMOVED***><CaretRightIcon className=***REMOVED***w-4 h-6 fill-slate-300 stroke-slate-300***REMOVED*** /></span>
                  : ***REMOVED******REMOVED***
              }
              <p className=***REMOVED***text-xs text-center mt-4***REMOVED***>{sectionStatus[p.id]?.completed} of {sectionStatus[p.id]?.total} total</p>
              <p className=***REMOVED***text-xs text-center mt-2***REMOVED***>{sectionStatus[p.id]?.requiredCompleted} of {sectionStatus[p.id]?.requiredTotal} required</p>
            </div>
          )
        })
      }</div>
  )
}

export const WizardNavSmall = ({
  form,
  activeId,
  sections,
  sectionStatus,
  level
}: {
  form: IForm
  activeId: string | null
  sections?: IFormSection[]
  sectionStatus: IFormSectionStatus
  level: number
}): ReactElement => {
  const steps = ((sections ?? []) as IWizardStep[]).sort((a, b) => a.order - b.order)
  const stepsMap = Object.fromEntries(steps.map(p => [p.id, p]))
  const currentStep = stepsMap[activeId ?? ***REMOVED******REMOVED***] ?? steps[0]
  const currentIndex = steps.indexOf(currentStep)
  const nextIndex = currentIndex + 1
  const prevIndex = currentIndex - 1
  const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  const path = params.slice(0, level).join(***REMOVED***/***REMOVED***)
  return (
      <div className=***REMOVED***flex flex-row gap-4 justify-end***REMOVED***>{
        prevIndex >= 0
          ? <Link to={`${path !== ***REMOVED******REMOVED*** ? `${path}/` : ***REMOVED******REMOVED***}${steps[prevIndex].id}`} className={utils.createButtonClass({
            className: ***REMOVED***px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700***REMOVED***
          })} type=***REMOVED***default***REMOVED***><CaretLeftIcon className=***REMOVED***inline***REMOVED*** /> Previous</Link>
          : <span className={utils.createButtonClass({
            className: ***REMOVED***px-4 bg-white border-none text-sm text-slate-400***REMOVED***
          })}>Previous</span>
        }
        {
          nextIndex < steps.length
            ? <Link to={`${path !== ***REMOVED******REMOVED*** ? `${path}/` : ***REMOVED******REMOVED***}${steps[nextIndex].id}`} className={utils.createButtonClass({
              className: ***REMOVED***px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700***REMOVED***
            })} type=***REMOVED***default***REMOVED***>Next <CaretRightIcon className=***REMOVED***inline***REMOVED*** /></Link>
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
    activeId: string | null
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
  level
}: IWizardLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }
  const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  const activeId = params[level] ?? sections?.[0]?.id ?? null
  const [sectionStatus, setSectionStatus] = useState<IFormSectionStatus>(calculateSectionStatus(sections, formValueState))
  useEffect(() => {
    setSectionStatus(calculateSectionStatus(sections, formValueState))
  }, [formValueState, sections])

  const formSection = sections?.find(s => s.id === activeId) ?? sections?.[0]

  return (
      <div className={className}>
        <NavComponent
            form={form}
            sections={sections}
            activeId={activeId}
            sectionStatus={sectionStatus}
            level={level}
          />
        <ContentComponent
            activeId={activeId}
            formSection={formSection}
            form={form}
            formValueState={formValueState}
            sectionStatus={sectionStatus}
            onChange={onChange}
            level={level}
            />
        <SmallNavComponent
          form={form}
          sections={sections}
          activeId={activeId}
          sectionStatus={sectionStatus}
          level={level}
          />
      </div>
  )
}

export default WizardLayout
