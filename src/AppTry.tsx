import React, { type ReactElement } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

const Home = (): ReactElement => {
  return (
        <div className='flex flex-col items-center justify-center h-full'>
        <h1 className='text-2xl font-bold'>Welcome to the Home Page</h1>
        <p className='mt-4'>This is a simple home page component.</p>
        </div>
  )
}

const App = (): ReactElement => {
  return (
    <div className='h-screen flex flex-col gap-4'>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />}>
              <Route path='*' element={<Home />} />
            </Route>

          </Routes>
          </BrowserRouter>
    </div>

  )
}

export default App
