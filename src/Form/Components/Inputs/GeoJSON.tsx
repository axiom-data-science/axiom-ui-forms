import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { AxiomOpenLayersMap, EMapShape, type IMapDrawEvent, type IMap, type IStyleableMapProps } from ***REMOVED***@axdspub/axiom-maps***REMOVED***
import { type GeoJSON } from ***REMOVED***geojson***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***

const GeoJSONInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  console.log(***REMOVED***INITIAL VALUE***REMOVED***, value)
  const MAP_CONFIG: IStyleableMapProps = {
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
  const [coordinates, setCoordinates] = useState<string>(***REMOVED******REMOVED***)

  const getValue = (): string => {
    return geojson !== undefined && geojson !== null
      ? typeof geojson === ***REMOVED***object***REMOVED***
        ? JSON.stringify(geojson, null, 2)
        : String(geojson)
      : ***REMOVED******REMOVED***
  }

  const createPolygonFromCoordinates = (coordString: string): GeoJSON | undefined => {
    if (!coordString.trim()) {
      setError(undefined)
      return undefined
    }

    try {
      const points = coordString
        .split(***REMOVED***\n***REMOVED***)
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          const [lat, lon] = line.split(***REMOVED***,***REMOVED***).map(coord => parseFloat(coord.trim()))
          if (isNaN(lat) || isNaN(lon)) {
            throw new Error(***REMOVED***Invalid coordinate format***REMOVED***)
          }
          return [lon, lat]
        })

      if (points.length < 3) {
        throw new Error(***REMOVED***Need at least 3 points to create a polygon***REMOVED***)
      }

      // Close the polygon by adding the first point at the end
      points.push(points[0])

      return {
        type: ***REMOVED***Feature***REMOVED***,
        properties: {},
        geometry: {
          type: ***REMOVED***Polygon***REMOVED***,
          coordinates: [points]
        }
      }
    } catch (e) {
      setError(***REMOVED***Invalid coordinate format. Use "lat, lon" format, one per line***REMOVED***)
      return undefined
    }
  }

  // Reload shape on the map
  useEffect(() => {
    if (map === undefined) return
    map.removeLayer(***REMOVED***geojson-layer***REMOVED***)

    if ((value as any).features === undefined) return

    map.addLayer({
      id: ***REMOVED***geojson-layer***REMOVED***,
      type: ***REMOVED***geoJson***REMOVED*** as const,
      label: ***REMOVED***GeoJSON Layer***REMOVED***,
      zIndex: 20,
      isBaseLayer: false,
      options: {
        geoJson: (value as any).features.map((feature: any) => ({
          ...feature,
          properties: {
            ...feature.properties,
            color: ***REMOVED***rgba(255,255,255,.2)***REMOVED***,
            stroke: ***REMOVED***orange***REMOVED***,
            ***REMOVED***stroke-width***REMOVED***: 2
          }
        }))
      }
    })
  }, [map])

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

  const handleCoordinatesChange = (e: string | undefined): void => {
    setCoordinates(e ?? ***REMOVED******REMOVED***)
    const newGeoJSON = createPolygonFromCoordinates(e ?? ***REMOVED******REMOVED***)
    if (newGeoJSON) {
      setGeojson(newGeoJSON)
      setError(undefined)
    } else {
      setGeojson(undefined)
    }
  }

  return <div>
      <AxiomOpenLayersMap {...MAP_CONFIG} setState={setMapState} />
      <div className="mt-4">
        <TextArea
          error={error}
          className=***REMOVED***min-h-[100px] bg-slate-50 rounded-lg shadow-inner***REMOVED***
          id={`${field.id}-coordinates`}
          testId={`${field.id}-coordinates`}
          label="Enter coordinates (lat, lon) one per line"
          value={coordinates}
          onChange={handleCoordinatesChange}
          placeholder="61.2181, -149.9003&#10;61.2182, -149.9004&#10;61.2183, -149.9005"
        />
      </div>
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
