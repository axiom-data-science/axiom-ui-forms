import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import React, { type ReactElement, useState } from 'react'

const TimeInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const [error, setError] = useState<string | null>(null)

  if (field.type !== 'time') {
    return <p>Field config for {field.id} is missing &apos;options&apos;</p>
  }
  const { minTime, maxTime } = field.constraints ?? {}

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

  const validateTime = (timeStr: string): string | null => {
    if (!minTime && !maxTime) return null

    // Create reference dates for comparison using the same date
    const referenceDate = '1970-01-01'
    const inputDate = new Date(`${referenceDate}T${timeStr}`)
    const minDate = minTime ? new Date(`${referenceDate}T${minTime}`) : null
    const maxDate = maxTime ? new Date(`${referenceDate}T${maxTime}`) : null

    if (minDate && inputDate < minDate) {
      return `Time must be after ${minTime}`
    }
    if (maxDate && inputDate > maxDate) {
      return `Time must be before ${maxTime}`
    }
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value

    // If we have a partial time (e.g., just started typing hours), don't update
    if (inputValue && inputValue.length < 5) { // 5 is the length of a complete time value (HH:MM)
      return
    }

    if (inputValue) {
      const newValue = new Date(`1970-01-01T${inputValue}`).toISOString()
      const validationError = validateTime(inputValue)
      setError(validationError)
      if (!validationError) {
        onChange(newValue)
      }
    } else {
      setError(null)
      onChange(undefined)
    }
  }

  const getConstraintMessage = (): string | null => {
    if (!minTime && !maxTime) return null
    const parts = []
    if (minTime) parts.push(`after ${minTime}`)
    if (maxTime) parts.push(`before ${maxTime}`)
    return `Must be ${parts.join(' and ')}`
  }

  const constraintMessage = getConstraintMessage()

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <label htmlFor={field.id}>
          <FieldLabel {...field} />
        </label>
        {constraintMessage && (
          <span className="text-sm text-slate-500 italic">{constraintMessage}</span>
        )}
      </div>
      <input
        id={field.id}
        className={`border ${error ? 'border-red-500' : 'border-slate-300'} p-2 w-full`}
        data-testid={field.id}
        type="time"
        value={formatValue(value as string)}
        onChange={handleChange}
        min={minTime}
        max={maxTime}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default TimeInput
