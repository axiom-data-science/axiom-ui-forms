import { type IFieldInputProps, type IGeometryField } from '@/Form/Creator/FormCreatorTypes'
import { Loader } from '@axdspub/axiom-ui-utilities'
import React, { lazy, Suspense, type ReactElement } from 'react'

const GeometryInput = lazy(async () => await import('./Geometry'))
const GeoJSONInputLoader = (props: IFieldInputProps): ReactElement => {
  const geomField = props.field as IGeometryField
  const height = geomField.settings?.height ?? '500px'

  return (
      <>
        <Suspense fallback={<div className={`h-[${height}]`}><Loader className='pt-20' /></div>}>
            <GeometryInput {...props} />
        </Suspense>
      </>
  )
}

export default GeoJSONInputLoader
