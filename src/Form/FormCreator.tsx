import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***
import { type IFormValues, type IForm, type IValueChangeFn } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { copyAndAddPathToFields } from ***REMOVED***@/Form/helpers***REMOVED***
import { ExclamationTriangleIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***

const FormCreator = ({
  form,
  formValueState,
  note,
  error,
  onChange
}: {
  form: IForm
  formValueState: [IFormValues, (v: IFormValues) => void]
  note?: string
  error?: string
  onChange?: IValueChangeFn

}): ReactElement => {
  const [activeForm, setActiveForm] = useState<IForm | null>(null)
  useEffect(() => {
    const newForm = copyAndAddPathToFields<IForm>(form)
    setActiveForm(newForm)
  }, [form])
  if (activeForm === null) {
    return <p>Processing</p>
  }
  return (
      <>
      <div>
        <h2 className=***REMOVED***text-2xl pb-4 font-bold***REMOVED***>{form.label}</h2>
        {
            note !== undefined
              ? <p className=***REMOVED***pb-4***REMOVED***>{note}</p>
              : null
        }
        {
            error !== undefined
              ? <p className=***REMOVED***pb-4 text-rose-800***REMOVED***><ExclamationTriangleIcon className=***REMOVED***inline mr-2***REMOVED*** /> {error}</p>
              : null
        }
        {
            activeForm.description !== undefined
              ? <p className=***REMOVED***pb-4***REMOVED***>{form.description}</p>
              : null
        }
        <div className=***REMOVED***flex flex-col gap-2***REMOVED***>
        {
        activeForm.fields.map((field) => {
          return (
            <FieldCreator onChange={onChange} form={form} field={field} key={field.id} formValueState={formValueState} />
          )
        })
        }
        </div>
      </div>
      </>
  )
}

export default FormCreator
