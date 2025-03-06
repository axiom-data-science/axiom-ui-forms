import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import { AxiomOpenLayersMap, EMapShape, type IMapDrawEvent, type IMap, type IStyleableMapProps } from '@axdspub/axiom-maps'
import { type GeoJSON } from 'geojson'
import React, { useEffect, useState, type ReactElement } from 'react'
import { TrashIcon, SquareIcon, BorderSolidIcon, DrawingPinFilledIcon } from '@radix-ui/react-icons'

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
  if (!geo || !('features' in geo) || !Array.isArray(geo.features) || geo.features.length === 0) {
    return { lat: 61.2181, lon: -149.9003 } // Default to Anchorage
  }

  const feature = geo.features[0]
  if (!feature?.geometry || feature.geometry.type !== 'Polygon') {
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
  console.log('INITIAL VALUE', value)
  const initialGeoJSON = value as unknown as GeoJSON
  const initialCenter = calculateCenterFromGeoJSON(initialGeoJSON)
  const [currentDrawType, setCurrentDrawType] = useState<EMapShape>(EMapShape.polygon)

  const MAP_CONFIG: IStyleableMapProps = {
    baseLayerKey: 'hybrid',
    height: '500px',
    width: '100%',
    style: {
      left: '0px',
      top: '0px',
      right: '0px',
      bottom: '0px',
      padding: '0'
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
    if (!value) return ''
    const geoValue = value as unknown as GeoJSON.FeatureCollection
    if (geoValue?.type === 'FeatureCollection' && Array.isArray(geoValue.features) && geoValue.features.length > 0) {
      const feature = geoValue.features[0]
      if (feature?.geometry?.type === 'Polygon') {
        // Get the first ring of coordinates (ignore holes)
        const coords = feature.geometry.coordinates[0]
        // Convert from [lon, lat] to "lat, lon" format
        return coords.map((pos: GeoJSON.Position) => `${pos[1]}, ${pos[0]}`).join('\n')
      }
    }
    return ''
  })

  const getValue = (): string => {
    return geojson !== undefined && geojson !== null
      ? typeof geojson === 'object'
        ? JSON.stringify(geojson, null, 2)
        : String(geojson)
      : ''
  }

  const createPolygonFromCoordinates = (coordString: string): GeoJSON | undefined => {
    if (!coordString.trim()) {
      setError(undefined)
      return undefined
    }

    try {
      const points = coordString
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => {
          const [lat, lon] = line.split(',').map(coord => parseFloat(coord.trim()))
          if (isNaN(lat) || isNaN(lon)) {
            throw new Error('Invalid coordinate format')
          }
          return [lon, lat]
        })

      if (points.length < 3) {
        throw new Error('Need at least 3 points to create a polygon')
      }

      // Close the polygon by adding the first point at the end
      points.push(points[0])

      return {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [points]
          }
        }]
      }
    } catch (e) {
      setError('Invalid coordinate format. Use "lat, lon" format, one per line')
      return undefined
    }
  }

  const updateCoordinatesFromGeoJSON = (geo: GeoJSON | undefined): void => {
    if (geo?.type === 'FeatureCollection' && Array.isArray(geo.features) && geo.features.length > 0) {
      const feature = geo.features[0]
      if (feature?.geometry?.type === 'Polygon') {
        const coords = feature.geometry.coordinates[0]
        setCoordinates(coords.map((pos: GeoJSON.Position) => `${pos[1]}, ${pos[0]}`).join('\n'))
      }
    }
  }

  // Reload shape on the map
  useEffect(() => {
    if (map === undefined) return
    map.enableDraw(currentDrawType)

    if (geojson !== undefined && 'features' in geojson) {
      map.setDrawGeojson(geojson)
      map.disableDraw(currentDrawType) // Disable drawing when there's a shape
    }
  }, [map, currentDrawType])

  useEffect(() => {
    if (map === undefined) return

    map.onDrawComplete((e: IMapDrawEvent) => {
      console.log('draw complete', e)
      setGeojson(e.data?.geojson)
      updateCoordinatesFromGeoJSON(e.data?.geojson)
      map.disableDraw(currentDrawType) // Disable drawing after shape is complete
    })

    // On modify drawing
    map.onDrawUpdate((e: IMapDrawEvent) => {
      console.log('draw update', e)
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
    setCoordinates(e ?? '')
    const newGeoJSON = createPolygonFromCoordinates(e ?? '')
    if (newGeoJSON) {
      setGeojson(newGeoJSON)
      setError(undefined)
      // Clear existing shape and redraw with new coordinates
      if (map) {
        map.setDrawGeojson({
          type: 'FeatureCollection',
          features: []
        })
        map.setDrawGeojson(newGeoJSON as GeoJSON.FeatureCollection)
      }
    } else {
      setGeojson(undefined)
      onChange(undefined) // Explicitly clear the value
      if (map) {
        map.setDrawGeojson({
          type: 'FeatureCollection',
          features: []
        })
      }
    }
  }

  const hasValidShape = (geo: GeoJSON | undefined): boolean => {
    return geo !== undefined &&
           'features' in geo &&
           Array.isArray(geo.features) &&
           geo.features.length > 0
  }

  const clearShape = (): void => {
    setGeojson(undefined)
    onChange(undefined)
    setCoordinates('')
    if (map) {
      map.setDrawGeojson({
        type: 'FeatureCollection',
        features: []
      })
      map.enableDraw(currentDrawType) // Re-enable drawing when shape is cleared
    }
  }

  const handleDrawTypeChange = (shapeType: EMapShape): void => {
    if (map) {
      // Clear existing shape if any
      map.setDrawGeojson({
        type: 'FeatureCollection',
        features: []
      })
      setGeojson(undefined)
      onChange(undefined)
      setCoordinates('')
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
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-500 hover:bg-gray-600'
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
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-500 hover:bg-gray-600'
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
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-500 hover:bg-gray-600'
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
          className='min-h-[100px] bg-slate-50 rounded-lg shadow-inner'
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
        className='min-h-[500px] bg-slate-50 rounded-lg shadow-inner'
        id={field.id}
        testId={field.id}
        label={<FieldLabel {...field} />}
        value={getValue()}
        onChange={(e) => {
          try {
            JSON.parse(e ?? '')
            onChange(JSON.parse(e ?? ''))
            setError(undefined)
          } catch (e) {
            setError('Invalid JSON')
          }
        }} />}
    </div>
}

export default GeoJSONInput
