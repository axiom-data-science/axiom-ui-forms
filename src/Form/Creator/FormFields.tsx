import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***
import { type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import React, { memo, type ReactElement } from ***REMOVED***react***REMOVED***

const FormFields = ({
  fields,
  className = ***REMOVED***flex flex-col gap-8 grow h-full***REMOVED***
}: {
  fields?: IFormField[]
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
