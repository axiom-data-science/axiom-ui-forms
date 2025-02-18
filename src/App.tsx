import FormManager from ***REMOVED***@/Form/Manage/Manage***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { BrowserRouter, Route, Routes } from ***REMOVED***react-router-dom***REMOVED***
import SetTester from ***REMOVED***@/SetTester***REMOVED***
import MapTester from ***REMOVED***@/Form/MapTester***REMOVED***
import SchemaToForm from ***REMOVED***@/Form/SchemaToForm***REMOVED***

const App = (): ReactElement => {
  return (

    <div className=***REMOVED***h-screen flex flex-col gap-4***REMOVED***>
      <BrowserRouter>
          <Routes>
            <Route path=***REMOVED***/***REMOVED*** element={<FormManager />} />
            <Route path=***REMOVED***/schema-to-form***REMOVED*** element={<SchemaToForm />} />
            <Route path="/set-tester" element={<SetTester />} />
            <Route path="/map-tester" element={<MapTester />} />W
          </Routes>
        </BrowserRouter>
    </div>

  )
}

export default App
