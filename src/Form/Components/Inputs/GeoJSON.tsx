import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import { AxiomOpenLayersMap, EMapShape, type IMapDrawEvent, type IMap } from '@axdspub/axiom-maps'
import { type GeoJSON } from 'geojson'
import React, { useEffect, useState, type ReactElement } from 'react'

const GeoJSONInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const MAP_CONFIG = {
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
    layers: [],
    tools: {
      draw: {
        shape: EMapShape.polygon,
        enabled: true
      }
    }
  }

  const [map, setMapState] = useState<IMap | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [geojson, setGeojson] = useState<GeoJSON | undefined>(undefined)
  const getValue = (): string => {
    return geojson !== undefined && geojson !== null
      ? typeof geojson === 'object'
        ? JSON.stringify(geojson, null, 2)
        : String(geojson)
      : ''
  }

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

  return <div>
      <AxiomOpenLayersMap {...MAP_CONFIG} setState={setMapState} />
      <TextArea
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
        }} /></div>
}

export default GeoJSONInput
