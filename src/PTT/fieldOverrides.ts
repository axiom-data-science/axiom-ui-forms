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
    prop: ***REMOVED***duration***REMOVED***,
    type: ***REMOVED***number***REMOVED***,
    constraints: {
      min: 6,
      max: 240
    }
  },
  {
    prop: ***REMOVED***ocean_model***REMOVED***,
    type: ***REMOVED***select***REMOVED***,
    options: [
      {
        label: ***REMOVED***CIOFSOP***REMOVED***,
        value: ***REMOVED***CIOFSOP***REMOVED***
      },
      {
        label: ***REMOVED***CIOFS***REMOVED***,
        value: ***REMOVED***CIOFS***REMOVED***
      },
      {
        label: ***REMOVED***NWGOA***REMOVED***,
        value: ***REMOVED***NWGOA***REMOVED***
      }
    ]
  }
]

export default fieldOverrides
