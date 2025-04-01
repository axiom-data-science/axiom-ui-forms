import JSONInputLoader from ***REMOVED***@/Form/Components/Inputs/JSONInputLoader***REMOVED***
import { type IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { CopyButton } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement, useState, useEffect } from ***REMOVED***react***REMOVED***

const validateForm = (form: IForm): string | undefined => {
  if (form.label === undefined) {
    return (***REMOVED***Label is required***REMOVED***)
  }

  return undefined
}

const FormConfigInput = ({ formState }: { formState: [IForm, (form: IForm) => void] }): ReactElement => {
  const [form, setForm] = formState
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
                 <div className=***REMOVED***h-full relative***REMOVED***>
                 <JSONInputLoader
                      field={
                        {
                          id: ***REMOVED***formManager***REMOVED***,
                          label: null,
                          type: ***REMOVED***json***REMOVED***
                        }
                      }
                      value={JSON.stringify(form)}
                      className=***REMOVED***h-full***REMOVED***
                      onChange={(e) => {
                        setStr(String(e))
                      }}
                      />
                 </div>
            </div>
  )
}

export default FormConfigInput
