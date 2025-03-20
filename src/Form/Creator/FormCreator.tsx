import { FormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { type IFormValues, type IForm, type IValueChangeFn, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormHeader from ***REMOVED***@/Form/Creator/FormHeader***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import { calculateSectionStatus, copyAndAddPathToFields, getFieldsFromFormSection, getFieldValue, updateFormValuesWithFieldValueInPlace } from ***REMOVED***@/Form/helpers***REMOVED***
import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import React, { useContext, type ReactElement } from ***REMOVED***react***REMOVED***

export interface IFormCreatorProps {
  form: IForm
  schema?: JSONSchema6
  formValueState: [IFormValues, (v: IFormValues) => void]
  note?: string
  error?: string
  onChange?: IValueChangeFn
  className?: string
  urlNavigable?: boolean
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
}

const FormStatus = (): ReactElement => {
  const { form, formValues, setFormValues } = useContext(FormContext)
  const status = calculateSectionStatus([form], [formValues, setFormValues])

  return (
    <>
    <p className=***REMOVED***text-xs mt-4***REMOVED***>{status[form.id]?.completed} of {status[form.id]?.total} total</p>
    <p className=***REMOVED***text-xs mt-2***REMOVED***>{status[form.id]?.requiredCompleted} of {status[form.id]?.requiredTotal} required</p>
    </>
  )
}

const FormCreator = ({
  form,
  formValueState,
  note,
  error,
  onChange,
  className,
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
              defaultClassName: className
            })}>
                <FormHeader form={activeForm} note={note} error={error} />
                {
                  activeForm?.fields !== undefined && activeForm.fields.length > 0 && activeForm.pages === undefined && activeForm.wizard_steps === undefined
                    ? <FormStatus />
                    : ***REMOVED******REMOVED***
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
