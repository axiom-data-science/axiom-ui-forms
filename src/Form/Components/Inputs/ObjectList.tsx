import ObjectInput from "@/Form/Components/Inputs/Object"
import { IFieldInputProps, IObjectListField, IValueType } from "@/Form/Creator/FormCreatorTypes"
import { ReactElement, useCallback } from "react"

const ObjectListInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {


    const f: IObjectListField = field as IObjectListField
    const keyField = f.fields.find(_f=>_f.id === f.settings.keyField)
    let configError: string | null = null
    if(keyField === undefined || keyField === null){
        configError = `Key field ${f.settings.keyField} does not point at a valid field`
    }
    if(keyField?.multiple){
        configError = ***REMOVED***Key field cannot be a multiple***REMOVED***
    }
    if(keyField?.type === ***REMOVED***object***REMOVED*** || keyField?.type === ***REMOVED***number***REMOVED*** || keyField?.type === ***REMOVED***boolean***REMOVED*** || keyField?.type === ***REMOVED***checkbox***REMOVED***){
        configError = ***REMOVED***Key field cannot be an object, numeric or boolean type***REMOVED***
    }
    const oC = useCallback((value: IValueType | IValueType[]): void => {
        console.log(***REMOVED***hi..***REMOVED***)
        onChange(value)
    }, [onChange])


    return <>
        <ObjectInput 
            field={field}
            onChange={oC}
            value={value}
            disabled={disabled}
        />
    </>


}