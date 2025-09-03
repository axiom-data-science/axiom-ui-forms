import { type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'

const leewayFieldOverrides: IFormFieldOverride[] = [
  {
    prop: 'do3D',
    description: 'The present scenario is always run in 2D, so this option is not available.',
    conditions: {
      result: 'disable'
    }
  },
  {
    prop: 'z',
    description: 'For the present scenario, the depth is always 0 (the surface).',
    conditions: {
      result: 'disable'
    },
    settings: {
      descriptionPresentation: 'tooltip'
    }
  },
  {
    prop: 'object_type',
    description: 'Leeway object type for this simulation. For more information, see [this page](https://opendrift.github.io/autoapi/opendrift/models/leeway/index.html).'
  }
]

export default leewayFieldOverrides
