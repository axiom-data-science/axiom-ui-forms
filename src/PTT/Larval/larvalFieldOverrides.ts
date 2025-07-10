import { type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'

const larvalFieldOverrides: IFormFieldOverride[] = [
  {
    prop: 'do3D',
    description: 'The present scenario is always run in 3D, so this option is not available.',
    conditions: {
      result: 'disable'
    }
  }
]

export default larvalFieldOverrides
