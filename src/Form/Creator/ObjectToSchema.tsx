import JSONInputLoader from ***REMOVED***@/Form/Components/Inputs/JSONInputLoader***REMOVED***
import { CopyButton } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***
import { Button } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***

import { CheckIcon, CopyIcon, ArrowDownIcon, Cross2Icon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import React, { type ReactElement, useState } from ***REMOVED***react***REMOVED***
import toJsonSchema from ***REMOVED***to-json-schema***REMOVED***

export const objectToSchema = (ob: unknown): JSONSchema6 => {
  return toJsonSchema(ob) as JSONSchema6
}

export const ObjectToSchemaButton = ({
  onUpdate,
  size = ***REMOVED***md***REMOVED***,
  className
}: {
  onUpdate?: (newSchema: JSONSchema6 | undefined) => void
  size?: string
  className?: string
}): ReactElement => {
  const [show, setShow] = useState<boolean>(false)
  return (
        <>
                <Button
          type=***REMOVED***create***REMOVED***
          size={size}
          className={className ?? ***REMOVED***inline-block absolute top-4 right-4***REMOVED***}
          onClick={() => {
            setShow(!show)
          }}
          >Create schema from object</Button>
          {
            show
              ? <div className=***REMOVED***fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 z-50 pointer-events-none flex flex-col***REMOVED***>
                  <div className=***REMOVED***absolute top-10 left-10 right-10 bottom-10 bg-white border-2 border-slate-400 rounded-lg shadow-lg pointer-events-auto flex flex-col***REMOVED***>
                  <Cross2Icon className=***REMOVED***absolute top-4 right-4 cursor-pointer***REMOVED*** onClick={() => { setShow(false) }} />
                  <h2 className=***REMOVED***p-4 text-xl ***REMOVED***>Create schema from object</h2>
                  <ObjectToSchema setShow={setShow} onUpdate={onUpdate} />
                  </div>
                </div>
              : <></>
          }

        </>
  )
}

const ObjectToSchema = ({
  setShow,
  onUpdate
}: {
  setShow: (t: boolean) => void
  onUpdate?: (newSchema: JSONSchema6 | undefined) => void

}): ReactElement => {
  const [schema, setSchema] = useState<JSONSchema6 | undefined>(undefined)
  return (
    <div className=***REMOVED***flex flex-row flex-grow***REMOVED***>
        <div className=***REMOVED***w-[50%] h-full  p-5***REMOVED***>
        <JSONInputLoader
            field={{
              id: ***REMOVED***object_input***REMOVED***,
              type: ***REMOVED***json***REMOVED***,
              settings: { allowEmpty: true },
              description: ***REMOVED***Paste JSON or YAML here that you want to convert to a schema.***REMOVED***
            }}
            value={undefined}
            onChange={(v) => {
              setSchema(objectToSchema(v))
            }}
            />
        </div>
        <div className=***REMOVED***flex-grow p-5 relative***REMOVED***>
          <div className=***REMOVED***bg-slate-200 h-full p-4 overflow-auto max-h-[600px]***REMOVED***>
            {
              <pre className=***REMOVED***whitespace-pre text-xs***REMOVED***>
                {schema !== undefined
                  ? JSON.stringify(schema, null, 2)
                  : ***REMOVED***Waiting on object input***REMOVED***}
              </pre>
            }
          </div>
                      {
              schema !== undefined
                ? <>
                  <span className=***REMOVED***absolute top-10 right-10***REMOVED***>
                    <CopyButton
                      string={JSON.stringify(schema, null, 2)}
                      OnCopiedElement={<>Copied <CheckIcon className=***REMOVED*** inline w-16 h-8***REMOVED*** /></>}
                      ToCopyElement={<>Copy <CopyIcon className=***REMOVED*** inline w-16 h-8***REMOVED*** /></>}
                    />
                  </span>
                  <span className=***REMOVED***absolute top-20 right-10 cursor-pointer***REMOVED*** onClick={() => {
                    if (onUpdate !== undefined) {
                      onUpdate(schema)
                    }
                    setShow(false)
                  }}>
                    Copy into form and close modal
                      <CopyIcon className=***REMOVED***ml-4 -mr-4 inline w-8 h-8***REMOVED*** />
                      <ArrowDownIcon className=***REMOVED***inline w-14 h-4***REMOVED*** />
                  </span>
                  </>
                : <></>
            }
        </div>
      </div>
  )
}

export default ObjectToSchema
