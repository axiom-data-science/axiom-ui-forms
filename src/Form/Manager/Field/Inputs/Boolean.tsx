import { type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { Checkbox } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const BooleanInput = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  return (
                 <Checkbox
                    id={field.id}
                    testId={field.id}
                    label={<strong>{field.label}</strong>}
                    className=***REMOVED***font-bold***REMOVED***
                    value={field.value === true}
                    onChange={(e) => {
                      field.value = e
                      onChange()
                    }} />
  )
}

export default BooleanInput
