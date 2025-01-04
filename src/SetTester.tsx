import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { set, isArray, isObject } from ***REMOVED***lodash***REMOVED***
import React, { type ReactElement, useEffect, useState } from ***REMOVED***react***REMOVED***

function flattenObjectToPaths (obj: any, prefix: string = ***REMOVED******REMOVED***): Record<string, any> {
  return Object.keys(obj).reduce((acc: Record<string, any>, key) => {
    const value = obj[key]
    const newKey = prefix.length > 0 ? `${prefix}.${key}` : key

    if (isObject(value) && !isArray(value)) {
      Object.assign(acc, flattenObjectToPaths(value, newKey))
    } else {
      acc[newKey] = value
    }

    return acc
  }, {})
}

const SetTester = (): ReactElement => {
  const [vals, setVals] = useState(***REMOVED******REMOVED***)
  const [paths, setPaths] = useState(***REMOVED******REMOVED***)
  const [out, setOut] = useState({})
  useEffect(() => {
    const newOut = {}
    const pathsToEval = paths.split(***REMOVED***\n***REMOVED***)
    const valsToEval = vals.split(***REMOVED***\n***REMOVED***)
    pathsToEval.forEach((path, i) => {
      set(newOut, path.replace(/\s+/g, ***REMOVED******REMOVED***), valsToEval[i] ?? ***REMOVED******REMOVED***)
    })
    setOut(newOut)
  }, [paths, vals])
  return (
        <div className=***REMOVED***p-20***REMOVED***>
        <h1 className=***REMOVED***font-bold font-xl mb-4***REMOVED***>Set Tester</h1>
        <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
        <TextArea id=***REMOVED***value***REMOVED*** testId=***REMOVED***value***REMOVED*** label=***REMOVED***Value***REMOVED*** value={vals} onChange={(e) => {
          setVals(e ?? ***REMOVED******REMOVED***)
        }} />
        <TextArea id=***REMOVED***path***REMOVED*** testId=***REMOVED***path***REMOVED*** label=***REMOVED***Path***REMOVED*** value={paths} onChange={(e) => {
          setPaths(e ?? ***REMOVED******REMOVED***)
        }} />
        <div>
            <p>Output</p>
        <pre className=***REMOVED***p-10 bg-slate-200***REMOVED***>
            {JSON.stringify(out, null, 2)}
        </pre>
        <div>
          <p>Reverse</p>
          <pre className=***REMOVED***p-10 bg-slate-200***REMOVED***>
            {JSON.stringify(flattenObjectToPaths(out), null, 2)}
            </pre>

        </div>
        </div>
        </div>
        </div>
  )
}

export default SetTester
