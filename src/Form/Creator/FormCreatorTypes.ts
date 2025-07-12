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

export type IFormField = ITextField | IConstantField | INumberField | ILongTextField | IJSONField | ISelectField | IRadioField | ICheckboxField | IDateField | ITimeField | IDateTimeField | IBooleanField | IObjectField | IObjectListField | IOneOfField | IGeoJSONField | IGeometryField | IFormFieldSection | ICustomField

export type IFormFieldType = ***REMOVED***text***REMOVED*** | ***REMOVED***long_text***REMOVED*** | ***REMOVED***number***REMOVED*** | ***REMOVED***json***REMOVED*** | ***REMOVED***select***REMOVED*** | ***REMOVED***radio***REMOVED*** | ***REMOVED***checkbox***REMOVED*** | ***REMOVED***date***REMOVED*** | ***REMOVED***time***REMOVED*** | ***REMOVED***datetime***REMOVED*** | ***REMOVED***boolean***REMOVED*** | ***REMOVED***object***REMOVED*** | ***REMOVED***objectList***REMOVED*** | ***REMOVED***oneOf***REMOVED*** | ***REMOVED***geojson***REMOVED*** | ***REMOVED***geometry***REMOVED*** | `custom:${string}`
export type ISectionFormFieldType = ***REMOVED***section***REMOVED*** | ***REMOVED***page***REMOVED***

export type IFieldConditionResult = ***REMOVED***exclude***REMOVED*** | ***REMOVED***include***REMOVED*** | ***REMOVED***disable***REMOVED*** | ***REMOVED***enable***REMOVED***

export interface ICheckConditionResult {
  pass: boolean
  result: IFieldConditionResult
}
export interface IFieldConditionsSet {
  logic?: ***REMOVED***and***REMOVED*** | ***REMOVED***or***REMOVED***
  conditions: Array<Omit<IFieldCondition, ***REMOVED***result***REMOVED***>>
  result?: IFieldConditionResult
}

export type IFieldConditionOperator = ***REMOVED***=***REMOVED*** | ***REMOVED***eq***REMOVED*** | ***REMOVED***>***REMOVED*** | ***REMOVED***gt***REMOVED*** | ***REMOVED***>=***REMOVED*** | ***REMOVED***gte***REMOVED*** | ***REMOVED***<***REMOVED*** | ***REMOVED***lt***REMOVED*** | ***REMOVED***<=***REMOVED*** | ***REMOVED***lte***REMOVED*** | ***REMOVED***!=***REMOVED*** | ***REMOVED***!eq***REMOVED***
export interface IFieldCondition {
  dependsOn?: string | string[]
  field?: string | string[]
  value?: string | number | boolean
  operator?: IFieldConditionOperator
  result?: IFieldConditionResult
}

type IFieldConstraints = Record<string, unknown>

interface IFormFieldSettingsBase {
  [key: string]: unknown
  descriptionPresentation?: ***REMOVED***inline***REMOVED*** | ***REMOVED***tooltip***REMOVED***
}

interface IFormFieldRoot {
  id: string
  type: string
  required?: boolean
  label?: string | null | undefined
  description?: string | null | undefined
  long_description?: string | null | undefined
  multiple?: boolean
  path?: IFormField[]
  destPath?: string
  level?: number
  index?: number
  defaultValue?: IValueType | IValueType[]
  conditions?: IFieldCondition
  conditionsSet?: IFieldConditionsSet
  constraints?: IFieldConstraints
  settings?: IFormFieldSettingsBase
  parent?: IFormField
}

export interface IConstantField extends IFormFieldRoot {
  type: ***REMOVED***constant***REMOVED***
  defaultValue: IValueType
}
interface INumberValueInput extends IFormFieldRoot {
  constraints?: {
    min?: number
    max?: number
  }
  settings?: IFormFieldSettingsBase & {
    step?: number
    canBeNull?: boolean
    nonNullDefaultValue?: number
  }

}

export interface INumberField extends INumberValueInput {
  type: ***REMOVED***number***REMOVED***
}

interface IStringValueInput extends IFormFieldRoot {
  placeholder?: string
}

export interface ITextField extends IStringValueInput {
  type: ***REMOVED***text***REMOVED***
}

interface ILongTextField extends IStringValueInput {
  type: ***REMOVED***long_text***REMOVED***
}

export interface IJSONField extends IFormFieldRoot {
  type: ***REMOVED***json***REMOVED***
  settings?: IFormFieldSettingsBase & {
    exportAsString?: boolean
    allowEmpty?: boolean
  }
}

interface ICustomField extends IFormFieldRoot {
  type: `custom:${string}`
}

