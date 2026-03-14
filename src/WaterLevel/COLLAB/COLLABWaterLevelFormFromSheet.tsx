import React, { useState, type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { type IFormOverride, type IFormFieldOverride, IFormSectionOverride } from '@/Form/Creator/FormCreatorTypes'
import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'

import fieldOverrides from './collabFieldOverrides.json'
import formOverride from './collabFormOverrides.json'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { getCollabSchema, getFormSections } from '@/WaterLevel/COLLAB/helpers'
import { ViewWithLoader } from '@axdspub/axiom-ui-utilities'


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
      fieldOverrideState={fieldOverrideState} // Don't allow overrides for this one since it's from the sheet
      formOverrideState={formOverrideState} // Don't allow overrides for this one since it's from the sheet
    />
  )
}


const CollabWatterLevelFormSheetLoader = (): ReactElement => {
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
        data !== undefined && <CollabWatterLevelFormSheet schema={data.schema} formSectionOverrides={data.formSectionOverrides} />
      }
    </ViewWithLoader >

  )
}

const queryClient = new QueryClient()

export default (): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <CollabWatterLevelFormSheetLoader />
    </QueryClientProvider>
  )
}
