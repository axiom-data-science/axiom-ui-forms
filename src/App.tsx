import FormManager from ***REMOVED***@/Form/Manage/Manage***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { BrowserRouter, Route, Routes } from ***REMOVED***react-router-dom***REMOVED***
import FormCreator from ***REMOVED***@/Form/FormCreator***REMOVED***
import { testFields } from ***REMOVED***@/Form/testData/fields***REMOVED***
import SetTester from ***REMOVED***@/SetTester***REMOVED***
import MapTester from ***REMOVED***@/Form/MapTester***REMOVED***

const App = (): ReactElement => {
  return (

    <div className=***REMOVED***h-screen flex flex-col gap-4***REMOVED***>
      <BrowserRouter>
        <Routes>
          <Route path=***REMOVED***/***REMOVED*** element={<FormManager />} />
          <Route path="/test" element={<FormCreator form={
            {
              id: ***REMOVED***test_form***REMOVED***,
              label: ***REMOVED***Test form***REMOVED***,
              fields: testFields
            }
          } />} />
          <Route path="/set-tester" element={<SetTester />} />
          <Route path="/map-tester" element={<MapTester />} />

        </Routes>
        </BrowserRouter>
    </div>

  )
}

export default App
