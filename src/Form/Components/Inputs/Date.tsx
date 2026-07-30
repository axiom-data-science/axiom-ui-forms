import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import React, { type ReactElement, useState } from 'react'

const DateInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  if (field.type !== 'date') {
    return <p>Field config for {field.id} is missing &apos;options&apos;</p>
  }

  const [error, setError] = useState<string | null>(null)
  const { minDate, maxDate } = field.constraints ?? {}

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

  const inputValue = formatValue(value as string)

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
    const newValue = e.target.value
    // Only notify parent of change if we have a complete valid date
    if (newValue) {
      // Create date in UTC by appending T00:00:00Z to the input value
      const date = new Date(newValue + 'T00:00:00Z')
      // Check if it's a valid date and the year is reasonable (4 digits)
      if (!isNaN(date.getTime()) && date.getUTCFullYear() > 999) {
        const validationError = validateDate(newValue)
        setError(validationError)
        if (!validationError) {
          onChange(date.toISOString().split('T')[0])
        }
      }
    } else {
      setError(null)
      onChange(undefined)
    }
  }

  const getConstraintMessage = (): string | null => {
    if (!minDate && !maxDate) return null
    const parts = []
    if (minDate) parts.push(`after ${formatValue(minDate)}`)
    if (maxDate) parts.push(`before ${formatValue(maxDate)}`)
    return `Must be ${parts.join(' and ')}`
  }

  const constraintMessage = getConstraintMessage()

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-2">
        <label htmlFor={field.id} className="flex-1 min-w-50">
          <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
        </label>
        {constraintMessage && (
          <span className="text-sm text-slate-500 italic">{constraintMessage}</span>
        )}
      </div>
      <input
        id={field.id}
        disabled={disabled}
        className={`border ${error ? 'border-red-500' : 'border-slate-300'} p-2 w-full${disabled ? ' opacity-50 cursor-not-allowed' : ''}`}
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
