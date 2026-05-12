import { GeometryInput } from ***REMOVED***@/Form/Components/Inputs***REMOVED***
import { IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { ILayerProps, IMap } from ***REMOVED***@axdspub/axiom-maps***REMOVED***
import { Checkbox } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { ReactElement, useEffect, useState } from ***REMOVED***react***REMOVED***

const availableLayers = [
  {
    id: ***REMOVED***NWGOA_combined_mask_land_only***REMOVED***,
    label: ***REMOVED***NWGOA Land Mask (Fraction of Time Dry)***REMOVED***,
    isBaseLayer: false,
    url: ***REMOVED***https://ncwms-ptt-masks.srv.axds.co/wms***REMOVED***,
    type: ***REMOVED***wms***REMOVED***,
    zIndex: 12,
    params: {
      layers: ***REMOVED***NWGOA/combined_mask_land_only***REMOVED***,
      styles: ***REMOVED***boxfill/cmocean-amp-rgb***REMOVED***,
      format: ***REMOVED***image/png***REMOVED***,
      transparent: true,
      version: ***REMOVED***1.1.1***REMOVED***,
    },
  },
  {
    id: ***REMOVED***NWGOA_h_water_50***REMOVED***,
    label: ***REMOVED***NWGOA Bathymetry (50% Time Dry Mask)***REMOVED***,
    isBaseLayer: false,
    url: ***REMOVED***https://ncwms-ptt-masks.srv.axds.co/wms***REMOVED***,
    type: ***REMOVED***wms***REMOVED***,
    zIndex: 10,
    params: {
      layers: ***REMOVED***NWGOA/h_water_50***REMOVED***,
      styles: ***REMOVED***boxfill/cmocean-deep-rgb***REMOVED***,
      format: ***REMOVED***image/png***REMOVED***,
      transparent: true,
      version: ***REMOVED***1.1.1***REMOVED***,
      colorscalerange: ***REMOVED***0,300***REMOVED***,
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
