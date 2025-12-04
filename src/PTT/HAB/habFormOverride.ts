import { type IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const habFormOverrid: IFormOverride = {
  id: ***REMOVED***larval***REMOVED***,
  label: ***REMOVED***Larval Form***REMOVED***,
  description: ***REMOVED***Larval Form***REMOVED***,
  wizard_steps: [
    {
      id: ***REMOVED***title***REMOVED***,
      label: ***REMOVED***Title***REMOVED***,
      description: ***REMOVED***Title of the form***REMOVED***,
      fields: [
        {
          prop: ***REMOVED***title***REMOVED***,
          label: ***REMOVED***Title***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          required: true,
          description: ***REMOVED***Title of your simulation***REMOVED***
        }
      ]
    },
    {
      id: ***REMOVED***ocean-model***REMOVED***,
      label: ***REMOVED***Ocean Model and time***REMOVED***,
      pages: [
        {
          id: ***REMOVED***basic***REMOVED***,
          label: ***REMOVED***Basic options***REMOVED***,
          fields: [
            {
              prop: ***REMOVED***ocean_model***REMOVED***
            },
            {
              prop: ***REMOVED***start_time***REMOVED***
            },
            {
              prop: ***REMOVED***end_time***REMOVED***
            },
            {
              prop: ***REMOVED***duration***REMOVED***
            }
          ]
        },
        {
          id: ***REMOVED***advanced***REMOVED***,
          label: ***REMOVED***Advanced options***REMOVED***,
          fields: [
            {
              prop: ***REMOVED***time_step***REMOVED***
            },
            {
              prop: ***REMOVED***time_step_output***REMOVED***
            }
          ]
        }
      ]
    },
    {
      id: ***REMOVED***map***REMOVED***,
      label: ***REMOVED***Map***REMOVED***,
      pages: [
        {
          id: ***REMOVED***selection***REMOVED***,
          label: ***REMOVED***Basic options***REMOVED***,
          fields: [
            {
              prop: ***REMOVED***shape_type***REMOVED***
            },
            {
              prop: ***REMOVED***point***REMOVED***
            },
            {
              prop: ***REMOVED***polygon***REMOVED***
            },
            {
              prop: ***REMOVED***linestring***REMOVED***
            },
            {
              prop: ***REMOVED***shapefile***REMOVED***
            },
            {
              prop: ***REMOVED***number***REMOVED***
            },
            {
              prop: ***REMOVED***radius***REMOVED***
            },
            {
              prop: ***REMOVED***do3D***REMOVED***
            },
            {
              prop: ***REMOVED***depth_options***REMOVED***
            }
          ]
        },
        {
          id: ***REMOVED***advanced-map***REMOVED***,
          label: ***REMOVED***Advanced options***REMOVED***,
          fields: [
            {
              prop: ***REMOVED***radius_type***REMOVED***,
              defaultValue: ***REMOVED***gaussian***REMOVED***
            }
          ]
        }
      ]
    },
    {
      id: ***REMOVED***hab-options***REMOVED***,
      label: ***REMOVED***HAB options***REMOVED***,
      pages: [
        {
          id: ***REMOVED***basic***REMOVED***,
          label: ***REMOVED***Basic options***REMOVED***,
          fields: [

          ]
        },
        {
          id: ***REMOVED***advanced***REMOVED***,
          label: ***REMOVED***Advanced options***REMOVED***,
          fields: [

          ]
        }
      ]
    },
    {
      id: ***REMOVED***physical-processes***REMOVED***,
      label: ***REMOVED***Physical processes***REMOVED***,
      pages: [
        {
          id: ***REMOVED***basic***REMOVED***,
          label: ***REMOVED***Basic options***REMOVED***,
          fields: [
            {
              prop: ***REMOVED***wind_drift***REMOVED***
            },
            {
              prop: ***REMOVED***wind_drift_options***REMOVED***
            },
            {
              prop: ***REMOVED***vertical_mixing***REMOVED***
            },
            {
              prop: ***REMOVED***stokes_drift***REMOVED***
            },
            {
              prop: ***REMOVED***horizontal_diffusivity***REMOVED***
            }
          ]
        },
        {
          id: ***REMOVED***advanced***REMOVED***,
          label: ***REMOVED***Advanced options***REMOVED***,
          fields: [
            {
              prop: ***REMOVED***vertical_mixing_options***REMOVED***
            },
            {
              prop: ***REMOVED***diffusivitymodel***REMOVED***
            },
            {
              prop: ***REMOVED***current_uncertainty***REMOVED***
            },
            {
              prop: ***REMOVED***wind_uncertainty***REMOVED***
            }
          ]
        }
      ]

    },
    {
      id: ***REMOVED***run-mechanics***REMOVED***,
      label: ***REMOVED***Run mechanics***REMOVED***,
      pages: [
        {
          id: ***REMOVED***basic***REMOVED***,
          label: ***REMOVED***Basic options***REMOVED***,
          fields: [
            {
              prop: ***REMOVED***output_format***REMOVED***
            },
            {
              prop: ***REMOVED***coastline_action***REMOVED***
            },
            {
              prop: ***REMOVED***seafloor_action***REMOVED***
            }
          ]
        },
        {
          id: ***REMOVED***advanced***REMOVED***,
          label: ***REMOVED***Advanced options***REMOVED***,
          fields: [
            {
              prop: ***REMOVED***use_static_masks***REMOVED***
            },
            {
              prop: ***REMOVED***use_auto_landmask***REMOVED***
            }
          ]
        }
      ]
    }

  ]
}

export default habFormOverrid
