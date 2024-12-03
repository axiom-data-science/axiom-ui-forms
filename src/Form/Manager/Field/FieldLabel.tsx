import { type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const FieldLabelText = (field: IFormField): ReactElement => {
  const required = field.required ? <span className=***REMOVED***text-red-500***REMOVED***>*</span> : null
  const label = <strong>{field.label} {required}</strong>
  return label
}

const FieldLabel = (field: IFormField): ReactElement => {
  return <p><FieldLabelText {...field} /></p>
}

export default FieldLabel
