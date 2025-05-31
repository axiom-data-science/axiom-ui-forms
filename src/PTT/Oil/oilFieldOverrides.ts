import { type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const oilFormOverride: IFormFieldOverride[] = [
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

export default oilFormOverride
