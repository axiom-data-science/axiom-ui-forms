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
      // description: 'Should able to select a point, polygon or upload a shapefile',
      pages: [
        {
          id: 'selection',
          label: 'Basic options',
          description: `Suggestions:
- To model an oil slick: select a point with a non-zero radius, click out a polygon, or input a shapefile. 
- Use a starting depth of 0 for the sea surface and run in 2D to save time.        
- To model a ship track spill: select a line, use a starting depth of 0 for the sea surface, and run in 2D.
- To model a subsea blowout: select a point and start particles at the seafloor or some other non-zero depth.
          `,
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
      id: 'oil-options',
      label: 'Oil options',
      pages: [
        {
          // description: 'Oil options for the simulation',
          id: 'basic',
          label: 'Basic options',
          fields: [
            {
              prop: 'oil_type'
            },
            // {
            //   prop: 'subsea_or_not'
            // },
            // {
            //   prop: 'oil_spill_scenarios'
            // },
            {
              prop: 'm3_per_hour'
            },
            {
              prop: 'oil_weathering_options'
            }
          ]
        },
        {
          id: 'advanced',
          label: 'Advanced options',
          fields: [
            {
              prop: 'oil_film_options'
            },
            // {
            //   prop: 'update_oilfilm_thickness'
            // },
            {
              prop: 'subsea_options_distribution'
            },
            {
              prop: 'subsea_options_uniform_distribution_parameters'
            },
            {
              prop: 'subsea_options_lognormal_distribution_parameters'
            },
            {
              prop: 'subsea_options_normal_distribution_parameters'
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

export default oilFormOverride
