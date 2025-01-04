import type { GeoJSON } from ***REMOVED***geojson***REMOVED***

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
// type can***REMOVED***t reference self
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
  value?: ***REMOVED***text***REMOVED*** | ***REMOVED***number***REMOVED***
  placeholder?: string
}

interface ITextField extends IStringValueInput {
  type: ***REMOVED***text***REMOVED*** | ***REMOVED***number***REMOVED***
}

interface ILongTextField extends IStringValueInput {
  type: ***REMOVED***long_text***REMOVED***

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
  value?: ***REMOVED***text***REMOVED*** | ***REMOVED***number***REMOVED***
}

interface IMultiSelectableInput extends ISelectableInput {
  values?: Array<***REMOVED***text***REMOVED*** | ***REMOVED***number***REMOVED***>
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
  value?: ***REMOVED***boolean***REMOVED***
}

interface IDateField extends IFormFieldRoot {
  type: ***REMOVED***date***REMOVED***
  value?: ***REMOVED***date***REMOVED***
}

interface ITimeField extends IFormFieldRoot {
  type: ***REMOVED***time***REMOVED***
  value?: ***REMOVED***time***REMOVED***
}

interface IDateTimeField extends IFormFieldRoot {
  type: ***REMOVED***datetime***REMOVED***
  value?: ***REMOVED***datetime***REMOVED***
}

interface IContainerField extends IFormFieldRoot {
  fields: IFormField[]
  layout?: ***REMOVED***horizontal***REMOVED*** | ***REMOVED***vertical***REMOVED*** | ***REMOVED***grid2***REMOVED*** | ***REMOVED***grid3***REMOVED*** | ***REMOVED***grid4***REMOVED***
}

export interface IObjectField extends IContainerField {
  type: ***REMOVED***object***REMOVED***
}

export interface IFormFieldSection extends IContainerField {
  type: ***REMOVED***section***REMOVED***
  description?: string
  multiple: false
  value: undefined
  values: undefined
}

interface IGeoJSONField extends IFormFieldRoot {
  type: ***REMOVED***geojson***REMOVED***
  value?: ***REMOVED***geojson***REMOVED***
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
