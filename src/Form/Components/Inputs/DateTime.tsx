import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import React, { type ReactElement } from 'react'

const DateTimeInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  // Convert the value to the format expected by datetime-local input (YYYY-MM-DDThh:mm)
  const formatValue = (val: string | undefined | null): string => {
    if (!val) return ''
    try {
      // Ensure the value is in the correct format
      const date = new Date(val)
      if (isNaN(date.getTime())) return ''

      // Format to YYYY-MM-DDThh:mm
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${year}-${month}-${day}T${hours}:${minutes}`
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
        data-testid={field.id}
        type="datetime-local"
        value={formatValue(value as string)}
        onChange={handleChange}
      />
    </div>
  )
}

export default DateTimeInput
