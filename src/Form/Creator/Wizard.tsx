import { calculateSectionStatus } from '@/Form/helpers'
import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import { type IForm, type IFormSection, type IWizardStep } from '@/Form/Creator/FormCreatorTypes'
import { type IPageLayoutProps, ActivePage } from '@/Form/Creator/Page'
import { utils } from '@axdspub/axiom-ui-utilities'
import { CaretRightIcon, CaretLeftIcon } from '@radix-ui/react-icons'
import React, { useContext, type ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import NavElement from '@/Form/Creator/NavElement'
import ActiveIdProvider, { ActiveIDContext } from '@/Form/Creator/ActiveIdProvider'

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
  const { activeId, setActiveId, path } = useContext(ActiveIDContext)

  return (
      <div className='relative'>
        <div className='h-[2px] top-5 bg-slate-300 absolute left-0 right-0 z-0' />
        <div className='flex flex-row gap-1'>
        {
        steps.map((p, i) => {
          return (
            <div key={p.id} className='flex-grow first:flex-shrink last:flex-shrink text-center first:text-left first:ml-4 last:text-right last:mr-4 z-10 relative'>
              <NavElement
                path={path}
                id={p.id}
                navigable={form?.settings?.url_navigable ?? true}
                className={`px-8 bg-white z-20 border-none text-sm ${activeId === p.id ? 'bg-slate-600 text-white' : 'hover:bg-slate-100'}`}
                onClick={() => { setActiveId?.(p.id) }}
              >
                {p.label}
              </NavElement>
              {
                i < steps.length - 1 && steps.length > 1
                  ? <span className='hidden absolute right-0 top-2 w-4 h-full bg-white'><CaretRightIcon className='w-4 h-6 fill-slate-300 stroke-slate-300' /></span>
                  : ''
              }
              <p className='text-xs mt-4'>{sectionStatus[p.id]?.completed} of {sectionStatus[p.id]?.total} total</p>
              <p className='text-xs mt-2'>{sectionStatus[p.id]?.requiredCompleted} of {sectionStatus[p.id]?.requiredTotal} required</p>
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
  const { activeId, setActiveId, path } = useContext(ActiveIDContext)
  const steps = ((sections ?? []) as IWizardStep[]).sort((a, b) => a.order - b.order)
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
              navigable={form?.settings?.url_navigable ?? true}
              onClick={() => { setActiveId?.(steps[prevIndex].id) }}
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
                onClick={() => { setActiveId?.(steps[nextIndex].id) }}
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
  const params = useParams()['*']?.split('/')?.filter(d => d !== '') ?? []
  const id = form?.settings?.url_navigable
    ? params[level] ?? sections[0]?.id ?? null
    : sections[0]?.id ?? null

  const formSection = sections?.find(s => s.id === id) ?? sections?.[0]
  const sectionStatus = calculateSectionStatus(sections, formValueState)

  return (
    <ActiveIdProvider path={params.slice(0, level).join('/')} id={id}>
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
      </ActiveIdProvider>
  )
}

export default WizardLayout
