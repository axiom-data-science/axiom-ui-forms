import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***
import { type IFormField, type IValueChangeFn } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const FormFields = ({
  fields,
  onChange,
  className = ***REMOVED***flex flex-col gap-2***REMOVED***
}: {
  fields?: IFormField[]
  onChange?: IValueChangeFn
  className?: string
}): ReactElement => {
  return (
      <>
      {
        fields === undefined || fields.length < 1
          ? ***REMOVED******REMOVED***
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
