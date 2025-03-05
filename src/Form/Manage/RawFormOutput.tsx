import { type IFormValues } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { CopyableJSONOutput } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***

import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import { set } from ***REMOVED***lodash***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

export const RawFormOutput = ({ formValueState }: { formValueState?: [IFormValues, (v: IFormValues) => void] }): ReactElement => {
  const [formValues] = formValueState ?? useAtom(formValuesAtom)
  const rehydrated = {}
  Object.keys(formValues).forEach(path => {
    set(rehydrated, path, formValues[path])
  })

  // const rehydratedMapped = {}

  return <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
    <CopyableJSONOutput string={JSON.stringify(formValues, null, 2)} label=***REMOVED***As stored***REMOVED*** />
    <CopyableJSONOutput string={JSON.stringify(rehydrated, null, 2)} label=***REMOVED***Rehydrated***REMOVED*** />
    </div>
}
