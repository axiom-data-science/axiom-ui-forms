import FieldCreator from '@/Form/Components/FieldCreator'
import FieldLabel from '@/Form/Components/FieldLabel'
import { type ICompositeValueType, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { utils } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const ObjectInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = (typeof value === 'object' ? value ?? {} : {}) as ICompositeValueType
  if (field.type === 'object' && field.fields !== undefined) {
    const cl = `${field.layout === 'horizontal'
        ? 'flex md:flex-row sm:flex-col gap-4 sm:gap-2'
        : field.layout === 'grid4'
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
        : field.layout === 'grid3'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : field.layout === 'grid2'
            ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
            : 'flex flex-col gap-4'
      }`
    const fc = field.layout === 'horizontal'
      ? 'flex-1'
      : ''
    return (
        <div>
        {
          field.label !== undefined
            ? <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
            : null
        }
        <div className={`p-4 bg-slate-100  ${cl}${disabled ? ' opacity-70 cursor-not-allowed' : ''}`}>
        {
          field.fields.map((childField) => {
            const key = (field.path ?? [field.id]).concat(childField.id).join('.')

            return (
              <FieldCreator
                disabled={disabled}
                onChange={(e) => {
                  if (childField.type === 'object' && childField.skip_path === true) {
                    onChange(e)
                  } else {
                    initialValue[childField.id] = e
                    onChange({ ...initialValue })
                  }
                }}
                className={utils.makeClassName({
                  defaultClassName: 'p-0',
                  className: fc
                })}
                // default to null here so that FormCreator doesn't go out and look for the value again
                // todo: update this so that it's clearer. difference between undefined and null too small
                value={(
                  childField.type === 'object' && childField.skip_path === true
                    ? initialValue
                    : initialValue[childField.id]
                ) ?? null
                }
                field={childField}
                key={key}
              />
            )
          })
        }
      </div>
      </div>
    )
  }
  return <p>Field config for {field.id} is missing &apos;fields&apos;</p>
}

export default ObjectInput
