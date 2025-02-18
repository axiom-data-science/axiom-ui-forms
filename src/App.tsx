import FormManager from '@/Form/Manage/Manage'
import React, { type ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SetTester from '@/SetTester'
import MapTester from '@/Form/MapTester'
import SchemaToForm from '@/Form/SchemaToForm'

const App = (): ReactElement => {
  return (

    <div className='h-screen flex flex-col gap-4'>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<FormManager />} />
            <Route path='/schema-to-form' element={<SchemaToForm />} />
            <Route path="/set-tester" element={<SetTester />} />
            <Route path="/map-tester" element={<MapTester />} />W
          </Routes>
        </BrowserRouter>
    </div>

  )
}

export default App
