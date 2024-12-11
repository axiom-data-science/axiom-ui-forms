import { type IFormInputComponent, type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Manager/Field/FieldLabel***REMOVED***
import BooleanInput from ***REMOVED***@/Form/Manager/Field/Inputs/Boolean***REMOVED***
import LongTextInput from ***REMOVED***@/Form/Manager/Field/Inputs/LongText***REMOVED***
import RadioInput from ***REMOVED***@/Form/Manager/Field/Inputs/Radio***REMOVED***
import SelectInput from ***REMOVED***@/Form/Manager/Field/Inputs/Select***REMOVED***
import TextInput from ***REMOVED***@/Form/Manager/Field/Inputs/Text***REMOVED***
import { PlusIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const inputMap: Record<string, IFormInputComponent> = {
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
                                <PlusIcon className=***REMOVED***w-6 h-6 text-slate-400***REMOVED*** onClick={() => {}} />
                            </>
                          : input({ field, onChange })
                        : <><FieldLabel {...field} /><p>Field type <em>{field.type}</em> not supported</p></>
                 }
            </>
  )
}

export default Field
