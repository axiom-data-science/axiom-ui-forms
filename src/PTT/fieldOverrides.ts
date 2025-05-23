import { type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const fieldOverrides: IFormFieldOverride[] = [

  {
    prop: ***REMOVED***time_step***REMOVED***,
    type: ***REMOVED***number***REMOVED***,
    constraints: {
      min: 1,
      max: 12
    }
  },
  {
    prop: ***REMOVED***z***REMOVED***,
    label: ***REMOVED***Depth to start simulation at***REMOVED***,
    constraints: {
      min: 0,
      max: 5000
    },
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
    defaultValue: 1000
  },
  {
    prop: ***REMOVED***geojson***REMOVED***,
    label: ***REMOVED***Select a point***REMOVED***,
    type: ***REMOVED***geojson***REMOVED***
  },
  {
    prop: ***REMOVED***do3D***REMOVED***,
    label: ***REMOVED***3D Simulation***REMOVED***
  },
  {
    prop: ***REMOVED***emulsification***REMOVED***,
    label: ***REMOVED***Oil Emulsification***REMOVED***
  },
  {
    prop: ***REMOVED***oil_film_thickness***REMOVED***,
    constraints: {
      min: 0.00001,
      max: 0.1
    },
    settings: {
      step: 0.0001
    },
    defaultValue: 0.001
  },
  {
    prop: ***REMOVED***m3_per_hour***REMOVED***,
    label: ***REMOVED***Flow rate (m3/h): between 0.001 and 1,000,000***REMOVED***,
    /* constraints: {
      min: 0.001,
      max: 1000000
    }, */
    defaultValue: 1,
    settings: {
      step: 0.001
    }
  },
  {
    prop: ***REMOVED***oil_type***REMOVED***,
    defaultValue: ***REMOVED***ALASKA NORTH SLOPE (AD00020)***REMOVED***
  },
  {
    prop: ***REMOVED***wind_drift_depth***REMOVED***,
    constraints: {
      min: 0,
      max: 10
    }
  },
  {
    prop: ***REMOVED***wind_drift_factor***REMOVED***,
    constraints: {
      min: 0,
      max: 1
    },
    settings: {
      step: 0.01
    }
  },
  {
    prop: ***REMOVED***mixed_layer_depth***REMOVED***,
    constraints: {
      min: 0,
      max: 1000
    }
  }
]

export default fieldOverrides
