import { type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Manager/Field/FieldLabel***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { Input, type ITextInputProps } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***

const Text = ({ field, onChange, InputComponent }: { field: IFormField, onChange: () => void, InputComponent?: React.FC<ITextInputProps> }): ReactElement => {
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  const [value, setValue] = useState<string>(formValues[field.id] !== undefined ? String(formValues[field.id]) : ***REMOVED******REMOVED***)

  useEffect(() => {
    formValues[field.id] = value
    setFormValues({ ...formValues })
  }, [value])
  useEffect(() => {
    setValue(formValues[field.id] !== undefined ? String(formValues[field.id]) : ***REMOVED******REMOVED***)
  }, [formValues[field.id]])

  const Component = InputComponent ?? Input

  return (
                 <Component
                    label={<FieldLabel {...field} />}
                    id={field.id}
                    testId={field.id}
                    value={value}
                    onChange={(e) => {
                      field.value = e
                      setValue(e !== undefined ? String(e) : ***REMOVED******REMOVED***)
                      onChange()
                    }} />
  )
}

export default Text
