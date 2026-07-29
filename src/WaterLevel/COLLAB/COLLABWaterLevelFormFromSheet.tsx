import React, { useState, type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { type IFormOverride, type IFormFieldOverride, IFormSectionOverride, IFormSection } from '@/Form/Creator/FormCreatorTypes'
import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'

import fieldOverrides from './collabFieldOverrides.json'
import formOverride from './collabFormOverrides.json'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { getCollabSchema, getFormGroupings, getFormSections } from '@/WaterLevel/COLLAB/helpers'
import { ViewWithLoader } from '@axdspub/axiom-ui-utilities'
import FileUpload from '@/Form/Components/Inputs/FileUpload/FileUpload'
import { overridesAndSchemaToFormObject, schemaToFormObject } from '@/utils/schemaToFormHelpers'
import { getFieldsFromFormSection } from '@/utils/getters'
import { cloneObject } from '@/utils/manipulators'
import { pick } from 'lodash-es'
import { useSearchParams } from 'react-router-dom'
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons'

const inputOverrides = {
  'custom:file_upload': FileUpload
}


const CollabWatterLevelFormSheet = (
  {
    schema,
    formSectionOverrides
  }: {
    schema: JSONSchema6,
    formSectionOverrides: IFormSectionOverride[]
  }
): ReactElement => {

  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>({
    id: 'collab-sheet',
    label: 'COLLAB Metadata from sheet',
    pages: formSectionOverrides
  } as IFormOverride)
  const schemaState = useState<JSONSchema6 | undefined>(schema)
  return (
    <FormWithEditorOverlay
      label="Water Level Form (COLLAB schema): from spreadsheet"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState} 
      inputOverrides={inputOverrides}  
    />
  )
}

const CollabedWatterLevelFormSheetSchemaOnly = (
  {
    schema,
    formSectionOverrides
  }: {
    schema: JSONSchema6
    formSectionOverrides: IFormSectionOverride[]
  }
): ReactElement => {
  const [searchParams] = useSearchParams()
  const schemaState = useState<JSONSchema6 | undefined>(schema)
  const fieldOverridesFromSections = formSectionOverrides.map(s => getFieldsFromFormSection(s as IFormSection)).flat()
    .map(f => {
      const fO = f as IFormFieldOverride
      const fieldO: Pick<IFormFieldOverride, 'prop' | 'type'> = pick(fO, ['prop', 'type'])
      return fieldO
    })
    .filter(f => {
      return !f.prop || !f.prop.match(/^contributor/)
    }) as IFormFieldOverride[]
  console.log('fieldOverridesFromSections', fieldOverridesFromSections)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverridesFromSections)
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
  
  const schemaOnlyForm = schemaToFormObject(cloneObject(schema))
  const allSchemaOnlyFields = getFieldsFromFormSection(schemaOnlyForm)
  console.log('allSchemaOnlyFields', allSchemaOnlyFields)

  const formOverrideOb = cloneObject(formOverride) as IFormOverride
  const combinedForm = overridesAndSchemaToFormObject({
    formOverrides: [formOverrideOb] as IFormOverride[],
    formFieldOverrides: [fieldOverrides] as IFormFieldOverride[][],
    schema
})

const allCombinedFields = getFieldsFromFormSection(combinedForm).filter(f => !(f as {skip_path?: boolean}).skip_path)
const keys1 = new Set(allSchemaOnlyFields.map(f => f.id))
const keys2 = new Set(allCombinedFields.map(f => f.id))
const missingInCombined = [...keys1].filter(k => !keys2.has(k))
const addedInCombined = [...keys2].filter(k => !keys1.has(k))
const [showDebug, setShowDebug] = useState(false)

  


  return (
    <>
    <FormWithEditorOverlay
      label="Water Level Form (COLLAB schema): from spreadsheet"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState} 
      formOverrideState={formOverrideState} 
      inputOverrides={inputOverrides}
      urlNavigable={true}
    />
    { (missingInCombined.length > 0 || addedInCombined.length > 0) &&
    <div className={`fixed bottom-0 left-0 ${showDebug ? 'w-90' : 'w-40'} bg-white/90 z-80 shadow-md border-2 border-slate-200`}>
      <h4 className='p-2 bg-slate-600 text-xs text-white cursor-pointer flex flex-row gap-2 items-center' onClick={() => setShowDebug(!showDebug)}>
        {showDebug ? <CaretDownIcon />: <CaretUpIcon />} Debug info <span className='text-[10px] py-1 px-2 bg-slate-600 text-white rounded-lg'>{missingInCombined.length + addedInCombined.length}</span>
      </h4>
      {
        showDebug &&
      <div className='p-4 flex flex-col gap-4 text-xs'>
      <div>
      <h3 className='font-bold mb-2'>Missing fields in combined form:</h3>
      <ul className='list-disc pl-5 max-h-50 overflow-auto'>
        {missingInCombined.map((fieldId) => (
          <li key={fieldId} className='text-sm text-red-600'>{fieldId}</li>
        ))}
      </ul>
      </div>
      <div>
      <h3 className='font-bold mb-2'>Additional fields in combined form:</h3>
      <ul className='list-disc pl-5 max-h-50 overflow-auto'>
        {addedInCombined.map((fieldId) => (
          <li key={fieldId} className='text-sm text-green-600'>{fieldId}</li>
        ))}
      </ul>
      </div>
      </div>
    }
    </div>
    }
    </>
  )

}


const CollabWatterLevelFormSheetLoader = ({useSchemaOnly}: {useSchemaOnly?: boolean}): ReactElement => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['collab-metadata-schema'],
    queryFn: async () => {
      const schema = await getCollabSchema()
      const formSectionOverrides = await getFormSections()
      return { schema, formSectionOverrides }
    }
  })

  return (
    <ViewWithLoader isLoading={isLoading} error={error} data={data}>
      {
        data !== undefined && (
          useSchemaOnly
            ? <CollabedWatterLevelFormSheetSchemaOnly schema={data.schema} formSectionOverrides={data.formSectionOverrides} />
            : <CollabWatterLevelFormSheet schema={data.schema} formSectionOverrides={data.formSectionOverrides} />
        )
      }
    </ViewWithLoader>

  )
}


const queryClient = new QueryClient()

export default ({useSchemaOnly}: {useSchemaOnly?: boolean}): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <CollabWatterLevelFormSheetLoader useSchemaOnly={useSchemaOnly} />
    </QueryClientProvider>
  )
}
