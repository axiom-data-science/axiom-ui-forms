import FormManager from '@/Form/Manage/Manage'
import React, { type ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FormCreator from '@/Form/FormCreator'
import { testFields } from '@/Form/testData/fields'

const App = (): ReactElement => {
  return (

    <div className='h-screen flex flex-col gap-4'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<FormManager />} />
          <Route path="/test" element={<FormCreator form={
            {
              id: 'test_form',
              label: 'Test form',
              fields: testFields
            }
          } />} />

        </Routes>
        </BrowserRouter>
    </div>

  )
}

export default App
