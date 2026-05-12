import { GeometryInput } from '@/Form/Components/Inputs'
import { IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { ILayerProps, IMap } from '@axdspub/axiom-maps'
import { Checkbox } from '@axdspub/axiom-ui-utilities'
import { ReactElement, useEffect, useState } from 'react'

const availableLayers = [
  {
    id: 'NWGOA_combined_mask_land_only',
    label: 'NWGOA Land Mask (Fraction of Time Dry)',
    isBaseLayer: false,
    url: 'https://ncwms-ptt-masks.srv.axds.co/wms',
    type: 'wms',
    zIndex: 12,
    params: {
      layers: 'NWGOA/combined_mask_land_only',
      styles: 'boxfill/cmocean-amp-rgb',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
    },
  },
  {
    id: 'NWGOA_h_water_50',
    label: 'NWGOA Bathymetry (50% Time Dry Mask)',
    isBaseLayer: false,
    url: 'https://ncwms-ptt-masks.srv.axds.co/wms',
    type: 'wms',
    zIndex: 10,
    params: {
      layers: 'NWGOA/h_water_50',
      styles: 'boxfill/cmocean-deep-rgb',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      colorscalerange: '0,300',
    },
  },
]

const CustomGeomInput = (props: IFieldInputProps): ReactElement => {
  const [map, setMap] = useState<IMap | undefined>(undefined)
  const [activeLayers, setActiveLayers] = useState<string[]>([])
  useEffect(() => {
    if (map !== undefined && availableLayers !== undefined) {
      const layers = Object.fromEntries(activeLayers.map((id) => [id, true])) as Record<
        string,
        boolean
      >
      const mapLayers = map.layers ?? ([] as ILayerProps[])
      const availableLayersMap = Object.fromEntries(availableLayers.map((l) => [l.id, l]))

      mapLayers.forEach((l) => {
        if (layers[l.id] === undefined && availableLayersMap[l.id]) {
          map.removeLayer(l.id)
        }
      })
      Object.keys(layers).forEach((k) => {
        const layer = availableLayersMap[k]
        if (layer !== undefined && !map.hasLayer(k)) {
          map.addLayer({
            ...(layer as ILayerProps),
          })
        }
      })
    }
  }, [activeLayers, availableLayers])
  return (
    <GeometryInput
      {...props}
      mapLoadedCallback={(e) => {
        setMap(e?.data?.map)
      }}
      MapOverLay={
        <div className="bg-white absolute top-4 left-4 rounded p-4 flex flex-col min-w-50 z-10 shadow pointer-events-auto">
          {availableLayers.map((layer) => (
            <Checkbox
              key={layer.id}
              id={layer.id}
              testId={layer.id}
              value={activeLayers.includes(layer.id)}
              label={layer.label}
              onChange={() => {
                if (map !== undefined) {
                  if (!activeLayers.includes(layer.id)) {
                    setActiveLayers(activeLayers.concat([layer.id]).slice())
                  } else {
                    setActiveLayers(activeLayers.filter((l) => l !== layer.id))
                  }
                }
              }}
            />
          ))}
        </div>
      }
    />
  )
}

export default CustomGeomInput
