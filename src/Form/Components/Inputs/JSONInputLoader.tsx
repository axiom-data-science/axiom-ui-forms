import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { Loader } from '@axdspub/axiom-ui-utilities'
import React, { lazy, Suspense, type ReactElement } from 'react'

const JSONInput = lazy(async () => await import('./JSON'))
const JSONInputLoader = (props: IFieldInputProps): ReactElement => {
  return (
    <>
      <Suspense fallback={<div className='h-[20vh]'><Loader className='pt-20' /></div>}>
        <JSONInput {...props} />
      </Suspense>
    </>
  )
}

export default JSONInputLoader
