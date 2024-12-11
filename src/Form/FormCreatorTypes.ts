interface IValueTypes {
  text: string
  number: number
  date: string
  datetime: string
  time: string
  boolean: boolean
  composite: ICompositeValueType
}

type ValueOf<T> = T[keyof T]

type ICompositeValueType = Record<string, string | number | boolean>

export type IValueType = ValueOf<IValueTypes> | Array<ValueOf<IValueTypes>> | { [key: string]: IValueType } | Array<{ [key: string]: IValueType }>
// export type IValueType2 = string | string[] | number | number[] | boolean | boolean[] | ICompositeValueType | ICompositeValueType[]

export type IFormField = ITextField | ILongTextField | ISelectField | IRadioField | ICheckboxField | IDateField | ITimeField | IDateTimeField | IBooleanField | ICompoundField

interface IFormFieldRoot {
  id: string
  type: string
  required: boolean
  label?: string
  value?: IValueType
  values?: IValueType[]
  multiple?: boolean
}

interface IStringValueInput extends IFormFieldRoot {
  value?: 'text' | 'number'
  placeholder?: string
}

interface ITextField extends IStringValueInput {
  type: 'text'
}

interface ILongTextField extends IStringValueInput {
  type: 'long_text'

}

interface ISelectOption {
  label: string
  value: string
}

interface ISelectableInput extends IFormFieldRoot {
  multiple: boolean
  options: ISelectOption[]
}

interface ISingleSelectableInput extends ISelectableInput {
  value?: 'text' | 'number'
  multiple: false
}

interface IMultiSelectableInput extends ISelectableInput {
  values?: Array<'text' | 'number'>
  multiple: true
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

interface ICompoundField extends IFormFieldRoot {
  type: 'compound'
  fields: IFormField[]
  layout?: 'horizontal' | 'vertical' | 'grid2' | 'grid3' | 'grid4'

}

/* interface IFormFieldSection {
    label: string
    description?: string
    fields: IFormField[]

}

export interface IPage {
    id: string
    label: string
    description?: string
    sections: IFormFieldSection[]

} */

export interface IForm {
  id: string
  label: string
  description?: string
  fields: IFormField[]
}

export type IFormValues = Record<string, IValueType>

export type IFormInputComponent = React.FC<{ field: IFormField, onChange: () => void }>
