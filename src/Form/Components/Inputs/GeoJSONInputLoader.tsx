import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { Loader } from '@axdspub/axiom-ui-utilities'
import React, { lazy, Suspense, type ReactElement } from 'react'

const GeoJSONInput = lazy(async () => await import('./GeoJSON'))
const GeoJSONInputLoader = (props: IFieldInputProps): ReactElement => {
  return (
      <>
        <Suspense fallback={<div className='h-[500px]'><Loader className='pt-20' /></div>}>
            <GeoJSONInput {...props} />
        </Suspense>
      </>
  )
}

export default GeoJSONInputLoader
