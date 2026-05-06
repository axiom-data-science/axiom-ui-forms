import { FormSectionContextProvider } from '@/Form/Creator/FormSectionContextProvider'
import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import { type IFormSection, type IValueChangeFn, type IFieldInputProps, IFormValues, type ICompositeValueType } from '@/Form/Creator/FormCreatorTypes'
import FormSection from '@/Form/Creator/FormSection'
import { calculateSectionStatus } from '@/utils/validators'
import React, { memo, ReactNode, type ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { useFormContext, useFormValues } from '@/Form/Creator/FormContextProvider'
import { Tabs } from '@axdspub/axiom-ui-utilities'
import FieldLabel from '@/Form/Components/FieldLabel'
import FormFields from '@/Form/Creator/FormFields'
import { cloneObject } from '@/utils/manipulators'
import FieldCreator from '@/Form/Components/FieldCreator'




export interface ITabLayoutProps {
  sections?: IFormSection[]
  level: number
  ContentComponent?: React.FC<{
    level: number
    formSection?: IFormSection
    sectionStatus: IFormSectionStatus
  }>
  className?: string
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
  SubmitButton?: React.FC<{ formValues: IFormValues }> | ReactNode
  scopedValue?: ICompositeValueType
  scopedOnChange?: (v: ICompositeValueType) => void
}

export const ActiveTab = ({
  formSection,
  className = 'flex flex-col gap-2 grow h-full',
  level
}: {
  formSection?: IFormSection
  className?: string
  level: number
}): ReactElement => {
  return (
    <div className={className}>
      {
        formSection?.description !== undefined
          ? <div className='mb-4'>
            <FieldLabel field={{
              ...formSection,
              description: null,
              label: formSection.description,
              type: 'text',
              settings: {
                descriptionPresentation: 'tooltip'
              }
            }}
              textClassName='font-normal'

            />

          </div>
          : ''
      }
      <FormSection formSection={formSection} level={level + 1} />
    </div>
  )
}

export const ScopedActiveTab = ({
  formSection,
  scopedValue,
  scopedOnChange,
  className = 'flex flex-col gap-2 grow h-full',
  level
}: {
  formSection?: IFormSection
  scopedValue: ICompositeValueType
  scopedOnChange: (v: ICompositeValueType) => void
  className?: string
  level: number
}): ReactElement => {
  return (
    <div className={className}>
      {
        formSection?.description !== undefined
          ? <div className='mb-4'>
            <FieldLabel field={{
              ...formSection,
              description: null,
              label: formSection.description,
              type: 'text',
              settings: {
                descriptionPresentation: 'tooltip'
              }
            }}
              textClassName='font-normal'
            />
          </div>
          : ''
      }
      <div className={level === 0 ? 'flex flex-col gap-8' : 'flex flex-col gap-4'}>
        {(formSection?.fields ?? []).map(field => (
          <FieldCreator
            key={field.id}
            field={field}
            value={scopedValue[field.id] ?? null}
            onChange={(v: any) => {
              const newValue = cloneObject(scopedValue)
              newValue[field.id] = v
              scopedOnChange(newValue)
            }}
          />
        ))}
      </div>
    </div>
  )
}

const TabLayout = (props: ITabLayoutProps): ReactElement => {
  if (props.sections === undefined) {
    return <></>
  }
  const { urlNavigable } = useFormContext()

  const url = new URL(window.location.href)
  const parts = url.pathname.split('/')
  const formParts = parts.slice(parts.length - props.level, parts.length)

  const params = (useParams()['*'] ?? '').split('/')
  const path = params.slice(0, props.level).join('/')
  const id = urlNavigable
    ? (params[props.level] && params[props.level] !== '') ? params[props.level] : (props.sections[0]?.id ?? null)
    : props.sections[0]?.id ?? null

  return (
    <FormSectionContextProvider path={path} id={id}>
      <TabLayoutContent {...props} />
    </FormSectionContextProvider>
  )
}

const TabLayoutContent = ({
  sections,
  inputOverrides,
  ContentComponent = ActiveTab,
  className = 'flex flex-row gap-8 grow',
  level,
  scopedValue,
  scopedOnChange
}: ITabLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }

  const formValues = useFormValues()
  const sectionStatus = calculateSectionStatus(sections, formValues)

  // If scopedValue/scopedOnChange are provided, use ScopedActiveTab instead
  const EffectiveContentComponent = (scopedValue !== undefined && scopedOnChange !== undefined)
    ? (props: any) => (
      <ScopedActiveTab
        {...props}
        scopedValue={scopedValue}
        scopedOnChange={scopedOnChange}
      />
    )
    : ContentComponent

  return (
    <div className={className}>
      <Tabs
        tabs={sections.map(s => {
          return {
            id: s.id,
            label: s.label ?? s.id,
            content: <EffectiveContentComponent
              formSection={s}
              sectionStatus={sectionStatus}
              level={level}
            />
          }
        })}
      />
    </div>
  )
}

export default memo(TabLayout)
