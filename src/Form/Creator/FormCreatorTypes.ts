import { type IFormContextValue } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
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

export type IFormFieldType =
  | ***REMOVED***text***REMOVED***
  | ***REMOVED***long_text***REMOVED***
  | ***REMOVED***number***REMOVED***
  | ***REMOVED***json***REMOVED***
  | ***REMOVED***select***REMOVED***
  | ***REMOVED***radio***REMOVED***
  | ***REMOVED***checkbox***REMOVED***
  | ***REMOVED***date***REMOVED***
  | ***REMOVED***time***REMOVED***
  | ***REMOVED***datetime***REMOVED***
  | ***REMOVED***boolean***REMOVED***
  | ***REMOVED***object***REMOVED***
  | ***REMOVED***objectWrapper***REMOVED***
  | ***REMOVED***objectList***REMOVED***
  | ***REMOVED***oneOf***REMOVED***
  | ***REMOVED***geojson***REMOVED***
  | ***REMOVED***geometry***REMOVED***
  | `custom:${string}`
export type ISectionFormFieldType = ***REMOVED***section***REMOVED*** | ***REMOVED***page***REMOVED***

export type IFieldConditionResult = ***REMOVED***exclude***REMOVED*** | ***REMOVED***include***REMOVED*** | ***REMOVED***disable***REMOVED*** | ***REMOVED***enable***REMOVED***

export interface ICheckConditionResult {
  pass: boolean
  result: IFieldConditionResult
  newDefaultValue?: IValueType | IValueType[]
}
export interface IFieldConditionsSet {
  logic?: ***REMOVED***and***REMOVED*** | ***REMOVED***or***REMOVED***
  conditions: IFieldCondition[]
  result?: IFieldConditionResult
  newDefaultValue?: IValueType | IValueType[]
}

export type IFieldConditionOperator =
  | ***REMOVED***=***REMOVED***
  | ***REMOVED***eq***REMOVED***
  | ***REMOVED***>***REMOVED***
  | ***REMOVED***gt***REMOVED***
  | ***REMOVED***>=***REMOVED***
  | ***REMOVED***gte***REMOVED***
  | ***REMOVED***<***REMOVED***
  | ***REMOVED***lt***REMOVED***
  | ***REMOVED***<=***REMOVED***
  | ***REMOVED***lte***REMOVED***
  | ***REMOVED***!=***REMOVED***
  | ***REMOVED***!eq***REMOVED***
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
  excludeFromPayload?: boolean
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
    nonNullDefaultValue?: number,
    invertForDisplay?: boolean
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

interface ISelectOption {
  label: string
  value: string | number
  [key: string]: string | number | boolean | Record<string, unknown>
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

interface ICustomField extends IFormFieldRoot, ISelectableInput {
  type: `custom:${string}`
}

interface ISingleSelectableInput extends ISelectableInput {}

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

export interface IObjectField extends Omit<IValidContainerField, ***REMOVED***fields***REMOVED***> {
  type: ***REMOVED***object***REMOVED***
  tabs?: IFormLayoutTab[]
  pages?: IPage[]
  wizard_steps?: IWizardStep[]
  fields?: IFormField[]
}

export interface IObjectListField extends Omit<IValidContainerField, ***REMOVED***fields***REMOVED***> {
  type: ***REMOVED***objectList***REMOVED***
  settings: {
    keyField: string
  }
  fields: IFormField[]
}

/**
 * IObjectWrapperField - A UI-only container for organizing nested fields with layout options
 *
 * Use this to group related fields into tabs, pages, or wizard steps without adding a data nesting level.
 * The wrapper itself doesn***REMOVED***t add data to the form values (skip_path: true is enforced).
 *
 * Example use case: Organize multiple object fields or array items with tabs for better UX
 *
 * Example schema override:
 * {
 *   type: ***REMOVED***objectWrapper***REMOVED***,
 *   id: ***REMOVED***personal_info_wrapper***REMOVED***,
 *   tabs: [
 *     { id: ***REMOVED***basic***REMOVED***, label: ***REMOVED***Basic Info***REMOVED***, fields: [...] },
 *     { id: ***REMOVED***contact***REMOVED***, label: ***REMOVED***Contact***REMOVED***, fields: [...] }
 *   ]
 * }
 */
export interface IObjectWrapperField extends Omit<IValidContainerField, ***REMOVED***fields***REMOVED*** | ***REMOVED***multiple***REMOVED***> {
  type: ***REMOVED***objectWrapper***REMOVED***
  tabs?: IFormLayoutTab[]
  pages?: IPage[]
  wizard_steps?: IWizardStep[]
  fields?: IFormField[]
  // Enforce skip_path: true for wrapper fields via type constraint
  skip_path: true
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
    /**
     * Path to a form field that controls which shape types are enabled.
     * Field value should be a comma-separated string or array of shape type names.
     * E.g., ***REMOVED***point,polygon***REMOVED*** or [***REMOVED***point***REMOVED***, ***REMOVED***linestring***REMOVED***]
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
}

export interface IPage extends Omit<IFormSection, ***REMOVED***pages***REMOVED***> {}
export interface IWizardStep extends Omit<IFormSection, ***REMOVED***wizard_steps***REMOVED***> {}
export interface IFormLayoutTab extends Omit<IFormSection, ***REMOVED***tabs***REMOVED***> {}

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
  tabs?: IFormLayoutTab[]
  settings?: IFormSettings
}

export type IFormFieldOverride = (Partial<IFormField> & { prop: string }) | IObjectFormFieldOverride
export type IObjectFormFieldOverride = Omit<
  Partial<IObjectField>,
  ***REMOVED***fields***REMOVED*** | ***REMOVED***tabs***REMOVED*** | ***REMOVED***pages***REMOVED*** | ***REMOVED***wizard_steps***REMOVED***
> & {
  fields?: IFormFieldOverride[]
  prop: string
  tabs?: IFormLayoutTabOverride[]
  pages?: IPageOverride[]
  wizard_steps?: IWizardStepOverride[]
}

export interface IFormSectionOverride extends Omit<IFormOverride, ***REMOVED***settings***REMOVED***> {}

interface IPageOverride extends Omit<IFormSectionOverride, ***REMOVED***pages***REMOVED***> {}
interface IFormLayoutTabOverride extends Omit<IFormSectionOverride, ***REMOVED***tabs***REMOVED***> {}
interface IWizardStepOverride extends Omit<IFormSectionOverride, ***REMOVED***wizard_steps***REMOVED***> {}

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
