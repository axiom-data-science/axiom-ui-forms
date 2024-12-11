import { type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import Text from ***REMOVED***@/Form/Manager/Field/Inputs/Text***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const LongText = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  return <Text field={field} onChange={onChange} InputComponent={TextArea} />
}

export default LongText
