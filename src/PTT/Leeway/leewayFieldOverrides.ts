import { type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const leewayFieldOverrides: IFormFieldOverride[] = [
  {
    prop: ***REMOVED***do3D***REMOVED***,
    description: ***REMOVED***The present scenario is always run in 2D, so this option is not available.***REMOVED***,
    conditions: {
      result: ***REMOVED***disable***REMOVED***
    }
  },
  {
    prop: ***REMOVED***z***REMOVED***,
    description: ***REMOVED***For the present scenario, the depth is always 0 (the surface).***REMOVED***,
    conditions: {
      result: ***REMOVED***disable***REMOVED***
    },
    settings: {
      descriptionPresentation: ***REMOVED***tooltip***REMOVED***
    }
  },
  {
    prop: ***REMOVED***object_type***REMOVED***,
    description: ***REMOVED***Leeway object type for this simulation. For more information, see [this page](https://opendrift.github.io/autoapi/opendrift/models/leeway/index.html).***REMOVED***
  }
]

export default leewayFieldOverrides
