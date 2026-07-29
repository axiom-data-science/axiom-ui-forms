import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { type IFormOverride, type IFormFieldOverride, IFormSectionOverride, IFormSection } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FormWithEditorOverlay from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***

import fieldOverrides from ***REMOVED***./collabFieldOverrides.json***REMOVED***
import formOverride from ***REMOVED***./collabFormOverrides.json***REMOVED***
import { QueryClient, QueryClientProvider, useQuery } from ***REMOVED***@tanstack/react-query***REMOVED***
import { getCollabSchema, getFormGroupings, getFormSections } from ***REMOVED***@/WaterLevel/COLLAB/helpers***REMOVED***
import { ViewWithLoader } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import FileUpload from ***REMOVED***@/Form/Components/Inputs/FileUpload/FileUpload***REMOVED***
import { overridesAndSchemaToFormObject, schemaToFormObject } from ***REMOVED***@/utils/schemaToFormHelpers***REMOVED***
import { getFieldsFromFormSection } from ***REMOVED***@/utils/getters***REMOVED***
import { cloneObject } from ***REMOVED***@/utils/manipulators***REMOVED***
import { pick } from ***REMOVED***lodash-es***REMOVED***

const inputOverrides = {
  ***REMOVED***custom:file_upload***REMOVED***: FileUpload
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
    id: ***REMOVED***collab-sheet***REMOVED***,
    label: ***REMOVED***COLLAB Metadata from sheet***REMOVED***,
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
  const schemaState = useState<JSONSchema6 | undefined>(schema)
  const fieldOverridesFromSections = formSectionOverrides.map(s => getFieldsFromFormSection(s as IFormSection)).flat()
    .map(f => {
      const fO = f as IFormFieldOverride
      const fieldO: Pick<IFormFieldOverride, ***REMOVED***prop***REMOVED*** | ***REMOVED***type***REMOVED***> = pick(fO, [***REMOVED***prop***REMOVED***, ***REMOVED***type***REMOVED***])
      return fieldO
    })
    .filter(f => {
      return !f.prop || !f.prop.match(/^contributor/)
    }) as IFormFieldOverride[]
  console.log(***REMOVED***fieldOverridesFromSections***REMOVED***, fieldOverridesFromSections)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverridesFromSections)
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)
  
  const schemaOnlyForm = schemaToFormObject(cloneObject(schema))
  const allSchemaOnlyFields = getFieldsFromFormSection(schemaOnlyForm)
  console.log(***REMOVED***allSchemaOnlyFields***REMOVED***, allSchemaOnlyFields)

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
    <div className=***REMOVED***fixed bottom-4 left-4 w-90 bg-white/90 z-80 shadow-md p-4 border-2 border-slate-200 rounded-md***REMOVED***>
      <h3 className=***REMOVED***text-lg font-bold mb-2***REMOVED***>Missing fields in combined form:</h3>
      <ul className=***REMOVED***list-disc pl-5 max-h-50 overflow-auto***REMOVED***>
        {missingInCombined.map((fieldId) => (
          <li key={fieldId} className=***REMOVED***text-sm text-red-600***REMOVED***>{fieldId}</li>
        ))}
      </ul>
      <h3 className=***REMOVED***text-lg font-bold mb-2***REMOVED***>Additional fields in combined form:</h3>
      <ul className=***REMOVED***list-disc pl-5 max-h-50 overflow-auto***REMOVED***>
        {addedInCombined.map((fieldId) => (
          <li key={fieldId} className=***REMOVED***text-sm text-green-600***REMOVED***>{fieldId}</li>
        ))}
      </ul>
    </div>
    }
    </>
  )

}


const CollabWatterLevelFormSheetLoader = ({useSchemaOnly}: {useSchemaOnly?: boolean}): ReactElement => {
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
