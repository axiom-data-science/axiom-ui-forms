import { type IFieldInputProps, type IGeometryField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { IMap, IMapLoadedEvent } from ***REMOVED***@axdspub/axiom-maps***REMOVED***
import { Loader } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { lazy, ReactNode, Suspense, type ReactElement } from ***REMOVED***react***REMOVED***

const GeometryInput = lazy(async () => await import(***REMOVED***./Geometry***REMOVED***))
const GeoJSONInputLoader = (
  props: IFieldInputProps & {
    mapLoadedCallback?: (e: IMapLoadedEvent) => void
    MapOverLay?: ReactNode
  }
): ReactElement => {
  const geomField = props.field as IGeometryField
  const height = geomField.settings?.height ?? ***REMOVED***500px***REMOVED***

  return (
    <>
      <Suspense
        fallback={
          <div className={`h-[${height}]`}>
            <Loader className="pt-20" />
          </div>
        }
      >
        <GeometryInput {...props} />
      </Suspense>
    </>
  )
}

export default GeoJSONInputLoader
