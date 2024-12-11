import { type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import Text from ***REMOVED***@/Form/Manager/Field/Inputs/Text***REMOVED***
import { type IInputProps, TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const LongText = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  return <Text field={field} onChange={onChange} InputComponent={(props: IInputProps) => {
    return <TextArea {...props} />
  }} />
}

export default LongText
