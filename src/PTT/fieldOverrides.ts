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
    prop: 'z',
    label: 'Depth to start simulation at',
    constraints: {
      min: 0,
      max: 5000
    },
    conditions: {
      dependsOn: 'seed_seafloor',
      value: false
    }
  },
  {
    prop: 'number',
    label: 'Number of particles',
    constraints: {
      min: 1,
      max: 10000
    },
    defaultValue: 1000
  },
  {
    prop: 'radius',
    constraints: {
      min: 0,
      max: 1000000
    },
    defaultValue: 1000
  },
  {
    prop: 'geojson',
    label: 'Select a point',
    type: 'geojson'
  },
  {
    prop: 'do3D',
    label: '3D Simulation'
  },
  {
    prop: 'emulsification',
    label: 'Oil Emulsification'
  },
  {
    prop: 'oil_film_thickness',
    constraints: {
      min: 0.00001,
      max: 0.1
    },
    settings: {
      step: 0.0001
    },
    defaultValue: 0.001
  },
  {
    prop: 'm3_per_hour',
    label: 'Flow rate (m3/h): between 0.001 and 1,000,000',
    /* constraints: {
      min: 0.001,
      max: 1000000
    }, */
    defaultValue: 1,
    settings: {
      step: 0.001
    }
  },
  {
    prop: 'oil_type',
    defaultValue: 'ALASKA NORTH SLOPE (AD00020)'
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
    prop: 'mixed_layer_depth',
    constraints: {
      min: 0,
      max: 1000
    }
  },
  {
    prop: 'horizontal_diffusivity',
    settings: {
      canBeNull: true,
      nonNullDefaultValue: 10000
    }
  }
]

export default fieldOverrides
