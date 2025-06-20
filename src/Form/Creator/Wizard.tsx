import { calculateSectionStatus } from ***REMOVED***@/utils/validators***REMOVED***
import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormSection, type IWizardStep } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type IPageLayoutProps, ActivePage, type INavProps } from ***REMOVED***@/Form/Creator/Page***REMOVED***
import { SelectInput, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CaretRightIcon, CaretLeftIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***
import NavElement from ***REMOVED***@/Form/Creator/NavElement***REMOVED***
import { FormSectionContextProvider, useFormSectionContext } from ***REMOVED***@/Form/Creator/FormSectionContextProvider***REMOVED***
import { useFormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { useAtomValue } from ***REMOVED***jotai***REMOVED***
import layoutAtom from ***REMOVED***@/utils/responsive/layoutState***REMOVED***

const sortByOrder = (a: IWizardStep, b: IWizardStep): number => {
  const aOrder = a.order ?? Infinity
  const bOrder = b.order ?? Infinity
  return aOrder - bOrder
}

export const WizardNavMobile = ({
  sections,
  sectionStatus,
  level
}: INavProps): ReactElement => {
  const { activeId, setActiveId, path } = useFormSectionContext()
  const { urlNavigable } = useFormContext()
  const steps = ((sections ?? []) as IWizardStep[]).sort(sortByOrder)
  const stepsMap = Object.fromEntries(steps.map(p => [p.id, p]))
  const currentStep = stepsMap[activeId ?? ***REMOVED******REMOVED***] ?? steps[0]
  const currentIndex = steps.indexOf(currentStep)
  const nextIndex = currentIndex + 1
  const prevIndex = currentIndex - 1
  // const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  // const path = params.slice(0, level).join(***REMOVED***/***REMOVED***)
  return (
      <div className=***REMOVED***flex flex-row gap-4 justify-center items-center***REMOVED***>{
        prevIndex >= 0
          ? <NavElement
              className=***REMOVED***p-2 bg-none  border-none text-sm hover:bg-slate-none***REMOVED***
              path={path}
              id={steps[prevIndex].id}
              navigable={urlNavigable ?? true}
              onClick={() => { setActiveId(steps[prevIndex].id) }}
              >
                <CaretLeftIcon className=***REMOVED***inline w-8 h-8***REMOVED*** />
            </NavElement>
          : <span className={utils.createButtonClass({
            className: ***REMOVED***p-2 bg-none border-none text-sm text-slate-400 ***REMOVED***
          })}><CaretLeftIcon className=***REMOVED***inline w-8 h-8***REMOVED*** /></span>
        }
        <div className=***REMOVED***flex-grow***REMOVED***>
        <SelectInput
          includePrompt={false}
          id=***REMOVED***wizard-step-select***REMOVED***
          testId=***REMOVED***wizard-step-select***REMOVED***
          className=***REMOVED***shadow-lg***REMOVED***
          value={activeId ?? ***REMOVED******REMOVED***}
          onChange={(e) => {
            setActiveId(e?.value)
          }}
          options={steps.map(p => ({
            value: p.id,
            label: p.label ?? p.id
          }))}
          />
        </div>

        {
          nextIndex < steps.length
            ? <NavElement
                path={path}
                id={steps[nextIndex].id}
                navigable={urlNavigable ?? true}
                className=***REMOVED***p-2 bg-none  border-none text-sm hover:bg-none***REMOVED***
                onClick={() => { setActiveId(steps[nextIndex].id) }}
                >
                  <CaretRightIcon className=***REMOVED***inline w-8 h-8***REMOVED*** />
              </NavElement>
            : <span className={utils.createButtonClass({
              className: ***REMOVED***p-2 bg-none border-none text-sm text-slate-400***REMOVED***
            })}><CaretRightIcon className=***REMOVED***inline w-8 h-8***REMOVED*** /></span>
        }
      </div>
  )
}

export const WizardNav = (props: INavProps): ReactElement => {
  const layout = useAtomValue(layoutAtom)
  return layout.size === ***REMOVED***sm***REMOVED***
    ? <WizardNavMobile {...props} />
    : <WizardNavLargeScreen {...props} />
}

export const WizardNavLargeScreen = ({
  sections,
  sectionStatus,
  level
}: INavProps): ReactElement => {
  const { form } = useFormContext()
  const steps = ((sections ?? []) as IWizardStep[]).sort(sortByOrder)
  const { activeId, setActiveId, path } = useFormSectionContext()
  const { urlNavigable } = useFormContext()

  return (
      <div className=***REMOVED***relative z-0***REMOVED***>
        <div className=***REMOVED***h-[2px] top-8 bg-slate-300 absolute left-0 right-0 z-0***REMOVED*** />
        <div className=***REMOVED***flex flex-row gap-4 py-4  max-w-full overflow-x-auto overflow-y-visible***REMOVED***>
        {
        steps.map((p, i) => {
          return (
            <div key={p.id} className=***REMOVED***flex-grow first:flex-shrink last:flex-shrink text-center first:text-left first:ml-4 last:text-right last:mr-4 z-10 relative***REMOVED***>
              <NavElement

                path={path}
                id={p.id}
                navigable={urlNavigable ?? true}
                className={`whitespace-nowrap px-8 bg-white z-20 border-none text-sm ${activeId === p.id ? ***REMOVED***bg-slate-600 text-white***REMOVED*** : ***REMOVED***hover:bg-slate-100***REMOVED***}`}
                onClick={() => { setActiveId(p.id) }}
              >
                {p.label}
              </NavElement>
              {
                i < steps.length - 1 && steps.length > 1
                  ? <span className=***REMOVED***hidden absolute right-0 top-2 w-4 h-full bg-white***REMOVED***><CaretRightIcon className=***REMOVED***w-4 h-6 fill-slate-300 stroke-slate-300***REMOVED*** /></span>
                  : ***REMOVED******REMOVED***
              }
              {
                form?.settings?.show_progress
                  ? <>
                    <p className=***REMOVED***text-xs mt-4***REMOVED***>{sectionStatus[p.id]?.completed} of {sectionStatus[p.id]?.total} total</p>
                    <p className=***REMOVED***text-xs mt-2***REMOVED***>{sectionStatus[p.id]?.requiredCompleted} of {sectionStatus[p.id]?.requiredTotal} required</p>
                  </>
                  : ***REMOVED******REMOVED***
              }

            </div>
          )
        })
      }</div>
      </div>
  )
}

export const WizardNavSmall = ({
  sections,
  sectionStatus,
  level
}: {
  sections?: IFormSection[]
  sectionStatus: IFormSectionStatus
  level: number
}): ReactElement => {
  const { activeId, setActiveId, path } = useFormSectionContext()
  const { urlNavigable } = useFormContext()
  const steps = ((sections ?? []) as IWizardStep[]).sort(sortByOrder)
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
              navigable={urlNavigable ?? true}
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
                navigable={urlNavigable ?? true}
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
    level: number
    sections?: IFormSection[]
    sectionStatus: IFormSectionStatus
    className?: string
  }>
}

const WizardLayout = (props: IPageLayoutProps): ReactElement => {
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
      <WizardLayoutContent {...props} />
    </FormSectionContextProvider>
  )
}

const WizardLayoutContent = ({
  sections,
  onChange,
  ContentComponent = ActivePage,
  NavComponent = WizardNav,
  SmallNavComponent = WizardNavSmall,
  className = ***REMOVED***flex flex-col gap-4 pt-8 flex-grow h-full***REMOVED***,
  level
}: IWizardLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }
  const { formValues, setFormValues } = useFormContext()
  const { activeId } = useFormSectionContext()
  const formSection = sections?.find(s => s.id === activeId) ?? sections?.[0]
  const sectionStatus = calculateSectionStatus(sections, [formValues, setFormValues])

  return (

      <div className={className}>
        <NavComponent
            sections={sections}
            sectionStatus={sectionStatus}
            level={level}
          />
        <ContentComponent
            formSection={formSection}
            sectionStatus={sectionStatus}
            onChange={onChange}
            level={level}
            />
        <SmallNavComponent
          sections={sections}
          sectionStatus={sectionStatus}
          level={level}
          />
      </div>
  )
}

export default WizardLayout
