import { type IFieldInputProps, type IGeometryField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Loader } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { lazy, Suspense, type ReactElement } from ***REMOVED***react***REMOVED***

const GeometryInput = lazy(async () => await import(***REMOVED***./Geometry***REMOVED***))
const GeoJSONInputLoader = (props: IFieldInputProps): ReactElement => {
  const geomField = props.field as IGeometryField
  const height = geomField.settings?.height ?? ***REMOVED***500px***REMOVED***

  return (
      <>
        <Suspense fallback={<div className={`h-[${height}]`}><Loader className=***REMOVED***pt-20***REMOVED*** /></div>}>
            <GeometryInput {...props} />
        </Suspense>
      </>
  )
}

export default GeoJSONInputLoader
