import { type IForm, type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import formAtom from ***REMOVED***@/state/formAtom***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import React, { type ReactElement, useState, useEffect } from ***REMOVED***react***REMOVED***

const validateForm = (form: IForm): string | undefined => {
  if (form.label === undefined) {
    return (***REMOVED***Label is required***REMOVED***)
  }
  if (form.fields === undefined) {
    return (***REMOVED***At least one field is required***REMOVED***)
  }
  if (form.fields.length > Object.keys(Object.fromEntries(form.fields.map((field: IFormField) => [field.id, field]))).length) {
    return (***REMOVED***Field IDs must be unique***REMOVED***)
  }
  return undefined
}

const FormConfigInput = (): ReactElement => {
  const [form, setForm] = useAtom(formAtom)
  const [error, setError] = useState<string | undefined>(validateForm(form))
  const [str, setStr] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (str !== ***REMOVED******REMOVED*** && str !== undefined) {
      try {
        const ob = JSON.parse(str)
        const newError = validateForm(ob)
        setError(newError)
        if (newError === undefined) {
          setForm(ob)
        }
      } catch {
        setError(***REMOVED***Invalid JSON***REMOVED***)
      }
    }
  }, [str])
  return (
            <div className=***REMOVED***h-full flex flex-col***REMOVED***>
                 { error !== undefined
                   ? <p className=***REMOVED***text-red-500 py-4***REMOVED***>
                      {error}
                  </p>
                   : ***REMOVED******REMOVED***
                 }
                 <TextArea
                      id=***REMOVED***formManager***REMOVED***
                      testId=***REMOVED***formManager***REMOVED***
                      value={JSON.stringify(form, null, 2)}
                      className=***REMOVED***h-full mt-0 w-full flex-grow min-h-[600px] shadow-inner-xl bg-slate-100***REMOVED***
                      onChange={(e) => {
                        setStr(e)
                      }}
                 />
            </div>
  )
}

export default FormConfigInput
