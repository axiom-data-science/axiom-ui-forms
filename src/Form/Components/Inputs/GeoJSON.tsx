import { Button, TextArea } from '@axdspub/axiom-ui-utilities'
import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'

import { EMapShape, type IMap, type IMapDrawEvent, type IStyleableMapProps } from '@axdspub/axiom-maps'
import { MapLoader } from '@axdspub/axiom-maps'
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

const calculateCenterFromGeoJSON = (geo: GeoJSON | undefined): { lat: number, lon: number, zoom: number } => {
  if (!geo || !('features' in geo) || !Array.isArray(geo.features) || geo.features.length === 0) {
    return { lat: 61.2181, lon: -149.9003, zoom: 8 } // Default to Anchorage
  }

  const feature = geo.features[0]
  if (!feature?.geometry) {
    return { lat: 61.2181, lon: -149.9003, zoom: 8 }
  }

  const geometry = feature.geometry
  let coordinates: GeoJSON.Position[] = []

  switch (geometry.type) {
    case 'Polygon':
      coordinates = geometry.coordinates[0] // Get first ring (ignore holes)
      break
    case 'LineString':
      coordinates = geometry.coordinates
      break
    case 'Point':
      coordinates = [geometry.coordinates]
      break
    default:
      return { lat: 61.2181, lon: -149.9003, zoom: 8 }
  }

  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return { lat: 61.2181, lon: -149.9003, zoom: 8 }
  }

  // Calculate bounds
  let minLat = Infinity
  let maxLat = -Infinity
  let minLon = Infinity
  let maxLon = -Infinity
  let sumLat = 0
  let sumLon = 0
  let count = 0

  coordinates.forEach((coord: GeoJSON.Position) => {
    const [lon, lat] = coord
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
    minLon = Math.min(minLon, lon)
    maxLon = Math.max(maxLon, lon)
    sumLat += lat
    sumLon += lon
    count++
  })

  // Calculate center
  const centerLat = sumLat / count
  const centerLon = sumLon / count

  // Calculate zoom level based on bounds
  const latDiff = maxLat - minLat
  const lonDiff = maxLon - minLon
  const maxDiff = Math.max(latDiff, lonDiff)

  // Adjust zoom based on the size of the shape
  let zoom = 8 // default zoom
  if (maxDiff < 0.1) zoom = 12 // very small shape
  else if (maxDiff < 0.5) zoom = 10 // small shape
  else if (maxDiff < 1) zoom = 9 // medium shape
  else if (maxDiff < 2) zoom = 8 // large shape
  else if (maxDiff < 5) zoom = 7 // very large shape
  else zoom = 6 // huge shape

  return {
    lat: centerLat,
    lon: centerLon,
    zoom
  }
}

