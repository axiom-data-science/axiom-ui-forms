import { type IConstantField, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { memoize } from ***REMOVED***lodash-es***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const notify = memoize((k, v, onChange) => {
  setTimeout(() => {
    onChange(v)
  }, 50)
})

const ConstantInput = ({ value, field, onChange }: IFieldInputProps): ReactElement => {
  const constantField = field as IConstantField
  const val = value ?? constantField.defaultValue
  notify(`${field.path ? field.path.map(f => f.id).join(***REMOVED***.***REMOVED***) : field.id}.${JSON.stringify(val)}`, val, onChange)
  return (
    <></>
  )
}

export default ConstantInput
