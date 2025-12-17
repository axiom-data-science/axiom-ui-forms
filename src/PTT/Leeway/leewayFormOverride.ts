import { type IFormOverride } from '@/Form/Creator/FormCreatorTypes'

const leewayFormOverride: IFormOverride = {
  id: 'leeway',
  label: 'Leeway Form',
  description: 'Leeway Form',
  wizard_steps: [
    {
      id: 'title',
      label: 'Title',
      description: 'Title of the form',
      fields: [
        {
          prop: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          description: 'Title of your simulation'
        },
        {
          prop: 'drift_model',
          type: 'constant'
        }
      ]
    },
    {
      id: 'ocean-model',
      label: 'Ocean Model and time',
      pages: [
        {
          id: 'basic',
          label: 'Basic options',
          fields: [
            {
              prop: 'ocean_model'
            },
            {
              prop: 'start_time'
            },
            {
              prop: 'duration'
            }
          ]
        },
        {
          id: 'advanced',
          label: 'Advanced options',
          fields: [
            {
              prop: 'time_step'
            },
            {
              prop: 'time_step_output'
            }
          ]
        }
      ]
    },
    {
      id: 'map',
      label: 'Map',
      pages: [
        {
          id: 'selection',
          label: 'Basic options',
          fields: [
            {
              prop: 'seed_flag'
            },
            {
              prop: 'lat'
            },
            {
              prop: 'lon'
            },
            {
              prop: 'shape_type'
            },
            {
              prop: 'point'
            },
            {
              prop: 'polygon'
            },
            {
              prop: 'linestring'
            },
            {
              prop: 'shapefile'
            },
            {
              prop: 'number'
            },
            {
              prop: 'radius'
            },
            {
              prop: 'do3D'
            },
            {
              prop: 'z'
            }
          ]
        },
        {
          id: 'advanced-map',
          label: 'Advanced options',
          fields: [
            {
              prop: 'radius_type',
              defaultValue: 'gaussian'
            }
          ]
        }
      ]
    },
    {
      id: 'leeway-options',
      label: 'Leeway options',
      pages: [
        {
          id: 'basic',
          label: 'Basic options',
          fields: [
            {
              prop: 'object_type'
            }
          ]
        },
        // {
        //   id: 'advanced',
        //   label: 'Advanced options',
        //   fields: []
        // }
      ]
    },
    {
      id: 'physical-processes',
      label: 'Physical processes',
      pages: [
        {
          id: 'basic',
          label: 'Basic options',
          fields: [
            {
              prop: 'stokes_drift'
            },
            {
              prop: 'horizontal_diffusivity'
            }
          ]
        },
        {
          id: 'advanced',
          label: 'Advanced options',
          fields: [
            {
              prop: 'current_uncertainty'
            },
            {
              prop: 'wind_uncertainty'
            }
          ]
        }
      ]
    },
    {
      id: 'run-mechanics',
      label: 'Run mechanics',
      pages: [
        {
          id: 'basic',
          label: 'Basic options',
          fields: [
            // {
            //   prop: 'output_format'
            // },
            {
              prop: 'coastline_action'
            }
          ]
        },
        {
          id: 'advanced',
          label: 'Advanced options',
          fields: [
            {
              prop: 'use_static_masks'
            },
            {
              prop: 'use_auto_landmask'
            }
          ]
        }
      ]
    }
  ]
}

export default leewayFormOverride
