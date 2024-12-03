import { type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Manager/Field/FieldLabel***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const LongText = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  return (
        <TextArea
            label={<FieldLabel {...field} />}
            id={field.id}
            testId={field.id}
            value={field.value !== undefined ? String(field.value) : undefined}
            onChange={(e) => {
              field.value = e
              onChange()
            }}
        />
  )
}

export default LongText
