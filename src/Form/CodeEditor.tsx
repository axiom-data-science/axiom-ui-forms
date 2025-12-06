"use client";
import React, { type ReactElement, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { yaml } from '@codemirror/lang-yaml'
import { autocompletion } from '@codemirror/autocomplete'
import { EditorView } from '@codemirror/view'
import yamlParser from 'js-yaml'
import { Button } from '@axdspub/axiom-ui-utilities'
import { ExclamationTriangleIcon, UpdateIcon } from '@radix-ui/react-icons'

const JsonYamlEditor = (): ReactElement => {
  const [format, setFormat] = useState<'json' | 'yaml'>('json')
  const [value, setValue] = useState<string>('{\n  "key": "value"\n}')
  const [error, setError] = useState<string | null>(null)

  // Validate JSON and display error
  const validateJson = (val: string): void => {
    try {
      JSON.parse(val)
      setError(null) // Clear error if valid
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message)
    }
  }

  const validateYaml = (val: string): void => {
    try {
      yamlParser.load(val)
      setError(null)
    } catch (err) {
      setError('Invalid YAML: ' + (err as Error).message)
    }
  }

  // Handle content change
  const handleChange = (val: string): void => {
    setValue(val)
    if (format === 'json') validateJson(val)
    else if (format === 'yaml') validateYaml(val)
  }

  // Format JSON or YAML
  const handleFormat = (): void => {
    try {
      if (format === 'json') {
        const jsonObject = JSON.parse(value)
        setValue(JSON.stringify(jsonObject, null, 2))
        validateJson(value)
      } else {
        const yamlObject = yamlParser.load(value)
        setValue(yamlParser.dump(yamlObject))
      }
      setError(null)
    } catch (error) {
      setError('Formatting failed: Invalid data.')
    }
  }

  const updateFormat = (newFormat: 'json' | 'yaml'): void => {
    try {
      if (newFormat === 'yaml') {
        const jsonObject = JSON.parse(value)
        setValue(yamlParser.dump(jsonObject))
        setFormat('yaml')
        setError(null)
      } else {
        const yamlObject = yamlParser.load(value)
        const jsonString = JSON.stringify(yamlObject, null, 2)
        setValue(jsonString)
        validateJson(jsonString)
        setFormat('json')
      }
    } catch (error) {
      setError('Format conversion failed: Invalid data.')
    }
  }

  const btnClass = 'border-0'

  return (
    <div className='h-full p-20 overflow-auto flex flex-col'>
    <div className='flex flex-row'>
        <Button size='xs' className={`${btnClass}${format !== 'json' ? ' font-normal' : ''}`} onClick={() => { updateFormat('json') }}>JSON</Button>
        <Button size='xs' className={`${btnClass}${format !== 'yaml' ? ' font-normal' : ''}`} onClick={() => { updateFormat('yaml') }}>YAML</Button>
        <div className="ml-auto">
        <Button size='xs' className={btnClass} onClick={() => { handleFormat() }}>Format <UpdateIcon className='inline w-3 h-3 -mt-1 ml-1' /></Button>
        </div>
      </div>
      <div className='relative h-full'>
      {error && <p className="text-red-500 text-xs mb-2 absolute bg-white bg-opacity-90 max-w-[50%] p-2 right-0 z-50"><ExclamationTriangleIcon className='inline w-3 h-3 -mt-1 mr-1' /> {error}</p>}
      <CodeMirror
        value={value}
        className='h-full'
        height="100%"
        extensions={[
          format === 'json' ? json() : yaml(),
          autocompletion(),
          EditorView.lineWrapping
        ]}
        onChange={handleChange}
        theme="dark"
      />
      </div>

    </div>
  )
}

export default JsonYamlEditor
