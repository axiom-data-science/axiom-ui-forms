import { TextArea } from '@axdspub/axiom-ui-utilities'
import { set, isArray, isObject } from 'lodash'
import React, { type ReactElement, useEffect, useState } from 'react'

function flattenObjectToPaths (obj: any, prefix: string = ''): Record<string, any> {
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
  const [vals, setVals] = useState('')
  const [paths, setPaths] = useState('')
  const [out, setOut] = useState({})
  useEffect(() => {
    const newOut = {}
    const pathsToEval = paths.split('\n')
    const valsToEval = vals.split('\n')
    pathsToEval.forEach((path, i) => {
      set(newOut, path.replace(/\s+/g, ''), valsToEval[i] ?? '')
    })
    setOut(newOut)
  }, [paths, vals])
  return (
        <div className='p-20'>
        <h1 className='font-bold font-xl mb-4'>Set Tester</h1>
        <div className='flex flex-col gap-4'>
        <TextArea id='value' testId='value' label='Value' value={vals} onChange={(e) => {
          setVals(e ?? '')
        }} />
        <TextArea id='path' testId='path' label='Path' value={paths} onChange={(e) => {
          setPaths(e ?? '')
        }} />
        <div>
            <p>Output</p>
        <pre className='p-10 bg-slate-200'>
            {JSON.stringify(out, null, 2)}
        </pre>
        <div>
          <p>Reverse</p>
          <pre className='p-10 bg-slate-200'>
            {JSON.stringify(flattenObjectToPaths(out), null, 2)}
            </pre>

        </div>
        </div>
        </div>
        </div>
  )
}

export default SetTester
