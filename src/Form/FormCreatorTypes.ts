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
  value?: ***REMOVED***text***REMOVED*** | ***REMOVED***number***REMOVED***
  placeholder?: string
}

interface ITextField extends IStringValueInput {
  type: ***REMOVED***text***REMOVED***
}

interface ILongTextField extends IStringValueInput {
  type: ***REMOVED***long_text***REMOVED***

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
  value?: ***REMOVED***text***REMOVED*** | ***REMOVED***number***REMOVED***
  multiple: false
}

interface IMultiSelectableInput extends ISelectableInput {
  values?: Array<***REMOVED***text***REMOVED*** | ***REMOVED***number***REMOVED***>
  multiple: true
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

interface ICompoundField extends IFormFieldRoot {
  type: ***REMOVED***compound***REMOVED***
  fields: IFormField[]
  layout?: ***REMOVED***horizontal***REMOVED*** | ***REMOVED***vertical***REMOVED*** | ***REMOVED***grid2***REMOVED*** | ***REMOVED***grid3***REMOVED*** | ***REMOVED***grid4***REMOVED***

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
