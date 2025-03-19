import { type IConstantField, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { memoize } from 'lodash'
import React, { type ReactElement } from 'react'

const notify = memoize((k, v, onChange) => {
  setTimeout(() => {
    onChange(v)
  }, 50)
})

const ConstantInput = ({ value, field, onChange }: IFieldInputProps): ReactElement => {
  const constantField = field as IConstantField
  const val = constantField.defaultValue
  notify(`${field.path ? field.path.map(f => f.id).join('.') : field.id}.${JSON.stringify(val)}`, val, onChange)
  return (
    <></>
  )
}

export default ConstantInput
