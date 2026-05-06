import { Button, TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import {
  type IGeometryField,
  type IFieldInputProps,
  type IFormField,
  type IValueType,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED*** // Added IFormField explicitly
import { useFormValue } from ***REMOVED***@/utils/formEngine/hooks***REMOVED***

import {
  EMapShape,
  type IMap,
  type IMapDrawEvent,
  type IStyleableMapProps,
} from ***REMOVED***@axdspub/axiom-maps***REMOVED***
import { MapLoader } from ***REMOVED***@axdspub/axiom-maps***REMOVED***
// Import Geometry type if not already done
import { type Feature, type GeoJSON, type Geometry } from ***REMOVED***geojson***REMOVED***
import React, { useEffect, useState, type ReactElement, useCallback } from ***REMOVED***react***REMOVED*** // Added useCallback
import { TrashIcon, SquareIcon, BorderSolidIcon, DrawingPinFilledIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import isEqual from ***REMOVED***lodash-es/isEqual***REMOVED***

/*
List of coordinates for testing. Around Anchorage.
...
*/

// --- calculateCenterFromGeoJSON remains the same (zoom ignored for initial load) ---
const calculateCenterFromGeoJSON = (
  geo: GeoJSON | undefined,
  defaultCenter?: { lat: number; lon: number; zoom: number }
): { lat: number; lon: number; zoom: number } => {
  // If default center is provided, use it
  if (defaultCenter) {
    return defaultCenter
  }

  // If input is Geometry, wrap it temporarily for calculation
  let featureCollection: GeoJSON.FeatureCollection | undefined
  if (geo && geo.type !== ***REMOVED***FeatureCollection***REMOVED***) {
    if (geo.type === ***REMOVED***Feature***REMOVED***) {
      featureCollection = { type: ***REMOVED***FeatureCollection***REMOVED***, features: [geo] }
    } else if (
      geo.type === ***REMOVED***Point***REMOVED*** ||
      geo.type === ***REMOVED***LineString***REMOVED*** ||
      geo.type === ***REMOVED***Polygon***REMOVED*** /* add others as needed */
    ) {
      featureCollection = {
        type: ***REMOVED***FeatureCollection***REMOVED***,
        features: [{ type: ***REMOVED***Feature***REMOVED***, properties: {}, geometry: geo as Geometry }],
      }
    }
  } else if (geo && geo.type === ***REMOVED***FeatureCollection***REMOVED***) {
    featureCollection = geo
  }

  // Default to Anchorage if no valid GeoJSON
  const DEFAULT_CENTER = { lat: 61.2181, lon: -149.9003, zoom: 8 }

  if (
    !featureCollection ||
    !(***REMOVED***features***REMOVED*** in featureCollection) ||
    !Array.isArray(featureCollection.features) ||
    featureCollection.features.length === 0
  ) {
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
  const flatCoordinates = ([] as GeoJSON.Position[]).concat(...(coordinates as any))

  if (
    !Array.isArray(flatCoordinates) ||
    flatCoordinates.length === 0 ||
    !Array.isArray(flatCoordinates[0])
  ) {
    // Handle single point case where flatCoordinates might be just [lon, lat]
    if (
      Array.isArray(flatCoordinates) &&
      flatCoordinates.length === 2 &&
      typeof flatCoordinates[0] === ***REMOVED***number***REMOVED***
    ) {
      const [lon, lat] = flatCoordinates as unknown as GeoJSON.Position
      // FIX #2: Return a default zoom even for a point here for centering logic,
      // but we won***REMOVED***t use this zoom for the initial MAP_CONFIG.
      return { lat, lon, zoom: 8 } // Default zoom
    }
    console.warn(***REMOVED***Could not determine coordinates for centering.***REMOVED***)
    return DEFAULT_CENTER
  }

  // Calculate bounds
  let minLat = Infinity
  let maxLat = -Infinity
  let minLon = Infinity
  let maxLon = -Infinity
  let sumLat = 0
  let sumLon = 0
  let count = 0

  flatCoordinates.forEach((coord: GeoJSON.Position) => {
    if (!Array.isArray(coord) || coord.length < 2) return
    const [lon, lat] = coord
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
    minLon = Math.min(minLon, lon)
    maxLon = Math.max(maxLon, lon)
    sumLat += lat
    sumLon += lon
    count++
  })

  if (count === 0) {
    return DEFAULT_CENTER
  }

  const centerLat = sumLat / count
  const centerLon = sumLon / count
  const latDiff = maxLat - minLat
  const lonDiff = maxLon - minLon
  const maxDiff = Math.max(latDiff, lonDiff)

  let zoom = 8 // default zoom
  if (count === 1 || maxDiff === 0) zoom = 12
  else if (maxDiff < 0.1) zoom = 12
  else if (maxDiff < 0.5) zoom = 10
  else if (maxDiff < 1) zoom = 9
  else if (maxDiff < 2) zoom = 8
  else if (maxDiff < 5) zoom = 7
  else zoom = 6

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

/**
 * Parse enabled shape types from an external form field value.
 * Supports comma-separated string or array of shape type names.
 * @param fieldValue - Value from the external form field
 * @returns Object with point, linestring, polygon booleans
 */
const parseEnabledShapesFromField = (
  fieldValue: IValueType | IValueType[]
): { point: boolean; linestring: boolean; polygon: boolean } => {
  const result = { point: false, linestring: false, polygon: false }
  if (!fieldValue) return result

  let shapesArray: string[] = []
  if (typeof fieldValue === ***REMOVED***string***REMOVED***) {
    shapesArray = fieldValue
      .split(***REMOVED***,***REMOVED***)
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s)
  } else if (Array.isArray(fieldValue)) {
    shapesArray = fieldValue.map((s) => String(s).toLowerCase())
  }

  shapesArray.forEach((shape) => {
    if (shape === ***REMOVED***point***REMOVED***) result.point = true
    if (shape === ***REMOVED***linestring***REMOVED*** || shape === ***REMOVED***line***REMOVED*** || shape === ***REMOVED***path***REMOVED***) result.linestring = true
    if (shape === ***REMOVED***polygon***REMOVED*** || shape === ***REMOVED***poly***REMOVED***) result.polygon = true
  })

  return result
}

/**
 * Merge enabled shapes from static settings and external field.
 * Static settings take precedence if explicitly set.
 * @param settings - Field settings
 * @param enabledFromField - Enabled shapes parsed from external field
 * @returns Merged enabled shapes
 */
const mergeEnabledShapes = (
  settings: ReturnType<() => IGeometryField[***REMOVED***settings***REMOVED***]>,
  enabledFromField: ReturnType<typeof parseEnabledShapesFromField>
): { point: boolean; linestring: boolean; polygon: boolean } => {
  const drawEnabled = settings?.drawEnabled !== false
  if (!drawEnabled) return { point: false, linestring: false, polygon: false }

  return {
    point:
      settings?.drawPointEnabled === true ||
      (settings?.drawPointEnabled !== false && enabledFromField.point),
    linestring:
      settings?.drawPathEnabled === true ||
      (settings?.drawPathEnabled !== false && enabledFromField.linestring),
    polygon:
      settings?.drawPolygonEnabled === true ||
      (settings?.drawPolygonEnabled !== false && enabledFromField.polygon),
  }
}

/**
 * Validate LineString point count against maxLineStringPoints setting.
 * @param points - Array of [lon, lat] coordinates
 * @param maxPoints - Maximum allowed points (undefined = no limit)
 * @returns Error message if invalid, undefined if valid
 */
const validateLineStringPoints = (points: number[][], maxPoints?: number): string | undefined => {
  if (!maxPoints || points.length <= maxPoints) return undefined
  return `LineString exceeds maximum of ${maxPoints} points (provided: ${points.length})`
}

/**
 * Clamp a LineString Feature to at most maxPoints coordinates.
 * Non-LineString features are returned unchanged.
 * @param feature - The GeoJSON Feature to check
 * @param maxPoints - Maximum allowed points (undefined = no limit)
 * @returns The (possibly truncated) feature and an error message if truncation occurred
 */
export const applyMaxPointsToFeature = (
  feature: Feature,
  maxPoints?: number
): { feature: Feature; limitError?: string } => {
  if (
    !maxPoints ||
    feature.geometry?.type !== ***REMOVED***LineString***REMOVED*** ||
    feature.geometry.coordinates.length <= maxPoints
  ) {
    return { feature }
  }
  const truncated: Feature = {
    ...feature,
    geometry: {
      type: ***REMOVED***LineString***REMOVED***,
      coordinates: (feature.geometry as GeoJSON.LineString).coordinates.slice(0, maxPoints),
    },
  }
  return { feature: truncated, limitError: `LineString limited to ${maxPoints} points` }
}

export const GeometryInput = ({
  field,
  onChange,
  value,
  disabled,
}: IFieldInputProps): ReactElement => {
  const [map, setMapState] = useState<IMap | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [showGeoJSONInput] = useState<boolean>(false)

  const convertToGeoJSON = (geo: IValueType): Feature | undefined => {
    if (
      geo &&
      typeof geo === ***REMOVED***object***REMOVED*** &&
      ***REMOVED***type***REMOVED*** in geo &&
      geo.type !== ***REMOVED***FeatureCollection***REMOVED*** &&
      geo.type !== ***REMOVED***Feature***REMOVED***
    ) {
      return { type: ***REMOVED***Feature***REMOVED***, properties: {}, geometry: geo as Geometry }
    }
    if (geo && typeof geo === ***REMOVED***object***REMOVED*** && ***REMOVED***type***REMOVED*** in geo && geo.type === ***REMOVED***Feature***REMOVED***) {
      return geo as Feature
    }
    return undefined
  }

  const geomField = field as IGeometryField

  // Always call useFormValue unconditionally (Rules of Hooks forbid conditional calls).
  // When enabledShapesField is not configured, the empty path returns undefined harmlessly.
  const enabledShapesFieldPath = geomField.settings?.enabledShapesField ?? ***REMOVED******REMOVED***
  const externalEnabledShapesRaw = useFormValue(enabledShapesFieldPath)
  const externalEnabledShapes = geomField.settings?.enabledShapesField
    ? parseEnabledShapesFromField(externalEnabledShapesRaw)
    : { point: false, linestring: false, polygon: false }

  // Merge external field selection with static settings (static takes precedence)
  const enabledShapes = mergeEnabledShapes(geomField.settings, externalEnabledShapes)

  const drawEnabled = geomField.settings?.drawEnabled !== false
  const drawPointEnabled = enabledShapes.point
  const drawPathEnabled = enabledShapes.linestring
  const drawPolygonEnabled = enabledShapes.polygon
  const showCoordinateInput = geomField.settings?.showCoordinateInput !== false

  /** Filter a converted Feature to only those geometry types enabled for this field. */
  const filterCompatibleGeometry = (feature: Feature | undefined): Feature | undefined => {
    if (!feature?.geometry) return undefined
    if (feature.geometry.type === ***REMOVED***Point***REMOVED*** && !drawPointEnabled) return undefined
    if (feature.geometry.type === ***REMOVED***LineString***REMOVED*** && !drawPathEnabled) return undefined
    if (feature.geometry.type === ***REMOVED***Polygon***REMOVED*** && !drawPolygonEnabled) return undefined
    return feature
  }

  const initialGeoJSON = convertToGeoJSON(value)
  const initialGeoJSONValue = filterCompatibleGeometry(initialGeoJSON)

  const [geojson, setGeojson] = useState<Feature | undefined>(initialGeoJSONValue)

  useEffect(() => {
    // Apply the same compatibility filter as initialGeoJSONValue so that an
    // incompatible geometry in formValues (e.g. a Point left by the destPath
    // collision when shape_type changes) does not get loaded into this field***REMOVED***s
    // local state and trigger a spurious onChange → setFormValues cycle.
    const nextGeojson = filterCompatibleGeometry(convertToGeoJSON(value))
    if (!isEqual(geojson, nextGeojson)) {
      setGeojson(nextGeojson)
    }
  }, [value, drawPointEnabled, drawPathEnabled, drawPolygonEnabled])

  const [currentDrawType, setCurrentDrawType] = useState<EMapShape>(() => getInitialDrawType(field))
  const [isDrawing, setIsDrawing] = useState<boolean>(!geojson && drawEnabled)

  const initialMapCenter = calculateCenterFromGeoJSON(geojson, geomField.settings?.defaultCenter)

  const MAP_CONFIG: IStyleableMapProps = {
    baseLayerKey: ***REMOVED***hybrid***REMOVED***,
    height: geomField.settings?.height ?? ***REMOVED***500px***REMOVED***,
    width: ***REMOVED***100%***REMOVED***,
    style: {
      /* ... styles ... */
    },
    center: { lat: initialMapCenter.lat, lon: initialMapCenter.lon },
    zoom: initialMapCenter.zoom,
    tools: {
      draw: {
        shape: currentDrawType,
        enabled: drawEnabled && (drawPolygonEnabled || drawPathEnabled || drawPointEnabled),
      },
    },
  }

  // ---- Coordinate Handling ----
  const updateCoordinatesFromFeature = useCallback((feature: Feature | undefined): void => {
    if (!feature?.geometry) {
      setCoordinates(***REMOVED******REMOVED***)
      return
    }
    const geometry = feature.geometry
    let newCoords = ***REMOVED******REMOVED***
    try {
      if (geometry.type === ***REMOVED***Polygon***REMOVED***) {
        newCoords = (geometry.coordinates[0] ?? []).map((pos) => `${pos[1]}, ${pos[0]}`).join(***REMOVED***\n***REMOVED***)
      } else if (geometry.type === ***REMOVED***LineString***REMOVED***) {
        newCoords = (geometry.coordinates ?? []).map((pos) => `${pos[1]}, ${pos[0]}`).join(***REMOVED***\n***REMOVED***)
      } else if (geometry.type === ***REMOVED***Point***REMOVED***) {
        const coords = geometry.coordinates ?? [NaN, NaN]
        if (!isNaN(coords[0]) && !isNaN(coords[1])) {
          newCoords = `${coords[1]}, ${coords[0]}`
        } else {
          newCoords = ***REMOVED******REMOVED***
        }
      }
    } catch (e) {
      console.error(***REMOVED***Err format coords:***REMOVED***, e)
      newCoords = ***REMOVED******REMOVED***
    }
    setCoordinates(newCoords)
    // setShowShapeTypeButtons(shouldShowShapeButtons(newCoords)); // Let coordinate effect handle this
  }, [])

  const [coordinates, setCoordinates] = useState<string>(() => {
    if (!geojson?.geometry) return ***REMOVED******REMOVED***
    let initCoords = ***REMOVED******REMOVED***
    const geometry = geojson.geometry
    try {
      if (geometry.type === ***REMOVED***Polygon***REMOVED***) {
        initCoords = (geometry.coordinates[0] ?? []).map((pos) => `${pos[1]}, ${pos[0]}`).join(***REMOVED***\n***REMOVED***)
      } else if (geometry.type === ***REMOVED***LineString***REMOVED***) {
        initCoords = (geometry.coordinates ?? []).map((pos) => `${pos[1]}, ${pos[0]}`).join(***REMOVED***\n***REMOVED***)
      } else if (geometry.type === ***REMOVED***Point***REMOVED***) {
        const coords = geometry.coordinates ?? [NaN, NaN]
        if (!isNaN(coords[0]) && !isNaN(coords[1])) {
          initCoords = `${coords[1]}, ${coords[0]}`
        }
      }
    } catch (e) {
      console.error(***REMOVED***Err init coords:***REMOVED***, e)
      initCoords = ***REMOVED******REMOVED***
    }
    return initCoords
  })

  useEffect(() => {
    updateCoordinatesFromFeature(geojson)
  }, [geojson, updateCoordinatesFromFeature])

  const createGeoJSONFromCoordinates = (
    coordString: string,
    forceType?: EMapShape
  ): Feature | undefined => {
    if (!coordString.trim()) {
      setError(undefined)
      return undefined
    }
    try {
      const points = coordString
        .split(***REMOVED***\n***REMOVED***)
        .map((l) => l.trim())
        .filter((l) => l)
        .map((l) => {
          const [lat, lon] = l.split(***REMOVED***,***REMOVED***).map((c) => parseFloat(c.trim()))
          if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180)
            throw Error(`Invalid: ${lat}, ${lon}`)
          return [lon, lat]
        })
      if (points.length === 0) throw Error(***REMOVED***No valid coords***REMOVED***)
      if (points.length === 1 && drawPointEnabled)
        return {
          type: ***REMOVED***Feature***REMOVED***,
          properties: {},
          geometry: { type: ***REMOVED***Point***REMOVED***, coordinates: points[0] },
        }
      if (
        (forceType === EMapShape.polygon || (!forceType && points.length >= 3)) &&
        drawPolygonEnabled
      ) {
        if (
          points.length > 0 &&
          JSON.stringify(points[0]) !== JSON.stringify(points[points.length - 1])
        )
          points.push(points[0])
        if (points.length < 4) throw Error(***REMOVED***Min 3 unique coords for polygon***REMOVED***)
        return {
          type: ***REMOVED***Feature***REMOVED***,
          properties: {},
          geometry: { type: ***REMOVED***Polygon***REMOVED***, coordinates: [points] },
        }
      }
      if (
        (forceType === EMapShape.linestring || (!forceType && points.length >= 2)) &&
        drawPathEnabled
      ) {
        if (points.length < 2) throw Error(***REMOVED***Min 2 coords for path***REMOVED***)
        const maxPoints = geomField.settings?.maxLineStringPoints
        const pointValidationError = validateLineStringPoints(points, maxPoints)
        if (pointValidationError) throw Error(pointValidationError)
        return {
          type: ***REMOVED***Feature***REMOVED***,
          properties: {},
          geometry: { type: ***REMOVED***LineString***REMOVED***, coordinates: points },
        }
      }
      setError(***REMOVED***Cannot create shape. Check tools/coords.***REMOVED***)
      return undefined
    } catch (e: any) {
      setError(`Invalid coords/count: ${e.message}. Use "lat, lon"`)
      return undefined
    }
  }

  const shouldShowShapeButtons = (coords: string): boolean => {
    /* ... same as last working version ... */
    const validLinesCount = coords
      .trim()
      .split(***REMOVED***\n***REMOVED***)
      .filter((l) => l.trim()).length
    return (drawPolygonEnabled || drawPathEnabled) && validLinesCount >= 2
  }
  const [showShapeTypeButtons, setShowShapeTypeButtons] = useState<boolean>(() =>
    shouldShowShapeButtons(coordinates)
  )
  useEffect(() => {
    setShowShapeTypeButtons(shouldShowShapeButtons(coordinates))
  }, [coordinates, drawPolygonEnabled, drawPathEnabled]) // Added effect to update buttons

  // ---- Map Event Handlers & State Updates ----
  useEffect(() => {
    // Map event listeners
    if (!map) return
    const maxPoints = geomField.settings?.maxLineStringPoints
    const drawCompleteListener = (e: IMapDrawEvent): void => {
      const f = e.data?.geojson?.features?.[0]
      if (f) {
        const { feature: clamped, limitError } = applyMaxPointsToFeature(f, maxPoints)
        setGeojson(clamped)
        setError(limitError)
        setIsDrawing(false)
        map.disableDraw(currentDrawType)
      }
    }
    const drawUpdateListener = (e: IMapDrawEvent): void => {
      const f = e.data?.geojson?.features?.[0]
      if (f) {
        const { feature: clamped, limitError } = applyMaxPointsToFeature(f, maxPoints)
        setGeojson(clamped)
        if (limitError) {
          // Limit reached mid-draw — stop accepting new points
          setError(limitError)
          map.disableDraw(currentDrawType)
          setIsDrawing(false)
        }
      }
    }
    map.onDrawComplete(drawCompleteListener)
    map.onDrawUpdate(drawUpdateListener)
    // Cleanup omitted
  }, [map, currentDrawType])

  useEffect(() => {
    // Parent onChange trigger
    onChange(geojson?.geometry ?? undefined)
  }, [geojson])

  useEffect(() => {
    // Map drawing/state sync effect
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
  }, [
    map,
    geojson,
    drawEnabled,
    drawPointEnabled,
    drawPathEnabled,
    drawPolygonEnabled,
    currentDrawType,
    field,
  ])

  // ---- Helper Functions ----
  const hasValidShape = (feature?: Feature): boolean => !!feature?.geometry

  const clearShape = (): void => {
    /* ... same ... */
    setGeojson(undefined)
    setCoordinates(***REMOVED******REMOVED***)
    setShowShapeTypeButtons(false)
    if (map && drawEnabled) {
      map.setDrawGeojson({ type: ***REMOVED***FeatureCollection***REMOVED***, features: [] })
      const iType = getInitialDrawType(field)
      setCurrentDrawType(iType)
      map.enableDraw(iType)
      setIsDrawing(true)
    }
  }

  const handleDrawTypeChange = (shapeType: EMapShape): void => {
    /* ... same as minimal fix version ... */
    if (map && drawEnabled) {
      const isAllowed =
        (shapeType === EMapShape.point && drawPointEnabled) ||
        (shapeType === EMapShape.linestring && drawPathEnabled) ||
        (shapeType === EMapShape.polygon && drawPolygonEnabled)
      if (isAllowed && shapeType !== currentDrawType) {
        map.disableDraw(currentDrawType)
        setCurrentDrawType(shapeType)
        map.enableDraw(shapeType)
        setIsDrawing(true)
      }
    }
  }

  const handleCoordinatesChange = (e: string | undefined): void => {
    /* ... same as minimal fix version ... */
    const newCoords = e ?? ***REMOVED******REMOVED***
    setCoordinates(newCoords)
    const pointsCount = newCoords
      .trim()
      .split(***REMOVED***\n***REMOVED***)
      .filter((l) => l.trim()).length
    let intendedType: EMapShape | undefined
    if (pointsCount === 1 && drawPointEnabled) intendedType = EMapShape.point
    else if (pointsCount >= 3 && drawPolygonEnabled) intendedType = EMapShape.polygon
    else if (pointsCount >= 2 && drawPathEnabled) intendedType = EMapShape.linestring
    const newFeature = createGeoJSONFromCoordinates(newCoords, intendedType)
    if (newFeature) {
      setGeojson(newFeature)
      setError(undefined)
      if (map) {
        map.setDrawGeojson({ type: ***REMOVED***FeatureCollection***REMOVED***, features: [] })
        map.setDrawGeojson({ type: ***REMOVED***FeatureCollection***REMOVED***, features: [newFeature] })
        map.disableDraw(currentDrawType)
        setIsDrawing(false)
      }
      //   setShowShapeTypeButtons(shouldShowShapeButtons(newCoords)); // Let effect handle this
    } else {
      if (!newCoords.trim()) {
        setGeojson(undefined)
        if (map && drawEnabled) {
          map.setDrawGeojson({ type: ***REMOVED***FeatureCollection***REMOVED***, features: [] })
          map.enableDraw(currentDrawType)
          setIsDrawing(true)
        }
        setShowShapeTypeButtons(false)
      } else if (!error) {
        setError(***REMOVED***Cannot form valid shape with coords/tools.***REMOVED***)
      }
    }
  }

  const applyShapeType = (shapeType: EMapShape): void => {
    /* ... same ... */
    const newFeature = createGeoJSONFromCoordinates(coordinates, shapeType)
    if (newFeature) {
      setGeojson(newFeature)
      setError(undefined)
    } else if (!error) {
      setError(`Could not create ${shapeType === EMapShape.polygon ? ***REMOVED***poly***REMOVED*** : ***REMOVED***path***REMOVED***}.`)
    }
  }

  // ---- JSX Return (Reverting Button ClassNames and removing disabled) ----
  return (
    <div>
      <FieldLabel field={field} disabled={disabled} value={value} onChange={onChange} />
      <div className="relative z-0">
        {drawEnabled && (drawPolygonEnabled || drawPathEnabled || drawPointEnabled) && (
          <div className="absolute z-20 top-4 right-4 flex flex-col gap-2">
            {/* Point Button - Render only if allowed */}
            {drawPointEnabled && (
              <div className="tooltip-container relative group">
                <Button
                  onClick={() => {
                    handleDrawTypeChange(EMapShape.point)
                  }}
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
                  onClick={() => {
                    handleDrawTypeChange(EMapShape.linestring)
                  }}
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
                  onClick={() => {
                    handleDrawTypeChange(EMapShape.polygon)
                  }}
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
        {disabled && (
          <div className="absolute z-50 bg-white bg-opacity-20 cursor-not-allowed top-0 right-0 left-0 bottom-0"></div>
        )}
        {/* Map Component */}
        <MapLoader {...MAP_CONFIG} setState={setMapState} mapLibraryKey="openlayers" />

        {/* Coordinate Input Section */}
        {showCoordinateInput && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2 flex-wrap gap-y-2">
              <span className="text-sm"> {/* ... label ... */} </span>
              {showShapeTypeButtons && (drawPathEnabled || drawPolygonEnabled) && (
                <div className="flex gap-2">
                  {***REMOVED*** ***REMOVED***}
                  {/* ... Create Path/Polygon buttons ... */}
                  {drawPathEnabled && (
                    <Button
                      onClick={() => {
                        applyShapeType(EMapShape.linestring)
                      }}
                      className="px-3 py-1 bg-white hover:bg-gray-50 text-black rounded-lg shadow-sm border border-gray-200 text-xs flex items-center gap-1"
                    >
                      <BorderSolidIcon className="w-3 h-3" />
                      Create Path
                    </Button>
                  )}
                  {drawPolygonEnabled && (
                    <Button
                      onClick={() => {
                        applyShapeType(EMapShape.polygon)
                      }}
                      className="px-3 py-1 bg-white hover:bg-gray-50 text-black rounded-lg shadow-sm border border-gray-200 text-xs flex items-center gap-1"
                    >
                      <SquareIcon className="w-3 h-3 rotate-45" />
                      Create Polygon
                    </Button>
                  )}
                </div>
              )}
            </div>
            <TextArea
              error={error}
              disabled={disabled}
              className="min-h-[100px] bg-slate-50 rounded-lg shadow-inner font-mono text-sm"
              id={`${field.id}-coordinates`}
              testId={`${field.id}-coordinates`}
              value={coordinates}
              onChange={handleCoordinatesChange}
              placeholder={***REMOVED***...***REMOVED***}
              aria-label="Coordinates Input"
            />
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </div>
        )}

        {/* Debug Output (Optional) */}
        {showGeoJSONInput && (
          <TextArea
            error={error}
            className="..."
            id={field.id + ***REMOVED***-debug***REMOVED***}
            testId={field.id + ***REMOVED***-debug***REMOVED***}
            label={
              <FieldLabel
                field={{ ...field, label: ***REMOVED***Debug GeoJSON Feature State***REMOVED*** }}
                disabled={disabled}
              />
            }
            value={JSON.stringify(value, null, 2)}
          />
        )}
      </div>
    </div>
  )
}

export default GeometryInput
