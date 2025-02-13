import { type IForm } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***

export interface IAssetSchema {
  asset_type: string
  schema_version: string
  is_type_default?: boolean
  asset_schema: Record<string, unknown>
}

export interface IAsset {
  asset_id: string
  asset_type: string
  asset_key: string
  schema_version: string
  label?: string
  description?: string
  start_date_time?: string
  end_date_time?: string
  bounds?: Record<string, unknown>
  data?: Record<string, unknown>
}

export interface IAssetForm {
  id: string
  label: string
  asset_type: string
  schema_version: string
  is_type_default?: boolean
  config: IForm
}
