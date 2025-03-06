import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import React, { type ReactElement, useState, useEffect } from 'react'

const DateInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  if (field.type !== 'date') {
    return <p>Field config for {field.id} is missing &apos;options&apos;</p>
  }
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { minDate, maxDate } = field.constraints ?? {}

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

  const validateDate = (dateStr: string): string | null => {
    if (!minDate && !maxDate) return null

    const inputDate = new Date(dateStr + 'T00:00:00Z')
    const minDateObj = minDate ? new Date(minDate) : null
    const maxDateObj = maxDate ? new Date(maxDate) : null

    if (minDateObj && inputDate < minDateObj) {
      return `Date must be after ${formatValue(minDate)}`
    }
    if (maxDateObj && inputDate > maxDateObj) {
      return `Date must be before ${formatValue(maxDate)}`
    }
    return null
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
        const validationError = validateDate(newInputValue)
        setError(validationError)
        if (!validationError) {
          onChange(date.toISOString())
        }
      }
    } else {
      setError(null)
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
        className={`border ${error ? 'border-red-500' : 'border-slate-300'} p-2 w-full`}
        data-testid={field.id}
        type="date"
        value={inputValue}
        onChange={handleChange}
        min={minDate ? formatValue(minDate) : undefined}
        max={maxDate ? formatValue(maxDate) : undefined}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default DateInput
