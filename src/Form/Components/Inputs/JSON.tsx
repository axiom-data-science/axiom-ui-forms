import React, { type ReactElement, useEffect, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'
import { yaml } from '@codemirror/lang-yaml'
import { autocompletion } from '@codemirror/autocomplete'
import { EditorView } from '@codemirror/view'
import yamlParser from 'js-yaml'
import { Button } from '@axdspub/axiom-ui-utilities'
import { ExclamationTriangleIcon, UpdateIcon } from '@radix-ui/react-icons'
import { type IJSONField, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import FieldLabel from '@/Form/Components/FieldLabel'
import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'
import { debounce } from 'lodash-es'

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

const JsonYamlEditor = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const jsonField = field as IJSONField
  const exportAsString = jsonField?.settings?.exportAsString ?? false
  const allowEmpty = jsonField?.settings?.allowEmpty ?? false
  const [format, setFormat] = useState<'json' | 'yaml'>('json')
  const [workingValue, setWorkingValue] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [hasFocus, setHasFocus] = useState(false)

  useEffect(() => {
    if (!hasFocus) {
      setWorkingValue(
        typeof value === 'object'
          ? JSON.stringify(value, null, 2)
          : (value !== undefined && value !== null
            ? tryGetFormatted(String(value), format)
            : allowEmpty
              ? ''
              : '{}'
          )
      )
    }
  }, [value])

  // Validate JSON and display error
  const validateJson = (val: string): boolean => {
    try {
      if (val.trim() === '') {
        setError(null)
        return true
      }
      JSON.parse(val)
      setError(null) // Clear error if valid
      return true
    } catch (err) {
      setError('Invalid JSON: ' + (err as Error).message)
      return false
    }
  }

  const validateYaml = (val: string): boolean => {
    try {
      if (val.trim() === '') {
        setError(null)
        return true
      }
      yamlParser.load(val)
      setError(null)
      return true
    } catch (err) {
      setError('Invalid YAML: ' + (err as Error).message)
      return false
    }
  }

  // Handle content change
  const handleChange = (val: string): void => {
    setWorkingValue(val)
    if (format === 'json') {
      if (validateJson(val)) {
        if (!allowEmpty && val.trim() === '') {
          val = '{}'
        }
        onChange(exportAsString ? val : JSON.parse(val))
      }
    } else if (format === 'yaml') {
      if (validateYaml(val)) {
        const json = JSON.stringify(val === '' && !allowEmpty ? '{}' : yamlParser.load(val), null, 2)
        if (validateJson(json)) {
          onChange(exportAsString ? json : JSON.parse(json))
        }
      }
    }
  }

  const debounced = debounce(handleChange, 500)

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
    <div className='flex flex-col h-full relative'>
      <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
      <div className='flex flex-row'>
        <Button size='xs' disabled={error !== null} className={`${btnClass} ${format !== 'json' ? 'font-normal' : 'text-white bg-[#282c34]'}`} onClick={() => { updateFormat('json') }}>JSON</Button>
        <Button size='xs' disabled={error !== null} className={`${btnClass} ${format !== 'yaml' ? 'font-normal' : 'text-white bg-[#282c34]'}`} onClick={() => { updateFormat('yaml') }}>YAML</Button>
        <div className="ml-auto">
          <Button size='xs' className={btnClass} onClick={() => { handleFormat() }}>Format <UpdateIcon className='inline w-3 h-3 -mt-1 ml-1' /></Button>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mb-2 absolute bg-white bg-opacity-90 max-w-[50%] p-2 right-0 z-40"><ExclamationTriangleIcon className='inline w-3 h-3 -mt-1 mr-1' /> {error}</p>}
      <span className='absolute right-6 bottom-4 pointer-events-auto z-40'>
        <CopyButton string={
          error === null && workingValue !== ''
            ? format === 'json'
              ? JSON.stringify(JSON.parse(workingValue), null, 2)
              : yamlParser.dump(workingValue)
            : workingValue
        } className='white z-40' />
      </span>
      <div className='h-full grow overflow-auto min-h-[400px]'>
        <CodeMirror
          readOnly={disabled}
          value={format === 'yaml' && workingValue === '{}' ? '' : workingValue}
          extensions={[
            format === 'json' ? json() : yaml(),
            autocompletion(),
            EditorView.lineWrapping
          ]}
          height='100%'
          minHeight='400px'
          className='h-full min-h-100'
          onChange={debounced}
          theme="dark"
          onFocus={() => {
            setHasFocus(true)
          }}
          onBlur={() => {
            setHasFocus(false)
          }}
        />
      </div>
    </div>

  )
}

export default JsonYamlEditor
