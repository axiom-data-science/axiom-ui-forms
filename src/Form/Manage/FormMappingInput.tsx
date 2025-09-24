import { type IForm } from '@/Form/Creator/FormCreatorTypes'
import { type IFormMapping } from '@/Form/FormMappingTypes'
import { getFields } from '@/utils/getters'
import { addFieldPath, cloneObject } from '@/utils/manipulators'
import { Input } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'

const FormMappingInput = ({
  form,
  mappingState
}: {
  form: IForm
  mappingState: [IFormMapping, (mapping: IFormMapping) => void]
}): ReactElement => {
  const [mapping, setMappings] = mappingState
  const uniqueFields = getFields(form?.fields?.map(f => addFieldPath(cloneObject(f))))
  return (
            <>
                 <div className='flex flex-col gap-4'>
                      {
                           uniqueFields.filter(f => f.type !== 'object' && f.type !== 'section').map(field => {
                             const fieldId = field.path?.join('.') ?? field.id
                             return (
                                     <div key={field.id} className='flex flex-col gap-2'>
                                          <div>
                                               <Input
                                                placeholder='Output path'
                                                label={<span className='pb-2'>
                                                    <span className='text-xs bg-slate-100  p-1 float-right text-rose-700'>{fieldId}</span>
                                                    {field.label}
                                               </span>}
                                               id={`map:${fieldId}`} testId={`map:${fieldId}`} value={mapping.fields?.[fieldId]?.xpath}
                                               onChange={(e) => {
                                                 if (e !== undefined && e !== '') {
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
