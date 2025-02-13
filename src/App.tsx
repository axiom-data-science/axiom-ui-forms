import FormManager from ***REMOVED***@/Form/Manage/Manage***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { BrowserRouter, Route, Routes } from ***REMOVED***react-router-dom***REMOVED***
import SetTester from ***REMOVED***@/SetTester***REMOVED***
import MapTester from ***REMOVED***@/Form/MapTester***REMOVED***
import SchemaToForm from ***REMOVED***@/Form/SchemaToForm***REMOVED***

import { AddSchema, EditSchema, ListSchema } from ***REMOVED***@/Admin/Schema/Manage***REMOVED***
import { AddAsset, ListAssets } from ***REMOVED***@/Admin/Asset/Manage***REMOVED***
import { QueryClient, QueryClientProvider } from ***REMOVED***@tanstack/react-query***REMOVED***

const App = (): ReactElement => {
  const queryClient = new QueryClient()
  return (

    <div className=***REMOVED***h-screen flex flex-col gap-4***REMOVED***>
      <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Routes>
            <Route path=***REMOVED***/***REMOVED*** element={<FormManager />} />
            <Route path=***REMOVED***/schema-to-form***REMOVED*** element={<SchemaToForm />} />
            <Route path="/set-tester" element={<SetTester />} />
            <Route path="/map-tester" element={<MapTester />} />
            <Route path="/manage/schema" element={<ListSchema />} />
            <Route path="/manage/schema/edit/:assetType/:schemaVersion" element={<EditSchema />} />
            <Route path="/manage/schema/add/:type?" element={<AddSchema />} />
            <Route path="/manage/asset" element={<ListAssets />} />
            <Route path="/manage/asset/add/:type?" element={<AddAsset />} />
          </Routes>
        </BrowserRouter>
        </QueryClientProvider>
    </div>

  )
}

export default App
