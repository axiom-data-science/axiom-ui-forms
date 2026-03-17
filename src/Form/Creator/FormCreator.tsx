'use client'

import { FormContext, IFormContextValue, useFormContext } from '@/Form/Creator/FormContextProvider'
import { type IFormValues, type IForm, type IValueChangeFn, type IFieldInputProps, type IFormOverride, type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'
import FormHeader from '@/Form/Creator/FormHeader'
import FormSection from '@/Form/Creator/FormSection'
import { getFieldsFromFormSection, getFieldValue } from '@/utils/getters'
import { cloneObject, copyAndAddPathToFields, updateFormValuesWithFieldValueInPlace } from '@/utils/manipulators'
import layoutAtom, { getWindowSize } from '@/utils/responsive/layoutState'
import { overridesAndSchemaToFormObject, schemaToFormObject } from '@/utils/schemaToFormHelpers'
import { calculateSectionStatus } from '@/utils/validators'
import { Loader, utils } from '@axdspub/axiom-ui-utilities'
import { useAtom } from 'jotai'
import { type JSONSchema6 } from 'json-schema'
import debounce from 'lodash-es/debounce'
import React, { type ReactNode, useContext, type ReactElement, useState, useEffect } from 'react'

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
        : <div className='p-5 bg-slate-200 text-xs'><Loader className='pt-20' /></div>
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
  defaultClassName = 'flex flex-col gap-8 flex-grow',
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
    window.addEventListener('resize', debounceUpdateLayout)

    return () => {
      window.removeEventListener('resize', debounceUpdateLayout)
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
          onChange={onChange}
          SubmitButton={SubmitButton}
        />
      </div>
      {typeof Footer === 'function' ? <FormComponentWrap Component={Footer} /> : Footer ?? ''}
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
