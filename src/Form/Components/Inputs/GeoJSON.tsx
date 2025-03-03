import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { AxiomOpenLayersMap, EMapShape } from ***REMOVED***@axdspub/axiom-maps***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const GeoJSONInput = ({ field, onChange, value }: IFieldInputProps): ReactElement => {
  const MAP_CONFIG = {
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
    center: { lat: 61.2181, lon: -149.9003 },
    zoom: 8,
    layers: [
      // {
      //   id: ***REMOVED***ghrsst_temperature***REMOVED***,
      //   type: ***REMOVED***wms***REMOVED***,
      //   label: ***REMOVED***GHRSST Temperature***REMOVED***,
      //   zIndex: 5,
      //   isBaseLayer: false,
      //   url: ***REMOVED***https://mur2.ncwms.axds.co/wms***REMOVED***,
      //   params: {
      //     layers: ***REMOVED***MUR2/analysed_sst***REMOVED***,
      //     styles: ***REMOVED***boxfill/matplotlib-magma***REMOVED***,
      //     format: ***REMOVED***image/png***REMOVED***,
      //     transparent: true
      //   }
      // }
    ],
    tools: {
      draw: {
        shape: EMapShape.polygon,
        enabled: true
      }
    }
  }

  const [error, setError] = useState<string | undefined>(undefined)
  const initialValue = value !== undefined ? value : ***REMOVED******REMOVED***
  const getValue = (): string => {
    return initialValue !== undefined && initialValue !== null
      ? typeof initialValue === ***REMOVED***object***REMOVED***
        ? JSON.stringify(initialValue, null, 2)
        : String(initialValue)
      : ***REMOVED******REMOVED***
  }
  return <div>
      <AxiomOpenLayersMap {...MAP_CONFIG} />
      <TextArea
        error={error}
        className={
            [
              ***REMOVED***min-h-[500px] bg-slate-50 rounded-lg shadow-inner***REMOVED***
              // ***REMOVED***p-0 bg-[repeating-linear-gradient(to_bottom,var(--tw-gradient-stops))] from-[#efefef] from-[length:0_25px] to-[#FFF] to-[length:25px_50px]***REMOVED***
            ].join(***REMOVED*** ***REMOVED***)
        }
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
        }} /></div>
}

export default GeoJSONInput
