import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import React, { type ReactElement } from 'react'

const DateInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  // Convert the value to the format expected by date input (YYYY-MM-DD)
  const formatValue = (val: string | undefined | null): string => {
    if (!val) return ''
    try {
      // Ensure the value is in the correct format
      const date = new Date(val)
      if (isNaN(date.getTime())) return ''

      // Format to YYYY-MM-DD
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    } catch {
      return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value ? new Date(e.target.value).toISOString() : undefined
    onChange(newValue)
  }

  return (
    <div>
      <label htmlFor={field.id}>
        <FieldLabel {...field} />
      </label>
      <input
        id={field.id}
        className="border border-slate-300 p-2 w-full"
        data-testid={field.id}
        type="date"
        value={formatValue(value as string)}
        onChange={handleChange}
      />
    </div>
  )
}

export default DateInput