export const GeoJSONInput = ({ field, onChange, value, disabled }: IFieldInputProps): ReactElement => {
  console.log('INITIAL VALUE', value)
  const initialGeoJSON = value as unknown as GeoJSON
  const initialMapConfig = calculateCenterFromGeoJSON(initialGeoJSON)
  const [currentDrawType, setCurrentDrawType] = useState<EMapShape>(EMapShape.polygon)
  const [isDrawing, setIsDrawing] = useState<boolean>(false)

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
    center: { lat: initialMapConfig.lat, lon: initialMapConfig.lon },
    zoom: initialMapConfig.zoom,
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
      const geometry = feature?.geometry
      if (!geometry) return ''

      if (geometry.type === 'Polygon') {
        const coords = geometry.coordinates[0]
        return coords.map((pos: GeoJSON.Position) => `${pos[1]}, ${pos[0]}`).join('\n')
      } else if (geometry.type === 'LineString') {
        const coords = geometry.coordinates
        return coords.map((pos: GeoJSON.Position) => `${pos[1]}, ${pos[0]}`).join('\n')
      } else if (geometry.type === 'Point') {
        const coords = geometry.coordinates
        return `${coords[1]}, ${coords[0]}`
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

  const createGeoJSONFromCoordinates = (coordString: string, forceType?: EMapShape): GeoJSON | undefined => {
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

      if (points.length === 0) {
        throw new Error('No valid coordinates found')
      }

      // Single point
      if (points.length === 1) {
        return {
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: points[0]
            }
          }]
        }
      }

      // For polygon or line, based on forceType or number of points
      if (forceType === EMapShape.polygon || (!forceType && points.length >= 3)) {
        // Close the polygon by adding the first point at the end if not already closed
        if (JSON.stringify(points[0]) !== JSON.stringify(points[points.length - 1])) {
          points.push(points[0])
        }
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
      }

      // LineString
      return {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: points
          }
        }]
      }
    } catch (e) {
      setError('Invalid coordinate format. Use "lat, lon" format, one per line')
      return undefined
    }
  }

  const [showShapeTypeButtons, setShowShapeTypeButtons] = useState<boolean>(() => {
    // Show buttons if initial value has 2+ coordinates
    if (!value) return false
    const geoValue = value as unknown as GeoJSON.FeatureCollection
    if (geoValue?.type === 'FeatureCollection' && Array.isArray(geoValue.features) && geoValue.features.length > 0) {
      const feature = geoValue.features[0]
      const geometry = feature?.geometry
      if (!geometry) return false

      if (geometry.type === 'Polygon' || geometry.type === 'LineString') {
        return geometry.coordinates.length >= 2
      }
    }
    return false
  })

  const updateCoordinatesFromGeoJSON = (geo: GeoJSON | undefined): void => {
    if (!geo || geo.type !== 'FeatureCollection' || !geo.features?.[0]?.geometry) return

    const feature = geo.features[0]
    const geometry = feature.geometry
    let newCoords = ''

    if (geometry.type === 'Polygon') {
      const coords = geometry.coordinates[0]
      newCoords = coords.map((pos: GeoJSON.Position) => `${pos[1]}, ${pos[0]}`).join('\n')
    } else if (geometry.type === 'LineString') {
      const coords = geometry.coordinates
      newCoords = coords.map((pos: GeoJSON.Position) => `${pos[1]}, ${pos[0]}`).join('\n')
    } else if (geometry.type === 'Point') {
      const coords = geometry.coordinates
      newCoords = `${coords[1]}, ${coords[0]}`
    }

    setCoordinates(newCoords)
    setShowShapeTypeButtons(shouldShowShapeButtons(newCoords))
  }

  useEffect(() => {
    if (map === undefined) return

    map.onDrawComplete((e: IMapDrawEvent) => {
      console.log('draw complete', e)
      setGeojson(e.data?.geojson)
      updateCoordinatesFromGeoJSON(e.data?.geojson)
      setIsDrawing(false)
      // Disable drawing after shape is completed
      map.disableDraw(currentDrawType)
    })

    // On modify drawing
    map.onDrawUpdate((e: IMapDrawEvent) => {
      console.log('draw update', e)
      setGeojson(e.data?.geojson)
      updateCoordinatesFromGeoJSON(e.data?.geojson)
    })
  }, [map])

  useEffect(() => {
    if (geojson !== undefined) {
      onChange(geojson)
    }
  }, [geojson])

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
      setIsDrawing(true)
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
      setShowShapeTypeButtons(false)
      setCurrentDrawType(shapeType)
      map.enableDraw(shapeType)
      setIsDrawing(true)
    }
  }

  const shouldShowShapeButtons = (coords: string): boolean => {
    const validLines = coords.trim().split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .filter(line => {
        try {
          const [lat, lon] = line.split(',').map(coord => parseFloat(coord.trim()))
          return !isNaN(lat) && !isNaN(lon)
        } catch {
          return false
        }
      })
    return validLines.length >= 3
  }

  const handleCoordinatesChange = (e: string | undefined): void => {
    const newCoords = e ?? ''
    setCoordinates(newCoords)
    setShowShapeTypeButtons(shouldShowShapeButtons(newCoords))

    try {
      const newGeoJSON = createGeoJSONFromCoordinates(newCoords)
      if (newGeoJSON) {
        setGeojson(newGeoJSON)
        setError(undefined)
        if (map) {
          map.setDrawGeojson({
            type: 'FeatureCollection',
            features: []
          })
          map.setDrawGeojson(newGeoJSON as GeoJSON.FeatureCollection)
          map.disableDraw(currentDrawType) // Disable drawing when coordinates are entered
        }
      } else {
        setGeojson(undefined)
        onChange(undefined)
        if (map) {
          map.setDrawGeojson({
            type: 'FeatureCollection',
            features: []
          })
        }
      }
    } catch (e) {
      setError('Invalid coordinate format')
    }
  }

  // Reload shape on the map
  useEffect(() => {
    if (map === undefined) return

    if (geojson !== undefined && 'features' in geojson) {
      map.setDrawGeojson(geojson)
      map.disableDraw(currentDrawType) // Disable drawing when there's a shape
      setIsDrawing(false)
      // Update coordinates display and shape type buttons
      updateCoordinatesFromGeoJSON(geojson)
      setShowShapeTypeButtons(shouldShowShapeButtons(coordinates))
    } else {
      map.enableDraw(currentDrawType)
      setIsDrawing(true)
    }
  }, [map, currentDrawType])

  const applyShapeType = (shapeType: EMapShape): void => {
    const newGeoJSON = createGeoJSONFromCoordinates(coordinates, shapeType)
    if (newGeoJSON) {
      setGeojson(newGeoJSON)
      setError(undefined)
      if (map) {
        map.setDrawGeojson({
          type: 'FeatureCollection',
          features: []
        })
        map.setDrawGeojson(newGeoJSON as GeoJSON.FeatureCollection)
      }
    }
    // Don't hide the buttons anymore
    // setShowShapeTypeButtons(false)
  }

  return <div>
  <FieldLabel field={field} disabled={disabled} />
    <div className="relative">
      <div className="absolute z-20 top-12 right-4 flex flex-col gap-2">
        <div className="tooltip-container relative group">
          <Button
            onClick={() => { handleDrawTypeChange(EMapShape.polygon) }}
            className={`p-2 rounded-lg shadow-lg ${
              currentDrawType === EMapShape.polygon && isDrawing
                ? 'bg-white hover:bg-gray-50 ring-2 ring-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.5)]'
                : 'bg-gray-100 hover:bg-gray-50'
            } text-black w-10 h-10 flex items-center justify-center`}
          >
            <SquareIcon className="w-5 h-5 rotate-45" />
            <span className="tooltip absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
              Draw Polygon
            </span>
          </Button>
        </div>
        <div className="tooltip-container relative group">
          <Button
            onClick={() => { handleDrawTypeChange(EMapShape.linestring) }}
            className={`p-2 rounded-lg shadow-lg ${
              currentDrawType === EMapShape.linestring && isDrawing
                ? 'bg-white hover:bg-gray-50 ring-2 ring-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.5)]'
                : 'bg-gray-100 hover:bg-gray-50'
            } text-black w-10 h-10 flex items-center justify-center`}
          >
            <BorderSolidIcon className="w-5 h-5" />
            <span className="tooltip absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
              Draw Path
            </span>
          </Button>
        </div>
        <div className="tooltip-container relative group">
          <Button
            onClick={() => { handleDrawTypeChange(EMapShape.point) }}
            className={`p-2 rounded-lg shadow-lg ${
              currentDrawType === EMapShape.point && isDrawing
                ? 'bg-white hover:bg-gray-50 ring-2 ring-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.5)]'
                : 'bg-gray-100 hover:bg-gray-50'
            } text-black w-10 h-10 flex items-center justify-center`}
          >
            <DrawingPinFilledIcon className="w-5 h-5" />
            <span className="tooltip absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
              Draw Point
            </span>
          </Button>
        </div>
        {hasValidShape(geojson) && (
          <div className="tooltip-container relative group">
            <Button
              onClick={clearShape}
              className="p-2 rounded-lg shadow-lg bg-red-500 hover:bg-red-600 text-white w-10 h-10 flex items-center justify-center"
            >
              <TrashIcon className="w-5 h-5" />
              <span className="tooltip absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
                Clear Shape
              </span>
            </Button>
          </div>
        )}
      </div>
        {
          disabled && (
              <div className="absolute z-50 bg-white bg-opacity-20 cursor-not-allowed top-0 right-0 left-0 bottom-0"></div>
          )
        }
        <MapLoader {...MAP_CONFIG} setState={setMapState} mapLibraryKey='openlayers' />

      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span>Draw on map or enter coordinates <pre className="inline-block text-sm">(latitude, longitude)</pre></span>
          {showShapeTypeButtons && (
            <div className="flex gap-2">
              <Button
                onClick={() => { applyShapeType(EMapShape.linestring) }}
                className="px-4 py-1 bg-white hover:bg-gray-50 text-black rounded-lg shadow-sm border border-gray-200 text-sm flex items-center gap-2"
              >
                <BorderSolidIcon className="w-4 h-4" />
                Create Path
              </Button>
              <Button
                onClick={() => { applyShapeType(EMapShape.polygon) }}
                className="px-4 py-1 bg-white hover:bg-gray-50 text-black rounded-lg shadow-sm border border-gray-200 text-sm flex items-center gap-2"
              >
                <SquareIcon className="w-4 h-4 rotate-45" />
                Create Polygon
              </Button>
            </div>
          )}
        </div>
        <TextArea
          disabled={disabled}
          error={error}
          className='min-h-25 bg-slate-50 rounded-lg shadow-inner'
          id={`${field.id}-coordinates`}
          testId={`${field.id}-coordinates`}
          value={coordinates}
          onChange={handleCoordinatesChange}
          placeholder="61.2181, -149.9003&#10;61.2182, -149.9004&#10;61.2183, -149.9005"
        />
      </div>
      {showGeoJSONInput && <TextArea
        error={error}
        className='min-h-125 bg-slate-50 rounded-lg shadow-inner'
        id={field.id}
        testId={field.id}
        label={<FieldLabel field={field} disabled={disabled} />}
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
    </div>
}

export default GeoJSONInput
