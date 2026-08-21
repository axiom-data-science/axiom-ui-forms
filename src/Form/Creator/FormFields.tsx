import FieldCreator from '@/Form/Components/FieldCreator'
import { IFormValues, type IFormField } from '@/Form/Creator/FormCreatorTypes'
import { getLayoutClassName } from '@/utils/layoutHelpers'
import React, { memo, ReactNode, type ReactElement } from 'react'
import { useFormValues } from '@/Form/Creator/FormContextProvider'

export type LayoutType = 'horizontal' | 'vertical' | 'grid2' | 'grid3' | 'grid4'

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
      : (className ?? 'flex flex-col gap-8 grow h-full')

  return (
    <>
      {fields === undefined || fields.length < 1 ? (
        ''
      ) : (
        <div className={computedClassName}>
          {fields?.map((field) => {
            return <FieldCreator field={field} key={field.id} />
          })}
          {SubmitButton && (
            <div className='flex flex-row gap-4 justify-end  p-4 mt-10 sticky bottom-0 bg-white/80 z-10'>
              {typeof SubmitButton === 'function' ? (
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
