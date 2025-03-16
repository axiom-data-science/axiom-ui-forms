import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { set, isArray, isObject, get } from ***REMOVED***lodash***REMOVED***
import React, { type ReactElement, useState } from ***REMOVED***react***REMOVED***

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

  const [obStr, setObStr] = useState(***REMOVED******REMOVED***)
  const [ob, setOb] = useState({})
  const [getStr, setGetStr] = useState(***REMOVED******REMOVED***)

  const out = {}
  const pathsToEval = paths.split(***REMOVED***\n***REMOVED***)
  const valsToEval = vals.split(***REMOVED***\n***REMOVED***)
  pathsToEval.forEach((path, i) => {
    set(out, path.replace(/\s+/g, ***REMOVED******REMOVED***), valsToEval[i] ?? ***REMOVED******REMOVED***)
  })

  return (
        <div className=***REMOVED***p-20***REMOVED***>
        <h1 className=***REMOVED***font-bold font-xl***REMOVED***>Set Tester</h1>
        <div className=***REMOVED***flex flex-col gap-10***REMOVED***>
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

          <p>Reverse</p>
          <pre className=***REMOVED***p-10 bg-slate-200***REMOVED***>
            {JSON.stringify(flattenObjectToPaths(out), null, 2)}
            </pre>
          </div>

          <h1 className=***REMOVED***font-bold font-xl***REMOVED***>Get Tester</h1>

            <TextArea id=***REMOVED***ob***REMOVED*** testId=***REMOVED***ob***REMOVED*** label=***REMOVED***Object to get from (paste json)***REMOVED*** value={obStr} onChange={(e) => {
              if (e === undefined || e === null || e === ***REMOVED******REMOVED***) {
                return
              }
              try {
                const newOb = JSON.parse(e)
                setOb(newOb)
              } catch (e) {
                console.error(e)
              }
              setObStr(e ?? ***REMOVED******REMOVED***)
            }}/>

            <TextArea id=***REMOVED***get***REMOVED*** testId=***REMOVED***get***REMOVED*** label=***REMOVED***Get (use json path)***REMOVED*** value={getStr} onChange={(e) => {
              setGetStr(e ?? ***REMOVED******REMOVED***)
            }}/>

        <pre className=***REMOVED***p-10 bg-slate-200***REMOVED***>
            {JSON.stringify(get(ob, getStr), null, 2)}
        </pre>

        </div>
        </div>
  )
}

export default SetTester
