import { type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'

const leewayFieldOverrides: IFormFieldOverride[] = [
  {
    prop: 'z',
    conditions: {
      dependsOn: 'do3D',
      value: true
    }
  }
]

export default leewayFieldOverrides
