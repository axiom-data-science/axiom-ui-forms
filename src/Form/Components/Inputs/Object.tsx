import FieldCreator from '@/Form/Components/FieldCreator'
import FieldLabel from '@/Form/Components/FieldLabel'
import { type ICompositeValueType, type IFieldInputProps } from '@/Form/FormCreatorTypes'
import { utils } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const ObjectInput = ({ form, field, onChange, value, formValueState }: IFieldInputProps): ReactElement => {
  const initialValue = (typeof value === 'object' ? value ?? {} : {}) as ICompositeValueType
  if (field.type === 'object' && field.fields !== undefined) {
    const cl = `${field.layout === 'horizontal' ? `flex flex-row gap-4  ${field.label !== undefined ? 'px-0' : ''}` : 'flex flex-col gap-4'}`
    const fc = field.layout === 'horizontal' ? 'flex-1' : ''
    return (
        <div>
        {
          field.label !== undefined
            ? <FieldLabel {...field} />
            : null
        }
        <div className={`p-4 bg-slate-100 ${cl}`}>
        {
          field.fields.map((childField) => {
            const id = (field.path ?? [field.id]).concat(childField.id).join('.')
            if (childField.type === 'object') {
              childField.path = field.path !== undefined ? field.path.concat(id) : [id]
              childField.level = field.level !== undefined ? field.level + 1 : 1
            }

            return (
              <FieldCreator
                formValueState={formValueState}
                onChange={field.skip_path === true
                  ? undefined
                  : (e) => {
                      initialValue[childField.id] = e
                      onChange({ ...initialValue })
                    }}
                className={utils.makeClassName({
                  defaultClassName: 'p-0',
                  className: fc
                })}
                value={initialValue[childField.id]}
                field={{ ...childField, id }}
                form={form}
                key={id}
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
