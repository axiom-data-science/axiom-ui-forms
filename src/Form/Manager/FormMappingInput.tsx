import { getUniqueFormFields } from '@/Form/Manager/helpers'
import formAtom from '@/state/formAtom'
import formMappingAtom from '@/state/formMappingAtom'
import { Input } from '@axdspub/axiom-ui-utilities'
import { useAtom } from 'jotai'
import React, { type ReactElement } from 'react'

const FormMappingInput = (): ReactElement => {
  const [form] = useAtom(formAtom)
  const [mapping, setMappings] = useAtom(formMappingAtom)
  const uniqueFields = getUniqueFormFields(form)
  return (
            <>
                 <div className='flex flex-col gap-4'>
                      {
                           uniqueFields.map(field => {
                             return (
                                     <div key={field.id} className='flex flex-row gap-2'>
                                          <div>
                                               <Input placeholder='Output path' label={<span className='pb-2'>
                                                    <span className='text-xs bg-slate-100  p-1 float-right text-rose-700'>{field.id}</span>
                                                    {field.label}
                                               </span>} id={`map:${field.id}`} testId={`map:${field.id}`} value={mapping.fields?.[field.id]?.xpath} onChange={(e) => {
                                                 if (e !== undefined && e !== '') {
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
