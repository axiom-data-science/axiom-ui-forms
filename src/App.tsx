import FormManager from '@/Form/Manage/Manage'
import React, { type ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SetTester from '@/SetTester'
import MapTester from '@/Form/MapTester'
import SchemaToForm from '@/Form/SchemaToForm'

import { AddSchema, EditSchema, ListSchema } from '@/Admin/Schema/Manage'
import { AddAsset, ListAssets } from '@/Admin/Asset/Manage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const App = (): ReactElement => {
  const queryClient = new QueryClient()
  return (

    <div className='h-screen flex flex-col gap-4'>
      <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<FormManager />} />
            <Route path='/schema-to-form' element={<SchemaToForm />} />
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
