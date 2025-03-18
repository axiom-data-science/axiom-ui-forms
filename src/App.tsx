import FormManager from '@/Form/Manage/Manage'
import React, { createContext, useContext, useState, type ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SetTester from '@/SetTester'
import MapTester from '@/Form/MapTester'
import SchemaToForm from '@/Form/SchemaToForm'
import pagedFormJson from '@/Form/testData/pagedForm.json'
import wizardFormJson from '@/Form/testData/wizardForm.json'
import customElementFormJson from '@/Form/testData/customElementForm.json'
import { type INumberField, type IForm, type IFormValues, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import Form from '@/Form/Creator/FormCreator'
import FieldLabel from '@/Form/Components/FieldLabel'
import { Slider } from '@axdspub/axiom-ui-utilities'
import ExternalMetadataExample from '@/Form/ExternalMetadataExample'
import FormWithDefaults from '@/Form/FormWithDefaults'

const PagedFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
  <Form form={pagedFormJson as IForm} formValueState={formValueState} className='p-20' urlNavigable={true} />
  <pre className='p-20 bg-slate-200 text-xs'>{JSON.stringify(formValueState[0], null, 2)}</pre>
  </div>
  )
}

const WizardFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
        <Form form={wizardFormJson as IForm} formValueState={formValueState} className='p-20' urlNavigable={true} />
        <pre className='p-20 bg-slate-200 text-xs'>{JSON.stringify(formValueState[0], null, 2)}</pre>
      </div>
  )
}

interface ICustomFormProp { label: string }
const CustomContext = createContext<ICustomFormProp>({ label: '' })

const CustomElementFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <CustomContext.Provider value={{ label: 'Custom Label' }}>
      <div>
      <Form
        form={customElementFormJson as IForm}
        formValueState={formValueState}
        className='p-20'
        urlNavigable={false}
        inputOverrides={{
          'custom:number': ({ field, value, onChange }: IFieldInputProps) => {
            const { label: labelFromContext } = useContext(CustomContext)
            const numberField = field as INumberField
            const [tempValue, setTempValue] = useState<number>(value !== undefined && value !== null ? +value : 0)
            const min = numberField?.constraints?.min ?? 0
            const max = numberField?.constraints?.max ?? 100
            const step = Number(numberField?.settings?.step ?? (max - min) / 100)
            return (<div>
              <h2 className='p-4 text-xl bg-rose-800 text-white'>{labelFromContext}</h2>
              <FieldLabel {...field} />
              <div className='flex flex-row gap-4'>
                <p className='font-bold w-[80px]'>{tempValue}</p>
                <Slider
                  className='flex-grow max-w-[400px] mt-1'
                  size='sm'
                  value={tempValue}
                  min={min}
                  max={max}
                  onChange={(v: number): void => {
                    setTempValue(v)
                  } }
                  onChangeComplete={(v: number): void => {
                    setTempValue(v)
                    onChange(v)
                  } }
                  id={field.id}
                  testId={field.id}
                  step={step} />
              </div>
            </div>)
          }
        }} />
      <pre className='p-20 bg-slate-200 text-xs'>{JSON.stringify(formValueState[0], null, 2)}</pre>
    </div>
    </CustomContext.Provider>
  )
}

const App = (): ReactElement => {
  return (

    <div className='h-screen flex flex-col gap-4'>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<FormManager />}>
              <Route path='*' element={<FormManager />} />
            </Route>
            <Route path='/schema-to-form' element={<SchemaToForm />} />
            <Route path="/set-tester" element={<SetTester />} />
            <Route path="/map-tester" element={<MapTester />} />
            <Route path="/page-form/" element={<PagedFormWrap />}>
              <Route path='*' element={<PagedFormWrap />} />
            </Route>
            <Route path='/wizard-form' element={<WizardFormWrap />}>
              <Route path='*' element={<WizardFormWrap />} />
            </Route>
            <Route path="/custom-form-element" element={<CustomElementFormWrap />}>
              <Route path='*' element={<CustomElementFormWrap />} />
            </Route>
            <Route path='/custom-element-context' element={<ExternalMetadataExample />} />
            <Route path='/form-with-defaults' element={<FormWithDefaults />} />
          </Routes>
        </BrowserRouter>
    </div>

  )
}

export default App
