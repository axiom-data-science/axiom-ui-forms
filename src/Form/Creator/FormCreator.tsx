'use client'

import { FormStableContext, FormValuesContext, IFormContextValue, useFormValues } from '@/Form/Creator/FormContextProvider'
import { type IFormValues, type IForm, type IFormSection, type IFormField, type IValueChangeFn, type IFieldInputProps, type IFormOverride, type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'
import FormHeader from '@/Form/Creator/FormHeader'
import FormSection from '@/Form/Creator/FormSection'
import { copyAndAddPathToFields } from '@/utils/manipulators'
import layoutAtom, { getWindowSize } from '@/utils/responsive/layoutState'
import { overridesAndSchemaToFormObject, schemaToFormObject, ensureObjectWrappersHaveSkipPath } from '@/utils/schemaToFormHelpers'
import { calculateSectionStatus } from '@/utils/validators'
import { seedNestedDefaults } from '@/utils/formEngine'
import { formHasNestedNavigation } from '@/utils/formEngine/hasNestedNavigation'
import { Loader, utils } from '@axdspub/axiom-ui-utilities'
import { ErrorBoundary } from 'react-error-boundary'
import { useAtom } from 'jotai'
import { type JSONSchema6 } from 'json-schema'
import debounce from 'lodash-es/debounce'
import React, { type ReactNode, useContext, type ReactElement, useState, useEffect, useMemo, useCallback } from 'react'
import errorRenderer from '@/utils/errorRenderer'

export interface IFormCreatorProps {
  form: IForm
  schema?: JSONSchema6
  formValueState?: [IFormValues, (v: IFormValues) => void]
  initialFormValues?: IFormValues
  note?: string
  error?: string
  onChange?: IValueChangeFn
  className?: string
  defaultClassName?: string
  urlNavigable?: boolean
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
  Header?: React.FC<{ formValues: IFormValues }> | ReactNode
  Footer?: React.FC<{ formValues: IFormValues }> | ReactNode
  SubmitButton?: React.FC<{ formValues: IFormValues }> | ReactNode
}


const FormComponentWrap = ({ Component }: { Component: React.FC<IFormContextValue> }): ReactElement => {
  const stableCtx = useContext(FormStableContext)
  const formValues = useFormValues()
  return <Component {...stableCtx} formValues={formValues} />
}

const FormStatus = (): ReactElement => {
  const { form } = useContext(FormStableContext)
  const formValues = useFormValues()
  if (form.settings?.show_progress === false) {
    return <></>
  }

  const status = calculateSectionStatus([form], formValues)

  return (
    <div className='flex flex-col gap-2 text-xs'>
      <p>{status[form.id]?.completed} of {status[form.id]?.total} total</p>
      <p>{status[form.id]?.requiredCompleted} of {status[form.id]?.requiredTotal} required</p>
    </div>
  )
}


export const SchemaFormCreator = ({
  label,
  id,
  schema,
  formOverrides,
  formFieldOverrides,
  ...props
}: Omit<IFormCreatorProps, 'form'> & {
  id?: string
  label?: string
  schema: JSONSchema6
  formOverrides?: IFormOverride[]
  formFieldOverrides?: IFormFieldOverride[][]
}): ReactElement => {
  const form = useMemo(() => {
    const f = formOverrides === undefined && formFieldOverrides === undefined
      ? schemaToFormObject(schema)
      : overridesAndSchemaToFormObject({ formOverrides, formFieldOverrides, schema })
    if (id !== undefined) f.id = id
    if (label !== undefined) f.label = label
    return f
  }, [schema, formOverrides, formFieldOverrides, id, label])

  return (
    <>{  
      form !== undefined
        ? <FormCreator form={form} {...props} />
        : <div className='p-5 bg-slate-200 text-xs'><Loader className='pt-20' /></div>
    }</>
  )
}

const seedFormValuesWithDefaults = (form: IForm): IFormValues => {
  const formValues: IFormValues = {}

  const gatherSectionFields = (section: IFormSection): IFormField[] => {
    const direct = section.fields ?? []
    const fromPages = (section.pages ?? []).flatMap(p => gatherSectionFields(p))
    const fromWizard = (section.wizard_steps ?? []).flatMap(ws => gatherSectionFields(ws))
    const fromTabs = (section.tabs ?? []).flatMap(t => gatherSectionFields(t))
    return [...direct, ...fromPages, ...fromWizard, ...fromTabs]
  }

  seedNestedDefaults(gatherSectionFields(form), formValues, { rootFormValues: formValues })

  return formValues
}

const FormCreator = ({
  form,
  formValueState,
  note,
  error,
  onChange,
  className,
  defaultClassName = 'flex flex-col gap-8 flex-grow',
  urlNavigable = true,
  inputOverrides,
  schema,
  Footer,
  Header,
  SubmitButton,
  initialFormValues
}: IFormCreatorProps): ReactElement => {
  const activeForm = useMemo(() => {
    const af = copyAndAddPathToFields(ensureObjectWrappersHaveSkipPath(form))
    // Disable URL navigation if form has nested pages or wizard_steps (these don't support URL nav)
    // This includes both top-level and embedded within object/objectList fields
    const hasNestedNavigation = formHasNestedNavigation(af)
    af.settings = { url_navigable: hasNestedNavigation ? false : urlNavigable, ...af.settings }
    return af
  }, [form, urlNavigable])

  const [formValues, setFormValues] = formValueState ?? useState<IFormValues>(() => ({
    ...seedFormValuesWithDefaults(activeForm),
    ...initialFormValues
  }))

  const [layout, setLayout] = useAtom(layoutAtom)
  const updateLayoutValue = useCallback((): void => {
    const newSize = getWindowSize()
    if (layout.size !== newSize) {
      setLayout({ size: newSize })
    }
  }, [layout.size, setLayout])

  useEffect(() => {
    const debounceUpdateLayout = debounce(updateLayoutValue, 200)
    window.addEventListener('resize', debounceUpdateLayout)

    return () => {
      window.removeEventListener('resize', debounceUpdateLayout)
      debounceUpdateLayout.cancel()
    }
  }, [updateLayoutValue])

  // Stable context value — only changes when form definition or config changes, not on keystroke
  const stableCtxValue = useMemo(() => ({
    form: activeForm,
    setFormValues,
    onChange,
    inputOverrides,
    schema,
    urlNavigable: activeForm.settings?.url_navigable
  }), [activeForm, setFormValues, onChange, inputOverrides, schema])

  return (
    <ErrorBoundary fallbackRender={errorRenderer}>
    <FormStableContext.Provider value={stableCtxValue}>
      <FormValuesContext.Provider value={formValues}>
        {typeof Header === 'function' ? <FormComponentWrap Component={Header} /> : Header ?? ''}
        <div className={utils.makeClassName({
          className: activeForm?.settings?.class_name,
          defaultClassName,
          extras: [className]
        })}>
          <FormHeader form={activeForm} note={note} error={error} />
          {
            activeForm?.fields !== undefined && activeForm.fields.length > 0 && activeForm.pages === undefined && activeForm.wizard_steps === undefined && activeForm.tabs === undefined
              ? <FormStatus />
              : ''
          }
          <FormSection
            formSection={activeForm}
            SubmitButton={SubmitButton}
          />
        </div>
        {typeof Footer === 'function' ? <FormComponentWrap Component={Footer} /> : Footer ?? ''}
      </FormValuesContext.Provider>
    </FormStableContext.Provider>
    </ErrorBoundary>
  )
}

export type IFormSectionStatus = Record<string, {
  completed: number
  total: number
  requiredTotal: number
  requiredCompleted: number
  valid: boolean
}>

export default FormCreator