interface ISelectOption {
  label: string
  value: string | number | boolean
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

interface IDateFieldConstraints extends IFieldConstraints {
  minDate?: string
  maxDate?: string
}

interface IDateField extends IFormFieldRoot {
  type: ***REMOVED***date***REMOVED***
  constraints?: IDateFieldConstraints
}

interface ITimeFieldConstraints extends IFieldConstraints {
  minTime?: string
  maxTime?: string
}

interface ITimeField extends IFormFieldRoot {
  type: ***REMOVED***time***REMOVED***
  constraints?: ITimeFieldConstraints
}

interface IDateTimeConstraints extends IFieldConstraints {
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
  multiple?: boolean
}

// Add a type guard to enforce the condition
type EnforceContainerFieldConstraints<T extends IContainerField> = T extends { skip_path: true }
  ? T & { multiple: false }
  : T

export type IValidContainerField = EnforceContainerFieldConstraints<IContainerField>

export interface IObjectField extends IValidContainerField {
  type: ***REMOVED***object***REMOVED***
}

export interface IObjectListField extends IValidContainerField {
  type: ***REMOVED***objectList***REMOVED***
}

export interface IOneOfField extends IValidContainerField {
  type: ***REMOVED***oneOf***REMOVED***
  discriminator?: {
    mapping?: Record<string, string>
    propertyName?: string
  }
}

export interface IFormFieldSection extends IValidContainerField {
  type: ***REMOVED***section***REMOVED*** | ***REMOVED***page***REMOVED***
}

export interface IFormFieldPage extends IFormFieldSection {
  type: ***REMOVED***page***REMOVED***
}

export interface IGeoJSONField extends IFormFieldRoot {
  type: ***REMOVED***geojson***REMOVED***
  exclude_types?: string[]
  include_types?: string[]
}

export interface IGeometryField extends IFormFieldRoot {
  type: ***REMOVED***geometry***REMOVED***
  exclude_types?: string[]
  include_types?: string[]
  settings?: IFormFieldSettingsBase & {
    drawEnabled?: boolean
    drawPolygonEnabled?: boolean
    drawPathEnabled?: boolean
    drawPointEnabled?: boolean
    showCoordinateInput?: boolean
    height?: string
    defaultCenter?: {
      lat: number
      lon: number
      zoom: number
    }
  }
}

export interface IFormSection {
  id: string
  label?: string
  description?: string
  order?: number
  fields?: IFormField[]
  pages?: IPage[]
  wizard_steps?: IWizardStep[]
}

export interface IPage extends Omit<IFormSection, ***REMOVED***pages***REMOVED***> {

}

export interface IWizardStep extends Omit<IFormSection, ***REMOVED***wizard_steps***REMOVED***> {

}

export interface IFormSettings {
  url_navigable?: boolean
  class_name?: string
  show_progress?: boolean
}

export interface IForm {
  id: string
  label?: string
  navigationType?: ***REMOVED***tabs***REMOVED*** | ***REMOVED***wizard***REMOVED*** | ***REMOVED***pages***REMOVED***
  description?: string
  fields?: IFormField[]
  pages?: IPage[]
  wizard_steps?: IWizardStep[]
  settings?: IFormSettings
}

export type IFormFieldOverride = Partial<IFormField> & { prop: string } | IObjectFormFieldOverride
export type IObjectFormFieldOverride = Omit<Partial<IObjectField>, ***REMOVED***fields***REMOVED***> & { fields?: IFormFieldOverride[], prop: string }

export interface IFormSectionOverride extends Omit<IFormOverride, ***REMOVED***settings***REMOVED***> {}

interface IPageOverride extends Omit<IFormSectionOverride, ***REMOVED***pages***REMOVED***> {

}

interface IWizardStepOverride extends Omit<IFormSectionOverride, ***REMOVED***wizard_steps***REMOVED***> {

}

export interface IFormOverride {
  id?: string
  label?: string
  description?: string
  pages?: IPageOverride[]
  wizard_steps?: IWizardStepOverride[]
  fields?: IFormFieldOverride[]
  settings?: IFormSettings
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

export interface IFormValues {
  [key: string]: IValueType | IValueType[] | undefined | IFormValues
}
export type IFormValueState = [IFormValues, (v: IFormValues) => void]

export type IFormInputComponent = React.FC<IFormFieldProps>

export type IValueChangeFn = (v: IValueType | IValueType[] | undefined) => void

export interface IFieldInputProps {
  field: IFormField
  onChange: IValueChangeFn
  value?: IValueType
  className?: string
  disabled?: boolean
}
