import { type IFormField, type ISelectField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import Text from ***REMOVED***@/Form/Manager/Field/Inputs/Text***REMOVED***
import { type ISelectProps, type ITextInputProps, SelectInput } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const Select = ({ field, onChange, InputComponent }: { field: IFormField, onChange: () => void, InputComponent?: React.FC<ISelectProps> }): ReactElement => {
  const selectField = field as ISelectField
  const SelectComponent = InputComponent ?? SelectInput
  return <Text field={field} onChange={onChange} InputComponent={(props: ITextInputProps): ReactElement => {
    return <SelectComponent {...props} options={selectField.options} onChange={(op) => {
      const value = op?.value !== undefined ? String(op.value) : ***REMOVED******REMOVED***
      props.onChange?.(value)
    }} />
  }} />
}

export default Select
