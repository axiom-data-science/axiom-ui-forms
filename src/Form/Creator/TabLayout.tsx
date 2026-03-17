import { FormSectionContextProvider } from '@/Form/Creator/FormSectionContextProvider'
import { type IFormSectionStatus } from '@/Form/Creator/FormCreator'
import { type IFormSection, type IValueChangeFn, type IFieldInputProps, IFormValues } from '@/Form/Creator/FormCreatorTypes'
import FormSection from '@/Form/Creator/FormSection'
import { calculateSectionStatus } from '@/utils/validators'
import React, { ReactNode, type ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { useFormContext } from '@/Form/Creator/FormContextProvider'
import { Tabs } from '@axdspub/axiom-ui-utilities'
import FieldLabel from '@/Form/Components/FieldLabel'




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
  className = 'flex flex-col gap-2 grow h-full',
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
  onChange,
  inputOverrides,
  ContentComponent = ActiveTab,
  className = 'flex flex-row gap-8 grow',
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
