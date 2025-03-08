import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import React, { useState, type ReactElement } from 'react'

const JSONStringInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const [error, setError] = useState<string | undefined>(undefined)
  const initialValue = value !== undefined ? value : ''
  const getValue = (): string => {
    return initialValue !== undefined && initialValue !== null
      ? typeof initialValue === 'object'
        ? JSON.stringify(initialValue, null, 2)
        : String(initialValue)
      : ''
  }
  return <div>
      <TextArea
        error={error}
        className={
            [
              'min-h-[500px] bg-slate-50 rounded-lg shadow-inner'
              // 'p-0 bg-[repeating-linear-gradient(to_bottom,var(--tw-gradient-stops))] from-[#efefef] from-[length:0_25px] to-[#FFF] to-[length:25px_50px]'
            ].join(' ')
        }
        id={field.id}
        testId={field.id}
        label={<FieldLabel {...field} />}
        value={getValue()}
        onChange={(e) => {
          try {
            JSON.parse(e ?? '')
            onChange(JSON.parse(e ?? ''))
            setError(undefined)
          } catch (e) {
            setError('Invalid JSON')
          }
        }} /></div>
}

export default JSONStringInput
