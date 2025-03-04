import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { AxiomOpenLayersMap, EMapShape, type IMapDrawEvent, type IMap } from ***REMOVED***@axdspub/axiom-maps***REMOVED***
import { type GeoJSON } from ***REMOVED***geojson***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***

const GeoJSONInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  console.log(***REMOVED***INITIAL VALUE***REMOVED***, value)
  const MAP_CONFIG = {
    baseLayerKey: ***REMOVED***hybrid***REMOVED***,
    height: ***REMOVED***500px***REMOVED***,
    width: ***REMOVED***100%***REMOVED***,
    style: {
      left: ***REMOVED***0px***REMOVED***,
      top: ***REMOVED***0px***REMOVED***,
      right: ***REMOVED***0px***REMOVED***,
      bottom: ***REMOVED***0px***REMOVED***,
      padding: ***REMOVED***0***REMOVED***
    },
    center: { lat: 61.2181, lon: -149.9003 },
    zoom: 8,
    layers: value
      ? [{
          id: ***REMOVED***geojson-layer***REMOVED***,
          type: ***REMOVED***geoJson***REMOVED*** as const,
          label: ***REMOVED***GeoJSON Layer***REMOVED***,
          zIndex: 20,
          isBaseLayer: false,
          options: {
            geoJson: (value as any).features
          }
        }]
      : [],
    tools: {
      draw: {
        shape: EMapShape.polygon,
        enabled: true
      }
    }
  }

  const [map, setMapState] = useState<IMap | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [geojson, setGeojson] = useState<GeoJSON | undefined>(value as unknown as GeoJSON)
  const [showGeoJSONInput] = useState<boolean>(true) // For debugging purposes
  const getValue = (): string => {
    return geojson !== undefined && geojson !== null
      ? typeof geojson === ***REMOVED***object***REMOVED***
        ? JSON.stringify(geojson, null, 2)
        : String(geojson)
      : ***REMOVED******REMOVED***
  }

  useEffect(() => {
    if (map === undefined) return

    map.onDrawComplete((e: IMapDrawEvent) => {
      console.log(***REMOVED***draw complete***REMOVED***, e)
      setGeojson(e.data?.geojson)
    })

    // On modify drawing
    map.onDrawUpdate((e: IMapDrawEvent) => {
      console.log(***REMOVED***draw update***REMOVED***, e)
      setGeojson(e.data?.geojson)
    })
  }
  , [map])

  useEffect(() => {
    if (geojson !== undefined) {
      onChange(geojson)
    }
  }, [geojson])

  return <div>
      <AxiomOpenLayersMap {...MAP_CONFIG} setState={setMapState} />
      {showGeoJSONInput && <TextArea
        error={error}
        className=***REMOVED***min-h-[500px] bg-slate-50 rounded-lg shadow-inner***REMOVED***
        id={field.id}
        testId={field.id}
        label={<FieldLabel {...field} />}
        value={getValue()}
        onChange={(e) => {
          try {
            JSON.parse(e ?? ***REMOVED******REMOVED***)
            onChange(JSON.parse(e ?? ***REMOVED******REMOVED***))
            setError(undefined)
          } catch (e) {
            setError(***REMOVED***Invalid JSON***REMOVED***)
          }
        }} />}
    </div>
}

export default GeoJSONInput
