import { type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'

const habFieldOverrides: IFormFieldOverride[] = [
  {
    prop: 'wind_drift',
    defaultValue: false,
    description: 'The present scenario does not use wind drift because phytoplankton are not expected to be right at the surface where wind drift occurs, so this option is not available.',
    conditions: {
      result: 'disable'
    }
  },
  {
    prop: 'stokes_drift',
    defaultValue: false,
    description: 'The present scenario does not use Stokes drift because phytoplankton are not expected to be right at the surface where Stokes drift occurs, so this option is not available.',
    conditions: {
      result: 'disable'
    }
  }

]

export default habFieldOverrides
