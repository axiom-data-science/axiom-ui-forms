***REMOVED***use client***REMOVED***

import { FormStableContext, FormValuesContext, IFormContextValue, useFormValues } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { type IFormValues, type IForm, type IFormSection, type IFormField, type IValueChangeFn, type IFieldInputProps, type IFormOverride, type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormHeader from ***REMOVED***@/Form/Creator/FormHeader***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import { copyAndAddPathToFields } from ***REMOVED***@/utils/manipulators***REMOVED***
import layoutAtom, { getWindowSize } from ***REMOVED***@/utils/responsive/layoutState***REMOVED***
import { overridesAndSchemaToFormObject, schemaToFormObject } from ***REMOVED***@/utils/schemaToFormHelpers***REMOVED***
import { calculateSectionStatus } from ***REMOVED***@/utils/validators***REMOVED***
import { seedNestedDefaults } from ***REMOVED***@/utils/formEngine***REMOVED***
import { formHasNestedNavigation } from ***REMOVED***@/utils/formEngine/hasNestedNavigation***REMOVED***
import { Loader, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { ErrorBoundary } from ***REMOVED***react-error-boundary***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import debounce from ***REMOVED***lodash-es/debounce***REMOVED***
import React, { type ReactNode, useContext, type ReactElement, useState, useEffect, useMemo, useCallback } from ***REMOVED***react***REMOVED***
import errorRenderer from ***REMOVED***@/utils/errorRenderer***REMOVED***

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
    <div className=***REMOVED***flex flex-col gap-2 text-xs***REMOVED***>
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
}: Omit<IFormCreatorProps, ***REMOVED***form***REMOVED***> & {
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
        : <div className=***REMOVED***p-5 bg-slate-200 text-xs***REMOVED***><Loader className=***REMOVED***pt-20***REMOVED*** /></div>
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
  defaultClassName = ***REMOVED***flex flex-col gap-8 flex-grow***REMOVED***,
  urlNavigable = true,
  inputOverrides,
  schema,
  Footer,
  Header,
  SubmitButton,
  initialFormValues
}: IFormCreatorProps): ReactElement => {
  const activeForm = useMemo(() => {
    const af = copyAndAddPathToFields(form)
    // Disable URL navigation if form has nested pages or wizard_steps (these don***REMOVED***t support URL nav)
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
    window.addEventListener(***REMOVED***resize***REMOVED***, debounceUpdateLayout)

    return () => {
      window.removeEventListener(***REMOVED***resize***REMOVED***, debounceUpdateLayout)
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
        {typeof Header === ***REMOVED***function***REMOVED*** ? <FormComponentWrap Component={Header} /> : Header ?? ***REMOVED******REMOVED***}
        <div className={utils.makeClassName({
          className: activeForm?.settings?.class_name,
          defaultClassName,
          extras: [className]
        })}>
          <FormHeader form={activeForm} note={note} error={error} />
          {
            activeForm?.fields !== undefined && activeForm.fields.length > 0 && activeForm.pages === undefined && activeForm.wizard_steps === undefined && activeForm.tabs === undefined
              ? <FormStatus />
              : ***REMOVED******REMOVED***
          }
          <FormSection
            formSection={activeForm}
            SubmitButton={SubmitButton}
          />
        </div>
        {typeof Footer === ***REMOVED***function***REMOVED*** ? <FormComponentWrap Component={Footer} /> : Footer ?? ***REMOVED******REMOVED***}
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
