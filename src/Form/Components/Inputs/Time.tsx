import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import React, { type ReactElement } from 'react'

const TimeInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  // Convert the value to the format expected by time input (hh:mm)
  const formatValue = (val: string | undefined | null): string => {
    if (!val) return ''
    try {
      // Ensure the value is in the correct format
      const date = new Date(val)
      if (isNaN(date.getTime())) return ''

      // Format to hh:mm
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${hours}:${minutes}`
    } catch {
      return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value ? new Date(`1970-01-01T${e.target.value}`).toISOString() : undefined
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
        type="time"
        value={formatValue(value as string)}
        onChange={handleChange}
      />
    </div>
  )
}

export default TimeInput
