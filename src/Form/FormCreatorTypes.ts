



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

interface ISelectableInput extends IFieldRoot {
    multiple: boolean
    options: ISelectOption[]
}

interface ISingleSelectableInput extends ISelectableInput {
    value?: ***REMOVED***text***REMOVED*** | ***REMOVED***number***REMOVED***
    multiple: false
}

interface IMultiSelectableInput extends ISelectableInput {
    value?: Array<***REMOVED***text***REMOVED*** | ***REMOVED***number***REMOVED***>
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

export interface IBooleanField extends IFieldRoot {
    type: ***REMOVED***boolean***REMOVED***
    value?: ***REMOVED***boolean***REMOVED***
}

interface IDateField extends IFieldRoot {
    type: ***REMOVED***date***REMOVED***
    value?: ***REMOVED***date***REMOVED***
}

interface ITimeField extends IFieldRoot {
    type: ***REMOVED***time***REMOVED***
    value?: ***REMOVED***time***REMOVED***
}

interface IDateTimeField extends IFieldRoot {
    type: ***REMOVED***datetime***REMOVED***
    value?: ***REMOVED***datetime***REMOVED***
}

interface ICompoundField extends IFieldRoot {
    type: ***REMOVED***compound***REMOVED***
    fields: IField[]
    layout?: ***REMOVED***horizontal***REMOVED*** | ***REMOVED***vertical***REMOVED*** | ***REMOVED***grid2***REMOVED*** | ***REMOVED***grid3***REMOVED*** | ***REMOVED***grid4***REMOVED***

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