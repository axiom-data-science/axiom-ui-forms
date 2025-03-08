import { type IFormValues, type IForm, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import FormHeader from '@/Form/Creator/FormHeader'
import FormSection from '@/Form/Creator/FormSection'
import { copyAndAddPathToFields } from '@/Form/helpers'
import React, { useEffect, useState, type ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'

export interface IFormCreatorProps {
  form: IForm
  formValueState: [IFormValues, (v: IFormValues) => void]
  note?: string
  error?: string
  onChange?: IValueChangeFn
  className?: string
}

const FormCreator = ({
  form,
  formValueState,
  note,
  error,
  onChange,
  className
}: IFormCreatorProps): ReactElement => {
  const [activeForm, setActiveForm] = useState<IForm | null>(null)
  useEffect(() => {
    const newForm = copyAndAddPathToFields<IForm>(form)
    setActiveForm(newForm)
  }, [form])
  if (activeForm === null) {
    return <p>Processing</p>
  }

  return (
    <div className={className}>
        <FormHeader form={activeForm} note={note} error={error} />
        <FormSection formSection={activeForm} formValueState={formValueState} form={activeForm} onChange={onChange} />
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

const Form = (props: IFormCreatorProps): ReactElement => {
  return (
    <Routes>
      <Route path='/' element={<FormCreator {...props} />}>
          <Route path='*' element={<FormCreator {...props} />} />
      </Route>
    </Routes>
  )
}

export default Form
