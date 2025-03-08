import { type IFormValues, type IForm, type IValueChangeFn } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormHeader from ***REMOVED***@/Form/Creator/FormHeader***REMOVED***
import FormSection from ***REMOVED***@/Form/Creator/FormSection***REMOVED***
import { copyAndAddPathToFields } from ***REMOVED***@/Form/helpers***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { Route, Routes } from ***REMOVED***react-router-dom***REMOVED***

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
      <Route path=***REMOVED***/***REMOVED*** element={<FormCreator {...props} />}>
          <Route path=***REMOVED*******REMOVED*** element={<FormCreator {...props} />} />
      </Route>
    </Routes>
  )
}

export default Form
