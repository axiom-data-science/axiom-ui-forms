import React, { useState, type ReactElement } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { type IFormOverride, type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'
import FormWithEditorOverlay from '@/Form/FormWithEditorOverlay'

import schema from './waterLevelSchema.json'
import fieldOverrides from './fieldOverrides.json'
import formOverride from './formOverrides.json'
import StationSearch from '@/WaterLevel/StationSearch'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const WaterLevelForm = (): ReactElement => {
  const schemaState = useState<JSONSchema6 | undefined>(schema as JSONSchema6)
  const fieldOverrideState = useState<IFormFieldOverride[]>(fieldOverrides as IFormFieldOverride[])
  const formOverrideState = useState<IFormOverride | undefined>(formOverride as IFormOverride)

  return (
    <QueryClientProvider client={queryClient}>
    <FormWithEditorOverlay
      inputOverrides={{
        'custom:station_search': StationSearch
      }}
      label="Water Level Form"
      schemaState={schemaState}
      fieldOverrideState={fieldOverrideState}
      formOverrideState={formOverrideState}
      />
      </QueryClientProvider>

  )
}

export default WaterLevelForm
