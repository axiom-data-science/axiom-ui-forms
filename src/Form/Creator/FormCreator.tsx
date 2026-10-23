'use client'

import { FormStableContext, FormValuesContext, IFormContextValue, useFormValues } from '@/Form/Creator/FormContextProvider'
import { type IFormValues, type IForm, type IFormSection, type IFormField, type IValueChangeFn, type IFieldInputProps, type IFormOverride, type IFormFieldOverride, IFormCreatorHandle } from '@/Form/Creator/FormCreatorTypes'
import FormHeader from '@/Form/Creator/FormHeader'
import FormSection from '@/Form/Creator/FormSection'
import { copyAndAddPathToFields } from '@/utils/manipulators'
import layoutAtom, { getWindowSize } from '@/utils/responsive/layoutState'
import { overridesAndSchemaToFormObject, schemaToFormObject, ensureObjectWrappersHaveSkipPath } from '@/utils/schemaToFormHelpers'
import { calculateSectionStatus } from '@/utils/validators'
import { seedNestedDefaults } from '@/utils/formEngine'
import { Loader, utils } from '@axdspub/axiom-ui-utilities'
import { ErrorBoundary } from 'react-error-boundary'
import { useAtom } from 'jotai'
import { type JSONSchema6 } from 'json-schema'
import debounce from 'lodash-es/debounce'
import isEqual from 'lodash-es/isEqual'
import React, { type ReactNode, useContext, type ReactElement, useState, useEffect, useMemo, useCallback, useImperativeHandle, useRef } from 'react'
import errorRenderer from '@/utils/errorRenderer'
import { FieldNavigationProvider, fieldPathsMatch, type IFieldNavigationRequest } from './FieldNavigationContext'
import { getFieldsFromFormSection, makeJsonPath } from '@/utils/getters'
import { FormNavigationDepthProvider } from './FormSectionContextProvider'



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
  urlNavigationDepth?: number
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


export const SchemaFormCreator = React.forwardRef<IFormCreatorHandle, Omit<IFormCreatorProps, 'form'> & {
  id?: string
  label?: string
  schema: JSONSchema6
  formOverrides?: IFormOverride[]
  formFieldOverrides?: IFormFieldOverride[][]
}>(({
  label,
  id,
  schema,
  formOverrides,
  formFieldOverrides,
  ...props
}, ref): ReactElement => {
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
        ? <FormCreator ref={ref} form={form} {...props} />
        : <div className='p-5 bg-slate-200 text-xs'><Loader className='pt-20' /></div>
    }</>
  )
})

SchemaFormCreator.displayName = 'SchemaFormCreator'

const seedFormValuesWithDefaults = (form: IForm): IFormValues => {
  const formValues: IFormValues = {}

  const gatherSectionFields = (section: IFormSection | IForm): IFormField[] => {
    const direct = section.fields ?? []
    const fromPages = (section.pages ?? []).flatMap(p => gatherSectionFields(p))
    const fromWizard = (section.wizard_steps ?? []).flatMap(ws => gatherSectionFields(ws))
    const fromTabs = (section.tabs ?? []).flatMap(t => gatherSectionFields(t))
    return [...direct, ...fromPages, ...fromWizard, ...fromTabs]
  }

  seedNestedDefaults(gatherSectionFields(form), formValues, { rootFormValues: formValues })

  return formValues
}

