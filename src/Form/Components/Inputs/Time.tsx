import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const TimeInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  // Convert the value to the format expected by time input (hh:mm)
  const formatValue = (val: string | undefined | null): string => {
    if (!val) return ***REMOVED******REMOVED***
    try {
      // Ensure the value is in the correct format
      const date = new Date(val)
      if (isNaN(date.getTime())) return ***REMOVED******REMOVED***

      // Format to hh:mm
      const hours = String(date.getHours()).padStart(2, ***REMOVED***0***REMOVED***)
      const minutes = String(date.getMinutes()).padStart(2, ***REMOVED***0***REMOVED***)

      return `${hours}:${minutes}`
    } catch {
      return ***REMOVED******REMOVED***
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
