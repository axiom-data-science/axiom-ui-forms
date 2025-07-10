import { type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const larvalFieldOverrides: IFormFieldOverride[] = [
  {
    prop: ***REMOVED***do3D***REMOVED***,
    description: ***REMOVED***The present scenario is always run in 3D, so this option is not available.***REMOVED***,
    conditions: {
      result: ***REMOVED***disable***REMOVED***
    }
  },
  {
    prop: ***REMOVED***hatched***REMOVED***,
    description: ***REMOVED***Should particles be initially modeled as eggs or larvae?***REMOVED***,
    type: ***REMOVED***select***REMOVED***,
    options: [
      {
        label: ***REMOVED***Eggs***REMOVED***,
        value: 0
      },
      {
        label: ***REMOVED***Larvae***REMOVED***,
        value: 1
      }
    ]
  },
  {
    prop: ***REMOVED***stage_fraction***REMOVED***,
    label: ***REMOVED***Egg development time fraction***REMOVED***,
    description: ***REMOVED***Tracks the fraction of development time completed, from 0 to 1, where a value of 1 means the egg has hatched.***REMOVED***,
    settings: {
      step: 0.1
    }
  },
  {
    prop: ***REMOVED***diameter***REMOVED***,
    label: ***REMOVED***Egg diameter***REMOVED***,
    description: ***REMOVED***Initial value of egg diameter in meters.***REMOVED***
  },
  {
    prop: ***REMOVED***neutral_buoyancy_salinity***REMOVED***,
    label: ***REMOVED***Neutral buoyancy salinity***REMOVED***,
    description: ***REMOVED***Initial value of egg neutral buoyancy salinity in practical salinity units (PSU).***REMOVED***
  },
  {
    prop: ***REMOVED***weight***REMOVED***,
    description: ***REMOVED***Initial value of weight in mg. This is the starting weight for larval fish, whenever they reach that stage in the simulation.***REMOVED***
  },
  {
    prop: ***REMOVED***egg_options***REMOVED***,
    label: ***REMOVED***Options for Eggs***REMOVED***,
    skip_path: true,
    type: ***REMOVED***object***REMOVED***,
    conditions: {
      dependsOn: ***REMOVED***hatched***REMOVED***,
      operator: ***REMOVED***!=***REMOVED***,
      value: 1
    },
    fields: [
      {
        prop: ***REMOVED***stage_fraction***REMOVED***
      },
      {
        prop: ***REMOVED***diameter***REMOVED***
      },
      {
        prop: ***REMOVED***neutral_buoyancy_salinity***REMOVED***
      }
    ]
  },
  {
    prop: ***REMOVED***larvae_options***REMOVED***,
    label: ***REMOVED***Options for Larvae***REMOVED***,
    skip_path: true,
    type: ***REMOVED***object***REMOVED***,
    fields: [
      {
        prop: ***REMOVED***weight***REMOVED***
      }
    ]
  }
]

export default larvalFieldOverrides