const FormCreator = React.forwardRef<IFormCreatorHandle, IFormCreatorProps>(({
  form,
  formValueState,
  note,
  error,
  onChange,
  className,
  defaultClassName = 'flex flex-col gap-8 grow',
  urlNavigable = true,
  urlNavigationDepth,
  inputOverrides,
  schema,
  Footer,
  Header,
  SubmitButton,
  initialFormValues
}: IFormCreatorProps, ref): ReactElement => {
  const activeForm = useMemo(() => {
    const af = copyAndAddPathToFields(ensureObjectWrappersHaveSkipPath(form))
    const navigationDepth = urlNavigationDepth ?? af.settings?.url_navigation_depth ?? 1
    if (!Number.isInteger(navigationDepth) || navigationDepth < 0) {
      throw new Error('urlNavigationDepth must be a non-negative integer')
    }
    af.settings = {
      ...af.settings,
      url_navigable: af.settings?.url_navigable ?? urlNavigable,
      url_navigation_depth: navigationDepth
    }
    return af
  }, [form, urlNavigable, urlNavigationDepth])

  const [formValues, setFormValues] = formValueState ?? useState<IFormValues>(() => ({
    ...seedFormValuesWithDefaults(activeForm),
    ...initialFormValues
  }))
  const [navigationRequest, setNavigationRequest] = useState<IFieldNavigationRequest | undefined>()
  const navigationRequestId = useRef(0)
  const formElementRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    jumpToField: async (path: string): Promise<boolean> => {
      const fieldExists = getFieldsFromFormSection(activeForm).some((field) => {
        const fieldPath = makeJsonPath(field)
        return fieldPath !== undefined && fieldPathsMatch(fieldPath, path)
      })
      if (!fieldExists || formElementRef.current === null) {
        return false
      }

      const nextRequest = { path, requestId: ++navigationRequestId.current }

      return await new Promise<boolean>((resolve) => {
        const root = formElementRef.current
        if (root === null) {
          resolve(false)
          return
        }

        let timeoutId: number
        const observer = new MutationObserver(() => findAndNavigate())
        const finish = (success: boolean): void => {
          observer.disconnect()
          window.clearTimeout(timeoutId)
          resolve(success)
        }
        const findAndNavigate = (): void => {
          const fieldElement = Array.from(root.querySelectorAll<HTMLElement>('[data-field-path]'))
            .find((element) => element.dataset.fieldPath === path)
          if (fieldElement === undefined) {
            return
          }

          fieldElement.scrollIntoView?.({ block: 'center', behavior: 'smooth' })
          fieldElement.classList.remove('ring-4', 'ring-amber-400', 'ring-offset-2', 'animate-pulse')
          void fieldElement.offsetWidth
          fieldElement.classList.add('ring-4', 'ring-amber-400', 'ring-offset-2', 'animate-pulse')
          window.setTimeout(() => {
            fieldElement.classList.remove('ring-4', 'ring-amber-400', 'ring-offset-2', 'animate-pulse')
          }, 1800)
          const focusTarget = fieldElement.querySelector<HTMLElement>(
            'input:not([type="hidden"]), textarea, select, button, [tabindex]:not([tabindex="-1"])'
          )
          focusTarget?.focus({ preventScroll: true })
          finish(true)
        }

        observer.observe(root, { childList: true, subtree: true })
        timeoutId = window.setTimeout(() => finish(false), 2000)
        setNavigationRequest(nextRequest)
        findAndNavigate()
      })
    }
  }), [activeForm])

  useEffect(() => {
    const valuesWithDefaults = {
      ...seedFormValuesWithDefaults(activeForm),
      ...formValues,
    }

    if (!isEqual(valuesWithDefaults, formValues)) {
      setFormValues(valuesWithDefaults)
    }
  }, [activeForm, formValues, setFormValues])

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
      <FieldNavigationProvider value={navigationRequest}>
        {typeof Header === 'function' ? <FormComponentWrap Component={Header} /> : Header ?? ''}
        <div ref={formElementRef} className={utils.makeClassName({
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
          <FormNavigationDepthProvider depth={0}>
            <FormSection
              formSection={activeForm}
              SubmitButton={SubmitButton}
            />
          </FormNavigationDepthProvider>
        </div>
        {typeof Footer === 'function' ? <FormComponentWrap Component={Footer} /> : Footer ?? ''}
      </FieldNavigationProvider>
      </FormValuesContext.Provider>
    </FormStableContext.Provider>
    </ErrorBoundary>
  )
})

FormCreator.displayName = 'FormCreator'

export type IFormSectionStatus = Record<string, {
  completed: number
  total: number
  requiredTotal: number
  requiredCompleted: number
  valid: boolean
}>

export default FormCreator
