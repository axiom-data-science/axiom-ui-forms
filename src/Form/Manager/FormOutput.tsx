import set from 'lodash/set'
import React, { type ReactElement, useEffect, useState } from 'react'

import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'
import { useAtom } from 'jotai'

import formAtom from '@/state/formAtom'
import formMappingAtom from '@/state/formMappingAtom'
import { utils } from '@axdspub/axiom-ui-utilities'

interface IOutputRecord {
  [key: string]: IOutputRecord | string | undefined | number
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

const FormOutput = (): ReactElement => {
  const [form] = useAtom(formAtom)
  const [formMapping] = useAtom(formMappingAtom)
  const [output, setOutput] = useState<IOutputRecord | undefined>(undefined)

  useEffect(() => {
    let newOutput: IOutputRecord = {}
    form.fields.forEach(field => {
      const path = formMapping.fields[field.id]?.xpath ?? field.id
      newOutput = set(newOutput, path, field.value ?? null)
    })

    setOutput(newOutput)
  }, [form, formMapping])
  return (<div className='relative' onClick={() => {
    navigator.clipboard.writeText(JSON.stringify(output, null, 2))
      .then(() => {
        console.log('Copied!')
      })
      .catch(e => {
        console.log('Error!')
      })
  }}>
            {/* <CopyIcon className='absolute top-4 right-4 w-10 h-10 text-slate-400 pointer-events-none' /> */}
            <CopyButton string={JSON.stringify(output, null, 2)} className='text-slate-400 absolute top-4 right-4' wrapperClassName='absolute top-0 right-0 bottom-0 left-0' />
            <pre className='p-10 bg-slate-200 hover:bg-slate-300 text-slate-600 select-none cursor-pointer'>
                 {JSON.stringify(output, null, 2)}
            </pre>
            </div>
  )
}

export default FormOutput
