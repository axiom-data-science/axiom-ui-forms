import { type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'

const fieldOverrides: IFormFieldOverride[] = [

  {
    prop: 'time_step',
    type: 'number',
    constraints: {
      min: 1,
      max: 12
    }
  },
  {
    prop: 'duration',
    type: 'number',
    constraints: {
      min: 6,
      max: 240
    }
  },
  {
    prop: 'ocean_model',
    type: 'select',
    options: [
      {
        label: 'CIOFSOP',
        value: 'CIOFSOP'
      },
      {
        label: 'CIOFS',
        value: 'CIOFS'
      },
      {
        label: 'NWGOA',
        value: 'NWGOA'
      }
    ]
  }
]

export default fieldOverrides
