import { type IFormOverride } from '@/Form/Creator/FormCreatorTypes'

const oilFormOverride: IFormOverride = {
  id: 'oil',
  label: 'Oil and Gas',
  description: 'Oil and Gas Form',
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
      description: 'Should able to select a point, polygon or upload a shapefile',
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
              prop: 'radius'
            },
            {
              prop: 'number'
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
      id: 'oil-options',
      label: 'Oil options',
      pages: [
        {
          id: 'basic',
          label: 'Basic options',
          fields: [
            {
              prop: 'oil_type'
            },
            {
              prop: 'm3_per_hour'
            },
            {
              prop: 'emulsification'
            },
            {
              prop: 'evaporation'
            },
            {
              prop: 'biodegradation'
            }

          ]
        },
        {
          id: 'advanced',
          label: 'Advanced options',
          fields: [
            {
              prop: 'oil_film_thickness'
            },
            {
              prop: 'update_oilfilm_thickness'
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
              prop: 'wind_drift_factor'
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
              prop: 'wind_uncertainty'
            },
            {
              prop: 'wind_drift_depth'
            },
            {
              prop: 'vertical_mixing_timestep'
            },
            {
              prop: 'mixed_layer_depth'
            },
            {
              prop: 'seafloor_action'
            },
            {
              prop: 'diffusivitymodel'
            },
            {
              prop: 'current_uncertainty'
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

export default oilFormOverride
