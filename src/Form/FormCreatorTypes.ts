



export interface IValueTypes {
    text: string
    number: number
    date: string
    datetime: string
    time: string
    boolean: boolean
}

export type IField = ITextField | ILongTextField | ISelectField | IRadioField | ICheckboxField | IDateField | ITimeField | IDateTimeField | IBooleanField | ICompoundField

interface IFieldRoot {
    id: string
    type: string
    required: boolean
    label?: string
    value?: keyof IValueTypes | Array<keyof IValueTypes>
}


interface IStringValueInput extends IFieldRoot {
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

interface ISelectableInput extends IFieldRoot {
    multiple: boolean
    options: ISelectOption[]
}

interface ISingleSelectableInput extends ISelectableInput {
    value?: 'text' | 'number'
    multiple: false
}

interface IMultiSelectableInput extends ISelectableInput {
    value?: Array<'text' | 'number'>
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

export interface IBooleanField extends IFieldRoot {
    type: 'boolean'
    value?: 'boolean'
}

interface IDateField extends IFieldRoot {
    type: 'date'
    value?: 'date'
}

interface ITimeField extends IFieldRoot {
    type: 'time'
    value?: 'time'
}

interface IDateTimeField extends IFieldRoot {
    type: 'datetime'
    value?: 'datetime'
}

interface ICompoundField extends IFieldRoot {
    type: 'compound'
    fields: IField[]
    layout?: 'horizontal' | 'vertical' | 'grid2' | 'grid3' | 'grid4'

}



/* interface IFieldSection {
    label: string
    description?: string
    fields: IField[]

}


export interface IPage {
    id: string
    label: string
    description?: string
    sections: IFieldSection[]

} */

export interface IForm {
    id: string
    label: string
    description?: string
    fields: IField[]
}