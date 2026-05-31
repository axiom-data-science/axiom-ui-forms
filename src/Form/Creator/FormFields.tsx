import FieldCreator from '@/Form/Components/FieldCreator'
import { type IFormField } from '@/Form/Creator/FormCreatorTypes'
import { getLayoutClassName } from '@/utils/layoutHelpers'
import React, { memo, type ReactElement } from 'react'

export type LayoutType = 'horizontal' | 'vertical' | 'grid2' | 'grid3' | 'grid4'

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
        </div>
      )}
    </>
  )
}

export default memo(FormFields)
