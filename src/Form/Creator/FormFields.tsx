import FieldCreator from ***REMOVED***@/Form/Components/FieldCreator***REMOVED***
import { type IFieldInputProps, type IForm, type IFormField, type IFormValues, type IValueChangeFn } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

const FormFields = ({
  form,
  fields,
  formValueState,
  onChange,
  className = ***REMOVED***flex flex-col gap-2***REMOVED***,
  inputOverrides
}: {
  form: IForm
  fields?: IFormField[]
  formValueState: [IFormValues, (v: IFormValues) => void]
  onChange?: IValueChangeFn
  className?: string
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
}): ReactElement => {
  return (
      <>
      {
        fields === undefined || fields.length < 1
          ? ***REMOVED******REMOVED***
          : <div className={className}>
            {
              fields?.map((field) => {
                return (
                  <FieldCreator onChange={onChange} form={form} field={field} key={field.id} formValueState={formValueState} inputOverrides={inputOverrides}/>
                )
              })
            }
        </div>
      }
      </>
  )
}

export default FormFields
