import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { AxiomOpenLayersMap, EMapShape, type IMapDrawEvent, type IMap, type IStyleableMapProps } from ***REMOVED***@axdspub/axiom-maps***REMOVED***
import { type GeoJSON } from ***REMOVED***geojson***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { TrashIcon, SquareIcon, BorderSolidIcon, DrawingPinFilledIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***

/*
List of coordinates for testing. Around Anchorage.
61.44480592425796, -150.3785489314675
61.26059021199541, -150.7356022485971
61.05235501381105, -150.61435734866856
61.06014246374005, -149.9221328461051
61.441517540302925, -149.16102284579276
61.44480592425796, -150.3785489314675
*/

const calculateCenterFromGeoJSON = (geo: GeoJSON | undefined): { lat: number, lon: number } => {
  if (!geo || !(***REMOVED***features***REMOVED*** in geo) || !Array.isArray(geo.features) || geo.features.length === 0) {
    return { lat: 61.2181, lon: -149.9003 } // Default to Anchorage
  }

  const feature = geo.features[0]
  if (!feature?.geometry || feature.geometry.type !== ***REMOVED***Polygon***REMOVED***) {
    return { lat: 61.2181, lon: -149.9003 }
  }

  const coordinates = feature.geometry.coordinates[0] // Get first ring (ignore holes)
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return { lat: 61.2181, lon: -149.9003 }
  }

  // Calculate average of all coordinates
  let sumLat = 0
  let sumLon = 0
  let count = 0

  coordinates.forEach((coord: GeoJSON.Position) => {
    sumLat += coord[1]
    sumLon += coord[0]
    count++
  })

  return {
    lat: sumLat / count,
    lon: sumLon / count
  }
}

const GeoJSONInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  console.log(***REMOVED***INITIAL VALUE***REMOVED***, value)
  const initialGeoJSON = value as unknown as GeoJSON
  const initialCenter = calculateCenterFromGeoJSON(initialGeoJSON)
  const [currentDrawType, setCurrentDrawType] = useState<EMapShape>(EMapShape.polygon)

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
    center: initialCenter,
    zoom: 8,
    tools: {
      draw: {
        shape: currentDrawType,
        enabled: true
      }
    }
  }

  const [map, setMapState] = useState<IMap | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [geojson, setGeojson] = useState<GeoJSON | undefined>(() => {
    if (!value) return undefined
    return value as unknown as GeoJSON
  })
  const [showGeoJSONInput] = useState<boolean>(false) // For debugging purposes
  const [coordinates, setCoordinates] = useState<string>(() => {
    if (!value) return ***REMOVED******REMOVED***
    const geoValue = value as unknown as GeoJSON.FeatureCollection
    if (geoValue?.type === ***REMOVED***FeatureCollection***REMOVED*** && Array.isArray(geoValue.features) && geoValue.features.length > 0) {
      const feature = geoValue.features[0]
      if (feature?.geometry?.type === ***REMOVED***Polygon***REMOVED***) {
        // Get the first ring of coordinates (ignore holes)
        const coords = feature.geometry.coordinates[0]
        // Convert from [lon, lat] to "lat, lon" format
        return coords.map((pos: GeoJSON.Position) => `${pos[1]}, ${pos[0]}`).join(***REMOVED***\n***REMOVED***)
      }
    }
    return ***REMOVED******REMOVED***
  })

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
        type: ***REMOVED***FeatureCollection***REMOVED***,
        features: [{
          type: ***REMOVED***Feature***REMOVED***,
          properties: {},
          geometry: {
            type: ***REMOVED***Polygon***REMOVED***,
            coordinates: [points]
          }
        }]
      }
    } catch (e) {
      setError(***REMOVED***Invalid coordinate format. Use "lat, lon" format, one per line***REMOVED***)
      return undefined
    }
  }

  const updateCoordinatesFromGeoJSON = (geo: GeoJSON | undefined): void => {
    if (geo?.type === ***REMOVED***FeatureCollection***REMOVED*** && Array.isArray(geo.features) && geo.features.length > 0) {
      const feature = geo.features[0]
      if (feature?.geometry?.type === ***REMOVED***Polygon***REMOVED***) {
        const coords = feature.geometry.coordinates[0]
        setCoordinates(coords.map((pos: GeoJSON.Position) => `${pos[1]}, ${pos[0]}`).join(***REMOVED***\n***REMOVED***))
      }
    }
  }

  // Reload shape on the map
  useEffect(() => {
    if (map === undefined) return
    map.enableDraw(currentDrawType)

    if (geojson !== undefined && ***REMOVED***features***REMOVED*** in geojson) {
      map.setDrawGeojson(geojson)
      map.disableDraw(currentDrawType) // Disable drawing when there***REMOVED***s a shape
    }
  }, [map, currentDrawType])

  useEffect(() => {
    if (map === undefined) return

    map.onDrawComplete((e: IMapDrawEvent) => {
      console.log(***REMOVED***draw complete***REMOVED***, e)
      setGeojson(e.data?.geojson)
      updateCoordinatesFromGeoJSON(e.data?.geojson)
      map.disableDraw(currentDrawType) // Disable drawing after shape is complete
    })

    // On modify drawing
    map.onDrawUpdate((e: IMapDrawEvent) => {
      console.log(***REMOVED***draw update***REMOVED***, e)
      setGeojson(e.data?.geojson)
      updateCoordinatesFromGeoJSON(e.data?.geojson)
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
      // Clear existing shape and redraw with new coordinates
      if (map) {
        map.setDrawGeojson({
          type: ***REMOVED***FeatureCollection***REMOVED***,
          features: []
        })
        map.setDrawGeojson(newGeoJSON as GeoJSON.FeatureCollection)
      }
    } else {
      setGeojson(undefined)
      onChange(undefined) // Explicitly clear the value
      if (map) {
        map.setDrawGeojson({
          type: ***REMOVED***FeatureCollection***REMOVED***,
          features: []
        })
      }
    }
  }

  const hasValidShape = (geo: GeoJSON | undefined): boolean => {
    return geo !== undefined &&
           ***REMOVED***features***REMOVED*** in geo &&
           Array.isArray(geo.features) &&
           geo.features.length > 0
  }

  const clearShape = (): void => {
    setGeojson(undefined)
    onChange(undefined)
    setCoordinates(***REMOVED******REMOVED***)
    if (map) {
      map.setDrawGeojson({
        type: ***REMOVED***FeatureCollection***REMOVED***,
        features: []
      })
      map.enableDraw(currentDrawType) // Re-enable drawing when shape is cleared
    }
  }

  const handleDrawTypeChange = (shapeType: EMapShape): void => {
    if (map) {
      // Clear existing shape if any
      map.setDrawGeojson({
        type: ***REMOVED***FeatureCollection***REMOVED***,
        features: []
      })
      setGeojson(undefined)
      onChange(undefined)
      setCoordinates(***REMOVED******REMOVED***)
      setCurrentDrawType(shapeType)
      map.enableDraw(shapeType)
    }
  }

  return <div className="relative">
      <FieldLabel {...field} />
      <div className="absolute z-20 top-12 right-4 flex flex-col gap-2">
        <div className="tooltip-container relative group">
          <button
            onClick={() => { handleDrawTypeChange(EMapShape.polygon) }}
            className={`p-2 rounded-lg shadow-lg ${
              currentDrawType === EMapShape.polygon
                ? ***REMOVED***bg-blue-500 hover:bg-blue-600***REMOVED***
                : ***REMOVED***bg-gray-500 hover:bg-gray-600***REMOVED***
            } text-white w-10 h-10 flex items-center justify-center`}
            title="Draw polygon"
          >
            <SquareIcon className="w-5 h-5" />
            <span className="tooltip absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
              Draw Polygon
            </span>
          </button>
        </div>
        <div className="tooltip-container relative group">
          <button
            onClick={() => { handleDrawTypeChange(EMapShape.linestring) }}
            className={`p-2 rounded-lg shadow-lg ${
              currentDrawType === EMapShape.linestring
                ? ***REMOVED***bg-blue-500 hover:bg-blue-600***REMOVED***
                : ***REMOVED***bg-gray-500 hover:bg-gray-600***REMOVED***
            } text-white w-10 h-10 flex items-center justify-center`}
            title="Draw line"
          >
            <BorderSolidIcon className="w-5 h-5" />
            <span className="tooltip absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
              Draw Line
            </span>
          </button>
        </div>
        <div className="tooltip-container relative group">
          <button
            onClick={() => { handleDrawTypeChange(EMapShape.point) }}
            className={`p-2 rounded-lg shadow-lg ${
              currentDrawType === EMapShape.point
                ? ***REMOVED***bg-blue-500 hover:bg-blue-600***REMOVED***
                : ***REMOVED***bg-gray-500 hover:bg-gray-600***REMOVED***
            } text-white w-10 h-10 flex items-center justify-center`}
            title="Draw point"
          >
            <DrawingPinFilledIcon className="w-5 h-5" />
            <span className="tooltip absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
              Draw Point
            </span>
          </button>
        </div>
        {hasValidShape(geojson) && (
          <div className="tooltip-container relative group">
            <button
              onClick={clearShape}
              className="p-2 rounded-lg shadow-lg bg-red-500 hover:bg-red-600 text-white w-10 h-10 flex items-center justify-center"
              title="Clear shape"
            >
              <TrashIcon className="w-5 h-5" />
              <span className="tooltip absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
                Clear Shape
              </span>
            </button>
          </div>
        )}
      </div>
      <AxiomOpenLayersMap {...MAP_CONFIG} setState={setMapState} />
      <div className="mt-4">
        <TextArea
          error={error}
          className=***REMOVED***min-h-[100px] bg-slate-50 rounded-lg shadow-inner***REMOVED***
          id={`${field.id}-coordinates`}
          testId={`${field.id}-coordinates`}
          label="Enter coordinates (latitude, longitude) one pair per line."
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
