import { type IFormOverride } from '@/Form/Creator/FormCreatorTypes'

const habFormOverride: IFormOverride = {
  id: 'hab',
  label: 'HAB Form',
  description: 'HAB Form',
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
      id: 'hab-options',
      label: 'HAB options',
      pages: [
        {
          id: 'basic',
          label: 'Basic options',
          fields: [
            {
              prop: 'species_type',
              type: 'radio',
              defaultValue: 'custom'
            },
            {
              prop: 'custom_species_type_settings',
              label: 'Species type options',
              skip_path: true,
              type: 'object',
              conditions: {
                dependsOn: 'species_type',
                operator: '=',
                value: 'custom'
              },
              fields: [
                {
                  prop: 'temperature_death_min',
                  conditions: {
                    dependsOn: 'species_type',
                    operator: '=',
                    value: 'custom'
                  }
                },
                {
                  prop: 'temperature_death_max',
                  conditions: {
                    dependsOn: 'species_type',
                    operator: '=',
                    value: 'custom'
                  }
                },
                {
                  prop: 'mortality_rate_high',
                  conditions: {
                    dependsOn: 'species_type',
                    operator: '=',
                    value: 'custom'
                  }
                },
                {
                  prop: 'salinity_death_min',
                  conditions: {
                    dependsOn: 'species_type',
                    operator: '=',
                    value: 'custom'
                  }
                },
                {
                  prop: 'salinity_death_max',
                  conditions: {
                    dependsOn: 'species_type',
                    operator: '=',
                    value: 'custom'
                  }
                }
              ]
            }
          ]
        },
        {
          id: 'advanced',
          label: 'Advanced options',
          fields: []
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
export default habFormOverride
