import { Button, TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IGeometryField, type IFieldInputProps, type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED*** // Added IFormField explicitly

import { EMapShape, type IMap, type IMapDrawEvent, type IStyleableMapProps } from ***REMOVED***@axdspub/axiom-maps***REMOVED***
import { OpenLayersMap as Map } from ***REMOVED***@axdspub/axiom-maps/library/openlayers***REMOVED***
// Import Geometry type if not already done
import { type Feature, type GeoJSON, type Geometry } from ***REMOVED***geojson***REMOVED***
import React, { useEffect, useState, type ReactElement, useCallback } from ***REMOVED***react***REMOVED*** // Added useCallback
import { TrashIcon, SquareIcon, BorderSolidIcon, DrawingPinFilledIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***

/*
List of coordinates for testing. Around Anchorage.
...
*/

// --- calculateCenterFromGeoJSON remains the same (zoom ignored for initial load) ---
const calculateCenterFromGeoJSON = (geo: GeoJSON | undefined, defaultCenter?: { lat: number, lon: number, zoom: number }): { lat: number, lon: number, zoom: number } => {
  // If default center is provided, use it
  if (defaultCenter) {
    return defaultCenter
  }

  // If input is Geometry, wrap it temporarily for calculation
  let featureCollection: GeoJSON.FeatureCollection | undefined
  if (geo && geo.type !== ***REMOVED***FeatureCollection***REMOVED***) {
    if (geo.type === ***REMOVED***Feature***REMOVED***) {
      featureCollection = { type: ***REMOVED***FeatureCollection***REMOVED***, features: [geo] }
    } else if (geo.type === ***REMOVED***Point***REMOVED*** || geo.type === ***REMOVED***LineString***REMOVED*** || geo.type === ***REMOVED***Polygon***REMOVED*** /* add others as needed */) {
      featureCollection = { type: ***REMOVED***FeatureCollection***REMOVED***, features: [{ type: ***REMOVED***Feature***REMOVED***, properties: {}, geometry: geo as Geometry }] }
    }
  } else if (geo && geo.type === ***REMOVED***FeatureCollection***REMOVED***) {
    featureCollection = geo
  }

  // Default to Anchorage if no valid GeoJSON
  const DEFAULT_CENTER = { lat: 61.2181, lon: -149.9003, zoom: 8 }

  if (!featureCollection || !(***REMOVED***features***REMOVED*** in featureCollection) || !Array.isArray(featureCollection.features) || featureCollection.features.length === 0) {
    return DEFAULT_CENTER
  }

  const feature = featureCollection.features[0]
  if (!feature?.geometry) {
    return DEFAULT_CENTER
  }

  const geometry = feature.geometry
  let coordinates: GeoJSON.Position | GeoJSON.Position[] | GeoJSON.Position[][] = [] // Adjusted type

  switch (geometry.type) {
    case ***REMOVED***Polygon***REMOVED***:
      coordinates = geometry.coordinates[0] // Get first ring (ignore holes)
      break
    case ***REMOVED***LineString***REMOVED***:
      coordinates = geometry.coordinates
      break
    case ***REMOVED***Point***REMOVED***:
      coordinates = [geometry.coordinates] // Wrap single point for uniform handling
      break
    default:
      return DEFAULT_CENTER
  }

  // Flatten coordinates for bounds calculation if needed (e.g., MultiPoint, MultiLineString)
  const flatCoordinates = ([] as GeoJSON.Position[]).concat(...coordinates as any)

  if (!Array.isArray(flatCoordinates) || flatCoordinates.length === 0 || !Array.isArray(flatCoordinates[0])) {
    // Handle single point case where flatCoordinates might be just [lon, lat]
    if (Array.isArray(flatCoordinates) && flatCoordinates.length === 2 && typeof flatCoordinates[0] === ***REMOVED***number***REMOVED***) {
      const [lon, lat] = flatCoordinates as unknown as GeoJSON.Position
      // FIX #2: Return a default zoom even for a point here for centering logic,
      // but we won***REMOVED***t use this zoom for the initial MAP_CONFIG.
      return { lat, lon, zoom: 8 } // Default zoom
    }
    console.warn(***REMOVED***Could not determine coordinates for centering.***REMOVED***)
    return DEFAULT_CENTER
  }

  // Calculate bounds
  let minLat = Infinity; let maxLat = -Infinity; let minLon = Infinity; let maxLon = -Infinity
  let sumLat = 0; let sumLon = 0; let count = 0

  flatCoordinates.forEach((coord: GeoJSON.Position) => {
    if (!Array.isArray(coord) || coord.length < 2) return; const [lon, lat] = coord
    minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat); minLon = Math.min(minLon, lon); maxLon = Math.max(maxLon, lon)
    sumLat += lat; sumLon += lon; count++
  })

  if (count === 0) { return DEFAULT_CENTER }

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
    if (value && typeof value === ***REMOVED***object***REMOVED*** && ***REMOVED***type***REMOVED*** in value && value.type !== ***REMOVED***FeatureCollection***REMOVED*** && value.type !== ***REMOVED***Feature***REMOVED***) {
      return { type: ***REMOVED***Feature***REMOVED***, properties: {}, geometry: value as Geometry }
    }
    if (value && typeof value === ***REMOVED***object***REMOVED*** && ***REMOVED***type***REMOVED*** in value && value.type === ***REMOVED***Feature***REMOVED***) { return value as Feature }
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

  const initialMapCenter = calculateCenterFromGeoJSON(geojson, geomField.settings?.defaultCenter)

  const MAP_CONFIG: IStyleableMapProps = {
    baseLayerKey: ***REMOVED***hybrid***REMOVED***,
    height: geomField.settings?.height ?? ***REMOVED***500px***REMOVED***,
    width: ***REMOVED***100%***REMOVED***,
    style: { /* ... styles ... */ },
    center: { lat: initialMapCenter.lat, lon: initialMapCenter.lon },
    zoom: initialMapCenter.zoom,
    tools: {
      draw: {
        shape: currentDrawType,
        enabled: drawEnabled && (drawPolygonEnabled || drawPathEnabled || drawPointEnabled)
      }
    }
  }

  // ---- Coordinate Handling ----
  const updateCoordinatesFromFeature = useCallback((feature: Feature | undefined): void => {
    if (!feature?.geometry) { setCoordinates(***REMOVED******REMOVED***); return }
    const geometry = feature.geometry; let newCoords = ***REMOVED******REMOVED***
    try {
      if (geometry.type === ***REMOVED***Polygon***REMOVED***) { newCoords = (geometry.coordinates[0] ?? []).map(pos => `${pos[1]}, ${pos[0]}`).join(***REMOVED***\n***REMOVED***) } else if (geometry.type === ***REMOVED***LineString***REMOVED***) { newCoords = (geometry.coordinates ?? []).map(pos => `${pos[1]}, ${pos[0]}`).join(***REMOVED***\n***REMOVED***) } else if (geometry.type === ***REMOVED***Point***REMOVED***) { const coords = geometry.coordinates ?? [NaN, NaN]; if (!isNaN(coords[0]) && !isNaN(coords[1])) { newCoords = `${coords[1]}, ${coords[0]}` } else { newCoords = ***REMOVED******REMOVED*** } }
    } catch (e) { console.error(***REMOVED***Err format coords:***REMOVED***, e); newCoords = ***REMOVED******REMOVED*** }
    setCoordinates(newCoords)
    // setShowShapeTypeButtons(shouldShowShapeButtons(newCoords)); // Let coordinate effect handle this
  }, [])

  const [coordinates, setCoordinates] = useState<string>(() => {
    if (!geojson?.geometry) return ***REMOVED******REMOVED***; let initCoords = ***REMOVED******REMOVED***; const geometry = geojson.geometry
    try {
      if (geometry.type === ***REMOVED***Polygon***REMOVED***) { initCoords = (geometry.coordinates[0] ?? []).map(pos => `${pos[1]}, ${pos[0]}`).join(***REMOVED***\n***REMOVED***) } else if (geometry.type === ***REMOVED***LineString***REMOVED***) { initCoords = (geometry.coordinates ?? []).map(pos => `${pos[1]}, ${pos[0]}`).join(***REMOVED***\n***REMOVED***) } else if (geometry.type === ***REMOVED***Point***REMOVED***) { const coords = geometry.coordinates ?? [NaN, NaN]; if (!isNaN(coords[0]) && !isNaN(coords[1])) { initCoords = `${coords[1]}, ${coords[0]}` } }
    } catch (e) { console.error(***REMOVED***Err init coords:***REMOVED***, e); initCoords = ***REMOVED******REMOVED*** } return initCoords
  })

  useEffect(() => {
    updateCoordinatesFromFeature(geojson)
  }, [geojson, updateCoordinatesFromFeature])

  const createGeoJSONFromCoordinates = (coordString: string, forceType?: EMapShape): Feature | undefined => { /* ... same as last working version ... */
    if (!coordString.trim()) { setError(undefined); return undefined }
    try {
      const points = coordString.split(***REMOVED***\n***REMOVED***).map(l => l.trim()).filter(l => l).map(l => { const [lat, lon] = l.split(***REMOVED***,***REMOVED***).map(c => parseFloat(c.trim())); if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) throw Error(`Invalid: ${lat}, ${lon}`); return [lon, lat] })
      if (points.length === 0) throw Error(***REMOVED***No valid coords***REMOVED***)
      if (points.length === 1 && drawPointEnabled) return { type: ***REMOVED***Feature***REMOVED***, properties: {}, geometry: { type: ***REMOVED***Point***REMOVED***, coordinates: points[0] } }
      if ((forceType === EMapShape.polygon || (!forceType && points.length >= 3)) && drawPolygonEnabled) { if (points.length > 0 && JSON.stringify(points[0]) !== JSON.stringify(points[points.length - 1])) points.push(points[0]); if (points.length < 4) throw Error(***REMOVED***Min 3 unique coords for polygon***REMOVED***); return { type: ***REMOVED***Feature***REMOVED***, properties: {}, geometry: { type: ***REMOVED***Polygon***REMOVED***, coordinates: [points] } } }
      if ((forceType === EMapShape.linestring || (!forceType && points.length >= 2)) && drawPathEnabled) { if (points.length < 2) throw Error(***REMOVED***Min 2 coords for path***REMOVED***); return { type: ***REMOVED***Feature***REMOVED***, properties: {}, geometry: { type: ***REMOVED***LineString***REMOVED***, coordinates: points } } }
      setError(***REMOVED***Cannot create shape. Check tools/coords.***REMOVED***); return undefined
    } catch (e: any) { setError(`Invalid coords/count: ${e.message}. Use "lat, lon"`); return undefined }
  }

  const shouldShowShapeButtons = (coords: string): boolean => { /* ... same as last working version ... */
    const validLinesCount = coords.trim().split(***REMOVED***\n***REMOVED***).filter(l => l.trim()).length
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
      map.setDrawGeojson({ type: ***REMOVED***FeatureCollection***REMOVED***, features: [geojson] })
      map.disableDraw(correctDrawType) // Ensure correct tool is disabled
      setIsDrawing(false)
    } else {
      map.setDrawGeojson({ type: ***REMOVED***FeatureCollection***REMOVED***, features: [] })
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
    setGeojson(undefined); setCoordinates(***REMOVED******REMOVED***); setShowShapeTypeButtons(false)
    if (map && drawEnabled) { map.setDrawGeojson({ type: ***REMOVED***FeatureCollection***REMOVED***, features: [] }); const iType = getInitialDrawType(field); setCurrentDrawType(iType); map.enableDraw(iType); setIsDrawing(true) }
  }

  const handleDrawTypeChange = (shapeType: EMapShape): void => { /* ... same as minimal fix version ... */
    if (map && drawEnabled) {
      const isAllowed = (shapeType === EMapShape.point && drawPointEnabled) || (shapeType === EMapShape.linestring && drawPathEnabled) || (shapeType === EMapShape.polygon && drawPolygonEnabled)
      if (isAllowed && shapeType !== currentDrawType) { map.disableDraw(currentDrawType); setCurrentDrawType(shapeType); map.enableDraw(shapeType); setIsDrawing(true) }
    }
  }

  const handleCoordinatesChange = (e: string | undefined): void => { /* ... same as minimal fix version ... */
    const newCoords = e ?? ***REMOVED******REMOVED***; setCoordinates(newCoords)
    const pointsCount = newCoords.trim().split(***REMOVED***\n***REMOVED***).filter(l => l.trim()).length
    let intendedType: EMapShape | undefined
    if (pointsCount === 1 && drawPointEnabled) intendedType = EMapShape.point
    else if (pointsCount >= 3 && drawPolygonEnabled) intendedType = EMapShape.polygon
    else if (pointsCount >= 2 && drawPathEnabled) intendedType = EMapShape.linestring
    const newFeature = createGeoJSONFromCoordinates(newCoords, intendedType)
    if (newFeature) {
      setGeojson(newFeature); setError(undefined)
      if (map) { map.setDrawGeojson({ type: ***REMOVED***FeatureCollection***REMOVED***, features: [] }); map.setDrawGeojson({ type: ***REMOVED***FeatureCollection***REMOVED***, features: [newFeature] }); map.disableDraw(currentDrawType); setIsDrawing(false) }
      //   setShowShapeTypeButtons(shouldShowShapeButtons(newCoords)); // Let effect handle this
    } else {
      if (!newCoords.trim()) { setGeojson(undefined); if (map && drawEnabled) { map.setDrawGeojson({ type: ***REMOVED***FeatureCollection***REMOVED***, features: [] }); map.enableDraw(currentDrawType); setIsDrawing(true) } setShowShapeTypeButtons(false) } else if (!error) { setError(***REMOVED***Cannot form valid shape with coords/tools.***REMOVED***) }
    }
  }

  const applyShapeType = (shapeType: EMapShape): void => { /* ... same ... */
    const newFeature = createGeoJSONFromCoordinates(coordinates, shapeType)
    if (newFeature) { setGeojson(newFeature); setError(undefined) } else if (!error) { setError(`Could not create ${shapeType === EMapShape.polygon ? ***REMOVED***poly***REMOVED*** : ***REMOVED***path***REMOVED***}.`) }
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
                                          ? ***REMOVED***bg-white hover:bg-gray-50 ring-2 ring-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.5)]***REMOVED***
                                          : ***REMOVED***bg-gray-100 hover:bg-gray-50***REMOVED***
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
                                         ? ***REMOVED***bg-white hover:bg-gray-50 ring-2 ring-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.5)]***REMOVED***
                                         : ***REMOVED***bg-gray-100 hover:bg-gray-50***REMOVED***
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
                                           ? ***REMOVED***bg-white hover:bg-gray-50 ring-2 ring-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.5)]***REMOVED***
                                           : ***REMOVED***bg-gray-100 hover:bg-gray-50***REMOVED***
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
                        <TextArea error={error} className=***REMOVED***min-h-[100px] bg-slate-50 rounded-lg shadow-inner font-mono text-sm***REMOVED*** id={`${field.id}-coordinates`} testId={`${field.id}-coordinates`} value={coordinates} onChange={handleCoordinatesChange} placeholder={***REMOVED***...***REMOVED***} aria-label="Coordinates Input" />
                        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
                    </div>
                )}

                 {/* Debug Output (Optional) */}
                 {showGeoJSONInput && <TextArea error={error} className=***REMOVED***...***REMOVED*** id={field.id + ***REMOVED***-debug***REMOVED***} testId={field.id + ***REMOVED***-debug***REMOVED***} label={<FieldLabel {...field} label="Debug GeoJSON Feature State"/>} value={JSON.stringify(value, null, 2)} />}
            </div>
        </div>
  )
}

export default GeometryInput
