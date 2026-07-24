import FieldLabel from '@/Form/Components/FieldLabel'
import SingleSelectInput from '@/Form/Components/Inputs/SingleSelect'
import StringInput from '@/Form/Components/Inputs/String'
import { ISelectField, IValueChangeFn, IValueType, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { SelectInput } from '@axdspub/axiom-ui-utilities'
import React, { useState, type ReactElement } from 'react'

const SelectOrTextInput = ({
  field,
  onChange,
  value,
  disabled,
  className,
}: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : ''
  const selectField = field as ISelectField
  const options = selectField.options !== undefined ? selectField.options : []
  if(options.length && !options.find((option) => option.value === 'other')) {
    options.push({ label: 'Other', value: 'other' })
  }
  const otherOption = options.find((option) => String(option.value).toLowerCase() === 'other')
  const checkInputShouldBeActive = (value: string | null | undefined): boolean => {
    if(String(value) !== '' && value !== undefined && value !== null && (String(value).toLowerCase() === 'other' || !options.find((option) => option.value === value))) {
      return true
    }
    return false
  }
  const [inputActive, setInputActive] = useState<boolean>(checkInputShouldBeActive(initialValue as string | null | undefined))
  const onChangeSelect: IValueChangeFn = (v) => {
    const shouldInputBeActive = checkInputShouldBeActive(String(v))
    setInputActive(shouldInputBeActive)
    if (v === '' || shouldInputBeActive === true) {
      onChange('')
    } else {
      onChange(v)
    }
}

  if (options.length > 0) {
    return (
      <div className='flex flex-col gap-2'>
        <SingleSelectInput
          field={{
            ...field,
            type: 'select',
            options
          }}
          onChange={onChangeSelect}
          value={inputActive ? otherOption?.value : initialValue}
          disabled={disabled}
          className={className}
        />
        {inputActive && (
            <StringInput
              field={{
                ...field,
                type: 'text',
                label: ''
              }}
              onChange={onChange}
              value={initialValue}
              disabled={disabled}
              className={className}
              />
        )}
      </div>
    )
  }
  return <p>Field config for {field.id} is missing &apos;options&apos;</p>
}

export default SelectOrTextInput
