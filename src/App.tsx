import FormManager from '@/Form/Manager/Manage'
import React, { ReactElement } from 'react'




const App = (): ReactElement => {
  return (

    <div className='h-screen flex flex-col gap-4'>
      <FormManager />
    </div>

  )
}

export default App