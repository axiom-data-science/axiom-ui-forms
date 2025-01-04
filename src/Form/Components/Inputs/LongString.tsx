import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const LongStringInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ***REMOVED******REMOVED***
  const getValue = (): string => {
    return initialValue !== undefined && initialValue !== null ? String(initialValue) : ***REMOVED******REMOVED***
  }
  return <div>
      <TextArea
        id={field.id}
        testId={field.id}
        label={<FieldLabel {...field} />}
        value={getValue()}
        onChange={(e) => {
          onChange(e)
        }} /><p className=***REMOVED***text-xs***REMOVED***>{getValue()}</p></div>
}

export default LongStringInput
