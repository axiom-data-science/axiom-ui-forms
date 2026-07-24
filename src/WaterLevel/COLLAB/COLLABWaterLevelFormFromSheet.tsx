import React, { useState, type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { type IFormOverride, type IFormFieldOverride, IFormSectionOverride } from '@/Form/Creator/FormCreatorTypes'
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
    schema
  }: {
    schema: JSONSchema6
  }
): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
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
console.log('allCombinedFields', allCombinedFields)
const keys1 = new Set(allSchemaOnlyFields.map(f => f.id))
const keys2 = new Set(allCombinedFields.map(f => f.id))
const missingInCombined = [...keys1].filter(k => !keys2.has(k))
const addedInCombined = [...keys2].filter(k => !keys1.has(k))

  


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
    <div className='fixed bottom-4 left-4 w-90 bg-white/90 z-80 shadow-md p-4 border-2 border-slate-200 rounded-md'>
      <h3 className='text-lg font-bold mb-2'>Missing fields in combined form:</h3>
      <ul className='list-disc pl-5 max-h-50 overflow-auto'>
        {missingInCombined.map((fieldId) => (
          <li key={fieldId} className='text-sm text-red-600'>{fieldId}</li>
        ))}
      </ul>
      <h3 className='text-lg font-bold mb-2'>Additional fields in combined form:</h3>
      <ul className='list-disc pl-5 max-h-50 overflow-auto'>
        {addedInCombined.map((fieldId) => (
          <li key={fieldId} className='text-sm text-green-600'>{fieldId}</li>
        ))}
      </ul>
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
            ? <CollabedWatterLevelFormSheetSchemaOnly schema={data.schema} />
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
