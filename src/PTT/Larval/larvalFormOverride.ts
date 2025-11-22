import { type IFormOverride } from '@/Form/Creator/FormCreatorTypes'

const larvalFormOverride: IFormOverride = {
  id: 'larval',
  label: 'Larval Form',
  description: 'Larval Form',
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
              prop: 'end_time'
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
              prop: 'depth_options'
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
      id: 'larval-options',
      label: 'Larval options',
      pages: [
        {
          id: 'basic',
          label: 'Basic options',
          fields: [
            {
              prop: 'hatched'
            },
            {
              prop: 'egg_options'
            },
            {
              prop: 'larvae_options'
            }
          ]
        }
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
              prop: 'wind_drift'
            },
            {
              prop: 'wind_drift_options'
            },
            {
              prop: 'vertical_mixing'
            },
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
              prop: 'vertical_mixing_options'
            },
            {
              prop: 'diffusivitymodel'
            },
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
            {
              prop: 'output_format'
            },
            {
              prop: 'coastline_action'
            },
            {
              prop: 'seafloor_action'
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

export default larvalFormOverride
