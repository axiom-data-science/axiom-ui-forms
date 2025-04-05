import React, { type ReactElement, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { yaml } from '@codemirror/lang-yaml'
import { autocompletion } from '@codemirror/autocomplete'
import { EditorView } from '@codemirror/view'
import yamlParser from 'js-yaml'
import { Button } from '@axdspub/axiom-ui-utilities'
import { ExclamationTriangleIcon, UpdateIcon } from '@radix-ui/react-icons'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import FieldLabel from '@/Form/Components/FieldLabel'
import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'

const getFormatted = (val: string, fmt: string): string => {
  if (fmt === 'json') {
    const jsonObject = JSON.parse(val)
    return JSON.stringify(jsonObject, null, 2)
  } else {
    const yamlObject = yamlParser.load(val)
    return yamlParser.dump(yamlObject)
  }
}

const tryGetFormatted = (val: string, fmt: string): string => {
  try {
    return getFormatted(val, fmt)
  } catch (error) {
    return val
  }
}

const JsonYamlEditor = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const [format, setFormat] = useState<'json' | 'yaml'>('json')
  const [workingValue, setWorkingValue] = useState<string>(typeof value === 'object'
    ? JSON.stringify(value, null, 2)
    : (value !== undefined && value !== null
        ? tryGetFormatted(String(value), format)
        : ''
      )
  )
  const [error, setError] = useState<string | null>(null)

  // Validate JSON and display error
  const validateJson = (val: string): void => {
    try {
      if (val.trim() !== '') {
        JSON.parse(val)
      }
      setError(null) // Clear error if valid
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message)
    }
  }

  const validateYaml = (val: string): void => {
    try {
      if (val.trim() !== '') {
        yamlParser.load(val)
      }
      setError(null)
    } catch (err) {
      setError('Invalid YAML: ' + (err as Error).message)
    }
  }

  // Handle content change
  const handleChange = (val: string): void => {
    setWorkingValue(val)
    if (format === 'json') {
      validateJson(val)
      onChange(val)
    } else if (format === 'yaml') {
      validateYaml(val)
      const ob = yamlParser.load(val)
      const json = JSON.stringify(ob, null, 2)
      validateJson(json)
      onChange(json)
    }
  }

  // Format JSON or YAML
  const handleFormat = (): void => {
    try {
      setWorkingValue(getFormatted(workingValue, format))
      setError(null)
    } catch (error) {
      setError('Formatting failed: Invalid data.')
    }
  }

  const updateFormat = (newFormat: 'json' | 'yaml'): void => {
    try {
      if (newFormat === 'yaml') {
        if (workingValue.trim() !== '') {
          const jsonObject = JSON.parse(workingValue)
          setWorkingValue(yamlParser.dump(jsonObject))
        }
        setFormat('yaml')
        setError(null)
      } else {
        if (workingValue.trim() !== '') {
          const yamlObject = yamlParser.load(workingValue)
          const jsonString = JSON.stringify(yamlObject, null, 2)
          setWorkingValue(jsonString)
          validateJson(jsonString)
        }
        setFormat('json')
      }
    } catch (error) {
      setError('Format conversion failed: Invalid data.')
    }
  }

  const btnClass = 'border-0 rounded-none'

  return (
    <div className='flex flex-col'>
      <FieldLabel {...field} />
      <div className='flex flex-row'>
        <Button size='xs' disabled={error !== null} className={`${btnClass} ${format !== 'json' ? 'font-normal' : 'text-white bg-[#282c34]'}`} onClick={() => { updateFormat('json') }}>JSON</Button>
        <Button size='xs' disabled={error !== null} className={`${btnClass} ${format !== 'yaml' ? 'font-normal' : 'text-white bg-[#282c34]'}`} onClick={() => { updateFormat('yaml') }}>YAML</Button>
        <div className="ml-auto">
        <Button size='xs' className={btnClass} onClick={() => { handleFormat() }}>Format <UpdateIcon className='inline w-3 h-3 -mt-1 ml-1' /></Button>
        </div>
      </div>
      <div className=' relative flex-grow'>
        <span className='absolute right-6 bottom-4 pointer-events-auto z-50'>
        <CopyButton string={
          error === null && workingValue !== ''
            ? format === 'json'
              ? JSON.stringify(JSON.parse(workingValue), null, 2)
              : yamlParser.dump(workingValue)
            : workingValue
        } className='white z-50' />
        </span>
      {error && <p className="text-red-500 text-xs mb-2 absolute bg-white bg-opacity-90 max-w-[50%] p-2 right-0 z-50"><ExclamationTriangleIcon className='inline w-3 h-3 -mt-1 mr-1' /> {error}</p>}
      <CodeMirror
        value={workingValue}
        className='h-full'
        height='550px'
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
