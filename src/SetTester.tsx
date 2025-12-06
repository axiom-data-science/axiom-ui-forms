"use client";
import { TextArea } from '@axdspub/axiom-ui-utilities'
import { set, isArray, isObject, get } from 'lodash-es'
import React, { type ReactElement, useState } from 'react'

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

  const [obStr, setObStr] = useState('')
  const [ob, setOb] = useState({})
  const [getStr, setGetStr] = useState('')

  const out = {}
  const pathsToEval = paths.split('\n')
  const valsToEval = vals.split('\n')
  pathsToEval.forEach((path, i) => {
    set(out, path.replace(/\s+/g, ''), valsToEval[i] ?? '')
  })

  return (
        <div className='p-20'>
        <h1 className='font-bold font-xl'>Set Tester</h1>
        <div className='flex flex-col gap-10'>
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

          <p>Reverse</p>
          <pre className='p-10 bg-slate-200'>
            {JSON.stringify(flattenObjectToPaths(out), null, 2)}
            </pre>
          </div>

          <h1 className='font-bold font-xl'>Get Tester</h1>

            <TextArea id='ob' testId='ob' label='Object to get from (paste json)' value={obStr} onChange={(e) => {
              if (e === undefined || e === null || e === '') {
                return
              }
              try {
                const newOb = JSON.parse(e)
                setOb(newOb)
              } catch (e) {
                console.error(e)
              }
              setObStr(e ?? '')
            }}/>

            <TextArea id='get' testId='get' label='Get (use json path)' value={getStr} onChange={(e) => {
              setGetStr(e ?? '')
            }}/>

        <pre className='p-10 bg-slate-200'>
            {JSON.stringify(get(ob, getStr), null, 2)}
        </pre>

        </div>
        </div>
  )
}

export default SetTester
