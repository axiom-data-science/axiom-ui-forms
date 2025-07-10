import { type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'

const fieldOverrides: IFormFieldOverride[] = [
  {
    prop: 'ocean_model',
    label: 'Ocean Model',
    description: `

    Operational Cook Inlet Model (CIOFSOP): 

  The operational Cook Inlet model is operationally run with a 48 forecast time period with saved model output available starting August 31, 2021, run in Cook Inlet, Alaska. The horizontal grid has resolution ranging from 10 meters in the estuaries to 3.5 kilometers in the deeper offshore waters and uses 30 sigma layers that follow the bathymetric terrain. Freshwater forcing is from river inputs using discharge observations from 12 major rivers supplied by the USGS. For more model details, see the [CIOFS website](https://tidesandcurrents.noaa.gov/ofs/ciofs/ciofs_info.html) and [development report](https://espis.boem.gov/Technical%20Summaries/5560.pdf).

    Hindcast Cook Inlet Model (CIOFS):

The hindcast Cook Inlet model was run from January 1999 through December 2022, in Cook Inlet, Alaska. The horizontal grid has resolution ranging from 10 meters in the estuaries to 3.5 kilometers in the deeper offshore waters and uses 30 sigma layers that follow the bathymetric terrain. Freshwater forcing is from river inputs using discharge observations from 12 major rivers supplied by the USGS. For more model details and performance, see [report](https://ciofs.axds.co/).

    Hindcast Northwest Gulf of Alaska Model (NWGOA): 
The hindcast Northwest Gulf of Alaska model was run from January 1999 through December 2008, in the northwest Gulf of Alaska and covering Cook Inlet. It has a horizontal resolution of approximately 1.5 km with 50 vertical layers that follow the bathymetric terrain. Freshwater forcing is from a watershed model. For more model details and performance, see [report](https://www.govinfo.gov/content/pkg/GOVPUB-I-48b50b5dc536ac94c0275ac7d0445ebf/pdf/GOVPUB-I-48b50b5dc536ac94c0275ac7d0445ebf.pdf) or [publication](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2019JC015724).`,

    options: [
      {
        label: 'Operational Cook Inlet Model (CIOFSOP)',
        value: 'CIOFSOP'
      },
      {
        label: 'Hindcast Cook Inlet Model (CIOFS)',
        value: 'CIOFS'
      },
      {
        label: 'Hindcast Northwest Gulf of Alaska Model (NWGOA)',
        value: 'NWGOA'
      }
    ],
    settings: {
      descriptionPresentation: 'tooltip'
    }
  },
  {
    prop: 'time_step',
    constraints: {
      // min: 0,
      max: 3600
    },
    settings: {
      step: 60
    }
  },
  {
    prop: 'time_step_output',
    description: 'Time step at which element properties are written to file, in seconds. This must be larger than the calculation time step, and be an integer multiple of time step.',
    settings: {
      step: 1
    }
  },
  {
    prop: 'seed_seafloor',
    description: 'If checked, particles will be seeded at the seafloor and Initial depth is not used.'
  },
  {
    prop: 'z',
    label: 'Initial depth for particles',
    description: 'Depth below sea level (in meters) where elements are released. Input 0 for the surface.',
    constraints: {
      min: 0,
      max: 5000
    },
    conditions: {
      dependsOn: 'seed_seafloor',
      value: false
    }
  },
  {
    prop: 'number',
    label: 'Number of particles',
    constraints: {
      min: 1,
      max: 10000
    },
    defaultValue: 1000
  },
  {
    prop: 'radius',
    constraints: {
      min: 0,
      max: 1000000
    },
    description: 'Radius in meters around each lon-lat pair, within which particles will be seeded according to Initial particle distribution.',
    defaultValue: 1000,
    conditions: {
      dependsOn: 'shape_type',
      value: 'point'
    }
  },
  {
    prop: 'shape_type',
    label: 'Shape',
    type: 'select',
    defaultValue: 'point',
    options: [
      {
        label: 'Point',
        value: 'point'
      },
      {
        label: 'Polygon',
        value: 'polygon'
      },
      {
        label: 'Line',
        value: 'linestring'
      },
      {
        label: 'Shapefile',
        value: 'shapefile'
      }
    ],
    settings: {
      allowNull: false
    }
  },
  {
    prop: 'point',
    destPath: 'geojson',
    type: 'geometry',
    label: null,
    description: 'Select a point on the map.',
    settings: {
      drawPointEnabled: true,
      showCoordinateInput: false
    },
    conditions: {
      dependsOn: 'shape_type',
      value: 'point'
    }
  },
  {
    prop: 'polygon',
    destPath: 'geojson',
    type: 'geometry',
    label: null,
    description: 'Draw a polygon on the map.',
    settings: {
      drawPolygonEnabled: true,
      showCoordinateInput: false
    },
    conditions: {
      dependsOn: 'shape_type',
      value: 'polygon'
    }
  },
  {
    prop: 'linestring',
    destPath: 'geojson',
    type: 'geometry',
    label: null,
    description: 'Draw a line on the map.',
    settings: {
      drawPathEnabled: true,
      showCoordinateInput: false
    },
    conditions: {
      dependsOn: 'shape_type',
      value: 'linestring'
    }
  },
  {
    prop: 'shapefile',
    label: null,
    description: 'Upload a shapefile to use as the shape',
    conditions: {
      dependsOn: 'shape_type',
      value: 'shapefile'
    }
  },
  {
    prop: 'do3D',
    label: '3D Simulation',
    description: 'If box is checked, run in three-dimensions instead of two.'
  },
  {
    prop: 'vertical_mixing_options',
    skip_path: true,
    type: 'object',
    conditions: {
      dependsOn: 'vertical_mixing',
      value: true
    },
    fields: [
      {
        prop: 'mixed_layer_depth'
      },
      {
        prop: 'vertical_mixing_timestep'
      },
      {
        prop: 'diffusivitymodel'
      }
    ]
  },
  {
    prop: 'mixed_layer_depth',
    description: 'Controls how deep the vertical diffusivity profile reaches, in meters.',
    constraints: {
      min: 0,
      max: 200
    }
  },
  {
    prop: 'vertical_mixing_timestep',
    description: 'Time step in seconds used for calculating vertical mixing model. Set this smaller to increase frequency of vertical mixing calculation; number of loops is calculated as the overall time step divided by this vertical mixing timestep so this must be smaller than the overall time step.',
    settings: {
      step: 10
    }
  },
  {
    prop: 'diffusivitymodel',
    label: 'Vertical mixing model',
    description: 'Controls how deep the vertical mixing or diffusivity profile reaches, in meters. The available models use the model winds to parameterize the vertical diffusivity profile. References: [Large 1994](https://agupubs.onlinelibrary.wiley.com/doi/abs/10.1029/94rg01872), [Sundby 1983](https://www.sciencedirect.com/science/article/abs/pii/0198014983900420)',
    options: [
      {
        label: 'Large 1994',
        value: 'windspeed_Large1994'
      },
      {
        label: 'Sundby 1983',
        value: 'windspeed_Sundby1983'
      }
    ]
  },
  {
    prop: 'stokes_drift',
    description: 'Stokes drift is additional movement near the sea surface in the direction of wave propagation caused by waves. If turned on for the simulation, the Stokes drift will be estimated from model winds since wave model output is not available.'
  },
  {
    prop: 'horizontal_diffusivity',
    label: 'Override horizontal diffusivity (on by default)',
    description: 'Override the model-specific horizontal diffusivity (random walk) with a custom value. For known ocean models, the value is calculated as the approximate horizontal grid resolution for the selected ocean model times an estimate of the sub-gridscale velocity of 0.1 m/s. For CIOFS models this results in 10 m^2/s. For NWGOA it results in 150 m^2/s.',
    constraints: {
      min: 0,
      max: 1000
    },
    settings: {
      canBeNull: true,
      nonNullDefaultValue: 100
    }
  },
  {
    prop: 'wind_drift',
    type: 'boolean',
    defaultValue: true,
    description: 'If on, elements at surface are moved with a fraction, the wind draft factor, of the wind speed from the surface down to the wind drift depth.'
  },
  {
    prop: 'wind_drift_factor',
    constraints: {
      max: 1
    }
  },
  {
    prop: 'wind_drift_options',
    skip_path: true,
    type: 'object',
    conditions: {
      dependsOn: 'wind_drift'
    },
    fields: [
      {
        prop: 'wind_drift_factor'
      },
      {
        prop: 'wind_drift_depth'
      }
    ]
  },
  {
    prop: 'depth_options',
    skip_path: true,
    type: 'object',
    // conditions: {
    //   dependsOn: 'do3D',
    //   value: true
    // },
    fields: [
      {
        prop: 'seed_seafloor'
      },
      {
        prop: 'z'
      }
    ]
  },
  {
    prop: 'radius_type',
    label: 'Initial particle distribution',
    conditions: {
      dependsOn: 'shape_type',
      value: 'point'
    }
  },
  {
    prop: 'output_format',
    label: 'Output Format',
    description: 'Select the format for the output file.'
  }
]
export default fieldOverrides
