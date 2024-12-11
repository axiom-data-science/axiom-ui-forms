import { type IValueType, type IFormField } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { FieldLabelText } from ***REMOVED***@/Form/Manager/Field/FieldLabel***REMOVED***
import FormManager from ***REMOVED***@/Form/Manager/Manage***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { Checkbox, Input, RadioGroup, SelectInput, TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { BrowserRouter, Route, Routes } from ***REMOVED***react-router-dom***REMOVED***

interface ITestInputProps {
  field: IFormField
  onChange?: (v: IValueType | undefined) => void
}

const StringInput = ({ field }: ITestInputProps): ReactElement => {
  const [formValues, setFormValues] = useAtom(formValuesAtom)
  return <Input id={field.id} label={field.label} testId={field.id} value={String(formValues[field.id] ?? ***REMOVED******REMOVED***)} onChange={(e) => {
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
  if (field.type === ***REMOVED***select***REMOVED*** && field.options !== undefined) {
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
  if (field.type === ***REMOVED***radio***REMOVED*** && field.options !== undefined) {
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
    id: ***REMOVED***short***REMOVED***,
    label: ***REMOVED***Test component***REMOVED***,
    type: ***REMOVED***text***REMOVED***,
    required: false
  },
  {
    id: ***REMOVED***long***REMOVED***,
    label: ***REMOVED***Long string component***REMOVED***,
    type: ***REMOVED***long_text***REMOVED***,
    required: false
  },
  {
    id: ***REMOVED***description***REMOVED***,
    label: ***REMOVED***Description***REMOVED***,
    type: ***REMOVED***long_text***REMOVED***,
    required: false
  },
  {
    id: ***REMOVED***agree***REMOVED***,
    label: ***REMOVED***Do u agree?***REMOVED***,
    type: ***REMOVED***boolean***REMOVED***,
    required: true
  },
  {
    label: ***REMOVED***Select one***REMOVED***,
    id: ***REMOVED***color***REMOVED***,
    type: ***REMOVED***select***REMOVED***,
    required: true,
    multiple: false,
    options: [
      {
        label: ***REMOVED***Red***REMOVED***,
        value: ***REMOVED***red***REMOVED***
      },
      {
        label: ***REMOVED***Green***REMOVED***,
        value: ***REMOVED***green***REMOVED***
      },
      {
        label: ***REMOVED***Blue***REMOVED***,
        value: ***REMOVED***blue***REMOVED***
      }
    ]
  },
  {
    label: ***REMOVED***Pick a size***REMOVED***,
    id: ***REMOVED***size***REMOVED***,
    type: ***REMOVED***radio***REMOVED***,
    required: false,
    layout: ***REMOVED***vertical***REMOVED***,
    multiple: false,
    options: [
      {
        label: ***REMOVED***Small***REMOVED***,
        value: ***REMOVED***small***REMOVED***
      },
      {
        label: ***REMOVED***Medium***REMOVED***,
        value: ***REMOVED***medium***REMOVED***
      },
      {
        label: ***REMOVED***Large***REMOVED***,
        value: ***REMOVED***large***REMOVED***
      }
    ]
  }
]
const TestTester = (): ReactElement => {
  const [formValues] = useAtom(formValuesAtom)
  return (
    <>
    <div className=***REMOVED***p-10 flex flex-col gap-8***REMOVED***>{
    testTesterConfig.map((field) => {
      const InputComponent = inputMap[field.type]
      return InputComponent !== undefined
        ? <div key={field.id}><InputComponent field={field} /></div>
        : <p>No component definition for {field.type} ({field.id})</p>
    })
    }</div>
    <pre className=***REMOVED***m-20 p-20 bg-slate-200***REMOVED***>{JSON.stringify(formValues, null, 2)}</pre>

    </>
  )
}

const App = (): ReactElement => {
  return (

    <div className=***REMOVED***h-screen flex flex-col gap-4***REMOVED***>
      <BrowserRouter>
        <Routes>
          <Route path=***REMOVED***/***REMOVED*** element={<FormManager />} />
          <Route path="/test" element={<TestTester />} />

        </Routes>
        </BrowserRouter>
    </div>

  )
}

export default App
