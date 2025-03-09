import FormManager from '@/Form/Manage/Manage'
import React, { useState, type ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SetTester from '@/SetTester'
import MapTester from '@/Form/MapTester'
import SchemaToForm from '@/Form/SchemaToForm'
import pagedFormJson from '@/Form/testData/pagedForm.json'
import wizardFormJson from '@/Form/testData/wizardForm.json'
import { type IForm, type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import Form from '@/Form/Creator/FormCreator'

const PagedFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
  <Form form={pagedFormJson as IForm} formValueState={formValueState} className='p-20' />
  <pre className='p-20 bg-slate-200 text-xs'>{JSON.stringify(formValueState[0], null, 2)}</pre>
  </div>
  )
}

const WizardFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
        <Form form={wizardFormJson as IForm} formValueState={formValueState} className='p-20' urlNavigable={false} />
        <pre className='p-20 bg-slate-200 text-xs'>{JSON.stringify(formValueState[0], null, 2)}</pre>
      </div>
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
          </Routes>
        </BrowserRouter>
    </div>

  )
}

export default App
