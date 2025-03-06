import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import React, { type ReactElement, useState, useEffect } from 'react'

const DateInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue(formatValue(value as string))
  }, [value])

  // Convert the value to the format expected by date input (YYYY-MM-DD)
  const formatValue = (val: string | undefined | null): string => {
    if (!val) return ''
    try {
      // Ensure the value is in the correct format
      const date = new Date(val)
      if (isNaN(date.getTime())) return ''

      // Format to YYYY-MM-DD using UTC to avoid timezone issues
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, '0')
      const day = String(date.getUTCDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    } catch {
      return ''
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newInputValue = e.target.value
    setInputValue(newInputValue)

    // Only notify parent of change if we have a complete valid date
    if (newInputValue) {
      // Create date in UTC by appending T00:00:00Z to the input value
      const date = new Date(newInputValue + 'T00:00:00Z')
      // Check if it's a valid date and the year is reasonable (4 digits)
      if (!isNaN(date.getTime()) && date.getUTCFullYear() > 999) {
        onChange(date.toISOString())
      }
    } else {
      onChange(undefined)
    }
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
        value={inputValue}
        onChange={handleChange}
      />
    </div>
  )
}

export default DateInput
