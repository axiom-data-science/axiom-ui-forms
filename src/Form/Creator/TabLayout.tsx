import { FormSectionContextProvider } from ***REMOVED***@/Form/Creator/FormSectionContextProvider***REMOVED***
import { type IFormSectionStatus } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormSection, type IValueChangeFn, type IFieldInputProps, IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import { calculateSectionStatus } from ***REMOVED***@/utils/validators***REMOVED***
import React, { ReactNode, type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***
import { useFormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { Tabs } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***




export interface ITabLayoutProps {
  sections?: IFormSection[]
  onChange?: IValueChangeFn
  level: number
  ContentComponent?: React.FC<{
    level: number
    formSection?: IFormSection
    onChange?: IValueChangeFn
    sectionStatus: IFormSectionStatus
  }>
  className?: string
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
  SubmitButton?: React.FC<{ formValues: IFormValues }> | ReactNode
}

export const ActiveTab = ({
  formSection,
  onChange,
  className = ***REMOVED***flex flex-col gap-2 grow h-full***REMOVED***,
  level
}: {
  formSection?: IFormSection
  onChange?: IValueChangeFn
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
      <FormSection formSection={formSection} onChange={onChange} level={level + 1} />
    </div>
  )
}

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

  console.log(props)
  console.log(***REMOVED***Form parts:***REMOVED***, formParts, ***REMOVED***Level:***REMOVED***, props.level, ***REMOVED***Params:***REMOVED***, params.join(***REMOVED***,***REMOVED***))

  return (
    <FormSectionContextProvider path={path} id={id}>
      <TabLayoutContent {...props} />
    </FormSectionContextProvider>
  )
}

const TabLayoutContent = ({

  sections,
  onChange,
  inputOverrides,
  ContentComponent = ActiveTab,
  className = ***REMOVED***flex flex-row gap-8 grow***REMOVED***,
  level
}: ITabLayoutProps): ReactElement => {
  if (sections === undefined) {
    return <></>
  }

  const { formValues } = useFormContext()
  const sectionStatus = calculateSectionStatus(sections, formValues)

  return (

    <div className={className}>
      <Tabs
        tabs={sections.map(s => {
          return {
            id: s.id,
            label: s.label ?? s.id,
            content: <ContentComponent
              formSection={s}
              onChange={onChange}
              sectionStatus={sectionStatus}
              level={level}
            />
          }
        })}
      />

    </div>
  )
}

export default TabLayout
