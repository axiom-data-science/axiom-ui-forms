import { type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const fieldOverrides: IFormFieldOverride[] = [
  {
    prop: ***REMOVED***ocean_model***REMOVED***,
    label: ***REMOVED***Ocean Model***REMOVED***,
    long_description: ***REMOVED***- **Operational Cook Inlet Model (CIOFSOP):** The operational Cook Inlet model is operationally run with a 48 forecast time period with saved model output available starting August 31, 2021, run in Cook Inlet, Alaska. The horizontal grid has resolution ranging from 10 meters in the estuaries to 3.5 kilometers in the deeper offshore waters and uses 30 sigma layers that follow the bathymetric terrain. Freshwater forcing is from river inputs using discharge observations from 12 major rivers supplied by the USGS. For more model details, see the [CIOFS website](https://tidesandcurrents.noaa.gov/ofs/ciofs/ciofs_info.html) and [development report](https://espis.boem.gov/Technical%20Summaries/5560.pdf).\n\n- **Hindcast Cook Inlet Model (CIOFS):** The hindcast Cook Inlet model was run from January 1999 through December 2022, in Cook Inlet, Alaska. The horizontal grid has resolution ranging from 10 meters in the estuaries to 3.5 kilometers in the deeper offshore waters and uses 30 sigma layers that follow the bathymetric terrain. Freshwater forcing is from river inputs using discharge observations from 12 major rivers supplied by the USGS. For more model details and performance, see [report](https://ciofs.axds.co/).\n\n- **Hindcast Northwest Gulf of Alaska Model (NWGOA):** The hindcast Northwest Gulf of Alaska model was run from January 1999 through December 2008, in the northwest Gulf of Alaska and covering Cook Inlet. It has a horizontal resolution of approximately 1.5 km with 50 vertical layers that follow the bathymetric terrain. Freshwater forcing is from a watershed model. For more model details and performance, see [report](https://www.govinfo.gov/content/pkg/GOVPUB-I-48b50b5dc536ac94c0275ac7d0445ebf/pdf/GOVPUB-I-48b50b5dc536ac94c0275ac7d0445ebf.pdf) or [publication](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2019JC015724).***REMOVED***,
    options: [
      {
        label: ***REMOVED***Operational Cook Inlet Model (CIOFSOP)***REMOVED***,
        value: ***REMOVED***CIOFSOP***REMOVED***
      },
      {
        label: ***REMOVED***Hindcast Cook Inlet Model (CIOFS)***REMOVED***,
        value: ***REMOVED***CIOFS***REMOVED***
      },
      {
        label: ***REMOVED***Hindcast Northwest Gulf of Alaska Model (NWGOA)***REMOVED***,
        value: ***REMOVED***NWGOA***REMOVED***
      }
    ],
    defaultValue: ***REMOVED***CIOFSOP***REMOVED***,
    settings: {
      descriptionPresentation: ***REMOVED***tooltip***REMOVED***,
      allowNull: false
    }
  },
  {
    prop: ***REMOVED***time_step***REMOVED***,
    constraints: {
      max: 3600
    },
    settings: {
      step: 60
    }
  },
  {
    prop: ***REMOVED***start_time***REMOVED***,
    type: ***REMOVED***custom:start_time***REMOVED***
  },
  {
    prop: ***REMOVED***duration***REMOVED***,
    type: ***REMOVED***custom:duration***REMOVED***
  },
  {
    prop: ***REMOVED***time_step_output***REMOVED***,
    description: ***REMOVED***Time step at which element properties are written to file, in seconds. This must be larger than the calculation time step, and be an integer multiple of time step.***REMOVED***,
    settings: {
      step: 1
    }
  },
  {
    prop: ***REMOVED***seed_seafloor***REMOVED***,
    description: ***REMOVED***If checked, particles will be seeded at the seafloor and Initial depth is not used.***REMOVED***
  },
  {
    prop: ***REMOVED***seed_flag***REMOVED***,
    type: ***REMOVED***constant***REMOVED***,
    defaultValue: ***REMOVED***geojson***REMOVED***
  },
  {
    prop: ***REMOVED***lat***REMOVED***,
    type: ***REMOVED***constant***REMOVED***,
    defaultValue: null
  },
  {
    prop: ***REMOVED***lon***REMOVED***,
    type: ***REMOVED***constant***REMOVED***,
    defaultValue: null
  },
  {
    prop: ***REMOVED***z***REMOVED***,
    label: ***REMOVED***Initial depth for particles***REMOVED***,
    description: ***REMOVED***Depth below sea level (in meters) where elements are released. Input 0 for the surface.***REMOVED***,
    // constraints: {
    //   min: 0,
    //   max: 5000
    // },
    conditions: {
      dependsOn: ***REMOVED***seed_seafloor***REMOVED***,
      value: false
    }
  },
  {
    prop: ***REMOVED***number***REMOVED***,
    label: ***REMOVED***Number of particles***REMOVED***,
    constraints: {
      min: 1,
      max: 10000
    },
    defaultValue: 1000
  },
  {
    prop: ***REMOVED***radius***REMOVED***,
    constraints: {
      min: 0,
      max: 1000000
    },
    description: ***REMOVED***Radius in meters around each lon-lat pair, within which particles will be seeded according to Initial particle distribution.***REMOVED***,
    defaultValue: 1000,
    conditions: {
      dependsOn: ***REMOVED***shape_type***REMOVED***,
      value: ***REMOVED***point***REMOVED***
    }
  },
  {
    prop: ***REMOVED***shape_type***REMOVED***,
    label: ***REMOVED***Shape***REMOVED***,
    type: ***REMOVED***select***REMOVED***,
    defaultValue: ***REMOVED***point***REMOVED***,
    options: [
      {
        label: ***REMOVED***Point***REMOVED***,
        value: ***REMOVED***point***REMOVED***
      },
      {
        label: ***REMOVED***Polygon***REMOVED***,
        value: ***REMOVED***polygon***REMOVED***
      },
      {
        label: ***REMOVED***Line***REMOVED***,
        value: ***REMOVED***linestring***REMOVED***
      },
      {
        label: ***REMOVED***Shapefile***REMOVED***,
        value: ***REMOVED***shapefile***REMOVED***
      }
    ],
    settings: {
      allowNull: false
    }
  },
  {
    prop: ***REMOVED***point***REMOVED***,
    destPath: ***REMOVED***geojson***REMOVED***,
    type: ***REMOVED***geometry***REMOVED***,
    label: null,
    description: ***REMOVED***Select a point on the map.***REMOVED***,
    settings: {
      drawPointEnabled: true,
      showCoordinateInput: false
    },
    conditions: {
      dependsOn: ***REMOVED***shape_type***REMOVED***,
      value: ***REMOVED***point***REMOVED***
    }
  },
  {
    prop: ***REMOVED***polygon***REMOVED***,
    destPath: ***REMOVED***geojson***REMOVED***,
    type: ***REMOVED***geometry***REMOVED***,
    label: null,
    description: ***REMOVED***Draw a polygon on the map.***REMOVED***,
    settings: {
      drawPolygonEnabled: true,
      showCoordinateInput: false
    },
    conditions: {
      dependsOn: ***REMOVED***shape_type***REMOVED***,
      value: ***REMOVED***polygon***REMOVED***
    }
  },
  {
    prop: ***REMOVED***linestring***REMOVED***,
    destPath: ***REMOVED***geojson***REMOVED***,
    type: ***REMOVED***geometry***REMOVED***,
    label: null,
    description: ***REMOVED***Draw a line on the map.***REMOVED***,
    settings: {
      drawPathEnabled: true,
      showCoordinateInput: false
    },
    conditions: {
      dependsOn: ***REMOVED***shape_type***REMOVED***,
      value: ***REMOVED***linestring***REMOVED***
    }
  },
  {
    prop: ***REMOVED***shapefile***REMOVED***,
    label: null,
    description: ***REMOVED***Upload a shapefile to use as the shape***REMOVED***,
    conditions: {
      dependsOn: ***REMOVED***shape_type***REMOVED***,
      value: ***REMOVED***shapefile***REMOVED***
    }
  },
  {
    prop: ***REMOVED***do3D***REMOVED***,
    label: ***REMOVED***3D Simulation***REMOVED***,
    description: ***REMOVED***If box is checked, run in three-dimensions instead of two.***REMOVED***
  },
  {
    prop: ***REMOVED***vertical_mixing_options***REMOVED***,
    skip_path: true,
    type: ***REMOVED***object***REMOVED***,
    conditions: {
      dependsOn: ***REMOVED***vertical_mixing***REMOVED***,
      value: true
    },
    fields: [
      {
        prop: ***REMOVED***mixed_layer_depth***REMOVED***
      },
      {
        prop: ***REMOVED***vertical_mixing_timestep***REMOVED***
      },
      {
        prop: ***REMOVED***diffusivitymodel***REMOVED***
      }
    ]
  },
  {
    prop: ***REMOVED***mixed_layer_depth***REMOVED***,
    description: ***REMOVED***Controls how deep the vertical diffusivity profile reaches, in meters.***REMOVED***,
    constraints: {
      min: 0,
      max: 200
    }
  },
  {
    prop: ***REMOVED***vertical_mixing_timestep***REMOVED***,
    description: ***REMOVED***Time step in seconds used for calculating vertical mixing model. Set this smaller to increase frequency of vertical mixing calculation; number of loops is calculated as the overall time step divided by this vertical mixing timestep so this must be smaller than the overall time step.***REMOVED***,
    settings: {
      step: 10
    }
  },
  {
    prop: ***REMOVED***diffusivitymodel***REMOVED***,
    label: ***REMOVED***Vertical mixing model***REMOVED***,
    description: ***REMOVED***Controls how deep the vertical mixing or diffusivity profile reaches, in meters. The available models use the model winds to parameterize the vertical diffusivity profile. References: [Large 1994](https://agupubs.onlinelibrary.wiley.com/doi/abs/10.1029/94rg01872), [Sundby 1983](https://www.sciencedirect.com/science/article/abs/pii/0198014983900420)***REMOVED***,
    options: [
      {
        label: ***REMOVED***Large 1994***REMOVED***,
        value: ***REMOVED***windspeed_Large1994***REMOVED***
      },
      {
        label: ***REMOVED***Sundby 1983***REMOVED***,
        value: ***REMOVED***windspeed_Sundby1983***REMOVED***
      }
    ]
  },
  {
    prop: ***REMOVED***stokes_drift***REMOVED***,
    description: ***REMOVED***Stokes drift is additional movement near the sea surface in the direction of wave propagation caused by waves. If turned on for the simulation, the Stokes drift will be estimated from model winds since wave model output is not available.***REMOVED***
  },
  {
    prop: ***REMOVED***horizontal_diffusivity***REMOVED***,
    label: ***REMOVED***Override horizontal diffusivity (on by default)***REMOVED***,
    description: ***REMOVED***Override the model-specific horizontal diffusivity (random walk) with a custom value. For known ocean models, the value is calculated as the approximate horizontal grid resolution for the selected ocean model times an estimate of the sub-gridscale velocity of 0.1 m/s. For CIOFS models this results in 10 m^2/s. For NWGOA it results in 150 m^2/s.***REMOVED***,
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
    prop: ***REMOVED***wind_drift***REMOVED***,
    type: ***REMOVED***boolean***REMOVED***,
    defaultValue: true,
    description: ***REMOVED***If on, elements at surface are moved with a fraction, the wind draft factor, of the wind speed from the surface down to the wind drift depth.***REMOVED***
  },
  {
    prop: ***REMOVED***wind_drift_factor***REMOVED***,
    constraints: {
      max: 1
    }
  },
  {
    prop: ***REMOVED***wind_drift_options***REMOVED***,
    skip_path: true,
    type: ***REMOVED***object***REMOVED***,
    conditions: {
      dependsOn: ***REMOVED***wind_drift***REMOVED***
    },
    fields: [
      {
        prop: ***REMOVED***wind_drift_factor***REMOVED***
      },
      {
        prop: ***REMOVED***wind_drift_depth***REMOVED***
      }
    ]
  },
  {
    prop: ***REMOVED***depth_options***REMOVED***,
    skip_path: true,
    type: ***REMOVED***object***REMOVED***,
    fields: [
      {
        prop: ***REMOVED***seed_seafloor***REMOVED***
      },
      {
        prop: ***REMOVED***z***REMOVED***
      }
    ]
  },
  {
    prop: ***REMOVED***radius_type***REMOVED***,
    label: ***REMOVED***Initial particle distribution***REMOVED***,
    conditions: {
      dependsOn: ***REMOVED***shape_type***REMOVED***,
      value: ***REMOVED***point***REMOVED***
    }
  },
  {
    prop: ***REMOVED***output_format***REMOVED***,
    label: ***REMOVED***Output Format***REMOVED***,
    description: ***REMOVED***Select the format for the output file.***REMOVED***
  }
]
export default fieldOverrides
