import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps, type ITextField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Input } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const StringInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const initialValue = (value !== undefined && value !== null) ? String(value) : ***REMOVED******REMOVED***
  const textField = field as ITextField
  /* const [val, setVal] = useState<string | undefined>(initialValue !== undefined && initialValue !== null ? String(initialValue) : ***REMOVED******REMOVED***)
  useDeferredValue(val)
  const newVal = useDeferredValue(val)
  useEffect(() => {
    onChange(newVal === ***REMOVED******REMOVED*** ? undefined : newVal)
  }, [newVal]) */
  return <div>
      <Input
        id={field.id}
        testId={field.id}
        value={initialValue}
        placeholder={textField.placeholder}
        label={<FieldLabel {...field} />} onChange={(e) => {
          onChange((e === ***REMOVED******REMOVED*** || e === null) ? undefined : e)
        }} /></div>
}

export default StringInput
