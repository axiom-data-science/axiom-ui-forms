import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const JSONStringInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const [error, setError] = useState<string | undefined>(undefined)
  const initialValue = value !== undefined ? value : ***REMOVED******REMOVED***
  const getValue = (): string => {
    return initialValue !== undefined && initialValue !== null
      ? typeof initialValue === ***REMOVED***object***REMOVED***
        ? JSON.stringify(initialValue, null, 2)
        : String(initialValue)
      : ***REMOVED******REMOVED***
  }
  return <div>
      <TextArea
        error={error}
        className={
            [
              ***REMOVED***min-h-[500px] bg-slate-50 rounded-lg shadow-inner***REMOVED***
              // ***REMOVED***p-0 bg-[repeating-linear-gradient(to_bottom,var(--tw-gradient-stops))] from-[#efefef] from-[length:0_25px] to-[#FFF] to-[length:25px_50px]***REMOVED***
            ].join(***REMOVED*** ***REMOVED***)
        }
        id={field.id}
        testId={field.id}
        label={<FieldLabel {...field} />}
        value={getValue()}
        onChange={(e) => {
          try {
            JSON.parse(e ?? ***REMOVED******REMOVED***)
            onChange(JSON.parse(e ?? ***REMOVED******REMOVED***))
            setError(undefined)
          } catch (e) {
            setError(***REMOVED***Invalid JSON***REMOVED***)
          }
        }} /></div>
}

export default JSONStringInput
