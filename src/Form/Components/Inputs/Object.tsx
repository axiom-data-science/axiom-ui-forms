import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type ICompositeValueType, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const ObjectInput = ({ form, field, onChange, value, formValueState }: IFieldInputProps): ReactElement => {
  const initialValue = (typeof value === ***REMOVED***object***REMOVED*** ? value ?? {} : {}) as ICompositeValueType
  if (field.type === ***REMOVED***object***REMOVED*** && field.fields !== undefined) {
    const cl = `${field.layout === ***REMOVED***horizontal***REMOVED*** ? `flex flex-row gap-4  ${field.label !== undefined ? ***REMOVED***px-0***REMOVED*** : ***REMOVED******REMOVED***}` : ***REMOVED***flex flex-col gap-4***REMOVED***}`
    const fc = field.layout === ***REMOVED***horizontal***REMOVED*** ? ***REMOVED***flex-1***REMOVED*** : ***REMOVED******REMOVED***
    return (
        <div>
        {
          field.label !== undefined
            ? <FieldLabel {...field} />
            : null
        }
        <div className={`p-4 bg-slate-100  ${cl}`}>
        {
          field.fields.map((childField) => {
            const key = (field.path ?? [field.id]).concat(childField.id).join(***REMOVED***.***REMOVED***)

            return (
              <FieldCreator
                formValueState={formValueState}
                onChange={(e) => {
                  if (childField.type === ***REMOVED***object***REMOVED*** && childField.skip_path === true) {
                    onChange(e)
                  } else {
                    initialValue[childField.id] = e
                    onChange({ ...initialValue })
                  }
                }}
                className={utils.makeClassName({
                  defaultClassName: ***REMOVED***p-0***REMOVED***,
                  className: fc
                })}
                value={initialValue[childField.id]}
                field={childField}
                form={form}
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
