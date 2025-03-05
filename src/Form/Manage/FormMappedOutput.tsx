import set from 'lodash/set'
import React, { type ReactElement, useEffect, useState } from 'react'

import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'
import { useAtom } from 'jotai'

import { utils } from '@axdspub/axiom-ui-utilities'
import formValuesAtom from '@/state/formValuesAtom'
import { copyAndAddPathToFields, getFields } from '@/Form/helpers'
import { type IFormValues, type IForm } from '@/Form/FormCreatorTypes'
import { type IFormMapping } from '@/Form/FormMappingTypes'

interface IOutputRecord {
  [key: string]: IOutputRecord | string | null | number
}

const CopyButton = ({
  string,
  size = 'med',
  defaultClassName = 'text-lg text-slate-400 pointer-events-none',
  className,
  defaultWrapperClassName,
  wrapperClassName
}: {
  string: string
  defaultClassName?: string
  className?: string
  defaultWrapperClassName?: string
  wrapperClassName?: string
  size?: 'sm' | 'med' | 'lg' | 'xlg'
}): ReactElement => {
  const [copied, setCopied] = useState(false)
  return (
        <button className={utils.makeClassName({
          className: wrapperClassName,
          defaultClassName: defaultWrapperClassName
        })} onClick={() => {
          navigator.clipboard.writeText(JSON.stringify(string, null, 2))
            .then(() => {
              setCopied(true)
              setTimeout(() => {
                setCopied(false)
              }, 1000)
            })
            .catch(e => {
              console.log('Error!')
            })
        }
        }>
            {
                copied
                  ? <span className={utils.makeClassName({
                    className,
                    defaultClassName
                  })}><CheckIcon className={
                    utils.makeClassName({
                      className: 'bg-slate-600 text-white rounded-full',
                      extras: [utils.getIconClassForSize(size)]
                    })}/></span>
                  : <CopyIcon className={utils.makeClassName({
                    className,
                    defaultClassName,
                    extras: [utils.getIconClassForSize(size)]
                  })} />
            }

            <span className='sr-only'>Copy</span>
        </button>
  )
}

const CopyableJSONOutput = ({ json, label }: { json: string, label: string }): ReactElement => {
  return <div>
    {
      label !== undefined
        ? <h2 className='text-lg pb-4 font-bold'>{label}</h2>
        : ''
    }
    <div className='relative' onClick={() => {
      navigator.clipboard.writeText(json)
        .then(() => {
          console.log('Copied!')
        })
        .catch(e => {
          console.log('Error!')
        })
    }}>
  <CopyButton string={json} className='text-slate-400 absolute top-4 right-4' wrapperClassName='absolute top-0 right-0 bottom-0 left-0' />
  <pre className='p-10 bg-slate-200 hover:bg-slate-300 text-slate-600 select-none cursor-pointer'>
       {json}
  </pre>
  </div>
  </div>
}

const MappedOutput = ({
  form,
  formMapping,
  formValueState
}: {
  form: IForm
  formMapping: IFormMapping
  formValueState?: [IFormValues, (v: IFormValues) => void]
}): ReactElement => {
  const [formValues] = formValueState ?? useAtom(formValuesAtom)
  const [output, setOutput] = useState<IOutputRecord | undefined>(undefined)
  const [flatOutput, setFlatOutput] = useState<IOutputRecord | undefined>(undefined)

  useEffect(() => {
    let newOutput: IOutputRecord = {}
    const newFlatOutput: IOutputRecord = {}
    const { fields } = copyAndAddPathToFields<IForm>(form)
    const flatFields = getFields(fields)
    flatFields.forEach(field => {
      const idPath = field.path?.join('.') ?? field.id
      const path = formMapping.fields[idPath]?.xpath ?? field.id
      const value = formValues[idPath]
      newOutput = set(newOutput, path, value ?? null)
      newFlatOutput[idPath] = (value === null || value === undefined) ? null : isNaN(+value) ? String(value) : Number(value)
    })

    setOutput(newOutput)
    setFlatOutput(newFlatOutput)
  }, [form, formValues, formMapping])
  return (<div className='flex flex-col gap-8'>
      <CopyableJSONOutput json={JSON.stringify(output, null, 2)} label='Output' />
      <CopyableJSONOutput json={JSON.stringify(flatOutput, null, 2)} label='Flat Output' />

  </div>
  )
}

export default MappedOutput
