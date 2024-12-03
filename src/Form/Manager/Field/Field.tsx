import { type IFormField } from '@/Form/FormCreatorTypes'
import FieldLabel from '@/Form/Manager/Field/FieldLabel'
import BooleanInput from '@/Form/Manager/Field/Inputs/Boolean'
import LongTextInput from '@/Form/Manager/Field/Inputs/LongText'
import RadioInput from '@/Form/Manager/Field/Inputs/Radio'
import SelectInput from '@/Form/Manager/Field/Inputs/Select'
import TextInput from '@/Form/Manager/Field/Inputs/Text'
import { PlusIcon } from '@radix-ui/react-icons'
import React, { type ReactElement } from 'react'

const inputMap: Record<string, React.FC<{ field: IFormField, onChange: () => void }>> = {
  text: TextInput,
  long_text: LongTextInput,
  boolean: BooleanInput,
  select: SelectInput,
  radio: RadioInput
}

const Field = ({ field, onChange }: { field: IFormField, onChange: () => void }): ReactElement => {
  const input = inputMap[field.type]

  return (
            <>
                 {
                      input !== undefined
                        ? field.multiple === true
                          ? <>
                                {input({ field, onChange })}
                                <PlusIcon className='w-6 h-6 text-slate-400' onClick={() => {}} />
                            </>
                          : input({ field, onChange })
                        : <><FieldLabel {...field} /><p>Field type <em>{field.type}</em> not supported</p></>
                 }
            </>
  )
}

export default Field
