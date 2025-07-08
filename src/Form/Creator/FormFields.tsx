import FieldCreator from '@/Form/Components/FieldCreator'
import { type IFormField, type IValueChangeFn } from '@/Form/Creator/FormCreatorTypes'
import React, { type ReactElement } from 'react'

const FormFields = ({
  fields,
  onChange,
  className = 'flex flex-col gap-4 flex-grow h-full'
}: {
  fields?: IFormField[]
  onChange?: IValueChangeFn
  className?: string
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
                  <FieldCreator onChange={onChange} field={field} key={field.id} />
                )
              })
            }
        </div>
      }
      </>
  )
}

export default FormFields
