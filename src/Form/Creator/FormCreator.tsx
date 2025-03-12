import { type IFormValues, type IForm, type IValueChangeFn, type IFieldInputProps, type IFormValueState } from '@/Form/Creator/FormCreatorTypes'
import FormHeader from '@/Form/Creator/FormHeader'
import FormSection from '@/Form/Creator/FormSection'
import { calculateSectionStatus, copyAndAddPathToFields } from '@/Form/helpers'
import { utils } from '@axdspub/axiom-ui-utilities'
import { type JSONSchema7 } from 'json-schema'
import React, { useEffect, useState, type ReactElement } from 'react'

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

  const FormStatus = ({ form, formValueState }: { form: IForm, formValueState: IFormValueState }): ReactElement => {
    const [status, setStatus] = useState<IFormSectionStatus>(calculateSectionStatus([form], formValueState))
    useEffect(() => {
      setStatus(calculateSectionStatus([form], formValueState))
    }, [formValueState, form])

    return (
      <>
      <p className='text-xs mt-4'>{status[form.id]?.completed} of {status[form.id]?.total} total</p>
      <p className='text-xs mt-2'>{status[form.id]?.requiredCompleted} of {status[form.id]?.requiredTotal} required</p>
      </>
    )
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
            : ''
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
