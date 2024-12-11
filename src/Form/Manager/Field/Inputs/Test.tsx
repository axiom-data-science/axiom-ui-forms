import { type IValueType, type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Manager/Field/FieldLabel***REMOVED***
import { type ReactNode, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import React from ***REMOVED***react***REMOVED***

interface ITestComponentProps<T> {
  label?: string | ReactNode
  onChange: (e: T | undefined) => void
}

interface ITestProps<T extends IValueType> {
  field: IFormField
  input: {
    Component: React.FC<ITestComponentProps<T>>
  }
  initialValue?: T
}

export default function Test<T extends IValueType,> ({
  field,
  input,
  initialValue

}: ITestProps<T>): ReactElement {
  const [value, setValue] = useState<T | undefined>(initialValue)
  const componentProps: ITestComponentProps<T> = {
    onChange: (e: T | undefined) => {
      setValue(e)
    }
  }

  return (
        <div>

            <input.Component label={<FieldLabel {...field} />} {...componentProps} />
            {
                value !== undefined && <div className=***REMOVED***mt-1 text-xs***REMOVED***>{String(value)}</div>
            }

        </div>
  )
}
