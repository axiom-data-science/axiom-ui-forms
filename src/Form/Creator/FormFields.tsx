import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***
import { IFormValues, type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { getLayoutClassName } from ***REMOVED***@/utils/layoutHelpers***REMOVED***
import React, { memo, ReactNode, type ReactElement } from ***REMOVED***react***REMOVED***
import { useFormValues } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***

export type LayoutType = ***REMOVED***horizontal***REMOVED*** | ***REMOVED***vertical***REMOVED*** | ***REMOVED***grid2***REMOVED*** | ***REMOVED***grid3***REMOVED*** | ***REMOVED***grid4***REMOVED***

const FormFields = ({
  fields,
  className,
  layout,
  SubmitButton
}: {
  fields?: IFormField[]
  className?: string
  layout?: LayoutType
  SubmitButton?: React.FC<{ formValues: IFormValues }> | ReactNode
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
          {SubmitButton && (
            <div className=***REMOVED***flex flex-row gap-4 justify-end  p-4 mt-10 sticky bottom-0 bg-white/80 z-10***REMOVED***>
              {typeof SubmitButton === ***REMOVED***function***REMOVED*** ? (
                <SubmitButton formValues={useFormValues()} />
              ) : (
                SubmitButton
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default memo(FormFields)
