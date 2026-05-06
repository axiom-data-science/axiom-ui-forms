import FieldCreator from '@/Form/Components/FieldCreator'
import { type IFormField } from '@/Form/Creator/FormCreatorTypes'
import React, { memo, type ReactElement } from 'react'

const FormFields = ({
  fields,
  className = 'flex flex-col gap-8 grow h-full'
}: {
  fields?: IFormField[]
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
                  <FieldCreator field={field} key={field.id} />
                )
              })
            }
        </div>
      }
      </>
  )
}

export default memo(FormFields)
