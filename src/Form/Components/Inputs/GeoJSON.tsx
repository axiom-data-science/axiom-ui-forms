import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps } from '@/Form/FormCreatorTypes'
import { TextArea } from '@axdspub/axiom-ui-utilities'
import { AxiomLeafletMap } from '@axdspub/axiom-maps'
import React, { useState, type ReactElement } from 'react'

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
    layers: [
      // {
      //   id: 'ghrsst_temperature',
      //   type: 'wms',
      //   label: 'GHRSST Temperature',
      //   zIndex: 5,
      //   isBaseLayer: false,
      //   url: 'https://mur2.ncwms.axds.co/wms',
      //   params: {
      //     layers: 'MUR2/analysed_sst',
      //     styles: 'boxfill/matplotlib-magma',
      //     format: 'image/png',
      //     transparent: true
      //   }
      // }
    ]
  }

  const [error, setError] = useState<string | undefined>(undefined)
  const initialValue = value !== undefined ? value : ''
  const getValue = (): string => {
    return initialValue !== undefined && initialValue !== null
      ? typeof initialValue === 'object'
        ? JSON.stringify(initialValue, null, 2)
        : String(initialValue)
      : ''
  }
  return <div>
      <AxiomLeafletMap {...MAP_CONFIG} />
      <TextArea
        error={error}
        className={
            [
              'min-h-[500px] bg-slate-50 rounded-lg shadow-inner'
              // 'p-0 bg-[repeating-linear-gradient(to_bottom,var(--tw-gradient-stops))] from-[#efefef] from-[length:0_25px] to-[#FFF] to-[length:25px_50px]'
            ].join(' ')
        }
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
