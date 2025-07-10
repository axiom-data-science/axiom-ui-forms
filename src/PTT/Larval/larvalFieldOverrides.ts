import { type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'

const larvalFieldOverrides: IFormFieldOverride[] = [
  {
    prop: 'do3D',
    description: 'The present scenario is always run in 3D, so this option is not available.',
    conditions: {
      result: 'disable'
    }
  },
  {
    prop: 'hatched',
    description: 'Should particles be initially modeled as eggs or larvae?',
    type: 'select',
    options: [
      {
        label: 'Eggs',
        value: 0
      },
      {
        label: 'Larvae',
        value: 1
      }
    ]
  },
  {
    prop: 'stage_fraction',
    label: 'Egg development time fraction',
    description: 'Tracks the fraction of development time completed, from 0 to 1, where a value of 1 means the egg has hatched.',
    settings: {
      step: 0.1
    }
  },
  {
    prop: 'diameter',
    label: 'Egg diameter',
    description: 'Initial value of egg diameter in meters.'
  },
  {
    prop: 'neutral_buoyancy_salinity',
    label: 'Neutral buoyancy salinity',
    description: 'Initial value of egg neutral buoyancy salinity in practical salinity units (PSU).'
  },
  {
    prop: 'weight',
    description: 'Initial value of weight in mg. This is the starting weight for larval fish, whenever they reach that stage in the simulation.'
  },
  {
    prop: 'egg_options',
    label: 'Options for Eggs',
    skip_path: true,
    type: 'object',
    conditions: {
      dependsOn: 'hatched',
      operator: '!=',
      value: 1
    },
    fields: [
      {
        prop: 'stage_fraction'
      },
      {
        prop: 'diameter'
      },
      {
        prop: 'neutral_buoyancy_salinity'
      }
    ]
  },
  {
    prop: 'larvae_options',
    label: 'Options for Larvae',
    skip_path: true,
    type: 'object',
    fields: [
      {
        prop: 'weight'
      }
    ]
  }
]

export default larvalFieldOverrides
