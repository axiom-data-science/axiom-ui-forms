import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { type IFormOverride, type IFormFieldOverride, IFormSectionOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***

import fieldOverrides from ***REMOVED***./collabFieldOverrides.json***REMOVED***
import formOverride from ***REMOVED***./collabFormOverrides.json***REMOVED***
import { QueryClient, QueryClientProvider, useQuery } from ***REMOVED***@tanstack/react-query***REMOVED***
import { getCollabSchema, getFormSections } from ***REMOVED***@/WaterLevel/COLLAB/helpers***REMOVED***
import { ViewWithLoader } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***


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
    id: ***REMOVED***collab-sheet***REMOVED***,
    label: ***REMOVED***COLLAB Metadata from sheet***REMOVED***,
    pages: formSectionOverrides
  } as IFormOverride)
  const schemaState = useState<JSONSchema6 | undefined>(schema)
  return (
    <FormWithEditorOverlay
      label="Water Level Form (COLLAB schema): from spreadsheet"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState} // Don***REMOVED***t allow overrides for this one since it***REMOVED***s from the sheet
      formOverrideState={formOverrideState} // Don***REMOVED***t allow overrides for this one since it***REMOVED***s from the sheet
    />
  )
}


const CollabWatterLevelFormSheetLoader = (): ReactElement => {
  const { data, isLoading, error } = useQuery({
    queryKey: [***REMOVED***collab-metadata-schema***REMOVED***],
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
