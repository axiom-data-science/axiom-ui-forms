import { calculateSectionStatus } from '@/Form/helpers'
import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import { type IForm, type IFormSection, type IWizardStep } from '@/Form/Creator/FormCreatorTypes'
import { type IPageLayoutProps, ActivePage } from '@/Form/Creator/Page'
import { utils } from '@axdspub/axiom-ui-utilities'
import { CaretRightIcon, CaretLeftIcon } from '@radix-ui/react-icons'
import React, { useEffect, useState, type ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import NavElement from '@/Form/Creator/NavElement'

export const WizardNav = ({
  form,
  activeIdState,
  sections,
  sectionStatus,
  level
}: {
  form: IForm
  activeIdState: [string | null, (v: string | null) => void]
  sections?: IFormSection[]
  sectionStatus: IFormSectionStatus
  level: number
}): ReactElement => {
  const steps = ((sections ?? []) as IWizardStep[]).sort((a, b) => a.order - b.order)
  const params = (useParams()['*'] ?? '').split('/')
  const path = params.slice(0, level).join('/')
  const [activeId, setActiveId] = activeIdState
  return (
      <div className='flex flex-row gap-1 justify-evenly relative align-middle'>
        <div className='h-[2px] -m-[1px] top-3 bg-slate-300 absolute left-0 right-0 z-0' />
        {
        steps.map((p, i) => {
          return (
            <div key={p.id} className='flex-grow text-center z-10 relative'>
              <NavElement
                path={path}
                id={p.id}
                navigable={form?.settings?.url_navigable ?? true}
                className={`px-8 bg-white z-20 border-none text-sm ${activeId === p.id ? 'bg-slate-600 text-white' : 'hover:bg-slate-100'}`}
                onClick={() => { setActiveId(p.id) }}
              >
                {p.label}
              </NavElement>
              {
                i < steps.length - 1 && steps.length > 1
                  ? <span className='absolute right-0 w-4 h-full bg-white'><CaretRightIcon className='w-4 h-6 fill-slate-300 stroke-slate-300' /></span>
                  : ''
              }
              <p className='text-xs text-center mt-4'>{sectionStatus[p.id]?.completed} of {sectionStatus[p.id]?.total} total</p>
              <p className='text-xs text-center mt-2'>{sectionStatus[p.id]?.requiredCompleted} of {sectionStatus[p.id]?.requiredTotal} required</p>
            </div>
          )
        })
      }</div>
  )
}

export const WizardNavSmall = ({
  form,
  activeIdState,
  sections,
  sectionStatus,
  level
}: {
  form: IForm
  activeIdState: [string | null, (v: string | null) => void]
  sections?: IFormSection[]
  sectionStatus: IFormSectionStatus
  level: number
}): ReactElement => {
  const [activeId, setActiveId] = activeIdState
  const steps = ((sections ?? []) as IWizardStep[]).sort((a, b) => a.order - b.order)
  const stepsMap = Object.fromEntries(steps.map(p => [p.id, p]))
  const currentStep = stepsMap[activeId ?? ''] ?? steps[0]
  const currentIndex = steps.indexOf(currentStep)
  const nextIndex = currentIndex + 1
  const prevIndex = currentIndex - 1
  const params = (useParams()['*'] ?? '').split('/')
  const path = params.slice(0, level).join('/')
  return (
      <div className='flex flex-row gap-4 justify-end'>{
        prevIndex >= 0
          ? <NavElement
              className='px-4 bg-slate-600 text-white border-none text-sm hover:bg-slate-700'
              path={path}
              id={steps[prevIndex].id}
              navigable={form?.settings?.url_navigable ?? true}
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
                navigable={form?.settings?.url_navigable ?? true}
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
    form: IForm
    level: number
    sections?: IFormSection[]
    activeIdState: [string | null, (v: string | null) => void]
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
  className = 'flex flex-col gap-16 pt-8',
  inputOverrides,
  level
}: IWizardLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }
  const params = useParams()['*']?.split('/') ?? []
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
  }, [useParams()['*']])

  return (
      <div className={className}>
        <NavComponent
            form={form}
            sections={sections}
            activeIdState={activeIdState}
            sectionStatus={sectionStatus}
            level={level}
          />
        <ContentComponent
            activeIdState={activeIdState}
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
          activeIdState={activeIdState}
          sectionStatus={sectionStatus}
          level={level}
          />
      </div>
  )
}

export default WizardLayout
