import { FieldDescriptionText, FieldDescriptionTooltip, FieldLabelText } from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Checkbox } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const BooleanInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = value !== undefined ? value : false
  return <Checkbox 
    id={field.id} 
    testId={field.id} 
    disabled={disabled} 
    value={Boolean(initialValue)} 
    onChange={(e) => {
      onChange(e)
    }}
    label={<>
      <FieldLabelText 
        field={field} 
        disabled={disabled} 
        value={value}
        onChange={onChange} 
      /> {
        (field.settings?.descriptionPresentation === ***REMOVED***inline***REMOVED*** || field.settings?.descriptionPresentation === undefined)
          ? <FieldDescriptionTooltip field={field} disabled={disabled} />
          : <FieldDescriptionText field={field} disabled={disabled} />
      }</>
    }
  />
}

export default BooleanInput
