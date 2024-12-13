import inputMap from '@/Form/Components/Inputs/inputMap'
import { type IFormField, type IValueChangeFn, type IValueType } from '@/Form/FormCreatorTypes'
import formValuesAtom from '@/state/formValuesAtom'
import { Button, utils } from '@axdspub/axiom-ui-utilities'
import { PlusIcon } from '@radix-ui/react-icons'
import { useAtom } from 'jotai'
import React, { type ReactElement } from 'react'

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
        return <div key={`${field.id}-${index}`} className='flex flex-col gap-2'>
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
      <div className='flex flex-row gap-2 mt-4'>
      <Button
        size='sm'
        type='create'
        onClick={() => {
          defaultOnChange([...(initialValues ?? []), undefined])
        }}
      >
        Add <PlusIcon className='inline' />
      </Button>
      </div>
    }

  </div>
}

const FieldCreator = ({
  field,
  onChange,
  className,
  defaultClassName = 'py-5 flex flex-col gap-8'
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
