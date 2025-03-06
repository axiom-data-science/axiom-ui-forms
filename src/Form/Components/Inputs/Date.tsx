import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import React, { type ReactElement, useState, useEffect } from ***REMOVED***react***REMOVED***

const DateInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const [inputValue, setInputValue] = useState(***REMOVED******REMOVED***)

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newInputValue = e.target.value
    setInputValue(newInputValue)

    // Only notify parent of change if we have a complete valid date
    if (newInputValue) {
      // Create date in UTC by appending T00:00:00Z to the input value
      const date = new Date(newInputValue + ***REMOVED***T00:00:00Z***REMOVED***)
      // Check if it***REMOVED***s a valid date and the year is reasonable (4 digits)
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
