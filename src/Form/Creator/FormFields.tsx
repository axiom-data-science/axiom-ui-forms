import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***
import { type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { getLayoutClassName } from ***REMOVED***@/utils/layoutHelpers***REMOVED***
import React, { memo, type ReactElement } from ***REMOVED***react***REMOVED***

export type LayoutType = ***REMOVED***horizontal***REMOVED*** | ***REMOVED***vertical***REMOVED*** | ***REMOVED***grid2***REMOVED*** | ***REMOVED***grid3***REMOVED*** | ***REMOVED***grid4***REMOVED***

const FormFields = ({
  fields,
  className,
  layout,
}: {
  fields?: IFormField[]
  className?: string
  layout?: LayoutType
}): ReactElement => {
  // If layout is provided, use it; otherwise use className; otherwise use default
  const computedClassName =
    layout !== undefined
      ? getLayoutClassName(layout)
      : (className ?? ***REMOVED***flex flex-col gap-8 grow h-full***REMOVED***)

  return (
    <>
      {fields === undefined || fields.length < 1 ? (
        ***REMOVED******REMOVED***
      ) : (
        <div className={computedClassName}>
          {fields?.map((field) => {
            return <FieldCreator field={field} key={field.id} />
          })}
        </div>
      )}
    </>
  )
}

export default memo(FormFields)
