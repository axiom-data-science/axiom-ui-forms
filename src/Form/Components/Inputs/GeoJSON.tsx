import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import { AxiomOpenLayersMap, EMapShape, type IMapDrawEvent, type IMap, type IStyleableMapProps } from '@axdspub/axiom-maps'
import { type GeoJSON } from 'geojson'
import React, { useEffect, useState, type ReactElement } from 'react'

/*
61.44480592425796, -150.3785489314675
61.26059021199541, -150.7356022485971
61.05235501381105, -150.61435734866856
61.06014246374005, -149.9221328461051
61.441517540302925, -149.16102284579276
61.44480592425796, -150.3785489314675
*/

const GeoJSONInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  console.log('INITIAL VALUE', value)
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
  const [showGeoJSONInput] = useState<boolean>(false) // For debugging purposes
  const [coordinates, setCoordinates] = useState<string>('')

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

  // Reload shape on the map
  useEffect(() => {
    if (map === undefined) return
    map.enableDraw(EMapShape.polygon)

    if (geojson !== undefined && 'features' in geojson) {
      map.setDrawGeojson(geojson)
    }
  }, [map])

  useEffect(() => {
    if (map === undefined) return

    map.onDrawComplete((e: IMapDrawEvent) => {
      console.log('draw complete', e)
      setGeojson(e.data?.geojson)
    })

    // On modify drawing
    map.onDrawUpdate((e: IMapDrawEvent) => {
      console.log('draw update', e)
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
      if (map) {
        map.setDrawGeojson({
          type: 'FeatureCollection',
          features: []
        })
      }
    }
  }

  return <div>
      <AxiomOpenLayersMap {...MAP_CONFIG} setState={setMapState} />
      <div className="mt-4">
        <TextArea
          error={error}
          className='min-h-[100px] bg-slate-50 rounded-lg shadow-inner'
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
