import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***
import { type IForm } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { copyAndAddPathToFields } from ***REMOVED***@/Form/helpers***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***

const FormCreator = ({
  form
}: { form: IForm }): ReactElement => {
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
            activeForm.description !== undefined
              ? <p className=***REMOVED***pb-4***REMOVED***>{form.description}</p>
              : null
        }
        <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
        {
        activeForm.fields.map((field) => {
          return (
            <FieldCreator field={field} key={field.id} />
          )
        })
        }
        </div>
      </div>
      </>
  )
}

export default FormCreator
