import { type IFormField } from '@/Form/FormCreatorTypes'
import Text from '@/Form/Manager/Field/Inputs/Text'
import { type IInputProps, TextArea } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const LongText = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  return <Text field={field} onChange={onChange} InputComponent={(props: IInputProps) => {
    return <TextArea {...props} />
  }} />
}

export default LongText
