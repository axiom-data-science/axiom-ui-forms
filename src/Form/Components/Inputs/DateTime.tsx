import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import React, { type ReactElement, useState } from ***REMOVED***react***REMOVED***

const DateTimeInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const [error, setError] = useState<string | null>(null)

  if (field.type !== ***REMOVED***datetime***REMOVED***) {
    return <p>Field config for {field.id} is missing &apos;options&apos;</p>
  }
  const { minDateTime, maxDateTime } = field.constraints ?? {}

  // Convert the value to the format expected by datetime-local input (YYYY-MM-DDThh:mm)
  const formatValue = (val: string | undefined | null): string => {
    if (!val) return ***REMOVED******REMOVED***
    try {
      // Ensure the value is in the correct format
      const date = new Date(val)
      if (isNaN(date.getTime())) return ***REMOVED******REMOVED***

      // Format to YYYY-MM-DDThh:mm
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, ***REMOVED***0***REMOVED***)
      const day = String(date.getDate()).padStart(2, ***REMOVED***0***REMOVED***)
      const hours = String(date.getHours()).padStart(2, ***REMOVED***0***REMOVED***)
      const minutes = String(date.getMinutes()).padStart(2, ***REMOVED***0***REMOVED***)

      return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch {
      return ***REMOVED******REMOVED***
    }
  }

  const validateDateTime = (date: Date): string | null => {
    if (minDateTime && date < new Date(minDateTime)) {
      return `Date must be after ${new Date(minDateTime).toLocaleString()}`
    }
    if (maxDateTime && date > new Date(maxDateTime)) {
      return `Date must be before ${new Date(maxDateTime).toLocaleString()}`
    }
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value

    // If we have a partial datetime (e.g., just started typing), don***REMOVED***t update
    if (inputValue && inputValue.length < 16) { // 16 is the length of a complete datetime-local value
      return
    }

    if (inputValue) {
      const date = new Date(inputValue)
      if (!isNaN(date.getTime())) {
        const validationError = validateDateTime(date)
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
    if (!minDateTime && !maxDateTime) return null
    const parts = []
    if (minDateTime) parts.push(`after ${new Date(minDateTime).toLocaleString()}`)
    if (maxDateTime) parts.push(`before ${new Date(maxDateTime).toLocaleString()}`)
    return `Must be ${parts.join(***REMOVED*** and ***REMOVED***)}`
  }

  const constraintMessage = getConstraintMessage()

  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-2">
        <label htmlFor={field.id} className="flex-1 min-w-[200px]">
          <FieldLabel field={field} disabled={disabled} />
        </label>
        {constraintMessage && (
          <span className="text-sm text-slate-500 italic">
            {constraintMessage}
          </span>
        )}
      </div>
      <input
        id={field.id}
        disabled={disabled}
        className={`border ${error ? ***REMOVED***border-red-500***REMOVED*** : ***REMOVED***border-slate-300***REMOVED***} p-2 w-full${disabled ? ***REMOVED*** opacity-50 cursor-not-allowed***REMOVED*** : ***REMOVED******REMOVED***}`}
        data-testid={field.id}
        type="datetime-local"
        value={formatValue(value as string)}
        onChange={handleChange}
        min={minDateTime ? formatValue(minDateTime) : undefined}
        max={maxDateTime ? formatValue(maxDateTime) : undefined}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export default DateTimeInput
