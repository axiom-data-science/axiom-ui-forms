import { getUniqueFormFields } from ***REMOVED***@/Form/Manager/helpers***REMOVED***
import formAtom from ***REMOVED***@/state/formAtom***REMOVED***
import formMappingAtom from ***REMOVED***@/state/formMappingAtom***REMOVED***
import { Input } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const FormMappingInput = (): ReactElement => {
  const [form] = useAtom(formAtom)
  const [mapping, setMappings] = useAtom(formMappingAtom)
  const uniqueFields = getUniqueFormFields(form)
  return (
            <>
                 <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
                      {
                           uniqueFields.map(field => {
                             return (
                                     <div key={field.id} className=***REMOVED***flex flex-row gap-2***REMOVED***>
                                          <div>
                                               <Input placeholder=***REMOVED***Output path***REMOVED*** label={<span className=***REMOVED***pb-2***REMOVED***>
                                                    <span className=***REMOVED***text-xs bg-slate-100  p-1 float-right text-rose-700***REMOVED***>{field.id}</span>
                                                    {field.label}
                                               </span>} id={`map:${field.id}`} testId={`map:${field.id}`} value={mapping.fields?.[field.id]?.xpath} onChange={(e) => {
                                                 if (e !== undefined && e !== ***REMOVED******REMOVED***) {
                                                   setMappings({
                                                     ...mapping,
                                                     fields: {
                                                       ...mapping.fields,
                                                       [field.id]: {
                                                         ...mapping.fields[field.id],
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
