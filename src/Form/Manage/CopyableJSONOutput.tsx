import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CheckIcon, CopyIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { type ReactElement, type ReactNode, useState } from ***REMOVED***react***REMOVED***

export const CopyButton = ({
  string,
  size = ***REMOVED***med***REMOVED***,
  defaultClassName = ***REMOVED***text-lg text-slate-400 pointer-events-none***REMOVED***,
  className,
  defaultWrapperClassName,
  wrapperClassName,
  ToCopyElement,
  OnCopiedElement

}: {
  string: string
  defaultClassName?: string
  className?: string
  defaultWrapperClassName?: string
  wrapperClassName?: string
  size?: ***REMOVED***sm***REMOVED*** | ***REMOVED***med***REMOVED*** | ***REMOVED***lg***REMOVED*** | ***REMOVED***xlg***REMOVED***
  ToCopyElement?: ReactNode
  OnCopiedElement?: ReactNode
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
          console.log(***REMOVED***Error!***REMOVED***)
        })
    }}>
      {copied
        ? OnCopiedElement ?? <span className={utils.makeClassName({
          className,
          defaultClassName
        })}><CheckIcon className={utils.makeClassName({
          className: ***REMOVED***bg-slate-600 text-white rounded-full***REMOVED***,
          extras: [utils.getIconClassForSize(size)]
        })} /></span>
        : ToCopyElement ?? <CopyIcon className={utils.makeClassName({
          className,
          defaultClassName,
          extras: [utils.getIconClassForSize(size)]
        })} />}

      <span className=***REMOVED***sr-only***REMOVED***>Copy</span>
    </button>
  )
}
export const CopyableJSONOutput = ({ string, label }: { string: string, label?: string }): ReactElement => {
  return <div>
    {label !== undefined
      ? <h2 className=***REMOVED***text-lg pb-4 font-bold***REMOVED***>{label}</h2>
      : ***REMOVED******REMOVED***}
    <div className=***REMOVED***relative***REMOVED*** onClick={() => {
      navigator.clipboard.writeText(string)
        .then(() => {
        })
        .catch(e => {
        })
    }}>
      <CopyButton string={string} className=***REMOVED***text-slate-400 absolute top-4 right-4***REMOVED*** wrapperClassName=***REMOVED***absolute top-0 right-0 bottom-0 left-0***REMOVED*** />
      <pre className=***REMOVED***p-10 bg-slate-200 hover:bg-slate-300 text-slate-600 select-none cursor-pointer font-mono text-xs***REMOVED***>
        {string}
      </pre>
    </div>
  </div>
}
