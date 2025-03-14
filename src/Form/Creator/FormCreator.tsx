import { type IFormValues, type IForm, type IValueChangeFn, type IFieldInputProps, type IFormValueState } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormHeader from ***REMOVED***@/Form/Creator/FormHeader***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import { calculateSectionStatus, copyAndAddPathToFields } from ***REMOVED***@/Form/helpers***REMOVED***
import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { type JSONSchema7 } from ***REMOVED***json-schema***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***

export interface IFormCreatorProps {
  form: IForm
  schema?: JSONSchema7
  formValueState: [IFormValues, (v: IFormValues) => void]
  note?: string
  error?: string
  onChange?: IValueChangeFn
  className?: string
  urlNavigable?: boolean
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
}

const FormStatus = ({ form, formValueState }: { form: IForm, formValueState: IFormValueState }): ReactElement => {
  const [status, setStatus] = useState<IFormSectionStatus>(calculateSectionStatus([form], formValueState))
  useEffect(() => {
    setStatus(calculateSectionStatus([form], formValueState))
  }, [formValueState, form])

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
  inputOverrides
}: IFormCreatorProps): ReactElement => {
  const [activeForm, setActiveForm] = useState<IForm | null>(null)
  useEffect(() => {
    const newForm = copyAndAddPathToFields(form)
    setActiveForm(newForm)
  }, [form])
  if (activeForm === null) {
    return <p>Processing</p>
  }

  activeForm.settings = {
    url_navigable: urlNavigable,
    ...activeForm.settings
  }

  return (

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
          formValueState={formValueState}
          form={activeForm}
          onChange={onChange}
          inputOverrides={inputOverrides}
          />
    </div>
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
