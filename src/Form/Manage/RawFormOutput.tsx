import formValuesAtom from '@/state/formValuesAtom'
import { useAtom } from 'jotai'
import { set } from 'lodash'
import React, { type ReactElement } from 'react'

export const RawFormOutput = (): ReactElement => {
  const [formValues] = useAtom(formValuesAtom)
  const rehydrated = {}
  Object.keys(formValues).forEach(path => {
    set(rehydrated, path, formValues[path])
  })

  // const rehydratedMapped = {}

  return <div className='flex flex-col gap-4'>
    <div>
    <h2>As stored</h2>
    <pre className='p-10 bg-slate-200'>{JSON.stringify(formValues, null, 2)}</pre>
    </div>
    <div>
    <h2>Rehydrated as mapped</h2>
    <pre className='p-10 bg-slate-200'>{JSON.stringify(rehydrated, null, 2)}</pre>
    </div>
    <div>
    <h2>Rehydrated</h2>
    <pre className='p-10 bg-slate-200'>{JSON.stringify(rehydrated, null, 2)}</pre>
    </div>
    </div>
}
