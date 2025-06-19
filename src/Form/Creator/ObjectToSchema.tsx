import JSONInputLoader from '@/Form/Components/Inputs/JSONInputLoader'
import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'
import { Button } from '@axdspub/axiom-ui-utilities'

import { CheckIcon, CopyIcon, ArrowDownIcon, Cross2Icon } from '@radix-ui/react-icons'
import { type JSONSchema6 } from 'json-schema'
import React, { type ReactElement, useState } from 'react'
import toJsonSchema from 'to-json-schema'

export const objectToSchema = (ob: unknown): JSONSchema6 => {
  return toJsonSchema(ob) as JSONSchema6
}

export const ObjectToSchemaButton = ({
  onUpdate,
  size = 'md',
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
          type='create'
          size={size}
          className={className ?? 'inline-block absolute top-4 right-4'}
          onClick={() => {
            setShow(!show)
          }}
          >Create schema from object</Button>
          {
            show
              ? <div className='fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 z-50 pointer-events-none flex flex-col'>
                  <div className='absolute top-10 left-10 right-10 bottom-10 bg-white border-2 border-slate-400 rounded-lg shadow-lg pointer-events-auto flex flex-col'>
                  <Cross2Icon className='absolute top-4 right-4 cursor-pointer' onClick={() => { setShow(false) }} />
                  <h2 className='p-4 text-xl '>Create schema from object</h2>
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
    <div className='flex flex-row flex-grow'>
        <div className='w-[50%] h-full  p-5'>
        <JSONInputLoader
            field={{
              id: 'object_input',
              type: 'json',
              settings: { allowEmpty: true },
              description: 'Paste JSON or YAML here that you want to convert to a schema.'
            }}
            value={undefined}
            onChange={(v) => {
              setSchema(objectToSchema(v))
            }}
            />
        </div>
        <div className='flex-grow p-5 relative'>
          <div className='bg-slate-200 h-full p-4 overflow-auto max-h-[600px]'>
            {
              <pre className='whitespace-pre text-xs'>
                {schema !== undefined
                  ? JSON.stringify(schema, null, 2)
                  : 'Waiting on object input'}
              </pre>
            }
          </div>
                      {
              schema !== undefined
                ? <>
                  <span className='absolute top-10 right-10'>
                    <CopyButton
                      string={JSON.stringify(schema, null, 2)}
                      OnCopiedElement={<>Copied <CheckIcon className=' inline w-16 h-8' /></>}
                      ToCopyElement={<>Copy <CopyIcon className=' inline w-16 h-8' /></>}
                    />
                  </span>
                  <span className='absolute top-20 right-10 cursor-pointer' onClick={() => {
                    if (onUpdate !== undefined) {
                      onUpdate(schema)
                    }
                    setShow(false)
                  }}>
                    Copy into form and close modal
                      <CopyIcon className='ml-4 -mr-4 inline w-8 h-8' />
                      <ArrowDownIcon className='inline w-14 h-4' />
                  </span>
                  </>
                : <></>
            }
        </div>
      </div>
  )
}

export default ObjectToSchema
