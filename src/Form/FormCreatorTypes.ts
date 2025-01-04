import type { GeoJSON } from 'geojson'

interface IValueTypes {
  text: string
  number: number
  date: string
  datetime: string
  time: string
  boolean: boolean
  geojson: GeoJSON
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

export type IFormField = ITextField | ILongTextField | ISelectField | IRadioField | ICheckboxField | IDateField | ITimeField | IDateTimeField | IBooleanField | IObjectField | IGeoJSONField | IFormFieldSection

interface IFormFieldRoot {
  id: string
  type: string
  required?: boolean
  label?: string | null | undefined
  multiple?: boolean
  path?: string[]
  level?: number
  value?: IValueType
}

interface IStringValueInput extends IFormFieldRoot {
  value?: 'text' | 'number'
  placeholder?: string
}

interface ITextField extends IStringValueInput {
  type: 'text' | 'number'
}

interface ILongTextField extends IStringValueInput {
  type: 'long_text'

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

interface IDateField extends IFormFieldRoot {
  type: 'date'
  value?: 'date'
}

interface ITimeField extends IFormFieldRoot {
  type: 'time'
  value?: 'time'
}

interface IDateTimeField extends IFormFieldRoot {
  type: 'datetime'
  value?: 'datetime'
}

interface IContainerField extends IFormFieldRoot {
  fields: IFormField[]
  layout?: 'horizontal' | 'vertical' | 'grid2' | 'grid3' | 'grid4'
}

export interface IObjectField extends IContainerField {
  type: 'object'
}

export interface IFormFieldSection extends IContainerField {
  type: 'section'
  description?: string
  multiple: false
  value: undefined
  values: undefined
}

interface IGeoJSONField extends IFormFieldRoot {
  type: 'geojson'
  value?: 'geojson'
  exclude_types?: string[]
  include_types?: string[]
}

export interface IPage {
  id: string
  label: string
  description?: string
  sections: IFormFieldSection[]

}

export interface IForm {
  id: string
  label: string
  description?: string
  fields: IFormField[]
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

export type IFormInputComponent = React.FC<IFormFieldProps>

export type IValueChangeFn = (v: IValueType | IValueType[] | undefined) => void

export interface IFieldInputProps {
  field: IFormField
  onChange: IValueChangeFn
  value?: IValueType
}
