import { type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const oilFormOverride: IFormFieldOverride[] = [
  {
    prop: ***REMOVED***emulsification***REMOVED***,
    label: ***REMOVED***Oil Emulsification***REMOVED***
  },
  {
    prop: ***REMOVED***oil_film_thickness***REMOVED***,
    description: ***REMOVED***Initial oil film thickness, in meters.***REMOVED***,
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
    prop: ***REMOVED***m3_per_hour***REMOVED***,
    label: ***REMOVED***Flow rate (m3/h): between 0.001 and 1,000,000***REMOVED***,
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
    prop: ***REMOVED***oil_type***REMOVED***,
    defaultValue: [***REMOVED***EC02713***REMOVED***, ***REMOVED***Alaska North Slope [2015]***REMOVED***]
  },
  // {
  //   prop: ***REMOVED***subsea_or_not***REMOVED***,
  //   label: ***REMOVED***Subsea?***REMOVED***,
  //   description: ***REMOVED***Check box if the simulation will be initialized below the surface; some advanced options become available.***REMOVED***,
  //   type: ***REMOVED***boolean***REMOVED***,
  //   defaultValue: false
  // },
  {
    prop: ***REMOVED***subsea_options_distribution***REMOVED***,
    skip_path: true,
    type: ***REMOVED***object***REMOVED***,
    conditions: {
      dependsOn: ***REMOVED***z***REMOVED***,
      value: 0
    },
    fields: [
      {
        prop: ***REMOVED***droplet_size_distribution***REMOVED***
      }
    ]
  },
  {
    prop: ***REMOVED***droplet_size_distribution***REMOVED***,
    defaultValue: ***REMOVED******REMOVED***
  },
  {
    prop: ***REMOVED***subsea_options_uniform_distribution_parameters***REMOVED***,
    skip_path: true,
    type: ***REMOVED***object***REMOVED***,
    conditions: {
      dependsOn: ***REMOVED***droplet_size_distribution***REMOVED***,
      value: ***REMOVED***uniform***REMOVED***
    },
    fields: [
      {
        prop: ***REMOVED***droplet_diameter_min_subsea***REMOVED***
      },
      {
        prop: ***REMOVED***droplet_diameter_max_subsea***REMOVED***
      }
    ]
  },
  {
    prop: ***REMOVED***subsea_options_lognormal_distribution_parameters***REMOVED***,
    skip_path: true,
    type: ***REMOVED***object***REMOVED***,
    conditions: {
      dependsOn: ***REMOVED***droplet_size_distribution***REMOVED***,
      value: ***REMOVED***lognormal***REMOVED***
    },
    fields: [
      {
        prop: ***REMOVED***droplet_diameter_sigma***REMOVED***
      },
      {
        prop: ***REMOVED***droplet_diameter_mu***REMOVED***
      }
    ]
  },
  {
    prop: ***REMOVED***subsea_options_normal_distribution_parameters***REMOVED***,
    skip_path: true,
    type: ***REMOVED***object***REMOVED***,
    conditions: {
      dependsOn: ***REMOVED***droplet_size_distribution***REMOVED***,
      value: ***REMOVED***normal***REMOVED***
    },
    fields: [
      {
        prop: ***REMOVED***droplet_diameter_sigma***REMOVED***
      },
      {
        prop: ***REMOVED***droplet_diameter_mu***REMOVED***
      }
    ]
  },
  // {
  //   prop: ***REMOVED***oil_spill_scenarios***REMOVED***,
  //   label: ***REMOVED***Oil Spill Scenarios***REMOVED***,
  //   description: ***REMOVED***Scenarios for oil spills, which select some subsequent parameters.***REMOVED***,
  //   type: ***REMOVED***select***REMOVED***,
  //   defaultValue: ***REMOVED***oil_slick***REMOVED***,
  //   options: [
  //     {
  //       label: ***REMOVED***Oil Slick***REMOVED***,
  //       value: ***REMOVED***oil_slick***REMOVED***
  //     },
  //     {
  //       label: ***REMOVED***Subsea Blowout***REMOVED***,
  //       value: ***REMOVED***subsea_blowout***REMOVED***
  //     },
  //     {
  //       label: ***REMOVED***Ship Track***REMOVED***,
  //       value: ***REMOVED***ship_track***REMOVED***
  //     }
  //   ]
  // },
  {
    prop: ***REMOVED***oil_weathering_options***REMOVED***,
    description: ***REMOVED***Options for oil weathering in addition to updating oil density and viscosity according to temperature.***REMOVED***,
    skip_path: true,
    type: ***REMOVED***object***REMOVED***,
    fields: [
      {
        prop: ***REMOVED***evaporation***REMOVED***
      },
      {
        prop: ***REMOVED***emulsification***REMOVED***
      },
      {
        prop: ***REMOVED***biodegradation***REMOVED***
      }
    ]
  },
  {
    prop: ***REMOVED***update_oilfilm_thickness***REMOVED***,
    defaultValue: false,
    description: ***REMOVED***If True, oil film thickness is calculated at each time step starting from the initial oil film value. If False, oil film thickness is kept constant with value provided at seeding. This option is not automatically on because it is costly and simplistic, and does not significantly affect the end result.***REMOVED***
  },
  {
    prop: ***REMOVED***wind_drift_depth***REMOVED***,
    constraints: {
      min: 0,
      max: 10
    }
  },
  {
    prop: ***REMOVED***wind_drift_factor***REMOVED***,
    constraints: {
      min: 0,
      max: 1
    },
    settings: {
      step: 0.01
    }
  }
]

export default oilFormOverride
