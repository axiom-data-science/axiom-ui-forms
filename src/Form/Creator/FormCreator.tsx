import { FormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { type IFormValues, type IForm, type IValueChangeFn, type IFieldInputProps, type IFormValueState } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormHeader from ***REMOVED***@/Form/Creator/FormHeader***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import { calculateSectionStatus, copyAndAddPathToFields, getFieldsFromFormSection, getFieldValue, updateFormValuesWithFieldValueInPlace } from ***REMOVED***@/Form/helpers***REMOVED***
import { Loader, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***

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

const FormStatus = ({ form, formValueState }: { form: IForm, formValueState: IFormValueState }): ReactElement => {
  const status = calculateSectionStatus([form], formValueState)

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

  activeForm.settings = {
    url_navigable: urlNavigable,
    ...activeForm.settings
  }

  const [formValues, setFormValues] = formValueState
  const [isReady, setIsReady] = useState(false)
  useEffect(() => {
    const formValuesCopy = structuredClone(formValues)
    getFieldsFromFormSection(activeForm).forEach(field => {
      if (field.defaultValue !== undefined && getFieldValue(field, formValues) === undefined) {
        updateFormValuesWithFieldValueInPlace(field, field.defaultValue, formValuesCopy)
      }
    })
    setFormValues(formValuesCopy)
    setIsReady(true)
  }, [form])

  console.log(***REMOVED***isReady***REMOVED***, isReady)
  if (isReady) {
    console.log(***REMOVED***formValues***REMOVED***, formValues)
  }

  return (
    <>
    {
      !isReady
        ? <Loader className=***REMOVED***pt-20***REMOVED*** />
        : <FormContext.Provider value={{
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
                    ? <FormStatus form={activeForm} formValueState={formValueState} />
                    : ***REMOVED******REMOVED***
                }
                <FormSection
                  formSection={activeForm}
                  onChange={onChange}
                  />
            </div>
          </FormContext.Provider>
    }
    </>
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
