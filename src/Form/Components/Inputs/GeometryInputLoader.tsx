import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { Loader } from '@axdspub/axiom-ui-utilities'
import React, { lazy, Suspense, type ReactElement } from 'react'

const GeometryInput = lazy(async () => await import('./Geometry'))
const GeoJSONInputLoader = (props: IFieldInputProps): ReactElement => {
  return (
      <>
        <Suspense fallback={<div className='h-[500px]'><Loader className='pt-20' /></div>}>
            <GeometryInput {...props} />
        </Suspense>
      </>
  )
}

export default GeoJSONInputLoader
