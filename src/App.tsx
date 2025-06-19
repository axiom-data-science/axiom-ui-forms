import FormManager from '@/Form/Manage/Manage'
import React, { createContext, useContext, useState, type ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SetTester from '@/SetTester'
import MapTester from '@/Form/MapTester'
import SchemaToForm from '@/Form/SchemaToForm'
import pagedFormJson from '@/Form/testData/pagedForm.json'
import wizardFormJson from '@/Form/testData/wizardForm.json'
import pttOilSpillForm from '@/Form/testData/pttFormConfigOpenOilModel.json'
import customElementFormJson from '@/Form/testData/customElementForm.json'
import { type INumberField, type IForm, type IFormValues, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import Form from '@/Form/Creator/FormCreator'
import FieldLabel from '@/Form/Components/FieldLabel'
import { Slider } from '@axdspub/axiom-ui-utilities'
import ExternalMetadataExample from '@/Form/ExternalMetadataExample'
import FormWithDefaults from '@/Form/FormWithDefaults'

import { CopyableJSONOutput } from '@/Form/Manage/CopyableJSONOutput'
import SchemaToFormWizard from '@/Form/Creator/SchemaToFormWizard'
import CodeEditor from '@/Form/CodeEditor'
import SchemaWithOverridesTest from '@/Form/SchemaWithOverridesTest'
import { assignDefaultValuesToFormValues } from '@/utils/manipulators'
import { ErrorBoundary } from 'react-error-boundary'
import SchemaToFormPTT from '@/Form/SchemaToFormPTT'
import OilForm from '@/PTT/Oil/OilForm'
import LeewayForm from '@/PTT/Leeway/LeewayForm'
import LarvalForm from '@/PTT/Larval/LarvalForm'
import OceanDriftForm from '@/PTT/OceanDrift/OceanDriftForm'
import AllPTT from '@/PTT/All'
import ResizableSidebar from '@/TestResize'
import layoutAtom, { getWindowSize } from '@/utils/responsive/layoutState'
import { useAtom } from 'jotai'
import { debounce } from 'lodash-es'
import MeditorForm from '@/Meditor/MeditorForm'

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

const PTTOilFormWrap = (): ReactElement => {
  const form = pttOilSpillForm as IForm
  const formValueState = useState<IFormValues>(assignDefaultValuesToFormValues(form, {}))
  return (
    <>
    <Form className='p-20' formValueState={formValueState} form={form} />
      <CopyableJSONOutput string={JSON.stringify(formValueState[0], null, 2)} />
    </>
  )
}

function fallbackRender ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }): ReactElement {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert" className='p-20'>
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

const App = (): ReactElement => {
  const [layout, setLayout] = useAtom(layoutAtom)
  const updateLayoutValue = (): void => {
    const newSize = getWindowSize()
    if (layout.size !== newSize) {
      console.log(`${layout.size} !== ${newSize}, updating layout`)
      setLayout({ size: newSize })
    }
  }
  const debounceUpdateLayout = debounce(function updateSize (): void {
    updateLayoutValue()
  }, 200)

  window.addEventListener('resize', debounceUpdateLayout)
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
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
            <Route path="/ptt-oil" element={<PTTOilFormWrap />}>
              <Route path="*" element={<PTTOilFormWrap />} />
            </Route>
            <Route path="/schema-to-form-wizard" element={<SchemaToFormWizard />}>
              <Route path="*" element={<SchemaToFormWizard />} />
            </Route>
            <Route path="/schema-override-test" element={<SchemaWithOverridesTest />}>
              <Route path="*" element={<SchemaWithOverridesTest />} />
            </Route>
            <Route path="/json-editor" element={<CodeEditor />} />
            <Route path="/schema-to-form-ptt" element={<SchemaToFormPTT />} />
            <Route path="/ptt/oil" element={<OilForm />}>
              <Route path="*" element={<OilForm />} />
            </Route>
            <Route path="/ptt/leeway" element={<LeewayForm />}>
              <Route path="*" element={<LeewayForm />} />
            </Route>
            <Route path="/ptt/larval" element={<LarvalForm />}>
              <Route path="*" element={<LarvalForm />} />
            </Route>
            <Route path="/ptt/ocean-drift" element={<OceanDriftForm />}>
              <Route path="*" element={<OceanDriftForm />} />
            </Route>
            <Route path="/all-ptt" element={<AllPTT />} />
            <Route path="/all-ptt/:scenario" element={<AllPTT />}>
              <Route path="*" element={<AllPTT />} />
            </Route>
            <Route path='/resizer' element={<ResizableSidebar />} />
            <Route path='/meditor' element={<MeditorForm />}>
              <Route path='*' element={<MeditorForm />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </div>
    </ErrorBoundary>

  )
}

export default App
