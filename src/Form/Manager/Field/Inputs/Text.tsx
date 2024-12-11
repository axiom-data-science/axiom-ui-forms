import { type IFormField } from '@/Form/FormCreatorTypes'
import FieldLabel from '@/Form/Manager/Field/FieldLabel'
import formValuesAtom from '@/state/formValuesAtom'
import { Input, type ITextInputProps } from '@axdspub/axiom-ui-utilities'
import { useAtom } from 'jotai'
import React, { useEffect, useState, type ReactElement } from 'react'

const Text = ({ field, onChange, InputComponent }: { field: IFormField, onChange: () => void, InputComponent?: React.FC<ITextInputProps> }): ReactElement => {
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  const [value, setValue] = useState<string>(formValues[field.id] !== undefined ? String(formValues[field.id]) : '')

  useEffect(() => {
    formValues[field.id] = value
    setFormValues({ ...formValues })
  }, [value])
  useEffect(() => {
    setValue(formValues[field.id] !== undefined ? String(formValues[field.id]) : '')
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
                      setValue(e !== undefined ? String(e) : '')
                      onChange()
                    }} />
  )
}

export default Text
