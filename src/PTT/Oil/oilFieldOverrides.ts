import { type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'

const oilFormOverride: IFormFieldOverride[] = [
  {
    prop: 'emulsification',
    label: 'Oil Emulsification'
  },
  {
    prop: 'oil_film_thickness',
    description: 'Initial oil film thickness, in meters. The film thickness may not be a critical parameter with respect to the drift or entrainment rate because there is a competing effect between thicker, more concentrated oil leading to fewer wave breaking events within the slick area, but also more oil entrained per event. The thickness might be more important for evaporation, which should be proportional to surface area (or inversely proportional to thickness).',
    constraints: {
      min: 0.00001,
      max: 0.1
    },
    settings: {
      step: 0.0001,
      descriptionPresentation: 'tooltip'
    },
    defaultValue: 0.001
  },
  {
    prop: 'm3_per_hour',
    label: 'Flow rate (m3/h): between 0.001 and 1,000,000',
    constraints: {
      min: 0.001,
      max: 1000000
    },
    defaultValue: 1,
    settings: {
      step: 100
    }
  },
  {
    prop: 'oil_type',
    defaultValue: ['EC02713', 'Alaska North Slope [2015]']
  },
  // {
  //   prop: 'subsea_or_not',
  //   label: 'Subsea?',
  //   description: 'Check box if the simulation will be initialized below the surface; some advanced options become available.',
  //   type: 'boolean',
  //   defaultValue: false
  // },
  {
    prop: 'oil_film_options',
    label: 'Oil Film Options',
    type: 'object',
    skip_path: true,
    fields: [
      {
        prop: 'oil_film_thickness'
      },
      {
        prop: 'update_oilfilm_thickness'
      }
    ]
  },
  {
    prop: 'subsea_options_distribution',
    skip_path: true,
    type: 'object',
    conditions: {
      dependsOn: 'z',
      operator: '!=',
      value: 0
    },
    fields: [
      {
        prop: 'droplet_size_distribution'
      }
    ]
  },
  // {
  //   prop: 'droplet_size_distribution',
  //   defaultValue: ''
  // },
  {
    prop: 'subsea_options_uniform_distribution_parameters',
    skip_path: true,
    type: 'object',
    conditionsSet: {
      logic: 'and',
      conditions: [
        {
          dependsOn: 'z',
          operator: '!=',
          value: 0
        },
        {
          dependsOn: 'droplet_size_distribution',
          value: 'uniform'
        }
      ]
    },
    fields: [
      {
        prop: 'droplet_diameter_min_subsea'
      },
      {
        prop: 'droplet_diameter_max_subsea'
      }
    ]
  },
  {
    prop: 'subsea_options_lognormal_distribution_parameters',
    skip_path: true,
    type: 'object',
    conditionsSet: {
      logic: 'and',
      conditions: [
        {
          dependsOn: 'z',
          operator: '!=',
          value: 0
        },
        {
          dependsOn: 'droplet_size_distribution',
          value: 'lognormal'
        }
      ]
    },
    fields: [
      {
        prop: 'droplet_diameter_sigma'
      },
      {
        prop: 'droplet_diameter_mu'
      }
    ]
  },
  {
    prop: 'subsea_options_normal_distribution_parameters',
    skip_path: true,
    type: 'object',
    conditionsSet: {
      logic: 'and',
      conditions: [
        {
          dependsOn: 'z',
          operator: '!=',
          value: 0
        },
        {
          dependsOn: 'droplet_size_distribution',
          value: 'normal'
        }
      ]
    },
    fields: [
      {
        prop: 'droplet_diameter_sigma'
      },
      {
        prop: 'droplet_diameter_mu'
      }
    ]
  },
  // {
  //   prop: 'oil_spill_scenarios',
  //   label: 'Oil Spill Scenarios',
  //   description: 'Scenarios for oil spills, which select some subsequent parameters.',
  //   type: 'select',
  //   defaultValue: 'oil_slick',
  //   options: [
  //     {
  //       label: 'Oil Slick',
  //       value: 'oil_slick'
  //     },
  //     {
  //       label: 'Subsea Blowout',
  //       value: 'subsea_blowout'
  //     },
  //     {
  //       label: 'Ship Track',
  //       value: 'ship_track'
  //     }
  //   ]
  // },
  {
    prop: 'oil_weathering_options',
    description: 'Options for oil weathering in addition to updating oil density and viscosity according to temperature.',
    skip_path: true,
    type: 'object',
    fields: [
      {
        prop: 'evaporation'
      },
      {
        prop: 'emulsification'
      },
      {
        prop: 'biodegradation'
      }
    ]
  },
  {
    prop: 'update_oilfilm_thickness',
    defaultValue: false,
    description: 'If True, oil film thickness is calculated at each time step starting from the initial oil film value. If False, oil film thickness is kept constant with value provided at seeding. This option is not automatically on because it is costly and simplistic, and does not significantly affect the end result.'
  },
  {
    prop: 'wind_drift_depth',
    constraints: {
      min: 0,
      max: 10
    }
  },
  {
    prop: 'wind_drift_factor',
    constraints: {
      min: 0,
      max: 1
    },
    settings: {
      step: 0.01
    }
  },
  {
    prop: 'depth_options',
    description: 'For an oil spill scenario, selecting an initial depth below the surface enables additional parameters under "Oil options".'
  }
]

export default oilFormOverride
