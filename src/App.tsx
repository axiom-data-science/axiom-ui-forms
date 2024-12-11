import { type IValueType, type IFormField } from '@/Form/FormCreatorTypes'
import { FieldLabelText } from '@/Form/Manager/Field/FieldLabel'
import FormManager from '@/Form/Manager/Manage'
import formValuesAtom from '@/state/formValuesAtom'
import { Checkbox, Input, RadioGroup, SelectInput, TextArea } from '@axdspub/axiom-ui-utilities'
import { useAtom } from 'jotai'
import React, { type ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

interface ITestInputProps {
  field: IFormField
  onChange?: (v: IValueType | undefined) => void
}

const StringInput = ({ field }: ITestInputProps): ReactElement => {
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  return <Input id={field.id} label={field.label} testId={field.id} value={String(formValues[field.id] ?? '')} onChange={(e) => {
    formValues[field.id] = e
    setFormValues({ ...formValues })
  }} />
}

const LongStringInput = ({ field }: ITestInputProps): ReactElement => {
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  return <div>
      <TextArea id={field.id} testId={field.id} label={field.label} onChange={(e) => {
        formValues[field.id] = e
        setFormValues({ ...formValues })
      }} /></div>
}

const BooleanInput = ({ field }: ITestInputProps): ReactElement => {
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  return <Checkbox id={field.id} testId={field.id} label={<FieldLabelText {...field} />} value={Boolean(formValues[field.id])} onChange={(e) => {
    formValues[field.id] = e
    setFormValues({ ...formValues })
  }} />
}

const SingleSelectInput = ({ field }: ITestInputProps): ReactElement => {
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  if (field.type === 'select' && field.options !== undefined) {
    return <SelectInput
        id={field.id}
        label={field.label}
        testId={field.id}
        options={field.options}
        onChange={(e) => {
          formValues[field.id] = e?.value
          setFormValues({ ...formValues })
        }}
      />
  }
  return <p>Field config for {field.id} is missing &apos;options&apos;</p>
}

const RadioInput = ({ field }: ITestInputProps): ReactElement => {
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  if (field.type === 'radio' && field.options !== undefined) {
    return <RadioGroup
        id={field.id}
        label={field.label}
        testId={field.id}
        options={field.options}
        onChange={(e) => {
          formValues[field.id] = e?.value
          setFormValues({ ...formValues })
        }}
      />
  }
  return <p>Field config for {field.id} is missing &apos;options&apos;</p>
}

const inputMap: Record<string, React.FC<ITestInputProps>> = {
  text: StringInput,
  long_text: LongStringInput,
  boolean: BooleanInput,
  select: SingleSelectInput,
  radio: RadioInput

}

const testTesterConfig: IFormField[] = [
  {
    id: 'short',
    label: 'Test component',
    type: 'text',
    required: false
  },
  {
    id: 'long',
    label: 'Long string component',
    type: 'long_text',
    required: false
  },
  {
    id: 'description',
    label: 'Description',
    type: 'long_text',
    required: false
  },
  {
    id: 'agree',
    label: 'Do u agree?',
    type: 'boolean',
    required: true
  },
  {
    label: 'Select one',
    id: 'color',
    type: 'select',
    required: true,
    multiple: false,
    options: [
      {
        label: 'Red',
        value: 'red'
      },
      {
        label: 'Green',
        value: 'green'
      },
      {
        label: 'Blue',
        value: 'blue'
      }
    ]
  },
  {
    label: 'Pick a size',
    id: 'size',
    type: 'radio',
    required: false,
    layout: 'vertical',
    multiple: false,
    options: [
      {
        label: 'Small',
        value: 'small'
      },
      {
        label: 'Medium',
        value: 'medium'
      },
      {
        label: 'Large',
        value: 'large'
      }
    ]
  }
]
const TestTester = (): ReactElement => {
  const [formValues] = useAtom(formValuesAtom)
  return (
    <>
    <div className='p-10 flex flex-col gap-8'>{
    testTesterConfig.map((field) => {
      const InputComponent = inputMap[field.type]
      return InputComponent !== undefined
        ? <div key={field.id}><InputComponent field={field} /></div>
        : <p>No component definition for {field.type} ({field.id})</p>
    })
    }</div>
    <pre className='m-20 p-20 bg-slate-200'>{JSON.stringify(formValues, null, 2)}</pre>

    </>
  )
}

const App = (): ReactElement => {
  return (

    <div className='h-screen flex flex-col gap-4'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<FormManager />} />
          <Route path="/test" element={<TestTester />} />

        </Routes>
        </BrowserRouter>
    </div>

  )
}

export default App
