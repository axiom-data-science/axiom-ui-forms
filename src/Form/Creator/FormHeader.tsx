import type { IForm } from ***REMOVED***@/library***REMOVED***
import { ExclamationTriangleIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const FormHeader = ({
  form, note, error

}: {
  form: IForm
  note?: string
  error?: string
}): ReactElement => {
  return (
    <>
      <h2 className=***REMOVED***text-2xl pb-4 font-bold***REMOVED***>{form.label}</h2>
      {note !== undefined
        ? <p className=***REMOVED***pb-4***REMOVED***>{note}</p>
        : null}
      {error !== undefined
        ? <p className=***REMOVED***pb-4 text-rose-800***REMOVED***><ExclamationTriangleIcon className=***REMOVED***inline mr-2***REMOVED*** /> {error}</p>
        : null}
      {form.description !== undefined
        ? <p className=***REMOVED***pb-4***REMOVED***>{form.description}</p>
        : null}
    </>
  )
}

export default FormHeader
