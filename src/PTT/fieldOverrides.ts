import { type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'

const fieldOverrides: IFormFieldOverride[] = [
  {
    prop: 'time_step',
    settings: {
      step: 0.1
    }
  },
  {
    prop: 'time_step_output',
    settings: {
      step: 1
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
    defaultValue: 1000,
    conditions: {
      dependsOn: 'shape_type',
      value: 'point'
    }
  },
  {
    prop: 'shape_type',
    label: 'Shape',
    type: 'select',
    defaultValue: 'point',
    options: [
      {
        label: 'Point',
        value: 'point'
      },
      {
        label: 'Polygon',
        value: 'polygon'
      },
      {
        label: 'Line',
        value: 'linestring'
      },
      {
        label: 'Shapefile',
        value: 'shapefile'
      }
    ],
    settings: {
      allowNull: false
    }
  },
  {
    prop: 'point',
    destPath: 'geojson',
    type: 'geometry',
    label: null,
    description: 'Select a point on the map.',
    settings: {
      drawPointEnabled: true,
      showCoordinateInput: false
    },
    conditions: {
      dependsOn: 'shape_type',
      value: 'point'
    }
  },
  {
    prop: 'polygon',
    destPath: 'geojson',
    type: 'geometry',
    label: null,
    description: 'Draw a polygon on the map.',
    settings: {
      drawPolygonEnabled: true,
      showCoordinateInput: false
    },
    conditions: {
      dependsOn: 'shape_type',
      value: 'polygon'
    }
  },
  {
    prop: 'linestring',
    destPath: 'geojson',
    type: 'geometry',
    label: null,
    description: 'Draw a line on the map.',
    settings: {
      drawPathEnabled: true,
      showCoordinateInput: false
    },
    conditions: {
      dependsOn: 'shape_type',
      value: 'linestring'
    }
  },
  {
    prop: 'shapefile',
    label: null,
    description: 'Upload a shapefile to use as the shape',
    conditions: {
      dependsOn: 'shape_type',
      value: 'shapefile'
    }
  },
  {
    prop: 'do3D',
    label: '3D Simulation'
  },
  {
    prop: 'horizontal_diffusivity',
    settings: {
      canBeNull: true,
      nonNullDefaultValue: 10000
    }
  },
  {
    prop: 'wind_drift_factor',
    settings: {
      canBeNull: true
    }
  },
  {
    prop: 'depth_options',
    skip_path: true,
    type: 'object',
    conditions: {
      dependsOn: 'do3D',
      value: true
    },
    fields: [
      {
        prop: 'seed_seafloor'
      },
      {
        prop: 'z'
      }
    ]
  }
]
export default fieldOverrides
