import FieldCreator from '@/Form/Components/FieldCreator'
import { type IFieldInputProps, type IForm, type IFormField, type IFormValues, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import React, { type ReactElement } from 'react'

const FormFields = ({
  form,
  fields,
  formValueState,
  onChange,
  className = 'flex flex-col gap-2',
  inputOverrides
}: {
  form: IForm
  fields?: IFormField[]
  formValueState: [IFormValues, (v: IFormValues) => void]
  onChange?: IValueChangeFn
  className?: string
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
}): ReactElement => {
  return (
      <>
      {
        fields === undefined || fields.length < 1
          ? ''
          : <div className={className}>
            {
              fields?.map((field) => {
                return (
                  <FieldCreator onChange={onChange} form={form} field={field} key={field.id} formValueState={formValueState} inputOverrides={inputOverrides}/>
                )
              })
            }
        </div>
      }
      </>
  )
}

export default FormFields
