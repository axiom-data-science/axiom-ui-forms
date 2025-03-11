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

export type IFormField = ITextField | INumberField | ILongTextField | IJSONField | ISelectField | IRadioField | ICheckboxField | IDateField | ITimeField | IDateTimeField | IBooleanField | IObjectField | IGeoJSONField | IFormFieldSection

export type IFormFieldType = 'text' | 'long_text' | 'number' | 'json' | 'select' | 'radio' | 'checkbox' | 'date' | 'time' | 'datetime' | 'boolean' | 'object' | 'geojson' | `custom:${string}`
export type ISectionFormFieldType = 'section' | 'page'

interface IFieldConditions {
  dependsOn: string | string[]
  value: string | number | boolean
}

interface IFormFieldRoot {
  id: string
  type: string
  required?: boolean
  label?: string | null | undefined
  multiple?: boolean
  path?: string[]
  fullPath?: string[]
  level?: number
  value?: IValueType
  conditions?: IFieldConditions
  settings?: Record<string, unknown>
}

interface INumberValueInput extends IFormFieldRoot {
  value?: 'number'
  constraints?: {
    min?: number
    max?: number
  }
}

export interface INumberField extends INumberValueInput {
  type: 'number'
}

interface IStringValueInput extends IFormFieldRoot {
  value?: 'text'
  placeholder?: string
}

interface ITextField extends IStringValueInput {
  type: 'text'
}

interface ILongTextField extends IStringValueInput {
  type: 'long_text'
}

interface IJSONField extends IFormFieldRoot {
  type: 'json'
}

interface ISelectOption {
  label: string
  value: string
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

interface ISingleSelectableInput extends ISelectableInput {
  value?: 'text' | 'number'
}

interface IMultiSelectableInput extends ISelectableInput {
  values?: Array<'text' | 'number'>
}

export interface ISelectField extends ISingleSelectableInput {
  type: 'select'
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
  value?: 'boolean'
}

interface IDateFieldConstraints {
  minDate?: string
  maxDate?: string
}

interface IDateField extends IFormFieldRoot {
  type: 'date'
  value?: 'date'
  constraints?: IDateFieldConstraints
}

interface ITimeFieldConstraints {
  minTime?: string
  maxTime?: string
}

interface ITimeField extends IFormFieldRoot {
  type: 'time'
  value?: 'time'
  constraints?: ITimeFieldConstraints
}

interface IDateTimeConstraints {
  minDateTime?: string
  maxDateTime?: string
}

interface IDateTimeField extends IFormFieldRoot {
  type: 'datetime'
  value?: 'datetime'
  constraints?: IDateTimeConstraints
}

interface IContainerField extends IFormFieldRoot {
  skip_path?: boolean
  fields: IFormField[]
  layout?: 'horizontal' | 'vertical' | 'grid2' | 'grid3' | 'grid4'
}

export interface IObjectField extends IContainerField {
  type: 'object'
}

export interface IFormFieldSection extends IContainerField {
  type: 'section' | 'page'
}

export interface IFormFieldPage extends IFormFieldSection {
  type: 'page'
}

interface IGeoJSONField extends IFormFieldRoot {
  type: 'geojson'
  value?: 'geojson'
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

export interface IPage extends Omit<IForm, 'pages'> {
  id: string
  label: string
  description?: string
  fields: IFormField[]

}

export interface IWizardStep extends Omit<IForm, 'wizard_steps'> {
  order: number
}

export interface IForm {
  id: string
  label: string
  navigationType?: 'tabs' | 'wizard' | 'pages'
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
  form: IForm
  field: IFormField
  onChange: IValueChangeFn
  formValueState: IFormValueState
  value?: IValueType
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
  className?: string
}
