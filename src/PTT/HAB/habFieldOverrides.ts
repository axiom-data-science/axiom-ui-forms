import { type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const habFieldOverrides: IFormFieldOverride[] = [
  {
    prop: ***REMOVED***wind_drift***REMOVED***,
    defaultValue: false,
    description: ***REMOVED***The present scenario does not use wind drift because phytoplankton are not expected to be right at the surface where wind drift occurs, so this option is not available.***REMOVED***,
    conditions: {
      result: ***REMOVED***disable***REMOVED***
    }
  },
  {
    prop: ***REMOVED***stokes_drift***REMOVED***,
    defaultValue: false,
    description: ***REMOVED***The present scenario does not use Stokes drift because phytoplankton are not expected to be right at the surface where Stokes drift occurs, so this option is not available.***REMOVED***,
    conditions: {
      result: ***REMOVED***disable***REMOVED***
    }
  }

]

export default habFieldOverrides
