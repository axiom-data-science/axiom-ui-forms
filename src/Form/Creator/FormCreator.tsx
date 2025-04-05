import { FormContext } from '@/Form/Creator/FormContextProvider'
import { type IFormValues, type IForm, type IValueChangeFn, type IFieldInputProps, type IFormOverride, type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'
import FormHeader from '@/Form/Creator/FormHeader'
import FormSection from '@/Form/Creator/FormSection'
import { getFieldsFromFormSection, getFieldValue } from '@/utils/getters'
import { copyAndAddPathToFields, updateFormValuesWithFieldValueInPlace } from '@/utils/manipulators'
import { overridesAndSchemaToFormObject, schemaToFormObject } from '@/utils/schemaToFormHelpers'
import { calculateSectionStatus } from '@/utils/validators'
import { Loader, utils } from '@axdspub/axiom-ui-utilities'
import { type JSONSchema6 } from 'json-schema'
import React, { useContext, useEffect, useState, type ReactElement } from 'react'

export interface IFormCreatorProps {
  form: IForm
  schema?: JSONSchema6
  formValueState: [IFormValues, (v: IFormValues) => void]
  note?: string
  error?: string
  onChange?: IValueChangeFn
  className?: string
  defaultClassName?: string
  urlNavigable?: boolean
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
}

const FormStatus = (): ReactElement => {
  const { form, formValues, setFormValues } = useContext(FormContext)
  const status = calculateSectionStatus([form], [formValues, setFormValues])

  return (
    <>
    <p className='text-xs mt-4'>{status[form.id]?.completed} of {status[form.id]?.total} total</p>
    <p className='text-xs mt-2'>{status[form.id]?.requiredCompleted} of {status[form.id]?.requiredTotal} required</p>
    </>
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
  const [form, setForm] = useState<IForm | undefined>(undefined)
  useEffect(() => {
    const newForm = formOverrides === undefined
      ? schemaToFormObject(schema)
      : overridesAndSchemaToFormObject({
        formOverrides,
        formFieldOverrides,
        schema
      }) // Convert the JSON schema to a form object
    if (id !== undefined) {
      newForm.id = id
    }
    if (label !== undefined) {
      newForm.label = label
    }
    setForm(newForm)
  }, [schema, formOverrides, formFieldOverrides, id, label])

  return (
    <>{
      form !== undefined
        ? <FormCreator form={form} {...props} />
        : <div className='p-5 bg-slate-200 text-xs'><Loader className='pt-20' /></div>
    }</>

  )
}

const FormCreator = ({
  form,
  formValueState,
  note,
  error,
  onChange,
  className,
  defaultClassName = 'flex flex-col gap-2 flex-grow',
  urlNavigable = true,
  inputOverrides,
  schema
}: IFormCreatorProps): ReactElement => {
  const activeForm = copyAndAddPathToFields(form)
  const activeFormValues = structuredClone(formValueState[0])
  getFieldsFromFormSection(activeForm).forEach(field => {
    if (field.defaultValue !== undefined && getFieldValue(field, activeFormValues) === undefined) {
      updateFormValuesWithFieldValueInPlace(field, field.defaultValue, activeFormValues)
    }
  })

  activeForm.settings = {
    url_navigable: urlNavigable,
    ...activeForm.settings
  }

  const [formValues, setFormValues] = formValueState

  return (
    <FormContext.Provider value={{
      form: activeForm,
      formValues,
      setFormValues,
      inputOverrides,
      schema,
      urlNavigable: activeForm.settings.url_navigable
    }}>
            <div className={utils.makeClassName({
              className: activeForm?.settings?.class_name,
              defaultClassName,
              extras: [className]
            })}>
                <FormHeader form={activeForm} note={note} error={error} />
                {
                  activeForm?.fields !== undefined && activeForm.fields.length > 0 && activeForm.pages === undefined && activeForm.wizard_steps === undefined
                    ? <FormStatus />
                    : ''
                }
                <FormSection
                  formSection={activeForm}
                  onChange={onChange}
                  />
            </div>
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
