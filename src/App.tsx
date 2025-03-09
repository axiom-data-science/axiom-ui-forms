import FormManager from ***REMOVED***@/Form/Manage/Manage***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { BrowserRouter, Route, Routes } from ***REMOVED***react-router-dom***REMOVED***
import SetTester from ***REMOVED***@/SetTester***REMOVED***
import MapTester from ***REMOVED***@/Form/MapTester***REMOVED***
import SchemaToForm from ***REMOVED***@/Form/SchemaToForm***REMOVED***
import pagedFormJson from ***REMOVED***@/Form/testData/pagedForm.json***REMOVED***
import wizardFormJson from ***REMOVED***@/Form/testData/wizardForm.json***REMOVED***
import { type IForm, type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import Form from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***

const PagedFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
  <Form form={pagedFormJson as IForm} formValueState={formValueState} className=***REMOVED***p-20***REMOVED*** />
  <pre className=***REMOVED***p-20 bg-slate-200 text-xs***REMOVED***>{JSON.stringify(formValueState[0], null, 2)}</pre>
  </div>
  )
}

const WizardFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
        <Form form={wizardFormJson as IForm} formValueState={formValueState} className=***REMOVED***p-20***REMOVED*** urlNavigable={false} />
        <pre className=***REMOVED***p-20 bg-slate-200 text-xs***REMOVED***>{JSON.stringify(formValueState[0], null, 2)}</pre>
      </div>
  )
}

const App = (): ReactElement => {
  return (

    <div className=***REMOVED***h-screen flex flex-col gap-4***REMOVED***>
      <BrowserRouter>
          <Routes>
            <Route path=***REMOVED***/***REMOVED*** element={<FormManager />}>
              <Route path=***REMOVED*******REMOVED*** element={<FormManager />} />
            </Route>
            <Route path=***REMOVED***/schema-to-form***REMOVED*** element={<SchemaToForm />} />
            <Route path="/set-tester" element={<SetTester />} />
            <Route path="/map-tester" element={<MapTester />} />
            <Route path="/page-form/" element={<PagedFormWrap />}>
              <Route path=***REMOVED*******REMOVED*** element={<PagedFormWrap />} />
            </Route>
            <Route path=***REMOVED***/wizard-form***REMOVED*** element={<WizardFormWrap />}>
              <Route path=***REMOVED*******REMOVED*** element={<WizardFormWrap />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </div>

  )
}

export default App
