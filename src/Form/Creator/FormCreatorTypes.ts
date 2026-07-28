import { type IFormContextValue } from '@/Form/Creator/FormContextProvider'
import type { GeoJSON } from 'geojson'

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
// type can't reference self
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface ICompositeValueType {
  [key: string]: IValueType | IValueType[] | undefined
}
export type IValueType = undefined | null | ValueOf<IValueTypes> // | Array<ValueOf<IValueTypes>> | { [key: string]: IValueType } | Array<Record<string, IValueTypes>>
// export type IValueType2 = string | string[] | number | number[] | boolean | boolean[] | ICompositeValueType | ICompositeValueType[]

export type IFormField =
  | ITextField
  | IConstantField
  | INumberField
  | ILongTextField
  | IJSONField
  | ISelectField
  | IRadioField
  | ICheckboxField
  | IDateField
  | ITimeField
  | IDateTimeField
  | IBooleanField
  | IObjectField
  | IObjectWrapperField
  | IObjectListField
  | IOneOfField
  | IGeoJSONField
  | IGeometryField
  | IFormFieldSection
  | ICustomField
  | IFileUploadInput

export type IFormFieldType =
  | 'text'
  | 'long_text'
  | 'number'
  | 'json'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'time'
  | 'datetime'
  | 'boolean'
  | 'object'
  | 'objectWrapper'
  | 'objectList'
  | 'oneOf'
  | 'fileUpload'
  | 'file_upload'
  | 'stateSelector'
  | 'state_selector'
  | 'selectOrText'
  | 'geojson'
  | 'geometry'
  | `custom:${string}`
export type ISectionFormFieldType = 'section' | 'page'

export type IFieldConditionResult = 'exclude' | 'include' | 'disable' | 'enable'

export interface ICheckConditionResult {
  pass: boolean
  result: IFieldConditionResult
  newDefaultValue?: IValueType | IValueType[]
}
export interface IFieldConditionsSet {
  logic?: 'and' | 'or'
  conditions: IFieldCondition[]
  result?: IFieldConditionResult
  newDefaultValue?: IValueType | IValueType[]
}

export type IFieldConditionOperator =
  | '='
  | 'eq'
  | '>'
  | 'gt'
  | '>='
  | 'gte'
  | '<'
  | 'lt'
  | '<='
  | 'lte'
  | '!='
  | '!eq'
export interface IFieldCondition {
  dependsOn?: string | string[]
  field?: string | string[]
  value?: string | number | boolean
  operator?: IFieldConditionOperator
  result?: IFieldConditionResult
  newDefaultValue?: IValueType | IValueType[]
}

type IFieldConstraints = Record<string, unknown>

interface IFormFieldSettingsBase {
  [key: string]: unknown
  descriptionPresentation?: 'inline' | 'tooltip'
  boldLabel?: boolean
  boldDescription?: boolean
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
  excludeFromPayload?: boolean
}

export interface IConstantField extends IFormFieldRoot {
  type: 'constant'
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
    invertForDisplay?: boolean
    smallLabel?: boolean
    className?: string
  }
}

export interface INumberField extends INumberValueInput {
  type: 'number'
}

interface IStringValueInput extends IFormFieldRoot {
  placeholder?: string
}

export interface ITextField extends IStringValueInput {
  type: 'text'
}

interface ILongTextField extends IStringValueInput {
  type: 'long_text'
}

export interface IJSONField extends IFormFieldRoot {
  type: 'json'
  settings?: IFormFieldSettingsBase & {
    exportAsString?: boolean
    allowEmpty?: boolean
  }
}

interface ISelectOption {
  label: string
  value: string | number
  description?: string
  [key: string]: string | number | boolean | Record<string, unknown> | undefined
}

interface ISelectableInput extends IFormFieldRoot {
  options?: ISelectOption[]
  options_source?: {
    type: 'url'
    url: string
    method?: 'GET' | 'POST'
    headers?: Record<string, string>
    body?: Record<string, string>
    value_key: string
    label_key: string
  }
}



interface IFileUploadInput extends IFormFieldRoot {
  type: 'fileUpload' | 'file_upload'
  settings?: IFormFieldSettingsBase & {
    acceptFileTypes?: string[]
  }
}
interface ICustomField extends IFormFieldRoot, ISelectableInput {
  type: `custom:${string}`
}

interface ISingleSelectableInput extends ISelectableInput {}

interface IMultiSelectableInput extends ISelectableInput {
  defaultValues?: Array<string | number>
}

export interface ISelectField extends ISingleSelectableInput {
  type: 'select' | 'stateSelector' | 'selectOrText'
  settings?: IFormFieldSettingsBase & {
    showDescriptionForSelected?: boolean
  }
}

export interface IRadioField extends ISingleSelectableInput {
  type: 'radio'
  layout?: 'horizontal' | 'vertical'
}

export interface ICheckboxField extends IMultiSelectableInput {
  type: 'checkbox'
}

export interface IBooleanField extends IFormFieldRoot {
  type: 'boolean'
}

interface IDateFieldConstraints extends IFieldConstraints {
  minDate?: string
  maxDate?: string
}

interface IDateField extends IFormFieldRoot {
  type: 'date'
  constraints?: IDateFieldConstraints
}

interface ITimeFieldConstraints extends IFieldConstraints {
  minTime?: string
  maxTime?: string
}

interface ITimeField extends IFormFieldRoot {
  type: 'time'
  constraints?: ITimeFieldConstraints
}

