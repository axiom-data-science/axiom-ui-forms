import { calculateSectionStatus } from ***REMOVED***@/utils/validators***REMOVED***
import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import {
  IFormValues,
  type IFormSection,
  type IWizardStep,
  type ICompositeValueType,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type IPageLayoutProps, ActivePage, type INavProps } from ***REMOVED***@/Form/Creator/Page***REMOVED***
import { SelectInput, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CaretRightIcon, CaretLeftIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { ReactNode, type ReactElement, memo } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***
import NavElement from ***REMOVED***@/Form/Creator/NavElement***REMOVED***
import {
  FormSectionContextProvider,
  useFormSectionContext,
} from ***REMOVED***@/Form/Creator/FormSectionContextProvider***REMOVED***
import { useFormContext, useFormValues } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { useAtomValue } from ***REMOVED***jotai***REMOVED***
import layoutAtom from ***REMOVED***@/utils/responsive/layoutState***REMOVED***
import { ScopedActiveSection } from ***REMOVED***@/Form/Creator/TabLayout***REMOVED***

const sortByOrder = (a: IWizardStep, b: IWizardStep): number => {
  const aOrder = a.order ?? Infinity
  const bOrder = b.order ?? Infinity
  return aOrder - bOrder
}

export const WizardNavMobile = ({
  sections,
  sectionStatus,
  level,
  SubmitButton,
}: INavProps): ReactElement => {
  const { activeId, setActiveId, path } = useFormSectionContext()
  const { urlNavigable } = useFormContext()
  const steps = ((sections ?? []) as IWizardStep[]).sort(sortByOrder)
  const stepsMap = Object.fromEntries(steps.map((p) => [p.id, p]))
  const currentStep = stepsMap[activeId ?? ***REMOVED******REMOVED***] ?? steps[0]
  const currentIndex = steps.indexOf(currentStep)
  const nextIndex = currentIndex + 1
  const prevIndex = currentIndex - 1
  // const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  // const path = params.slice(0, level).join(***REMOVED***/***REMOVED***)
  return (
    <>
      <div className="flex flex-row gap-4 justify-center items-center">
        {prevIndex >= 0 ? (
          <NavElement
            className="p-2 bg-none  border-none text-sm hover:bg-slate-none"
            path={path}
            id={steps[prevIndex].id}
            navigable={urlNavigable ?? true}
            onClick={() => {
              setActiveId(steps[prevIndex].id)
            }}
          >
            <CaretLeftIcon className="inline w-8 h-8" />
          </NavElement>
        ) : (
          <span
            className={utils.createButtonClass({
              className: ***REMOVED***p-2 bg-none border-none text-sm text-slate-400 ***REMOVED***,
            })}
          >
            <CaretLeftIcon className="inline w-8 h-8" />
          </span>
        )}
        <div className="grow">
          <SelectInput
            includePrompt={false}
            id="wizard-step-select"
            clearable={false}
            testId="wizard-step-select"
            className="shadow-lg"
            value={activeId ?? ***REMOVED******REMOVED***}
            onChange={(e) => {
              setActiveId(e?.value !== undefined ? String(e.value) : undefined)
            }}
            options={steps.map((p) => ({
              value: p.id,
              label: p.label ?? p.id,
            }))}
          />
        </div>

        {nextIndex < steps.length ? (
          <NavElement
            path={path}
            id={steps[nextIndex].id}
            navigable={urlNavigable ?? true}
            className="p-2 bg-none  border-none text-sm hover:bg-none"
            onClick={() => {
              setActiveId(steps[nextIndex].id)
            }}
          >
            <CaretRightIcon className="inline w-8 h-8" />
          </NavElement>
        ) : (
          <span
            className={utils.createButtonClass({
              className: ***REMOVED***p-2 bg-none border-none text-sm text-slate-400***REMOVED***,
            })}
          >
            <CaretRightIcon className="inline w-8 h-8" />
          </span>
        )}
      </div>
      {typeof SubmitButton === ***REMOVED***function***REMOVED*** ? (
        <SubmitButton formValues={useFormValues()} />
      ) : (
        SubmitButton
      )}
    </>
  )
}

export const WizardNav = (props: INavProps): ReactElement => {
  const layout = useAtomValue(layoutAtom)
  return layout.size === ***REMOVED***sm***REMOVED*** ? <WizardNavMobile {...props} /> : <WizardNavLargeScreen {...props} />
}

export const WizardNavLargeScreen = ({
  sections,
  sectionStatus,
  level,
  SubmitButton,
}: INavProps): ReactElement => {
  const { form } = useFormContext()
  const steps = ((sections ?? []) as IWizardStep[]).sort(sortByOrder)
  const { activeId, setActiveId, path } = useFormSectionContext()
  const { urlNavigable } = useFormContext()

  return (
    <div className="relative z-0">
      <div className="h-0.5 top-8 bg-slate-300 absolute left-0 right-0 z-0" />
      <div className="flex flex-row gap-4 py-4  max-w-full overflow-x-auto overflow-y-visible">
        {steps.map((p, i) => {
          return (
            <div
              key={p.id}
              className="grow first:shrink last:shrink text-center first:text-left first:ml-4 last:text-right last:mr-4 z-10 relative"
            >
              <NavElement
                path={path}
                id={p.id}
                navigable={urlNavigable ?? true}
                className={`whitespace-nowrap px-8 bg-white z-20 border-none text-sm ${activeId === p.id ? ***REMOVED***bg-slate-600 text-white***REMOVED*** : ***REMOVED***hover:bg-slate-100***REMOVED***}`}
                onClick={() => {
                  setActiveId(p.id)
                }}
              >
                {p.label}
              </NavElement>
              {i < steps.length - 1 && steps.length > 1 ? (
                <span className="hidden absolute right-0 top-2 w-4 h-full bg-white">
                  <CaretRightIcon className="w-4 h-6 fill-slate-300 stroke-slate-300" />
                </span>
              ) : (
                ***REMOVED******REMOVED***
              )}
              {form?.settings?.show_progress ? (
                <div className="flex flex-col gap-2 text-xs">
                  <p>
                    {sectionStatus[p.id]?.completed} of {sectionStatus[p.id]?.total} total
                  </p>
                  <p>
                    {sectionStatus[p.id]?.requiredCompleted} of {sectionStatus[p.id]?.requiredTotal}{***REMOVED*** ***REMOVED***}
                    required
                  </p>
                </div>
              ) : (
                ***REMOVED******REMOVED***
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const WizardNavSmall = ({
  sections,
  sectionStatus,
  level,
  SubmitButton,
  defaultClassName = ***REMOVED***flex flex-row gap-4 justify-end  p-4 mt-10 sticky bottom-0 bg-white/80 z-10***REMOVED***,
  className
}: {
  sections?: IFormSection[]
  sectionStatus: IFormSectionStatus
  level: number
  SubmitButton?: React.FC<{ formValues: IFormValues }> | ReactNode
  defaultClassName?: string
  className?: string
}): ReactElement => {
  const { activeId, setActiveId, path } = useFormSectionContext()
  const { urlNavigable } = useFormContext()
  const steps = ((sections ?? []) as IWizardStep[]).sort(sortByOrder)
  const stepsMap = Object.fromEntries(steps.map((p) => [p.id, p]))
  const currentStep = stepsMap[activeId ?? ***REMOVED******REMOVED***] ?? steps[0]
  const currentIndex = steps.indexOf(currentStep)
  const nextIndex = currentIndex + 1
  const prevIndex = currentIndex - 1
  // const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  // const path = params.slice(0, level).join(***REMOVED***/***REMOVED***)
  return (
    <div className={utils.makeClassName({
      defaultClassName,
      className
    })}>
      {prevIndex >= 0 ? (
        <NavElement
          className="px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700 hover:text-white"
          path={path}
          id={steps[prevIndex].id}
          navigable={urlNavigable ?? true}
          onClick={() => {
            setActiveId(steps[prevIndex].id)
          }}
        >
          <CaretLeftIcon className="inline" /> Previous
        </NavElement>
      ) : (
        <span
          className={utils.createButtonClass({
            className: ***REMOVED***px-4 bg-white border-none text-sm text-slate-400***REMOVED***,
          })}
        >
          Previous
        </span>
      )}
      {nextIndex < steps.length ? (
        <NavElement
          path={path}
          id={steps[nextIndex].id}
          navigable={urlNavigable ?? true}
          className="px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700 hover:text-white"
          onClick={() => {
            setActiveId(steps[nextIndex].id)
          }}
        >
          Next <CaretRightIcon className="inline" />
        </NavElement>
      ) : (
        <span
          className={utils.createButtonClass({
            className: ***REMOVED***px-4 bg-white border-none text-sm text-slate-400***REMOVED***,
          })}
        >
          Next
        </span>
      )}
      {typeof SubmitButton === ***REMOVED***function***REMOVED*** ? (
        <SubmitButton formValues={useFormValues()} />
      ) : (
        SubmitButton
      )}
    </div>
  )
}

export interface IWizardLayoutProps extends IPageLayoutProps {

}

const WizardLayout = (props: IPageLayoutProps): ReactElement => {
  if (props.sections === undefined) {
    return <></>
  }
  const { urlNavigable } = useFormContext()
  const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  const path = params.slice(0, props.level).join(***REMOVED***/***REMOVED***)
  const id = urlNavigable
    ? params[props.level] && params[props.level] !== ***REMOVED******REMOVED***
      ? params[props.level]
      : (props.sections[0]?.id ?? null)
    : (props.sections[0]?.id ?? null)

  return (
    <FormSectionContextProvider path={path} id={id}>
      <WizardLayoutContent {...props} />
    </FormSectionContextProvider>
  )
}

const WizardLayoutContent = ({
  sections,
  ContentComponent = ActivePage,
  NavComponent = WizardNav,
  SmallNavComponent = WizardNavSmall,
  className = ***REMOVED***flex flex-col gap-4 pt-8 grow h-full***REMOVED***,
  level,
  SubmitButton,
  scopedValue,
  scopedOnChange,
}: IWizardLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }
  const formValues = useFormValues()
  const { activeId } = useFormSectionContext()
  const formSection = sections?.find((s) => s.id === activeId) ?? sections?.[0]
  const sectionStatus = calculateSectionStatus(sections, formValues)
  const useScoped = scopedValue !== undefined && scopedOnChange !== undefined

  return (
    <div className={className}>
      <NavComponent
        sections={sections}
        sectionStatus={sectionStatus}
        level={level}
        SubmitButton={SubmitButton}
      />
      {useScoped && formSection ? (
        <ScopedActiveSection
          formSection={formSection}
          scopedValue={scopedValue}
          scopedOnChange={scopedOnChange}
          level={level}
        />
      ) : (
        <ContentComponent formSection={formSection} sectionStatus={sectionStatus} level={level} />
      )}
      <SmallNavComponent
        sections={sections}
        sectionStatus={sectionStatus}
        level={level}
        SubmitButton={SubmitButton}
      />
    </div>
  )
}

export default WizardLayout
