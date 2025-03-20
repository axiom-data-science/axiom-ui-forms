import { utils } from '@axdspub/axiom-ui-utilities'
import { CheckIcon, CopyIcon } from '@radix-ui/react-icons'
import React, { type ReactElement, useState } from 'react'

export const CopyButton = ({
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
      navigator.clipboard.writeText(string)
        .then(() => {
          setCopied(true)
          setTimeout(() => {
            setCopied(false)
          }, 1000)
        })
        .catch(e => {
          console.log('Error!')
        })
    }}>
      {copied
        ? <span className={utils.makeClassName({
          className,
          defaultClassName
        })}><CheckIcon className={utils.makeClassName({
          className: 'bg-slate-600 text-white rounded-full',
          extras: [utils.getIconClassForSize(size)]
        })} /></span>
        : <CopyIcon className={utils.makeClassName({
          className,
          defaultClassName,
          extras: [utils.getIconClassForSize(size)]
        })} />}

      <span className='sr-only'>Copy</span>
    </button>
  )
}
export const CopyableJSONOutput = ({ string, label }: { string: string, label?: string }): ReactElement => {
  return <div>
    {label !== undefined
      ? <h2 className='text-lg pb-4 font-bold'>{label}</h2>
      : ''}
    <div className='relative' onClick={() => {
      navigator.clipboard.writeText(string)
        .then(() => {
          console.log('Copied!')
        })
        .catch(e => {
          console.log('Error!')
        })
    }}>
      <CopyButton string={string} className='text-slate-400 absolute top-4 right-4' wrapperClassName='absolute top-0 right-0 bottom-0 left-0' />
      <pre className='p-10 bg-slate-200 hover:bg-slate-300 text-slate-600 select-none cursor-pointer font-mono text-xs'>
        {string}
      </pre>
    </div>
  </div>
}
