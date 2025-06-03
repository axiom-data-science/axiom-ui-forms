import { type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const fieldOverrides: IFormFieldOverride[] = [
  {
    prop: ***REMOVED***time_step***REMOVED***,
    settings: {
      step: 0.1
    }
  },
  {
    prop: ***REMOVED***time_step_output***REMOVED***,
    settings: {
      step: 1
    }
  },
  {
    prop: ***REMOVED***z***REMOVED***,
    label: ***REMOVED***Depth to start simulation at***REMOVED***,
    constraints: {
      min: 0,
      max: 5000
    },
    conditions: {
      dependsOn: ***REMOVED***seed_seafloor***REMOVED***,
      value: false
    }
  },
  {
    prop: ***REMOVED***number***REMOVED***,
    label: ***REMOVED***Number of particles***REMOVED***,
    constraints: {
      min: 1,
      max: 10000
    },
    defaultValue: 1000
  },
  {
    prop: ***REMOVED***radius***REMOVED***,
    constraints: {
      min: 0,
      max: 1000000
    },
    defaultValue: 1000,
    conditions: {
      dependsOn: ***REMOVED***shape_type***REMOVED***,
      value: ***REMOVED***point***REMOVED***
    }
  },
  {
    prop: ***REMOVED***shape_type***REMOVED***,
    label: ***REMOVED***Shape***REMOVED***,
    type: ***REMOVED***select***REMOVED***,
    defaultValue: ***REMOVED***point***REMOVED***,
    options: [
      {
        label: ***REMOVED***Point***REMOVED***,
        value: ***REMOVED***point***REMOVED***
      },
      {
        label: ***REMOVED***Polygon***REMOVED***,
        value: ***REMOVED***polygon***REMOVED***
      },
      {
        label: ***REMOVED***Line***REMOVED***,
        value: ***REMOVED***linestring***REMOVED***
      },
      {
        label: ***REMOVED***Shapefile***REMOVED***,
        value: ***REMOVED***shapefile***REMOVED***
      }
    ],
    settings: {
      allowNull: false
    }
  },
  {
    prop: ***REMOVED***point***REMOVED***,
    destPath: ***REMOVED***geojson***REMOVED***,
    type: ***REMOVED***geometry***REMOVED***,
    label: null,
    description: ***REMOVED***Select a point on the map.***REMOVED***,
    settings: {
      drawPointEnabled: true,
      showCoordinateInput: false
    },
    conditions: {
      dependsOn: ***REMOVED***shape_type***REMOVED***,
      value: ***REMOVED***point***REMOVED***
    }
  },
  {
    prop: ***REMOVED***polygon***REMOVED***,
    destPath: ***REMOVED***geojson***REMOVED***,
    type: ***REMOVED***geometry***REMOVED***,
    label: null,
    description: ***REMOVED***Draw a polygon on the map.***REMOVED***,
    settings: {
      drawPolygonEnabled: true,
      showCoordinateInput: false
    },
    conditions: {
      dependsOn: ***REMOVED***shape_type***REMOVED***,
      value: ***REMOVED***polygon***REMOVED***
    }
  },
  {
    prop: ***REMOVED***linestring***REMOVED***,
    destPath: ***REMOVED***geojson***REMOVED***,
    type: ***REMOVED***geometry***REMOVED***,
    label: null,
    description: ***REMOVED***Draw a line on the map.***REMOVED***,
    settings: {
      drawPathEnabled: true,
      showCoordinateInput: false
    },
    conditions: {
      dependsOn: ***REMOVED***shape_type***REMOVED***,
      value: ***REMOVED***linestring***REMOVED***
    }
  },
  {
    prop: ***REMOVED***shapefile***REMOVED***,
    label: null,
    description: ***REMOVED***Upload a shapefile to use as the shape***REMOVED***,
    conditions: {
      dependsOn: ***REMOVED***shape_type***REMOVED***,
      value: ***REMOVED***shapefile***REMOVED***
    }
  },
  {
    prop: ***REMOVED***do3D***REMOVED***,
    label: ***REMOVED***3D Simulation***REMOVED***
  },
  {
    prop: ***REMOVED***horizontal_diffusivity***REMOVED***,
    settings: {
      canBeNull: true,
      nonNullDefaultValue: 10000
    }
  },
  {
    prop: ***REMOVED***wind_drift_factor***REMOVED***,
    settings: {
      canBeNull: true
    }
  },
  {
    prop: ***REMOVED***depth_options***REMOVED***,
    skip_path: true,
    type: ***REMOVED***object***REMOVED***,
    conditions: {
      dependsOn: ***REMOVED***do3D***REMOVED***,
      value: true
    },
    fields: [
      {
        prop: ***REMOVED***seed_seafloor***REMOVED***
      },
      {
        prop: ***REMOVED***z***REMOVED***
      }
    ]
  }
]
export default fieldOverrides
