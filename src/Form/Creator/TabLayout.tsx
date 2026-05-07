import { FormSectionContextProvider } from ***REMOVED***@/Form/Creator/FormSectionContextProvider***REMOVED***
import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormSection, type IValueChangeFn, type IFieldInputProps, IFormValues, type ICompositeValueType } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import { calculateSectionStatus } from ***REMOVED***@/utils/validators***REMOVED***
import React, { memo, ReactNode, type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***
import { useFormContext, useFormValues } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { Tabs } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import FormFields from ***REMOVED***@/Form/Creator/FormFields***REMOVED***
import { cloneObject } from ***REMOVED***@/utils/manipulators***REMOVED***
import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***




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
  className = ***REMOVED***flex flex-col gap-2 grow h-full***REMOVED***,
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
          ? <div className=***REMOVED***mb-4***REMOVED***>
            <FieldLabel field={{
              ...formSection,
              description: null,
              label: formSection.description,
              type: ***REMOVED***text***REMOVED***,
              settings: {
                descriptionPresentation: ***REMOVED***tooltip***REMOVED***
              }
            }}
              textClassName=***REMOVED***font-normal***REMOVED***

            />

          </div>
          : ***REMOVED******REMOVED***
      }
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
export const ScopedActiveSection = memo(({
  formSection,
  scopedValue,
  scopedOnChange,
  className = ***REMOVED***flex flex-col gap-2 grow h-full***REMOVED***,
  level
}: IScopedActiveTabProps): ReactElement => {
  return (
    <div className={className}>
      {
        formSection?.description !== undefined
          ? <div className=***REMOVED***mb-4***REMOVED***>
            <FieldLabel field={{
              ...formSection,
              description: null,
              label: formSection.description,
              type: ***REMOVED***text***REMOVED***,
              settings: {
                descriptionPresentation: ***REMOVED***tooltip***REMOVED***
              }
            }}
              textClassName=***REMOVED***font-normal***REMOVED***
            />
          </div>
          : ***REMOVED******REMOVED***
      }
      <div className={level === 0 ? ***REMOVED***flex flex-col gap-8***REMOVED*** : ***REMOVED***flex flex-col gap-4***REMOVED***}>
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
})

// Backwards compatibility alias
export const ScopedActiveTab = ScopedActiveSection

const TabLayout = (props: ITabLayoutProps): ReactElement => {
  if (props.sections === undefined) {
    return <></>
  }
  const { urlNavigable } = useFormContext()

  const url = new URL(window.location.href)
  const parts = url.pathname.split(***REMOVED***/***REMOVED***)
  const formParts = parts.slice(parts.length - props.level, parts.length)

  const params = (useParams()[***REMOVED*******REMOVED***] ?? ***REMOVED******REMOVED***).split(***REMOVED***/***REMOVED***)
  const path = params.slice(0, props.level).join(***REMOVED***/***REMOVED***)
  const id = urlNavigable
    ? (params[props.level] && params[props.level] !== ***REMOVED******REMOVED***) ? params[props.level] : (props.sections[0]?.id ?? null)
    : props.sections[0]?.id ?? null

  return (
    <FormSectionContextProvider path={path} id={id}>
      <TabLayoutContent {...props} />
    </FormSectionContextProvider>
  )
}

const ScopedTabContentWrapper = memo(({
  formSection,
  sectionStatus,
  level,
  scopedValue,
  scopedOnChange
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
})

const RegularTabContentWrapper = memo(({
  formSection,
  sectionStatus,
  level,
  ContentComponent
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
    <ContentComponent
      formSection={formSection}
      sectionStatus={sectionStatus}
      level={level}
    />
  )
})

const TabLayoutContent = ({
  sections,
  inputOverrides,
  ContentComponent = ActiveTab,
  className = ***REMOVED***flex flex-row gap-8 grow***REMOVED***,
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
  const useScoped = scopedValue !== undefined && scopedOnChange !== undefined

  return (
    <div className={className}>
      <Tabs
        tabs={sections.map(s => {
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
            )
          }
        })}
      />
    </div>
  )
}

export default memo(TabLayout)
