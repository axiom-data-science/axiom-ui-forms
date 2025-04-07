import { Button, TextArea } from '@axdspub/axiom-ui-utilities'
import FieldLabel from '@/Form/Components/FieldLabel'
import { type IGeometryField, type IFieldInputProps, type IFormField } from '@/Form/Creator/FormCreatorTypes' // Added IFormField explicitly

import { EMapShape, type IMap, type IMapDrawEvent, type IStyleableMapProps } from '@axdspub/axiom-maps'
import { OpenLayersMap as Map } from '@axdspub/axiom-maps/library/openlayers'
// Import Geometry type if not already done
import { type Feature, type GeoJSON, type Geometry } from 'geojson'
import React, { useEffect, useState, type ReactElement, useCallback } from 'react' // Added useCallback
import { TrashIcon, SquareIcon, BorderSolidIcon, DrawingPinFilledIcon } from '@radix-ui/react-icons'

/*
List of coordinates for testing. Around Anchorage.
...
*/

// --- calculateCenterFromGeoJSON remains the same (zoom ignored for initial load) ---
const calculateCenterFromGeoJSON = (geo: GeoJSON | undefined): { lat: number, lon: number, zoom: number } => {
  // ... (Implementation from previous correct version) ...
  // If input is Geometry, wrap it temporarily for calculation
  let featureCollection: GeoJSON.FeatureCollection | undefined
  if (geo && geo.type !== 'FeatureCollection') {
    if (geo.type === 'Feature') {
      featureCollection = { type: 'FeatureCollection', features: [geo] }
    } else if (geo.type === 'Point' || geo.type === 'LineString' || geo.type === 'Polygon' /* add others as needed */) {
      featureCollection = { type: 'FeatureCollection', features: [{ type: 'Feature', properties: {}, geometry: geo as Geometry }] }
    }
  } else if (geo && geo.type === 'FeatureCollection') {
    featureCollection = geo
  }

  if (!featureCollection || !('features' in featureCollection) || !Array.isArray(featureCollection.features) || featureCollection.features.length === 0) {
    return { lat: 61.2181, lon: -149.9003, zoom: 8 } // Default to Anchorage
  }

  const feature = featureCollection.features[0]
  if (!feature?.geometry) {
    return { lat: 61.2181, lon: -149.9003, zoom: 8 }
  }

  const geometry = feature.geometry
  let coordinates: GeoJSON.Position | GeoJSON.Position[] | GeoJSON.Position[][] = [] // Adjusted type

  switch (geometry.type) {
    case 'Polygon':
      coordinates = geometry.coordinates[0] // Get first ring (ignore holes)
      break
    case 'LineString':
      coordinates = geometry.coordinates
      break
    case 'Point':
      coordinates = [geometry.coordinates] // Wrap single point for uniform handling
      break
    default:
      return { lat: 61.2181, lon: -149.9003, zoom: 8 }
  }

  // Flatten coordinates for bounds calculation if needed (e.g., MultiPoint, MultiLineString)
  const flatCoordinates = ([] as GeoJSON.Position[]).concat(...coordinates as any)

  if (!Array.isArray(flatCoordinates) || flatCoordinates.length === 0 || !Array.isArray(flatCoordinates[0])) {
    // Handle single point case where flatCoordinates might be just [lon, lat]
    if (Array.isArray(flatCoordinates) && flatCoordinates.length === 2 && typeof flatCoordinates[0] === 'number') {
      const [lon, lat] = flatCoordinates as unknown as GeoJSON.Position
      // FIX #2: Return a default zoom even for a point here for centering logic,
      // but we won't use this zoom for the initial MAP_CONFIG.
      return { lat, lon, zoom: 8 } // Default zoom
    }
    console.warn('Could not determine coordinates for centering.')
    return { lat: 61.2181, lon: -149.9003, zoom: 8 }
  }

  // Calculate bounds
  let minLat = Infinity; let maxLat = -Infinity; let minLon = Infinity; let maxLon = -Infinity
  let sumLat = 0; let sumLon = 0; let count = 0

  flatCoordinates.forEach((coord: GeoJSON.Position) => {
    if (!Array.isArray(coord) || coord.length < 2) return; const [lon, lat] = coord
    minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat); minLon = Math.min(minLon, lon); maxLon = Math.max(maxLon, lon)
    sumLat += lat; sumLon += lon; count++
  })

  if (count === 0) { return { lat: 61.2181, lon: -149.9003, zoom: 8 } }

  const centerLat = sumLat / count; const centerLon = sumLon / count
  const latDiff = maxLat - minLat; const lonDiff = maxLon - minLon; const maxDiff = Math.max(latDiff, lonDiff)

  let zoom = 8 // default zoom
  if (count === 1 || maxDiff === 0) zoom = 12; else if (maxDiff < 0.1) zoom = 12; else if (maxDiff < 0.5) zoom = 10
  else if (maxDiff < 1) zoom = 9; else if (maxDiff < 2) zoom = 8; else if (maxDiff < 5) zoom = 7; else zoom = 6

  return { lat: centerLat, lon: centerLon, zoom }
}

