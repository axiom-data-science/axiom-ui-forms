import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type ICompositeValueType, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const ObjectInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  const initialValue = (typeof value === ***REMOVED***object***REMOVED*** ? value ?? {} : {}) as ICompositeValueType
  if (field.type === ***REMOVED***object***REMOVED*** && field.fields !== undefined) {
    const cl = `${field.layout === ***REMOVED***horizontal***REMOVED***
        ? ***REMOVED***flex md:flex-row sm:flex-col gap-4 sm:gap-2***REMOVED***
        : field.layout === ***REMOVED***grid4***REMOVED***
        ? ***REMOVED***grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4***REMOVED***
        : field.layout === ***REMOVED***grid3***REMOVED***
          ? ***REMOVED***grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4***REMOVED***
          : field.layout === ***REMOVED***grid2***REMOVED***
            ? ***REMOVED***grid grid-cols-1 md:grid-cols-2 gap-4***REMOVED***
            : ***REMOVED***flex flex-col gap-4***REMOVED***
      }`
    const fc = field.layout === ***REMOVED***horizontal***REMOVED***
      ? ***REMOVED***flex-1***REMOVED***
      : ***REMOVED******REMOVED***
    return (
        <div>
        {
          field.label !== undefined
            ? <FieldLabel field={field} disabled={disabled} />
            : null
        }
        <div className={`p-4 bg-slate-100  ${cl}${disabled ? ***REMOVED*** opacity-70 cursor-not-allowed***REMOVED*** : ***REMOVED******REMOVED***}`}>
        {
          field.fields.map((childField) => {
            const key = (field.path ?? [field.id]).concat(childField.id).join(***REMOVED***.***REMOVED***)

            return (
              <FieldCreator
                disabled={disabled}
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
                // default to null here so that FormCreator doesn***REMOVED***t go out and look for the value again
                // todo: update this so that it***REMOVED***s clearer. difference between undefined and null too small
                value={(
                  childField.type === ***REMOVED***object***REMOVED*** && childField.skip_path === true
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
