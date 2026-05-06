import ObjectInput from "@/Form/Components/Inputs/Object"
import { IFieldInputProps, IObjectListField, IValueType } from "@/Form/Creator/FormCreatorTypes"
import { ReactElement } from "react"

const ObjectListInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {


    const f: IObjectListField = field as IObjectListField
    const keyField = f.fields.find(_f=>_f.id === f.settings.keyField)
    let configError: string | null = null
    if(keyField === undefined || keyField === null){
        configError = `Key field ${f.settings.keyField} does not point at a valid field`
    }
    if(keyField?.multiple){
        configError = 'Key field cannot be a multiple'
    }
    if(keyField?.type === 'object' || keyField?.type === 'number' || keyField?.type === 'boolean' || keyField?.type === 'checkbox'){
        configError = 'Key field cannot be an object, numeric or boolean type'
    }
    const oC = (value: IValueType | IValueType[]): void => {
        console.log('hi..')
        onChange(value)
    }


    return <>
        <ObjectInput 
            field={field}
            onChange={oC}
            value={value}
            disabled={disabled}
        />
    </>


}