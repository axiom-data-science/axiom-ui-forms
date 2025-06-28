import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps, type ITextField } from '@/Form/Creator/FormCreatorTypes'
import { Input } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const StringInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = (value !== undefined && value !== null) ? String(value) : ''
  const textField = field as ITextField
  /* const [val, setVal] = useState<string | undefined>(initialValue !== undefined && initialValue !== null ? String(initialValue) : '')
  useDeferredValue(val)
  const newVal = useDeferredValue(val)
  useEffect(() => {
    onChange(newVal === '' ? undefined : newVal)
  }, [newVal]) */
  return <div>
      <Input
        id={field.id}
        disabled={disabled}
        testId={field.id}
        value={initialValue}
        placeholder={textField.placeholder}
        label={<FieldLabel field={field} disabled={disabled} />} onChange={(e) => {
          onChange((e === '' || e === null) ? undefined : e)
        }} /></div>
}

export default StringInput
