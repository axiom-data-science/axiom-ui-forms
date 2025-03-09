import { type IFormValues, type IForm, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import FormHeader from '@/Form/Creator/FormHeader'
import FormSection from '@/Form/Creator/FormSection'
import { copyAndAddPathToFields } from '@/Form/helpers'
import { utils } from '@axdspub/axiom-ui-utilities'
import React, { useEffect, useState, type ReactElement } from 'react'

export interface IFormCreatorProps {
  form: IForm
  formValueState: [IFormValues, (v: IFormValues) => void]
  note?: string
  error?: string
  onChange?: IValueChangeFn
  className?: string
  urlNavigable?: boolean
}

const FormCreator = ({
  form,
  formValueState,
  note,
  error,
  onChange,
  className,
  urlNavigable = true
}: IFormCreatorProps): ReactElement => {
  const [activeForm, setActiveForm] = useState<IForm | null>(null)
  useEffect(() => {
    const newForm = copyAndAddPathToFields<IForm>(form)
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
        <FormSection
          formSection={activeForm}
          formValueState={formValueState}
          form={activeForm}
          onChange={onChange}
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