interface IDateTimeConstraints extends IFieldConstraints {
  minDateTime?: string
  maxDateTime?: string
}

interface IDateTimeField extends IFormFieldRoot {
  type: 'datetime'
  constraints?: IDateTimeConstraints
}

export type IFormFieldLayout = 'horizontal' | 'vertical' | 'grid2' | 'grid3' | 'grid4'
interface IContainerField extends IFormFieldRoot {
  skip_path?: boolean
  fields: IFormField[]
  layout?: IFormFieldLayout
  multiple?: boolean
}

// Add a type guard to enforce the condition
type EnforceContainerFieldConstraints<T extends IContainerField> = T extends { skip_path: true }
  ? T & { multiple: false }
  : T

export type IValidContainerField = EnforceContainerFieldConstraints<IContainerField>

export interface IObjectField extends Omit<IValidContainerField, 'fields'> {
  type: 'object'
  tabs?: IFormLayoutTab[]
  pages?: IPage[]
  wizard_steps?: IWizardStep[]
  fields?: IFormField[]
}

export interface IObjectListField extends Omit<IValidContainerField, 'fields'> {
  type: 'objectList'
  settings: {
    keyField: string
    valueField?: string
    onlyShowKeyUntilUniqueEntered?: boolean
    showInitialObject?: boolean
    excludeKeyFieldFromValue?: boolean
  }
  fields: IFormField[]
}

/**
 * IObjectWrapperField - A UI-only container for organizing nested fields with layout options
 *
 * Use this to group related fields into tabs, pages, or wizard steps without adding a data nesting level.
 * The wrapper itself doesn't add data to the form values (skip_path: true is enforced).
 *
 * Example use case: Organize multiple object fields or array items with tabs for better UX
 *
 * Example schema override:
 * {
 *   type: 'objectWrapper',
 *   id: 'personal_info_wrapper',
 *   tabs: [
 *     { id: 'basic', label: 'Basic Info', fields: [...] },
 *     { id: 'contact', label: 'Contact', fields: [...] }
 *   ]
 * }
 */
export interface IObjectWrapperField extends Omit<IValidContainerField, 'fields' | 'multiple'> {
  type: 'objectWrapper'
  tabs?: IFormLayoutTab[]
  pages?: IPage[]
  wizard_steps?: IWizardStep[]
  fields?: IFormField[]
  // Enforce skip_path: true for wrapper fields via type constraint
  skip_path?: true
}

export interface IOneOfField extends IValidContainerField {
  type: 'oneOf'
  discriminator?: {
    mapping?: Record<string, string>
    propertyName?: string
  }
}

export interface IFormFieldSection extends IValidContainerField {
  type: 'section' | 'page'
}

export interface IFormFieldPage extends IFormFieldSection {
  type: 'page'
}

export interface IGeoJSONField extends IFormFieldRoot {
  type: 'geojson'
  exclude_types?: string[]
  include_types?: string[]
}

export interface IGeometryField extends IFormFieldRoot {
  type: 'geometry'
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
    /**
     * Path to a form field that controls which shape types are enabled.
     * Field value should be a comma-separated string or array of shape type names.
     * E.g., 'point,polygon' or ['point', 'linestring']
     * Merged with static settings (static settings take precedence).
     */
    enabledShapesField?: string
    /**
     * Maximum number of points allowed in a LineString geometry.
     * Validation enforced on coordinate parsing and geometry updates.
     */
    maxLineStringPoints?: number
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
  tabs?: IFormLayoutTab[]
  settings?: {
    boldDescription?: boolean
    className?: string
  }
}

export interface IPage extends Omit<IFormSection, 'pages'> {}
export interface IWizardStep extends Omit<IFormSection, 'wizard_steps'> {}
export interface IFormLayoutTab extends Omit<IFormSection, 'tabs'> {
  layout?: 'horizontal' | 'vertical' | 'grid2' | 'grid3' | 'grid4'
}

export interface IFormSettings {
  url_navigable?: boolean
  class_name?: string
  show_progress?: boolean
}

export interface IForm {
  id: string
  label?: string
  navigationType?: 'tabs' | 'wizard' | 'pages'
  description?: string
  fields?: IFormField[]
  pages?: IPage[]
  wizard_steps?: IWizardStep[]
  tabs?: IFormLayoutTab[]
  settings?: IFormSettings
}

export type IFormFieldOverride = (Partial<IFormField> & { prop: string }) | IObjectFormFieldOverride
export type IObjectFormFieldOverride = Omit<
  Partial<IObjectField>,
  'fields' | 'tabs' | 'pages' | 'wizard_steps'
> & {
  fields?: IFormFieldOverride[]
  prop?: string
  tabs?: IFormLayoutTabOverride[]
  pages?: IPageOverride[]
  wizard_steps?: IWizardStepOverride[]
}

export interface IFormSectionOverride extends Omit<IFormOverride, 'settings'> {
  layout?: IContainerField['layout']
}

interface IPageOverride extends Omit<IFormSectionOverride, 'pages'> {}
interface IFormLayoutTabOverride extends Omit<IFormSectionOverride, 'tabs'> {}
interface IWizardStepOverride extends Omit<IFormSectionOverride, 'wizard_steps'> {}

export interface IFormOverride {
  id?: string
  label?: string
  description?: string
  long_description?: string
  pages?: IPageOverride[]
  wizard_steps?: IWizardStepOverride[]
  tabs?: IFormLayoutTabOverride[]
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
  context?: IFormContextValue
}
