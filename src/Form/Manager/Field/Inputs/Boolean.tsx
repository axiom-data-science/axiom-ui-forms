import { type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { Checkbox } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const BooleanInput = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  const [value, setValue] = useState<boolean>(field.value === true)
  return (
                 <Checkbox
                    id={field.id}
                    testId={field.id}
                    label={<strong>{field.label}</strong>}
                    className=***REMOVED***font-bold***REMOVED***
                    value={value}
                    onChange={(e) => {
                      field.value = e
                      setValue(e)
                      onChange()
                    }} />
  )
}

export default BooleanInput
