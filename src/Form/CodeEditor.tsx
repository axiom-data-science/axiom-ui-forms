import React, { type ReactElement, useState } from ***REMOVED***react***REMOVED***
import CodeMirror from ***REMOVED***@uiw/react-codemirror***REMOVED***
import { json } from ***REMOVED***@codemirror/lang-json***REMOVED***
import { yaml } from ***REMOVED***@codemirror/lang-yaml***REMOVED***
import { autocompletion } from ***REMOVED***@codemirror/autocomplete***REMOVED***
import { EditorView } from ***REMOVED***@codemirror/view***REMOVED***
import yamlParser from ***REMOVED***js-yaml***REMOVED***
import { Button } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { ExclamationTriangleIcon, UpdateIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***

const JsonYamlEditor = (): ReactElement => {
  const [format, setFormat] = useState<***REMOVED***json***REMOVED*** | ***REMOVED***yaml***REMOVED***>(***REMOVED***json***REMOVED***)
  const [value, setValue] = useState<string>(***REMOVED***{\n  "key": "value"\n}***REMOVED***)
  const [error, setError] = useState<string | null>(null)

  // Validate JSON and display error
  const validateJson = (val: string): void => {
    try {
      JSON.parse(val)
      setError(null) // Clear error if valid
    } catch (err) {
      setError(***REMOVED***Invalid JSON: ***REMOVED*** + (err as Error).message)
    }
  }

  const validateYaml = (val: string): void => {
    try {
      yamlParser.load(val)
      setError(null)
    } catch (err) {
      setError(***REMOVED***Invalid YAML: ***REMOVED*** + (err as Error).message)
    }
  }

  // Handle content change
  const handleChange = (val: string): void => {
    setValue(val)
    if (format === ***REMOVED***json***REMOVED***) validateJson(val)
    else if (format === ***REMOVED***yaml***REMOVED***) validateYaml(val)
  }

  // Format JSON or YAML
  const handleFormat = (): void => {
    try {
      if (format === ***REMOVED***json***REMOVED***) {
        const jsonObject = JSON.parse(value)
        setValue(JSON.stringify(jsonObject, null, 2))
        validateJson(value)
      } else {
        const yamlObject = yamlParser.load(value)
        setValue(yamlParser.dump(yamlObject))
      }
      setError(null)
    } catch (error) {
      setError(***REMOVED***Formatting failed: Invalid data.***REMOVED***)
    }
  }

  const updateFormat = (newFormat: ***REMOVED***json***REMOVED*** | ***REMOVED***yaml***REMOVED***): void => {
    try {
      if (newFormat === ***REMOVED***yaml***REMOVED***) {
        const jsonObject = JSON.parse(value)
        setValue(yamlParser.dump(jsonObject))
        setFormat(***REMOVED***yaml***REMOVED***)
        setError(null)
      } else {
        const yamlObject = yamlParser.load(value)
        const jsonString = JSON.stringify(yamlObject, null, 2)
        setValue(jsonString)
        validateJson(jsonString)
        setFormat(***REMOVED***json***REMOVED***)
      }
    } catch (error) {
      setError(***REMOVED***Format conversion failed: Invalid data.***REMOVED***)
    }
  }

  const btnClass = ***REMOVED***border-0***REMOVED***

  return (
    <div className=***REMOVED***h-full p-20 overflow-auto flex flex-col***REMOVED***>
    <div className=***REMOVED***flex flex-row***REMOVED***>
        <Button size=***REMOVED***xs***REMOVED*** className={`${btnClass}${format !== ***REMOVED***json***REMOVED*** ? ***REMOVED*** font-normal***REMOVED*** : ***REMOVED******REMOVED***}`} onClick={() => { updateFormat(***REMOVED***json***REMOVED***) }}>JSON</Button>
        <Button size=***REMOVED***xs***REMOVED*** className={`${btnClass}${format !== ***REMOVED***yaml***REMOVED*** ? ***REMOVED*** font-normal***REMOVED*** : ***REMOVED******REMOVED***}`} onClick={() => { updateFormat(***REMOVED***yaml***REMOVED***) }}>YAML</Button>
        <div className="ml-auto">
        <Button size=***REMOVED***xs***REMOVED*** className={btnClass} onClick={() => { handleFormat() }}>Format <UpdateIcon className=***REMOVED***inline w-3 h-3 -mt-1 ml-1***REMOVED*** /></Button>
        </div>
      </div>
      <div className=***REMOVED***relative h-full***REMOVED***>
      {error && <p className="text-red-500 text-xs mb-2 absolute bg-white bg-opacity-90 max-w-[50%] p-2 right-0 z-50"><ExclamationTriangleIcon className=***REMOVED***inline w-3 h-3 -mt-1 mr-1***REMOVED*** /> {error}</p>}
      <CodeMirror
        value={value}
        className=***REMOVED***h-full***REMOVED***
        height="100%"
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
