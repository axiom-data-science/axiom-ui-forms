import React, { ReactElement } from "react"

function errorRenderer({
  error,
}: {
  error: Error
  resetErrorBoundary: () => void
}): ReactElement {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert" className='p-10 bg-slate-100'>
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  )
}

export default errorRenderer