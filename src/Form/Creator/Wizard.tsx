import { calculateSectionStatus } from '@/utils/validators'
import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import { type IFormSection, type IWizardStep } from '@/Form/Creator/FormCreatorTypes'
import { type IPageLayoutProps, ActivePage, type INavProps } from '@/Form/Creator/Page'
import { SelectInput, utils } from '@axdspub/axiom-ui-utilities'
import { CaretRightIcon, CaretLeftIcon } from '@radix-ui/react-icons'
import React, { type ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import NavElement from '@/Form/Creator/NavElement'
import { FormSectionContextProvider, useFormSectionContext } from '@/Form/Creator/FormSectionContextProvider'
import { useFormContext } from '@/Form/Creator/FormContextProvider'
import { useAtomValue } from 'jotai'
import layoutAtom from '@/utils/responsive/layoutState'

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
  const currentStep = stepsMap[activeId ?? ''] ?? steps[0]
  const currentIndex = steps.indexOf(currentStep)
  const nextIndex = currentIndex + 1
  const prevIndex = currentIndex - 1
  // const params = (useParams()['*'] ?? '').split('/')
  // const path = params.slice(0, level).join('/')
  return (
      <div className='flex flex-row gap-4 justify-center items-center'>{
        prevIndex >= 0
          ? <NavElement
              className='p-2 bg-none  border-none text-sm hover:bg-slate-none'
              path={path}
              id={steps[prevIndex].id}
              navigable={urlNavigable ?? true}
              onClick={() => { setActiveId(steps[prevIndex].id) }}
              >
                <CaretLeftIcon className='inline w-8 h-8' />
            </NavElement>
          : <span className={utils.createButtonClass({
            className: 'p-2 bg-none border-none text-sm text-slate-400 '
          })}><CaretLeftIcon className='inline w-8 h-8' /></span>
        }
        <div className='flex-grow'>
        <SelectInput
          includePrompt={false}
          id='wizard-step-select'
          testId='wizard-step-select'
          className='shadow-lg'
          value={activeId ?? ''}
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
                className='p-2 bg-none  border-none text-sm hover:bg-none'
                onClick={() => { setActiveId(steps[nextIndex].id) }}
                >
                  <CaretRightIcon className='inline w-8 h-8' />
              </NavElement>
            : <span className={utils.createButtonClass({
              className: 'p-2 bg-none border-none text-sm text-slate-400'
            })}><CaretRightIcon className='inline w-8 h-8' /></span>
        }
      </div>
  )
}

export const WizardNav = (props: INavProps): ReactElement => {
  const layout = useAtomValue(layoutAtom)
  return layout.size === 'sm'
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
      <div className='relative'>
        <div className='h-[2px] top-8 bg-slate-300 absolute left-0 right-0 z-0' />
        <div className='flex flex-row gap-4 py-4  max-w-full overflow-x-auto overflow-y-visible'>
        {
        steps.map((p, i) => {
          return (
            <div key={p.id} className='flex-grow first:flex-shrink last:flex-shrink text-center first:text-left first:ml-4 last:text-right last:mr-4 z-10 relative'>
              <NavElement

                path={path}
                id={p.id}
                navigable={urlNavigable ?? true}
                className={`whitespace-nowrap px-8 bg-white z-20 border-none text-sm ${activeId === p.id ? 'bg-slate-600 text-white' : 'hover:bg-slate-100'}`}
                onClick={() => { setActiveId(p.id) }}
              >
                {p.label}
              </NavElement>
              {
                i < steps.length - 1 && steps.length > 1
                  ? <span className='hidden absolute right-0 top-2 w-4 h-full bg-white'><CaretRightIcon className='w-4 h-6 fill-slate-300 stroke-slate-300' /></span>
                  : ''
              }
              {
                form?.settings?.show_progress
                  ? <>
                    <p className='text-xs mt-4'>{sectionStatus[p.id]?.completed} of {sectionStatus[p.id]?.total} total</p>
                    <p className='text-xs mt-2'>{sectionStatus[p.id]?.requiredCompleted} of {sectionStatus[p.id]?.requiredTotal} required</p>
                  </>
                  : ''
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
  const currentStep = stepsMap[activeId ?? ''] ?? steps[0]
  const currentIndex = steps.indexOf(currentStep)
  const nextIndex = currentIndex + 1
  const prevIndex = currentIndex - 1
  // const params = (useParams()['*'] ?? '').split('/')
  // const path = params.slice(0, level).join('/')
  return (
      <div className='flex flex-row gap-4 justify-end'>{
        prevIndex >= 0
          ? <NavElement
              className='px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700'
              path={path}
              id={steps[prevIndex].id}
              navigable={urlNavigable ?? true}
              onClick={() => { setActiveId(steps[prevIndex].id) }}
              >
                <CaretLeftIcon className='inline' /> Previous
            </NavElement>
          : <span className={utils.createButtonClass({
            className: 'px-4 bg-white border-none text-sm text-slate-400'
          })}>Previous</span>
        }
        {
          nextIndex < steps.length
            ? <NavElement
                path={path}
                id={steps[nextIndex].id}
                navigable={urlNavigable ?? true}
                className='px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700'
                onClick={() => { setActiveId(steps[nextIndex].id) }}
                >
                  Next <CaretRightIcon className='inline' />
              </NavElement>
            : <span className={utils.createButtonClass({
              className: 'px-4 bg-white border-none text-sm text-slate-400'
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
  const params = (useParams()['*'] ?? '').split('/')
  const path = params.slice(0, props.level).join('/')
  const id = urlNavigable
    ? (params[props.level] && params[props.level] !== '') ? params[props.level] : (props.sections[0]?.id ?? null)
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
  className = 'flex flex-col gap-4 pt-8 flex-grow h-full',
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
