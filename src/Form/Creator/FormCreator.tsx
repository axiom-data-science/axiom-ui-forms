***REMOVED***use client***REMOVED***

import { FormContext, IFormContextValue, useFormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { type IFormValues, type IForm, type IValueChangeFn, type IFieldInputProps, type IFormOverride, type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormHeader from ***REMOVED***@/Form/Creator/FormHeader***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import { getFieldsFromFormSection, getFieldValue } from ***REMOVED***@/utils/getters***REMOVED***
import { cloneObject, copyAndAddPathToFields, updateFormValuesWithFieldValueInPlace } from ***REMOVED***@/utils/manipulators***REMOVED***
import layoutAtom, { getWindowSize } from ***REMOVED***@/utils/responsive/layoutState***REMOVED***
import { overridesAndSchemaToFormObject, schemaToFormObject } from ***REMOVED***@/utils/schemaToFormHelpers***REMOVED***
import { calculateSectionStatus } from ***REMOVED***@/utils/validators***REMOVED***
import { Loader, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import debounce from ***REMOVED***lodash-es/debounce***REMOVED***
import React, { type ReactNode, useContext, type ReactElement, useState, useEffect } from ***REMOVED***react***REMOVED***

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
  const formContext = useFormContext()
  return <Component {...formContext} />
}

const FormStatus = (): ReactElement => {
  const { form, formValues } = useContext(FormContext)
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
  const form = formOverrides === undefined && formFieldOverrides === undefined
    ? schemaToFormObject(schema)
    : overridesAndSchemaToFormObject({
      formOverrides,
      formFieldOverrides,
      schema
    }) // Convert the JSON schema to a form object
  if (id !== undefined) {
    form.id = id
  }
  if (label !== undefined) {
    form.label = label
  }

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
  getFieldsFromFormSection(form).forEach(field => {
    if (field.defaultValue !== undefined && getFieldValue(field, formValues) === undefined) {
      updateFormValuesWithFieldValueInPlace(field, field.defaultValue, formValues)
    }
  })
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
  const activeForm = copyAndAddPathToFields(form)
  const activeFormValues = cloneObject(formValueState?.[0] ?? {})
  getFieldsFromFormSection(activeForm).forEach(field => {
    if (field.defaultValue !== undefined && getFieldValue(field, activeFormValues) === undefined) {
      updateFormValuesWithFieldValueInPlace(field, field.defaultValue, activeFormValues)
    }
  })
  const [formValues, setFormValues] = formValueState ?? useState<IFormValues>({
    ...seedFormValuesWithDefaults(activeForm),
    ...initialFormValues
  })

  activeForm.settings = {
    url_navigable: urlNavigable,
    ...activeForm.settings
  }

  const [layout, setLayout] = useAtom(layoutAtom)
  const updateLayoutValue = (): void => {
    const newSize = getWindowSize()
    if (layout.size !== newSize) {
      setLayout({ size: newSize })
    }
  }

  useEffect(() => {
    const debounceUpdateLayout = debounce(updateLayoutValue, 200)
    window.addEventListener(***REMOVED***resize***REMOVED***, debounceUpdateLayout)

    return () => {
      window.removeEventListener(***REMOVED***resize***REMOVED***, debounceUpdateLayout)
      debounceUpdateLayout.cancel()
    }
  }, [])

  return (
    <FormContext.Provider value={{
      form: activeForm,
      formValues,
      setFormValues,
      inputOverrides,
      schema,
      urlNavigable: activeForm.settings.url_navigable
    }}>
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
          onChange={onChange}
          SubmitButton={SubmitButton}
        />
      </div>
      {typeof Footer === ***REMOVED***function***REMOVED*** ? <FormComponentWrap Component={Footer} /> : Footer ?? ***REMOVED******REMOVED***}
    </FormContext.Provider>
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
