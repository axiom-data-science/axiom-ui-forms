import { type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'

const leewayFieldOverrides: IFormFieldOverride[] = [
  {
    prop: 'z',
    conditions: {
      dependsOn: 'do3D',
      value: true
    }
  },
  {
    prop: 'object_type',
    description: 'Leeway object type for this simulation. For more information, see [this page](https://opendrift.github.io/autoapi/opendrift/models/leeway/index.html).'
  }
]

export default leewayFieldOverrides
