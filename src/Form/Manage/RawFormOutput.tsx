import { type IFormValues } from '@/Form/FormCreatorTypes'
import { CopyableJSONOutput } from '@/Form/Manage/CopyableJSONOutput'

import formValuesAtom from '@/state/formValuesAtom'
import { useAtom } from 'jotai'
import { set } from 'lodash'
import React, { type ReactElement } from 'react'

export const RawFormOutput = ({ formValueState }: { formValueState?: [IFormValues, (v: IFormValues) => void] }): ReactElement => {
  const [formValues] = formValueState ?? useAtom(formValuesAtom)
  const rehydrated = {}
  Object.keys(formValues).forEach(path => {
    set(rehydrated, path, formValues[path])
  })

  // const rehydratedMapped = {}

  return <div className='flex flex-col gap-4'>
    <CopyableJSONOutput string={JSON.stringify(formValues, null, 2)} label='As stored' />
    <CopyableJSONOutput string={JSON.stringify(rehydrated, null, 2)} label='Rehydrated' />
    </div>
}
