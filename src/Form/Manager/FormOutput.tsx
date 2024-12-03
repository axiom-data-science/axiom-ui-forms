import set from ***REMOVED***lodash/set***REMOVED***
import React, { type ReactElement, useEffect, useState } from ***REMOVED***react***REMOVED***

import { CheckIcon, CopyIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***

import formAtom from ***REMOVED***@/state/formAtom***REMOVED***
import formMappingAtom from ***REMOVED***@/state/formMappingAtom***REMOVED***
import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***

interface IOutputRecord {
  [key: string]: IOutputRecord | string | undefined | number
}

const CopyButton = ({
  string,
  size = ***REMOVED***med***REMOVED***,
  defaultClassName = ***REMOVED***text-lg text-slate-400 pointer-events-none***REMOVED***,
  className,
  defaultWrapperClassName,
  wrapperClassName
}: {
  string: string
  defaultClassName?: string
  className?: string
  defaultWrapperClassName?: string
  wrapperClassName?: string
  size?: ***REMOVED***sm***REMOVED*** | ***REMOVED***med***REMOVED*** | ***REMOVED***lg***REMOVED*** | ***REMOVED***xlg***REMOVED***
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
              console.log(***REMOVED***Error!***REMOVED***)
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
                      className: ***REMOVED***bg-slate-600 text-white rounded-full***REMOVED***,
                      extras: [utils.getIconClassForSize(size)]
                    })}/></span>
                  : <CopyIcon className={utils.makeClassName({
                    className,
                    defaultClassName,
                    extras: [utils.getIconClassForSize(size)]
                  })} />
            }

            <span className=***REMOVED***sr-only***REMOVED***>Copy</span>
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
  return (<div className=***REMOVED***relative***REMOVED*** onClick={() => {
    navigator.clipboard.writeText(JSON.stringify(output, null, 2))
      .then(() => {
        console.log(***REMOVED***Copied!***REMOVED***)
      })
      .catch(e => {
        console.log(***REMOVED***Error!***REMOVED***)
      })
  }}>
            {/* <CopyIcon className=***REMOVED***absolute top-4 right-4 w-10 h-10 text-slate-400 pointer-events-none***REMOVED*** /> */}
            <CopyButton string={JSON.stringify(output, null, 2)} className=***REMOVED***text-slate-400 absolute top-4 right-4***REMOVED*** wrapperClassName=***REMOVED***absolute top-0 right-0 bottom-0 left-0***REMOVED*** />
            <pre className=***REMOVED***p-10 bg-slate-200 hover:bg-slate-300 text-slate-600 select-none cursor-pointer***REMOVED***>
                 {JSON.stringify(output, null, 2)}
            </pre>
            </div>
  )
}

export default FormOutput
