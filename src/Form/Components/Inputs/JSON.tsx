import React, { type ReactElement, useEffect, useState } from ***REMOVED***react***REMOVED***
import CodeMirror from ***REMOVED***@uiw/react-codemirror***REMOVED***
import { json } from ***REMOVED***@codemirror/lang-json***REMOVED***
import { yaml } from ***REMOVED***@codemirror/lang-yaml***REMOVED***
import { autocompletion } from ***REMOVED***@codemirror/autocomplete***REMOVED***
import { EditorView } from ***REMOVED***@codemirror/view***REMOVED***
import yamlParser from ***REMOVED***js-yaml***REMOVED***
import { Button } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { ExclamationTriangleIcon, UpdateIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { type IJSONField, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { CopyButton } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***
import { debounce } from ***REMOVED***lodash-es***REMOVED***

const getFormatted = (val: string, fmt: string): string => {
  if (fmt === ***REMOVED***json***REMOVED***) {
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
  const [format, setFormat] = useState<***REMOVED***json***REMOVED*** | ***REMOVED***yaml***REMOVED***>(***REMOVED***json***REMOVED***)
  const [workingValue, setWorkingValue] = useState<string>(***REMOVED******REMOVED***)
  const [error, setError] = useState<string | null>(null)
  const [hasFocus, setHasFocus] = useState(false)

  useEffect(() => {
    if (!hasFocus) {
      setWorkingValue(
        typeof value === ***REMOVED***object***REMOVED***
          ? JSON.stringify(value, null, 2)
          : (value !== undefined && value !== null
              ? tryGetFormatted(String(value), format)
              : allowEmpty
                ? ***REMOVED******REMOVED***
                : ***REMOVED***{}***REMOVED***
            )
      )
    }
  }, [value])

  // Validate JSON and display error
  const validateJson = (val: string): boolean => {
    try {
      if (val.trim() === ***REMOVED******REMOVED***) {
        setError(null)
        return true
      }
      JSON.parse(val)
      setError(null) // Clear error if valid
      return true
    } catch (err) {
      setError(***REMOVED***Invalid JSON: ***REMOVED*** + (err as Error).message)
      return false
    }
  }

  const validateYaml = (val: string): boolean => {
    try {
      if (val.trim() === ***REMOVED******REMOVED***) {
        setError(null)
        return true
      }
      yamlParser.load(val)
      setError(null)
      return true
    } catch (err) {
      setError(***REMOVED***Invalid YAML: ***REMOVED*** + (err as Error).message)
      return false
    }
  }

  // Handle content change
  const handleChange = (val: string): void => {
    setWorkingValue(val)
    if (format === ***REMOVED***json***REMOVED***) {
      if (validateJson(val)) {
        if (!allowEmpty && val.trim() === ***REMOVED******REMOVED***) {
          val = ***REMOVED***{}***REMOVED***
        }
        onChange(exportAsString ? val : JSON.parse(val))
      }
    } else if (format === ***REMOVED***yaml***REMOVED***) {
      if (validateYaml(val)) {
        const json = JSON.stringify(val === ***REMOVED******REMOVED*** && !allowEmpty ? ***REMOVED***{}***REMOVED*** : yamlParser.load(val), null, 2)
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
      setError(***REMOVED***Formatting failed: Invalid data.***REMOVED***)
    }
  }

  const updateFormat = (newFormat: ***REMOVED***json***REMOVED*** | ***REMOVED***yaml***REMOVED***): void => {
    try {
      if (newFormat === ***REMOVED***yaml***REMOVED***) {
        if (workingValue.trim() !== ***REMOVED******REMOVED***) {
          const jsonObject = JSON.parse(workingValue)
          setWorkingValue(yamlParser.dump(jsonObject))
        }
        setFormat(***REMOVED***yaml***REMOVED***)
        setError(null)
      } else {
        if (workingValue.trim() !== ***REMOVED******REMOVED***) {
          const yamlObject = yamlParser.load(workingValue)
          const jsonString = JSON.stringify(yamlObject, null, 2)
          setWorkingValue(jsonString)
          validateJson(jsonString)
        }
        setFormat(***REMOVED***json***REMOVED***)
      }
    } catch (error) {
      setError(***REMOVED***Format conversion failed: Invalid data.***REMOVED***)
    }
  }

  const btnClass = ***REMOVED***border-0 rounded-none***REMOVED***

  return (
    <div className=***REMOVED***flex flex-col h-full relative***REMOVED***>
      <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
      <div className=***REMOVED***flex flex-row***REMOVED***>
        <Button size=***REMOVED***xs***REMOVED*** disabled={error !== null} className={`${btnClass} ${format !== ***REMOVED***json***REMOVED*** ? ***REMOVED***font-normal***REMOVED*** : ***REMOVED***text-white bg-[#282c34]***REMOVED***}`} onClick={() => { updateFormat(***REMOVED***json***REMOVED***) }}>JSON</Button>
        <Button size=***REMOVED***xs***REMOVED*** disabled={error !== null} className={`${btnClass} ${format !== ***REMOVED***yaml***REMOVED*** ? ***REMOVED***font-normal***REMOVED*** : ***REMOVED***text-white bg-[#282c34]***REMOVED***}`} onClick={() => { updateFormat(***REMOVED***yaml***REMOVED***) }}>YAML</Button>
        <div className="ml-auto">
        <Button size=***REMOVED***xs***REMOVED*** className={btnClass} onClick={() => { handleFormat() }}>Format <UpdateIcon className=***REMOVED***inline w-3 h-3 -mt-1 ml-1***REMOVED*** /></Button>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mb-2 absolute bg-white bg-opacity-90 max-w-[50%] p-2 right-0 z-40"><ExclamationTriangleIcon className=***REMOVED***inline w-3 h-3 -mt-1 mr-1***REMOVED*** /> {error}</p>}
      <span className=***REMOVED***absolute right-6 bottom-4 pointer-events-auto z-40***REMOVED***>
        <CopyButton string={
          error === null && workingValue !== ***REMOVED******REMOVED***
            ? format === ***REMOVED***json***REMOVED***
              ? JSON.stringify(JSON.parse(workingValue), null, 2)
              : yamlParser.dump(workingValue)
            : workingValue
        } className=***REMOVED***white z-40***REMOVED*** />
        </span>
      <div className=***REMOVED***h-full flex-grow overflow-auto min-h-[300px]***REMOVED***>
      <CodeMirror
        readOnly={disabled}
        value={format === ***REMOVED***yaml***REMOVED*** && workingValue === ***REMOVED***{}***REMOVED*** ? ***REMOVED******REMOVED*** : workingValue}
        extensions={[
          format === ***REMOVED***json***REMOVED*** ? json() : yaml(),
          autocompletion(),
          EditorView.lineWrapping
        ]}
        height=***REMOVED***100%***REMOVED***
        className=***REMOVED***h-full***REMOVED***
        onChange={debounced}
        theme="dark"
        onFocus={() => {
          console.log(***REMOVED***FOCUS***REMOVED***)
          setHasFocus(true)
        }}
        onBlur={() => {
          console.log(***REMOVED***BLUR***REMOVED***)
          setHasFocus(false)
        }}
      />
      </div>
      </div>

  )
}

export default JsonYamlEditor
