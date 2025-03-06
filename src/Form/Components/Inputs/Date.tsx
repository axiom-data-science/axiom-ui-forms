import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import React, { type ReactElement, useState, useEffect } from ***REMOVED***react***REMOVED***

const DateInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  if (field.type !== ***REMOVED***date***REMOVED***) {
    return <p>Field config for {field.id} is missing &apos;options&apos;</p>
  }
  const [inputValue, setInputValue] = useState(***REMOVED******REMOVED***)
  const [error, setError] = useState<string | null>(null)
  const { minDate, maxDate } = field.constraints ?? {}

  useEffect(() => {
    setInputValue(formatValue(value as string))
  }, [value])

  // Convert the value to the format expected by date input (YYYY-MM-DD)
  const formatValue = (val: string | undefined | null): string => {
    if (!val) return ***REMOVED******REMOVED***
    try {
      // Ensure the value is in the correct format
      const date = new Date(val)
      if (isNaN(date.getTime())) return ***REMOVED******REMOVED***

      // Format to YYYY-MM-DD using UTC to avoid timezone issues
      const year = date.getUTCFullYear()
      const month = String(date.getUTCMonth() + 1).padStart(2, ***REMOVED***0***REMOVED***)
      const day = String(date.getUTCDate()).padStart(2, ***REMOVED***0***REMOVED***)

      return `${year}-${month}-${day}`
    } catch {
      return ***REMOVED******REMOVED***
    }
  }

  const validateDate = (dateStr: string): string | null => {
    if (!minDate && !maxDate) return null

    const inputDate = new Date(dateStr + ***REMOVED***T00:00:00Z***REMOVED***)
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
      const date = new Date(newInputValue + ***REMOVED***T00:00:00Z***REMOVED***)
      // Check if it***REMOVED***s a valid date and the year is reasonable (4 digits)
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

  const getConstraintMessage = (): string | null => {
    if (!minDate && !maxDate) return null
    const parts = []
    if (minDate) parts.push(`after ${formatValue(minDate)}`)
    if (maxDate) parts.push(`before ${formatValue(maxDate)}`)
    return `Must be ${parts.join(***REMOVED*** and ***REMOVED***)}`
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
        className={`border ${error ? ***REMOVED***border-red-500***REMOVED*** : ***REMOVED***border-slate-300***REMOVED***} p-2 w-full`}
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
