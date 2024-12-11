import Field from ***REMOVED***@/Form/Manager/Field/Field***REMOVED***
import { getUniqueFormFields } from ***REMOVED***@/Form/Manager/helpers***REMOVED***
import formAtom from ***REMOVED***@/state/formAtom***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import React, { useEffect, type ReactElement } from ***REMOVED***react***REMOVED***
import { base64ToJson, jsonToBase64 } from ***REMOVED***@/helpers***REMOVED***
import { type IForm } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***

const Form = (): ReactElement => {
  const [form, setForm] = useAtom(formAtom)
  const uniqueFields = getUniqueFormFields(form)
  useEffect(() => {
    const base64String = jsonToBase64<IForm>(form)
    const decodedForm = base64ToJson<IForm>(base64String)

    console.log(base64String.length)
    console.log(decodedForm)
  }, [form])
  return (
            <div>
                 <h2 className=***REMOVED***text-2xl pb-4 font-bold***REMOVED***>{form.label}</h2>
                 {
                      form.description !== undefined
                        ? <p className=***REMOVED***pb-4***REMOVED***>{form.description}</p>
                        : null
                 }
                 <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
                      {
                           uniqueFields.map((field, index) => {
                             return (
                                     <div key={index}>
                                          {
                                            <Field field={field} onChange={() => {
                                              setForm({ ...form })
                                            }} />
                                        }
                                     </div>
                             )
                           })
                      }
                 </div>

            </div>
  )
}

export default Form
