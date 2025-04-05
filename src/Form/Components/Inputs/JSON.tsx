import React, { type ReactElement, useState } from ***REMOVED***react***REMOVED***
import CodeMirror from ***REMOVED***@uiw/react-codemirror***REMOVED***
import { json } from ***REMOVED***@codemirror/lang-json***REMOVED***
import { yaml } from ***REMOVED***@codemirror/lang-yaml***REMOVED***
import { autocompletion } from ***REMOVED***@codemirror/autocomplete***REMOVED***
import { EditorView } from ***REMOVED***@codemirror/view***REMOVED***
import yamlParser from ***REMOVED***js-yaml***REMOVED***
import { Button } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { ExclamationTriangleIcon, UpdateIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { CopyButton } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***

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

const JsonYamlEditor = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const [format, setFormat] = useState<***REMOVED***json***REMOVED*** | ***REMOVED***yaml***REMOVED***>(***REMOVED***json***REMOVED***)
  const [workingValue, setWorkingValue] = useState<string>(typeof value === ***REMOVED***object***REMOVED***
    ? JSON.stringify(value, null, 2)
    : (value !== undefined && value !== null
        ? tryGetFormatted(String(value), format)
        : ***REMOVED******REMOVED***
      )
  )
  const [error, setError] = useState<string | null>(null)

  // Validate JSON and display error
  const validateJson = (val: string): void => {
    try {
      if (val.trim() !== ***REMOVED******REMOVED***) {
        JSON.parse(val)
      }
      setError(null) // Clear error if valid
    } catch (err) {
      setError(***REMOVED***Invalid JSON: ***REMOVED*** + (err as Error).message)
    }
  }

  const validateYaml = (val: string): void => {
    try {
      if (val.trim() !== ***REMOVED******REMOVED***) {
        yamlParser.load(val)
      }
      setError(null)
    } catch (err) {
      setError(***REMOVED***Invalid YAML: ***REMOVED*** + (err as Error).message)
    }
  }

  // Handle content change
  const handleChange = (val: string): void => {
    setWorkingValue(val)
    if (format === ***REMOVED***json***REMOVED***) {
      validateJson(val)
      onChange(val)
    } else if (format === ***REMOVED***yaml***REMOVED***) {
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
    <div className=***REMOVED***flex flex-col***REMOVED***>
      <FieldLabel {...field} />
      <div className=***REMOVED***flex flex-row***REMOVED***>
        <Button size=***REMOVED***xs***REMOVED*** disabled={error !== null} className={`${btnClass} ${format !== ***REMOVED***json***REMOVED*** ? ***REMOVED***font-normal***REMOVED*** : ***REMOVED***text-white bg-[#282c34]***REMOVED***}`} onClick={() => { updateFormat(***REMOVED***json***REMOVED***) }}>JSON</Button>
        <Button size=***REMOVED***xs***REMOVED*** disabled={error !== null} className={`${btnClass} ${format !== ***REMOVED***yaml***REMOVED*** ? ***REMOVED***font-normal***REMOVED*** : ***REMOVED***text-white bg-[#282c34]***REMOVED***}`} onClick={() => { updateFormat(***REMOVED***yaml***REMOVED***) }}>YAML</Button>
        <div className="ml-auto">
        <Button size=***REMOVED***xs***REMOVED*** className={btnClass} onClick={() => { handleFormat() }}>Format <UpdateIcon className=***REMOVED***inline w-3 h-3 -mt-1 ml-1***REMOVED*** /></Button>
        </div>
      </div>
      <div className=***REMOVED*** relative flex-grow***REMOVED***>
        <span className=***REMOVED***absolute right-6 bottom-4 pointer-events-auto z-50***REMOVED***>
        <CopyButton string={
          error === null && workingValue !== ***REMOVED******REMOVED***
            ? format === ***REMOVED***json***REMOVED***
              ? JSON.stringify(JSON.parse(workingValue), null, 2)
              : yamlParser.dump(workingValue)
            : workingValue
        } className=***REMOVED***white z-50***REMOVED*** />
        </span>
      {error && <p className="text-red-500 text-xs mb-2 absolute bg-white bg-opacity-90 max-w-[50%] p-2 right-0 z-50"><ExclamationTriangleIcon className=***REMOVED***inline w-3 h-3 -mt-1 mr-1***REMOVED*** /> {error}</p>}
      <CodeMirror
        value={workingValue}
        className=***REMOVED***h-full***REMOVED***
        height=***REMOVED***550px***REMOVED***
        extensions={[
          format === ***REMOVED***json***REMOVED*** ? json() : yaml(),
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
