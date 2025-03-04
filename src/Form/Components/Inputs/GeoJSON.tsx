import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import { AxiomOpenLayersMap, EMapShape, type IMapDrawEvent, type IMap, type IStyleableMapProps } from '@axdspub/axiom-maps'
import { type GeoJSON } from 'geojson'
import React, { useEffect, useState, type ReactElement } from 'react'

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
  const [showGeoJSONInput] = useState<boolean>(true) // For debugging purposes
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
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [points]
        }
      }
    } catch (e) {
      setError('Invalid coordinate format. Use "lat, lon" format, one per line')
      return undefined
    }
  }

  // Reload shape on the map
  useEffect(() => {
    if (map === undefined) return
    map.removeLayer('geojson-layer')

    if ((value as any).features === undefined) return

    map.addLayer({
      id: 'geojson-layer',
      type: 'geoJson' as const,
      label: 'GeoJSON Layer',
      zIndex: 20,
      isBaseLayer: false,
      options: {
        geoJson: (value as any).features.map((feature: any) => ({
          ...feature,
          properties: {
            ...feature.properties,
            color: 'rgba(255,255,255,.2)',
            stroke: 'orange',
            'stroke-width': 2
          }
        }))
      }
    })
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
    } else {
      setGeojson(undefined)
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
