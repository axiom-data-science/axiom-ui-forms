import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import { set } from ***REMOVED***lodash***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

export const RawFormOutput = (): ReactElement => {
  const [formValues] = useAtom(formValuesAtom)
  const rehydrated = {}
  Object.keys(formValues).forEach(path => {
    set(rehydrated, path, formValues[path])
  })

  // const rehydratedMapped = {}

  return <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
    <div>
    <h2>As stored</h2>
    <pre className=***REMOVED***p-10 bg-slate-200***REMOVED***>{JSON.stringify(formValues, null, 2)}</pre>
    </div>
    <div>
    <h2>Rehydrated as mapped</h2>
    <pre className=***REMOVED***p-10 bg-slate-200***REMOVED***>{JSON.stringify(rehydrated, null, 2)}</pre>
    </div>
    <div>
    <h2>Rehydrated</h2>
    <pre className=***REMOVED***p-10 bg-slate-200***REMOVED***>{JSON.stringify(rehydrated, null, 2)}</pre>
    </div>
    </div>
}
