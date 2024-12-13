import { addFieldPath, getFields } from ***REMOVED***@/Form/helpers***REMOVED***
import formAtom from ***REMOVED***@/state/formAtom***REMOVED***
import formMappingAtom from ***REMOVED***@/state/formMappingAtom***REMOVED***
import { Input } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const FormMappingInput = (): ReactElement => {
  const [form] = useAtom(formAtom)
  const [mapping, setMappings] = useAtom(formMappingAtom)
  const uniqueFields = getFields(form.fields.map(f => addFieldPath(structuredClone(f))))
  return (
            <>
                 <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
                      {
                           uniqueFields.filter(f => f.type !== ***REMOVED***object***REMOVED*** && f.type !== ***REMOVED***section***REMOVED***).map(field => {
                             const fieldId = field.path?.join(***REMOVED***.***REMOVED***) ?? field.id
                             return (
                                     <div key={field.id} className=***REMOVED***flex flex-col gap-2***REMOVED***>
                                          <div>
                                               <Input
                                                placeholder=***REMOVED***Output path***REMOVED***
                                                label={<span className=***REMOVED***pb-2***REMOVED***>
                                                    <span className=***REMOVED***text-xs bg-slate-100  p-1 float-right text-rose-700***REMOVED***>{fieldId}</span>
                                                    {field.label}
                                               </span>}
                                               id={`map:${fieldId}`} testId={`map:${fieldId}`} value={mapping.fields?.[fieldId]?.xpath}
                                               onChange={(e) => {
                                                 if (e !== undefined && e !== ***REMOVED******REMOVED***) {
                                                   setMappings({
                                                     ...mapping,
                                                     fields: {
                                                       ...mapping.fields,
                                                       [fieldId]: {
                                                         ...mapping.fields[fieldId],
                                                         xpath: e

                                                       }
                                                     }

                                                   })
                                                 }
                                               }}
                                               />
                                          </div>

                                     </div>
                             )
                           })
                      }
                 </div>
            </>
  )
}

export default FormMappingInput
