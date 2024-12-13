import inputMap from ***REMOVED***@/Form/Components/Inputs/inputMap***REMOVED***
import { type IFormField, type IValueChangeFn, type IValueType } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { Button, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { PlusIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***

interface IFieldCreator {
  field: IFormField
  onChange?: IValueChangeFn
  className?: string
  defaultClassName?: string
}

const MultipleFieldCreator = ({ field, onChange }: IFieldCreator): ReactElement => {
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  const defaultOnChange = (v: IValueType[] | undefined): void => {
    formValues[field.id] = v
    setFormValues(structuredClone(formValues))
  }

  const initialValues = formValues[field.id] as IValueType[] | undefined ?? [null]
  const InputComponent = inputMap[field.type]

  return <div>
    {
      initialValues?.map((value, index) => {
        return <div key={`${field.id}-${index}`} className=***REMOVED***flex flex-col gap-2***REMOVED***>
          <InputComponent
          field={{
            ...field,
            required: false,
            label: index > 0 ? null : field.label,
            id: `${field.id}-${index}`
          }}
          value={value}
          onChange={(v) => {
            const newValues = [...initialValues]
            newValues[index] = v
            defaultOnChange(newValues)
          }}
        />
        </div>
      })
    }
    {
      <div className=***REMOVED***flex flex-row gap-2 mt-4***REMOVED***>
      <Button
        size=***REMOVED***sm***REMOVED***
        type=***REMOVED***create***REMOVED***
        onClick={() => {
          defaultOnChange([...(initialValues ?? []), undefined])
        }}
      >
        Add <PlusIcon className=***REMOVED***inline***REMOVED*** />
      </Button>
      </div>
    }

  </div>
}

const FieldCreator = ({
  field,
  onChange,
  className,
  defaultClassName = ***REMOVED***py-5 flex flex-col gap-8***REMOVED***
}: IFieldCreator): ReactElement => {
  const InputComponent = inputMap[field.type]
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  const defaultOnChange = (v: IValueType | undefined): void => {
    formValues[field.id] = v
    setFormValues(structuredClone(formValues))
  }
  return InputComponent !== undefined
    ? <div className={utils.makeClassName({
      className,
      defaultClassName
    })}>{
      field.multiple === true
        ? <MultipleFieldCreator field={field} onChange={onChange} />
        : <InputComponent field={field} onChange={onChange ?? defaultOnChange} />

    }</div>
    : <p>No component definition for {field.type} ({field.id})</p>
}

export default FieldCreator
