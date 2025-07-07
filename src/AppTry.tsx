import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { BrowserRouter, Route, Routes } from ***REMOVED***react-router-dom***REMOVED***

const Home = (): ReactElement => {
  return (
        <div className=***REMOVED***flex flex-col items-center justify-center h-full***REMOVED***>
        <h1 className=***REMOVED***text-2xl font-bold***REMOVED***>Welcome to the Home Page</h1>
        <p className=***REMOVED***mt-4***REMOVED***>This is a simple home page component.</p>
        </div>
  )
}

const App = (): ReactElement => {
  return (
    <div className=***REMOVED***h-screen flex flex-col gap-4***REMOVED***>
      <BrowserRouter>
          <Routes>
            <Route path=***REMOVED***/***REMOVED*** element={<Home />}>
              <Route path=***REMOVED*******REMOVED*** element={<Home />} />
            </Route>

          </Routes>
          </BrowserRouter>
    </div>

  )
}

export default App
