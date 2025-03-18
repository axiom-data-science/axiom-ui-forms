import type { GeoJSON } from ***REMOVED***geojson***REMOVED***

interface IValueTypes {
  text: string
  number: number
  date: string
  datetime: string
  time: string
  boolean: boolean
  geojson: GeoJSON
  json: JSON
  composite: ICompositeValueType
}

type ValueOf<T> = T[keyof T]

// export type ICompositeValueType = Record<string, string | number | boolean>
// type can***REMOVED***t reference self
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface ICompositeValueType {
  [key: string]: IValueType | IValueType[] | undefined
}
export type IValueType = undefined | null | ValueOf<IValueTypes> // | Array<ValueOf<IValueTypes>> | { [key: string]: IValueType } | Array<Record<string, IValueTypes>>
// export type IValueType2 = string | string[] | number | number[] | boolean | boolean[] | ICompositeValueType | ICompositeValueType[]

export type IFormField = ITextField | INumberField | ILongTextField | IJSONField | ISelectField | IRadioField | ICheckboxField | IDateField | ITimeField | IDateTimeField | IBooleanField | IObjectField | IGeoJSONField | IGeometryField | IFormFieldSection | ICustomFIeld

export type IFormFieldType = ***REMOVED***text***REMOVED*** | ***REMOVED***long_text***REMOVED*** | ***REMOVED***number***REMOVED*** | ***REMOVED***json***REMOVED*** | ***REMOVED***select***REMOVED*** | ***REMOVED***radio***REMOVED*** | ***REMOVED***checkbox***REMOVED*** | ***REMOVED***date***REMOVED*** | ***REMOVED***time***REMOVED*** | ***REMOVED***datetime***REMOVED*** | ***REMOVED***boolean***REMOVED*** | ***REMOVED***object***REMOVED*** | ***REMOVED***geojson***REMOVED*** | ***REMOVED***geometry***REMOVED*** | `custom:${string}`
export type ISectionFormFieldType = ***REMOVED***section***REMOVED*** | ***REMOVED***page***REMOVED***

interface IFieldConditions {
  dependsOn: string | string[]
  value: string | number | boolean
}

interface IFormFieldRoot {
  id: string
  type: string
  required?: boolean
  label?: string | null | undefined
  description?: string | null | undefined
  multiple?: boolean
  path?: IFormField[]
  fullPath?: string[]
  level?: number
  defaultValue?: IValueType | IValueType[]
  conditions?: IFieldConditions
  settings?: Record<string, unknown>
}

interface INumberValueInput extends IFormFieldRoot {
  constraints?: {
    min?: number
    max?: number
  }
}

export interface INumberField extends INumberValueInput {
  type: ***REMOVED***number***REMOVED***
}

interface IStringValueInput extends IFormFieldRoot {
  placeholder?: string
}

interface ITextField extends IStringValueInput {
  type: ***REMOVED***text***REMOVED***
}

interface ILongTextField extends IStringValueInput {
  type: ***REMOVED***long_text***REMOVED***
}

interface IJSONField extends IFormFieldRoot {
  type: ***REMOVED***json***REMOVED***
}

interface ICustomFIeld extends IFormFieldRoot {
  type: `custom:${string}`
}

interface ISelectOption {
  label: string
  value: string
}

interface ISelectableInput extends IFormFieldRoot {
  options?: ISelectOption[]
  options_source?: {
    type: ***REMOVED***url***REMOVED***
    url: string
    method?: ***REMOVED***GET***REMOVED*** | ***REMOVED***POST***REMOVED***
    headers?: Record<string, string>
    body?: Record<string, string>
    value_key: string
    label_key: string
  }
}

interface ISingleSelectableInput extends ISelectableInput {
}

interface IMultiSelectableInput extends ISelectableInput {
  defaultValues?: Array<string | number>
}

export interface ISelectField extends ISingleSelectableInput {
  type: ***REMOVED***select***REMOVED***
}

export interface IRadioField extends ISingleSelectableInput {
  type: ***REMOVED***radio***REMOVED***
  layout?: ***REMOVED***horizontal***REMOVED*** | ***REMOVED***vertical***REMOVED***
}

export interface ICheckboxField extends IMultiSelectableInput {
  type: ***REMOVED***checkbox***REMOVED***
}

export interface IBooleanField extends IFormFieldRoot {
  type: ***REMOVED***boolean***REMOVED***
}

interface IDateFieldConstraints {
  minDate?: string
  maxDate?: string
}

interface IDateField extends IFormFieldRoot {
  type: ***REMOVED***date***REMOVED***
  constraints?: IDateFieldConstraints
}

interface ITimeFieldConstraints {
  minTime?: string
  maxTime?: string
}

interface ITimeField extends IFormFieldRoot {
  type: ***REMOVED***time***REMOVED***
  constraints?: ITimeFieldConstraints
}

interface IDateTimeConstraints {
  minDateTime?: string
  maxDateTime?: string
}

interface IDateTimeField extends IFormFieldRoot {
  type: ***REMOVED***datetime***REMOVED***
  constraints?: IDateTimeConstraints
}

interface IContainerField extends IFormFieldRoot {
  skip_path?: boolean
  fields: IFormField[]
  layout?: ***REMOVED***horizontal***REMOVED*** | ***REMOVED***vertical***REMOVED*** | ***REMOVED***grid2***REMOVED*** | ***REMOVED***grid3***REMOVED*** | ***REMOVED***grid4***REMOVED***
}

export interface IObjectField extends IContainerField {
  type: ***REMOVED***object***REMOVED***
}

export interface IFormFieldSection extends IContainerField {
  type: ***REMOVED***section***REMOVED*** | ***REMOVED***page***REMOVED***
}

export interface IFormFieldPage extends IFormFieldSection {
  type: ***REMOVED***page***REMOVED***
}

interface IGeoJSONField extends IFormFieldRoot {
  type: ***REMOVED***geojson***REMOVED***
  exclude_types?: string[]
  include_types?: string[]
}

interface IGeometryField extends IFormFieldRoot {
  type: ***REMOVED***geometry***REMOVED***
  exclude_types?: string[]
  include_types?: string[]
}

export interface IFormSection {
  id: string
  label?: string
  description?: string
  fields?: IFormField[]
  pages?: IPage[]
  wizard_steps?: IWizardStep[]
}

export interface IPage extends Omit<IForm, ***REMOVED***pages***REMOVED***> {
  id: string
  label: string
  description?: string
  fields: IFormField[]

}

export interface IWizardStep extends Omit<IForm, ***REMOVED***wizard_steps***REMOVED***> {
  order: number
}

export interface IForm {
  id: string
  label: string
  navigationType?: ***REMOVED***tabs***REMOVED*** | ***REMOVED***wizard***REMOVED*** | ***REMOVED***pages***REMOVED***
  description?: string
  fields?: IFormField[]
  pages?: IPage[]
  wizard_steps?: IWizardStep[]
  settings?: {
    url_navigable?: boolean
    class_name?: string
    show_progress?: boolean
  }
}

export interface IFormWithPages {
  id: string
  label: string
  description?: string
  pages: IPage[]
}

export interface IFormFieldProps {
  field: IFormField
  onChange?: IValueChangeFn
}

export type IFormValues = Record<string, IValueType | IValueType[]>
export type IFormValueState = [IFormValues, (v: IFormValues) => void]

export type IFormInputComponent = React.FC<IFormFieldProps>

export type IValueChangeFn = (v: IValueType | IValueType[] | undefined) => void

export interface IFieldInputProps {
  field: IFormField
  onChange: IValueChangeFn
  value?: IValueType
  className?: string
}
