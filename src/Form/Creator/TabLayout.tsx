import { FormSectionContextProvider } from '@/Form/Creator/FormSectionContextProvider'
import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import {
  type IFormSection,
  type IValueChangeFn,
  type IFieldInputProps,
  IFormValues,
  type ICompositeValueType,
} from '@/Form/Creator/FormCreatorTypes'
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
import { getLayoutClassName } from '@/utils/layoutHelpers'

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
  level,
}: {
  formSection?: IFormSection
  className?: string
  level: number
}): ReactElement => {
  return (
    <div className={className}>
      {formSection?.description !== undefined ? (
        <div className="mb-4">
          <FieldLabel
            field={{
              ...formSection,
              description: null,
              label: formSection.description,
              type: 'text',
              settings: {
                descriptionPresentation: 'tooltip',
              },
            }}
            textClassName="font-normal"
          />
        </div>
      ) : (
        ''
      )}
      <FormSection formSection={formSection} level={level + 1} />
    </div>
  )
}

interface IScopedActiveTabProps {
  formSection?: IFormSection
  scopedValue: ICompositeValueType
  scopedOnChange: (v: ICompositeValueType) => void
  className?: string
  level: number
}

/**
 * Generic scoped section component - renders fields with scoped value/onChange
 * Used by TabLayout, Page, and WizardLayout when embedding sections in objects
 */
export const ScopedActiveSection = memo(
  ({
    formSection,
    scopedValue,
    scopedOnChange,
    className = 'flex flex-col gap-2 grow h-full',
    level,
  }: IScopedActiveTabProps): ReactElement => {
    const fieldLayoutClass = getLayoutClassName((formSection as any)?.layout)

    return (
      <div className={className}>
        {formSection?.description !== undefined ? (
          <div className="mb-4">
            <FieldLabel
              field={{
                ...formSection,
                description: null,
                label: formSection.description,
                type: 'text',
                settings: {
                  descriptionPresentation: 'tooltip',
                },
              }}
              textClassName="font-normal"
            />
          </div>
        ) : (
          ''
        )}
        <div className={fieldLayoutClass}>
          {(formSection?.fields ?? []).map((field) => {
            // For skip_path fields (objectWrapper or object with skip_path=true),
            // pass the entire scoped value and handle onChange to merge back
            const isSkipPath = field.type === 'objectWrapper' || (field as any).skip_path === true

            return (
              <FieldCreator
                key={field.id}
                field={field}
                value={isSkipPath ? scopedValue : (scopedValue[field.id] ?? null)}
                onChange={(v: any) => {
                  if (isSkipPath) {
                    // For skip_path fields, v is the entire merged object
                    scopedOnChange(v)
                  } else {
                    // For normal fields, nest the value under field.id
                    const newValue = cloneObject(scopedValue)
                    newValue[field.id] = v
                    scopedOnChange(newValue)
                  }
                }}
              />
            )
          })}
        </div>
      </div>
    )
  }
)

// Backwards compatibility alias
export const ScopedActiveTab = ScopedActiveSection

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
    ? params[props.level] && params[props.level] !== ''
      ? params[props.level]
      : (props.sections[0]?.id ?? null)
    : (props.sections[0]?.id ?? null)

  return (
    <FormSectionContextProvider path={path} id={id}>
      <TabLayoutContent {...props} />
    </FormSectionContextProvider>
  )
}

const ScopedTabContentWrapper = memo(
  ({
    formSection,
    sectionStatus,
    level,
    scopedValue,
    scopedOnChange,
  }: {
    formSection?: IFormSection
    sectionStatus: IFormSectionStatus
    level: number
    scopedValue: ICompositeValueType
    scopedOnChange: (v: ICompositeValueType) => void
  }): ReactElement => {
    return (
      <ScopedActiveTab
        formSection={formSection}
        scopedValue={scopedValue}
        scopedOnChange={scopedOnChange}
        level={level}
      />
    )
  }
)

const RegularTabContentWrapper = memo(
  ({
    formSection,
    sectionStatus,
    level,
    ContentComponent,
  }: {
    formSection?: IFormSection
    sectionStatus: IFormSectionStatus
    level: number
    ContentComponent: React.FC<{
      level: number
      formSection?: IFormSection
      sectionStatus: IFormSectionStatus
    }>
  }): ReactElement => {
    return (
      <ContentComponent formSection={formSection} sectionStatus={sectionStatus} level={level} />
    )
  }
)

const TabLayoutContent = ({
  sections,
  inputOverrides,
  ContentComponent = ActiveTab,
  className = 'flex flex-row gap-8 grow',
  level,
  scopedValue,
  scopedOnChange,
  SubmitButton,
}: ITabLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }

  const formValues = useFormValues()
  const sectionStatus = calculateSectionStatus(sections, formValues)

  // If scopedValue/scopedOnChange are provided, use ScopedActiveTab instead
  const useScoped = scopedValue !== undefined && scopedOnChange !== undefined

  return (
    <>
    <div className={className}>
      <Tabs
        className="w-full"
        tabNavClassName="border-b-0"
        activeTabNavClassName="border-b-2 border-slate-400"
        navClassName="w-full border-b border-slate-300"
        tabs={sections.map((s) => {
          return {
            id: s.id,
            label: s.label ?? s.id,
            content: useScoped ? (
              <ScopedTabContentWrapper
                formSection={s}
                sectionStatus={sectionStatus}
                level={level}
                scopedValue={scopedValue}
                scopedOnChange={scopedOnChange}
              />
            ) : (
              <RegularTabContentWrapper
                formSection={s}
                sectionStatus={sectionStatus}
                level={level}
                ContentComponent={ContentComponent}
              />
            ),
          }
        })}
      />
    </div>
        {SubmitButton && (
          <div className='flex flex-row gap-4 justify-end  p-4 mt-10 sticky bottom-0 bg-white/80 z-10'>
            {typeof SubmitButton === 'function' ? (
              <SubmitButton formValues={useFormValues()} />
            ) : (
              SubmitButton
            )}
          </div>
        )}
    </>
  )
}

export default memo(TabLayout)