// Helper function to determine initial draw type based on settings
const getInitialDrawType = (field: IFormField): EMapShape => {
  const settings = (field as IGeometryField).settings ?? {}
  const drawEnabled = settings.drawEnabled !== false
  const drawPointEnabled = settings.drawPointEnabled === true && drawEnabled
  const drawPathEnabled = settings.drawPathEnabled === true && drawEnabled
  const drawPolygonEnabled = settings.drawPolygonEnabled === true && drawEnabled

  if (drawPointEnabled) return EMapShape.point
  if (drawPathEnabled) return EMapShape.linestring
  if (drawPolygonEnabled) return EMapShape.polygon
  return EMapShape.point // Defaulting to Point if none specified
}

export const GeometryInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const [map, setMapState] = useState<IMap | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [showGeoJSONInput] = useState<boolean>(false)

  const [geojson, setGeojson] = useState<Feature | undefined>(() => {
    if (value && typeof value === 'object' && 'type' in value && value.type !== 'FeatureCollection' && value.type !== 'Feature') {
      return { type: 'Feature', properties: {}, geometry: value as Geometry }
    }
    if (value && typeof value === 'object' && 'type' in value && value.type === 'Feature') { return value as Feature }
    return undefined
  })

  const geomField = field as IGeometryField

  const drawEnabled = geomField.settings?.drawEnabled !== false
  const drawPointEnabled = geomField.settings?.drawPointEnabled === true && drawEnabled
  const drawPathEnabled = geomField.settings?.drawPathEnabled === true && drawEnabled
  const drawPolygonEnabled = geomField.settings?.drawPolygonEnabled === true && drawEnabled
  const showCoordinateInput = geomField.settings?.showCoordinateInput !== false

  const [currentDrawType, setCurrentDrawType] = useState<EMapShape>(() => getInitialDrawType(field))
  const [isDrawing, setIsDrawing] = useState<boolean>(!geojson && drawEnabled)

  const initialMapCenter = calculateCenterFromGeoJSON(geojson)
  const INITIAL_DEFAULT_ZOOM = 8 // Fixed default zoom

  const MAP_CONFIG: IStyleableMapProps = {
    baseLayerKey: 'hybrid',
    height: geomField.settings?.height ?? '500px',
    width: '100%',
    style: { /* ... styles ... */ },
    center: { lat: initialMapCenter.lat, lon: initialMapCenter.lon },
    zoom: INITIAL_DEFAULT_ZOOM, // Use fixed zoom
    tools: {
      draw: {
        shape: currentDrawType,
        enabled: drawEnabled && (drawPolygonEnabled || drawPathEnabled || drawPointEnabled)
      }
    }
  }

  // ---- Coordinate Handling ----
  const updateCoordinatesFromFeature = useCallback((feature: Feature | undefined): void => {
    if (!feature?.geometry) { setCoordinates(''); return }
    const geometry = feature.geometry; let newCoords = ''
    try {
      if (geometry.type === 'Polygon') { newCoords = (geometry.coordinates[0] ?? []).map(pos => `${pos[1]}, ${pos[0]}`).join('\n') } else if (geometry.type === 'LineString') { newCoords = (geometry.coordinates ?? []).map(pos => `${pos[1]}, ${pos[0]}`).join('\n') } else if (geometry.type === 'Point') { const coords = geometry.coordinates ?? [NaN, NaN]; if (!isNaN(coords[0]) && !isNaN(coords[1])) { newCoords = `${coords[1]}, ${coords[0]}` } else { newCoords = '' } }
    } catch (e) { console.error('Err format coords:', e); newCoords = '' }
    setCoordinates(newCoords)
    // setShowShapeTypeButtons(shouldShowShapeButtons(newCoords)); // Let coordinate effect handle this
  }, [])

  const [coordinates, setCoordinates] = useState<string>(() => {
    if (!geojson?.geometry) return ''; let initCoords = ''; const geometry = geojson.geometry
    try {
      if (geometry.type === 'Polygon') { initCoords = (geometry.coordinates[0] ?? []).map(pos => `${pos[1]}, ${pos[0]}`).join('\n') } else if (geometry.type === 'LineString') { initCoords = (geometry.coordinates ?? []).map(pos => `${pos[1]}, ${pos[0]}`).join('\n') } else if (geometry.type === 'Point') { const coords = geometry.coordinates ?? [NaN, NaN]; if (!isNaN(coords[0]) && !isNaN(coords[1])) { initCoords = `${coords[1]}, ${coords[0]}` } }
    } catch (e) { console.error('Err init coords:', e); initCoords = '' } return initCoords
  })

  useEffect(() => {
    updateCoordinatesFromFeature(geojson)
  }, [geojson, updateCoordinatesFromFeature])

  const createGeoJSONFromCoordinates = (coordString: string, forceType?: EMapShape): Feature | undefined => { /* ... same as last working version ... */
    if (!coordString.trim()) { setError(undefined); return undefined }
    try {
      const points = coordString.split('\n').map(l => l.trim()).filter(l => l).map(l => { const [lat, lon] = l.split(',').map(c => parseFloat(c.trim())); if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) throw Error(`Invalid: ${lat}, ${lon}`); return [lon, lat] })
      if (points.length === 0) throw Error('No valid coords')
      if (points.length === 1 && drawPointEnabled) return { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: points[0] } }
      if ((forceType === EMapShape.polygon || (!forceType && points.length >= 3)) && drawPolygonEnabled) { if (points.length > 0 && JSON.stringify(points[0]) !== JSON.stringify(points[points.length - 1])) points.push(points[0]); if (points.length < 4) throw Error('Min 3 unique coords for polygon'); return { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [points] } } }
      if ((forceType === EMapShape.linestring || (!forceType && points.length >= 2)) && drawPathEnabled) { if (points.length < 2) throw Error('Min 2 coords for path'); return { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: points } } }
      setError('Cannot create shape. Check tools/coords.'); return undefined
    } catch (e: any) { setError(`Invalid coords/count: ${e.message}. Use "lat, lon"`); return undefined }
  }

  const shouldShowShapeButtons = (coords: string): boolean => { /* ... same as last working version ... */
    const validLinesCount = coords.trim().split('\n').filter(l => l.trim()).length
    return (drawPolygonEnabled || drawPathEnabled) && validLinesCount >= 2
  }
  const [showShapeTypeButtons, setShowShapeTypeButtons] = useState<boolean>(() => shouldShowShapeButtons(coordinates))
  useEffect(() => { setShowShapeTypeButtons(shouldShowShapeButtons(coordinates)) }, [coordinates, drawPolygonEnabled, drawPathEnabled]) // Added effect to update buttons

  // ---- Map Event Handlers & State Updates ----
  useEffect(() => { // Map event listeners
    if (!map) return
    const drawCompleteListener = (e: IMapDrawEvent): void => { /* ... same ... */ const f = e.data?.geojson?.features?.[0]; if (f) { setGeojson(f); setIsDrawing(false); map.disableDraw(currentDrawType) } }
    const drawUpdateListener = (e: IMapDrawEvent): void => { /* ... same ... */ const f = e.data?.geojson?.features?.[0]; if (f) { setGeojson(f) } }
    map.onDrawComplete(drawCompleteListener); map.onDrawUpdate(drawUpdateListener)
    // Cleanup omitted
  }, [map, currentDrawType])

  useEffect(() => { // Parent onChange trigger
    onChange(geojson?.geometry ?? undefined)
  }, [geojson])

  useEffect(() => { // Map drawing/state sync effect
    if (!map) return
    const correctDrawType = getInitialDrawType(field)
    if (currentDrawType !== correctDrawType) {
      setCurrentDrawType(correctDrawType)
    }

    if (geojson?.geometry) {
      map.setDrawGeojson({ type: 'FeatureCollection', features: [geojson] })
      map.disableDraw(correctDrawType) // Ensure correct tool is disabled
      setIsDrawing(false)
    } else {
      map.setDrawGeojson({ type: 'FeatureCollection', features: [] })
      if (drawEnabled && (drawPointEnabled || drawPathEnabled || drawPolygonEnabled)) {
        map.enableDraw(correctDrawType) // Enable the correct initial tool
        setIsDrawing(true)
      } else {
        map.disableDraw(correctDrawType) // Ensure drawing is off if not enabled
        setIsDrawing(false)
      }
    }
  }, [map, geojson, drawEnabled, drawPointEnabled, drawPathEnabled, drawPolygonEnabled, currentDrawType, field])

  // ---- Helper Functions ----
  const hasValidShape = (feature?: Feature): boolean => !!feature?.geometry

  const clearShape = (): void => { /* ... same ... */
    setGeojson(undefined); setCoordinates(''); setShowShapeTypeButtons(false)
    if (map && drawEnabled) { map.setDrawGeojson({ type: 'FeatureCollection', features: [] }); const iType = getInitialDrawType(field); setCurrentDrawType(iType); map.enableDraw(iType); setIsDrawing(true) }
  }

  const handleDrawTypeChange = (shapeType: EMapShape): void => { /* ... same as minimal fix version ... */
    if (map && drawEnabled) {
      const isAllowed = (shapeType === EMapShape.point && drawPointEnabled) || (shapeType === EMapShape.linestring && drawPathEnabled) || (shapeType === EMapShape.polygon && drawPolygonEnabled)
      if (isAllowed && shapeType !== currentDrawType) { map.disableDraw(currentDrawType); setCurrentDrawType(shapeType); map.enableDraw(shapeType); setIsDrawing(true) }
    }
  }

  const handleCoordinatesChange = (e: string | undefined): void => { /* ... same as minimal fix version ... */
    const newCoords = e ?? ''; setCoordinates(newCoords)
    const pointsCount = newCoords.trim().split('\n').filter(l => l.trim()).length
    let intendedType: EMapShape | undefined
    if (pointsCount === 1 && drawPointEnabled) intendedType = EMapShape.point
    else if (pointsCount >= 3 && drawPolygonEnabled) intendedType = EMapShape.polygon
    else if (pointsCount >= 2 && drawPathEnabled) intendedType = EMapShape.linestring
    const newFeature = createGeoJSONFromCoordinates(newCoords, intendedType)
    if (newFeature) {
      setGeojson(newFeature); setError(undefined)
      if (map) { map.setDrawGeojson({ type: 'FeatureCollection', features: [] }); map.setDrawGeojson({ type: 'FeatureCollection', features: [newFeature] }); map.disableDraw(currentDrawType); setIsDrawing(false) }
      //   setShowShapeTypeButtons(shouldShowShapeButtons(newCoords)); // Let effect handle this
    } else {
      if (!newCoords.trim()) { setGeojson(undefined); if (map && drawEnabled) { map.setDrawGeojson({ type: 'FeatureCollection', features: [] }); map.enableDraw(currentDrawType); setIsDrawing(true) } setShowShapeTypeButtons(false) } else if (!error) { setError('Cannot form valid shape with coords/tools.') }
    }
  }

  const applyShapeType = (shapeType: EMapShape): void => { /* ... same ... */
    const newFeature = createGeoJSONFromCoordinates(coordinates, shapeType)
    if (newFeature) { setGeojson(newFeature); setError(undefined) } else if (!error) { setError(`Could not create ${shapeType === EMapShape.polygon ? 'poly' : 'path'}.`) }
  }

  // ---- JSX Return (Reverting Button ClassNames and removing disabled) ----
  return (
        <div>
            <FieldLabel {...field} />
            <div className="relative">
                {drawEnabled && (drawPolygonEnabled || drawPathEnabled || drawPointEnabled) && (
                    <div className="absolute z-20 top-4 right-4 flex flex-col gap-2">
                        {/* Point Button - Render only if allowed */}
                        {drawPointEnabled && (
                             <div className="tooltip-container relative group">
                                 <Button
                                    onClick={() => { handleDrawTypeChange(EMapShape.point) }}
                                    // Reverted className logic
                                    className={`p-2 rounded-lg shadow-lg ${
                                        currentDrawType === EMapShape.point && isDrawing
                                          ? 'bg-white hover:bg-gray-50 ring-2 ring-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.5)]'
                                          : 'bg-gray-100 hover:bg-gray-50'
                                      } text-black w-10 h-10 flex items-center justify-center`}
                                    aria-label="Draw Point"
                                  >
                                   <DrawingPinFilledIcon className="w-5 h-5" />
                                   <span className="tooltip absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
                                     Draw Point
                                   </span>
                                 </Button>
                             </div>
                        )}
                        {/* Path Button - Render only if allowed */}
                        {drawPathEnabled && (
                           <div className="tooltip-container relative group">
                               <Button
                                   onClick={() => { handleDrawTypeChange(EMapShape.linestring) }}
                                   // Reverted className logic
                                   className={`p-2 rounded-lg shadow-lg ${
                                       currentDrawType === EMapShape.linestring && isDrawing
                                         ? 'bg-white hover:bg-gray-50 ring-2 ring-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.5)]'
                                         : 'bg-gray-100 hover:bg-gray-50'
                                     } text-black w-10 h-10 flex items-center justify-center`}
                                   aria-label="Draw Path"
                                 >
                                   <BorderSolidIcon className="w-5 h-5" />
                                   <span className="tooltip absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
                                     Draw Path
                                   </span>
                                 </Button>
                           </div>
                        )}
                         {/* Polygon Button - Render only if allowed */}
                        {drawPolygonEnabled && (
                             <div className="tooltip-container relative group">
                                 <Button
                                     onClick={() => { handleDrawTypeChange(EMapShape.polygon) }}
                                     // Reverted className logic
                                     className={`p-2 rounded-lg shadow-lg ${
                                         currentDrawType === EMapShape.polygon && isDrawing
                                           ? 'bg-white hover:bg-gray-50 ring-2 ring-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.5)]'
                                           : 'bg-gray-100 hover:bg-gray-50'
                                       } text-black w-10 h-10 flex items-center justify-center`}
                                     aria-label="Draw Polygon"
                                   >
                                    <SquareIcon className="w-5 h-5 rotate-45" />
                                    <span className="tooltip absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
                                      Draw Polygon
                                    </span>
                                  </Button>
                             </div>
                        )}
                        {/* Clear Button - Render if shape exists */}
                        {hasValidShape(geojson) && (
                            <div className="tooltip-container relative group">
                                <Button
                                    onClick={clearShape}
                                    className="p-2 rounded-lg shadow-lg bg-red-500 hover:bg-red-600 text-white w-10 h-10 flex items-center justify-center"
                                    aria-label="Clear Shape"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                    <span className="tooltip absolute right-full mr-2 px-2 py-1 bg-gray-800 text-white text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none">
                                      Clear Shape
                                    </span>
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Map Component */}
                <Map {...MAP_CONFIG} setState={setMapState} />

                {/* Coordinate Input Section */}
                {showCoordinateInput && (
                     <div className="mt-4">
                        <div className="flex justify-between items-center mb-2 flex-wrap gap-y-2">
                            <span className="text-sm"> {/* ... label ... */} </span>
                            {showShapeTypeButtons && (drawPathEnabled || drawPolygonEnabled) && (
                                <div className="flex gap-2"> {/* ... Create Path/Polygon buttons ... */}
                                    {drawPathEnabled && <Button onClick={() => { applyShapeType(EMapShape.linestring) }} className="px-3 py-1 bg-white hover:bg-gray-50 text-black rounded-lg shadow-sm border border-gray-200 text-xs flex items-center gap-1"><BorderSolidIcon className="w-3 h-3" />Create Path</Button>}
                                    {drawPolygonEnabled && <Button onClick={() => { applyShapeType(EMapShape.polygon) }} className="px-3 py-1 bg-white hover:bg-gray-50 text-black rounded-lg shadow-sm border border-gray-200 text-xs flex items-center gap-1"><SquareIcon className="w-3 h-3 rotate-45" />Create Polygon</Button>}
                                </div>
                            )}
                        </div>
                        <TextArea error={error} className='min-h-[100px] bg-slate-50 rounded-lg shadow-inner font-mono text-sm' id={`${field.id}-coordinates`} testId={`${field.id}-coordinates`} value={coordinates} onChange={handleCoordinatesChange} placeholder={'...'} aria-label="Coordinates Input" />
                        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
                    </div>
                )}

                 {/* Debug Output (Optional) */}
                 {showGeoJSONInput && <TextArea error={error} className='...' id={field.id + '-debug'} testId={field.id + '-debug'} label={<FieldLabel {...field} label="Debug GeoJSON Feature State"/>} value={JSON.stringify(value, null, 2)} />}
            </div>
        </div>
  )
}

export default GeometryInput
