import set from ***REMOVED***lodash/set***REMOVED***
import React, { type ReactElement, useEffect, useState } from ***REMOVED***react***REMOVED***

import { CheckIcon, CopyIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***

import formAtom from ***REMOVED***@/state/formAtom***REMOVED***
import formMappingAtom from ***REMOVED***@/state/formMappingAtom***REMOVED***
import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { copyAndAddPathToFields, getFields } from ***REMOVED***@/Form/helpers***REMOVED***
import { type IForm } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***

interface IOutputRecord {
  [key: string]: IOutputRecord | string | null | number
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

const CopyableJSONOutput = ({ json, label }: { json: string, label: string }): ReactElement => {
  return <div>
    {
      label !== undefined
        ? <h2 className=***REMOVED***text-lg pb-4 font-bold***REMOVED***>{label}</h2>
        : ***REMOVED******REMOVED***
    }
    <div className=***REMOVED***relative***REMOVED*** onClick={() => {
      navigator.clipboard.writeText(json)
        .then(() => {
          console.log(***REMOVED***Copied!***REMOVED***)
        })
        .catch(e => {
          console.log(***REMOVED***Error!***REMOVED***)
        })
    }}>
  <CopyButton string={json} className=***REMOVED***text-slate-400 absolute top-4 right-4***REMOVED*** wrapperClassName=***REMOVED***absolute top-0 right-0 bottom-0 left-0***REMOVED*** />
  <pre className=***REMOVED***p-10 bg-slate-200 hover:bg-slate-300 text-slate-600 select-none cursor-pointer***REMOVED***>
       {json}
  </pre>
  </div>
  </div>
}

const MappedOutput = (): ReactElement => {
  const [form] = useAtom(formAtom)
  const [formMapping] = useAtom(formMappingAtom)
  const [formValues] = useAtom(formValuesAtom)
  const [output, setOutput] = useState<IOutputRecord | undefined>(undefined)
  const [flatOutput, setFlatOutput] = useState<IOutputRecord | undefined>(undefined)

  useEffect(() => {
    let newOutput: IOutputRecord = {}
    const newFlatOutput: IOutputRecord = {}
    const { fields } = copyAndAddPathToFields<IForm>(form)
    getFields(fields).forEach(field => {
      const idPath = field.path?.join(***REMOVED***.***REMOVED***) ?? field.id
      const path = formMapping.fields[idPath]?.xpath ?? field.id
      const value = formValues[idPath]
      newOutput = set(newOutput, path, value ?? null)
      newFlatOutput[idPath] = (value === null || value === undefined) ? null : isNaN(+value) ? String(value) : Number(value)
    })

    setOutput(newOutput)
    setFlatOutput(newFlatOutput)
  }, [form, formValues, formMapping])
  return (<div className=***REMOVED***flex flex-col gap-8***REMOVED***>
      <CopyableJSONOutput json={JSON.stringify(output, null, 2)} label=***REMOVED***Output***REMOVED*** />
      <CopyableJSONOutput json={JSON.stringify(flatOutput, null, 2)} label=***REMOVED***Flat Output***REMOVED*** />

  </div>
  )
}

export default MappedOutput
