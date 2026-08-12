import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { type IFormOverride } from ***REMOVED***@/library***REMOVED***

export const pamSchema: JSONSchema6 = {
  $schema: ***REMOVED***http://json-schema.org/draft-07/schema#***REMOVED***,
  title: ***REMOVED***PAM***REMOVED***,
  type: ***REMOVED***object***REMOVED***,
  properties: {
    pam_project: {
      type: ***REMOVED***object***REMOVED***,
      title: ***REMOVED***PAM Project***REMOVED***,
      properties: {
        project_organization_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Organization Code***REMOVED***, description: ***REMOVED***PARS controlled vocabulary organization code***REMOVED*** },
        project_name: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Project Name***REMOVED*** },
        project_funding: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Project Funding***REMOVED***, description: ***REMOVED***Funding source or award number***REMOVED*** },
      },
      required: [***REMOVED***project_organization_code***REMOVED***, ***REMOVED***project_name***REMOVED***],
    },
    pam_site: {
      type: ***REMOVED***object***REMOVED***,
      title: ***REMOVED***PAM Site***REMOVED***,
      description: ***REMOVED***Fixed monitoring location reused across deployments***REMOVED***,
      properties: {
        site_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Site Code***REMOVED***, description: ***REMOVED***Unique site identifier***REMOVED*** },
        site_latitude: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Latitude***REMOVED***, minimum: -90, maximum: 90 },
        site_longitude: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Longitude***REMOVED***, minimum: -180, maximum: 180 },
      },
      required: [***REMOVED***site_code***REMOVED***, ***REMOVED***site_latitude***REMOVED***, ***REMOVED***site_longitude***REMOVED***],
    },
    pam_deployment: {
      type: ***REMOVED***object***REMOVED***,
      title: ***REMOVED***PAM Deployment***REMOVED***,
      description: ***REMOVED***One deployment event including recorders, recording configurations, and analyses***REMOVED***,
      properties: {
        deployment_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Deployment Code***REMOVED***, description: ***REMOVED***Unique deployment identifier (links all PARS CSVs)***REMOVED*** },
        deployment_water_depth_m: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Water Depth (m)***REMOVED***, minimum: 0 },
        monitoring_start_datetime: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***date-time***REMOVED***, title: ***REMOVED***Monitoring Start***REMOVED*** },
        monitoring_end_datetime: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***date-time***REMOVED***, title: ***REMOVED***Monitoring End***REMOVED*** },
        deployment_platform_type_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Platform Type***REMOVED***, enum: [***REMOVED***BOTTOM_MOUNTED_MOORING***REMOVED***, ***REMOVED***DRIFTING_BUOY***REMOVED***, ***REMOVED***ELECTRIC_GLIDER***REMOVED***, ***REMOVED***MOORED_SURFACE_BUOY***REMOVED***, ***REMOVED***TOWED_ARRAY***REMOVED***, ***REMOVED***WAVE_GLIDER***REMOVED***] },
        deployment_platform_id: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Platform ID***REMOVED***, description: ***REMOVED***Optional unique platform identifier, e.g. SLOCUM-WE16***REMOVED*** },
        deployment_url: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***uri***REMOVED***, title: ***REMOVED***Deployment URL***REMOVED***, description: ***REMOVED***Link to external status page***REMOVED*** },
        dynamic_management_platform: { type: ***REMOVED***boolean***REMOVED***, title: ***REMOVED***Dynamic Management Platform***REMOVED***, description: ***REMOVED***True if this deployment generates real-time detections for management***REMOVED*** },
        gps_data_uri: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***uri***REMOVED***, title: ***REMOVED***GPS Track File***REMOVED***, description: ***REMOVED***URI of uploaded GPS CSV file (mobile platforms only)***REMOVED*** },
        points_of_contact: {
          type: ***REMOVED***array***REMOVED***,
          title: ***REMOVED***Points of Contact***REMOVED***,
          items: {
            type: ***REMOVED***object***REMOVED***,
            properties: {
              contact_name: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Full Name***REMOVED*** },
              contact_email: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***email***REMOVED***, title: ***REMOVED***Email***REMOVED*** },
            },
            required: [***REMOVED***contact_name***REMOVED***, ***REMOVED***contact_email***REMOVED***],
          },
        },
        recordings: {
          type: ***REMOVED***array***REMOVED***,
          title: ***REMOVED***Recordings***REMOVED***,
          items: {
            type: ***REMOVED***object***REMOVED***,
            properties: {
              recording_device_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Device Code***REMOVED***, description: ***REMOVED***Unique recorder identifier, e.g. SOUNDTRAP-6078***REMOVED*** },
              recording_device_type_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Device Type Code***REMOVED***, description: ***REMOVED***PARS controlled vocabulary device type, e.g. SOUNDTRAP, DMON***REMOVED*** },
              recording_device_depth_m: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Hydrophone Depth (m)***REMOVED***, minimum: 0 },
              recording_sample_rate_khz: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Sample Rate (kHz)***REMOVED***, minimum: 0 },
              recording_duration_secs: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Recording Duration (s)***REMOVED***, description: ***REMOVED***Duty cycle on-time in seconds***REMOVED***, minimum: 0 },
              recording_interval_secs: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Recording Interval (s)***REMOVED***, description: ***REMOVED***Duty cycle total period in seconds***REMOVED***, minimum: 0 },
              recording_bit_depth: { type: ***REMOVED***integer***REMOVED***, title: ***REMOVED***Bit Depth***REMOVED***, minimum: 0 },
              recording_n_channels: { type: ***REMOVED***integer***REMOVED***, title: ***REMOVED***Number of Channels***REMOVED***, minimum: 0, default: 1 },
              recording_timezone: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Recording Timezone***REMOVED***, description: ***REMOVED***Timezone of raw soundfiles, e.g. UTC***REMOVED*** },
              analyses: {
                type: ***REMOVED***array***REMOVED***,
                title: ***REMOVED***Analyses***REMOVED***,
                items: {
                  type: ***REMOVED***object***REMOVED***,
                  properties: {
                    analysis_organization_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Analysis Organization Code***REMOVED***, description: ***REMOVED***PARS controlled vocabulary organization code for the analyzing org***REMOVED*** },
                    analysis_sound_source_codes: { type: ***REMOVED***array***REMOVED***, title: ***REMOVED***Sound Source Codes***REMOVED***, description: ***REMOVED***PARS species/sound source codes, e.g. RIWH, HUWH***REMOVED***, items: { type: ***REMOVED***string***REMOVED*** } },
                    analysis_start_datetime: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***date-time***REMOVED***, title: ***REMOVED***Analysis Start***REMOVED*** },
                    analysis_end_datetime: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***date-time***REMOVED***, title: ***REMOVED***Analysis End***REMOVED*** },
                    analysis_sample_rate_khz: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Analysis Sample Rate (kHz)***REMOVED***, description: ***REMOVED***Sample rate used for analysis; may differ from recording sample rate if resampled***REMOVED***, minimum: 0 },
                    analysis_min_frequency_khz: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Min Frequency (kHz)***REMOVED***, minimum: 0, default: 0 },
                    analysis_max_frequency_khz: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Max Frequency (kHz)***REMOVED***, minimum: 0 },
                    analysis_processing_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Processing Code***REMOVED***, enum: [***REMOVED***POST_PROCESSED***REMOVED***, ***REMOVED***REAL_TIME***REMOVED***] },
                    analysis_protocol_reference: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Protocol Reference***REMOVED***, description: ***REMOVED***Citation/URL for the analysis protocol document***REMOVED*** },
                    analysis_citations: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Citations***REMOVED*** },
                    analysis_detector_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Detector Code***REMOVED***, description: ***REMOVED***PARS controlled vocabulary, e.g. LFDCS, MANUAL, PAMGUARD***REMOVED*** },
                    analysis_detector_version: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Detector Version***REMOVED*** },
                    detections_data_uri: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***uri***REMOVED***, title: ***REMOVED***Detections File***REMOVED***, description: ***REMOVED***URI of the detections data produced by this analysis***REMOVED*** },
                  },
                  required: [
                    ***REMOVED***analysis_organization_code***REMOVED***,
                    ***REMOVED***analysis_sound_source_codes***REMOVED***,
                    ***REMOVED***analysis_start_datetime***REMOVED***,
                    ***REMOVED***analysis_end_datetime***REMOVED***,
                    ***REMOVED***analysis_sample_rate_khz***REMOVED***,
                    ***REMOVED***analysis_min_frequency_khz***REMOVED***,
                    ***REMOVED***analysis_max_frequency_khz***REMOVED***,
                    ***REMOVED***analysis_processing_code***REMOVED***,
                    ***REMOVED***analysis_protocol_reference***REMOVED***,
                    ***REMOVED***analysis_detector_code***REMOVED***,
                    ***REMOVED***analysis_detector_version***REMOVED***,
                  ],
                },
              },
            },
            required: [
              ***REMOVED***recording_sample_rate_khz***REMOVED***,
              ***REMOVED***recording_duration_secs***REMOVED***,
              ***REMOVED***recording_interval_secs***REMOVED***,
              ***REMOVED***recording_bit_depth***REMOVED***,
              ***REMOVED***recording_n_channels***REMOVED***,
              ***REMOVED***recording_timezone***REMOVED***,
              ***REMOVED***recording_device_code***REMOVED***,
              ***REMOVED***recording_device_type_code***REMOVED***,
              ***REMOVED***recording_device_depth_m***REMOVED***
            ],
          },
        },
      },
      required: [
        ***REMOVED***deployment_code***REMOVED***,
        ***REMOVED***monitoring_start_datetime***REMOVED***,
        ***REMOVED***monitoring_end_datetime***REMOVED***,
        ***REMOVED***deployment_platform_type_code***REMOVED***,
        ***REMOVED***deployment_water_depth_m***REMOVED***,
        ***REMOVED***points_of_contact***REMOVED***,
        ***REMOVED***recordings***REMOVED***,
      ],
    },
  },
}

export const pamForm: IFormOverride = {
  id: ***REMOVED***pam-form***REMOVED***,
  label: ***REMOVED***PAM***REMOVED***,
  pages: [
    {
      id: ***REMOVED***pam_project***REMOVED***,
      label: ***REMOVED***PAM Project***REMOVED***,
      description: ***REMOVED***Organization and project details***REMOVED***,
      fields: [
        { prop: ***REMOVED***_pam_project***REMOVED***, type: ***REMOVED***object***REMOVED***, skip_path: true, label: ***REMOVED******REMOVED***, fields: [
          { prop: ***REMOVED***pam_project.project_organization_code***REMOVED*** },
          { prop: ***REMOVED***pam_project.project_name***REMOVED*** },
          { prop: ***REMOVED***pam_project.project_funding***REMOVED*** },
        ]},
      ],
    },
    {
      id: ***REMOVED***pam_site***REMOVED***,
      label: ***REMOVED***PAM Site***REMOVED***,
      description: ***REMOVED***Fixed monitoring location***REMOVED***,
      fields: [
        { prop: ***REMOVED***_pam_site***REMOVED***, type: ***REMOVED***object***REMOVED***, skip_path: true, label: ***REMOVED******REMOVED***, fields: [
          { prop: ***REMOVED***pam_site.site_code***REMOVED*** },
          { prop: ***REMOVED***pam_site.site_latitude***REMOVED*** },
          { prop: ***REMOVED***pam_site.site_longitude***REMOVED*** },
        ]},
      ],
    },
    {
      id: ***REMOVED***pam_deployment***REMOVED***,
      label: ***REMOVED***PAM Deployment***REMOVED***,
      description: ***REMOVED***Deployment event details***REMOVED***,
      fields: [
        { prop: ***REMOVED***_pam_deployment***REMOVED***, type: ***REMOVED***object***REMOVED***, skip_path: true, label: ***REMOVED******REMOVED***, fields: [
          { prop: ***REMOVED***pam_deployment.deployment_code***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.monitoring_start_datetime***REMOVED***, type: ***REMOVED***datetime***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.monitoring_end_datetime***REMOVED***, type: ***REMOVED***datetime***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.deployment_platform_type_code***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.deployment_platform_id***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.deployment_water_depth_m***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.points_of_contact***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.deployment_url***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.gps_data_uri***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.dynamic_management_platform***REMOVED***, type: ***REMOVED***checkbox***REMOVED*** },
        ]},
      ],
    },
    {
      id: ***REMOVED***pam_recordings***REMOVED***,
      label: ***REMOVED***Recordings***REMOVED***,
      description: ***REMOVED***Recording devices and analysis runs for this deployment***REMOVED***,
      fields: [
        { prop: ***REMOVED***pam_deployment.recordings***REMOVED***, type: ***REMOVED***object***REMOVED***, multiple: true, tabs: [
          { id: ***REMOVED***recording_info***REMOVED***, label: ***REMOVED***Device & Config***REMOVED***, fields: [
            { prop: ***REMOVED***recordings[].recording_device_code***REMOVED*** },
            { prop: ***REMOVED***recordings[].recording_device_type_code***REMOVED*** },
            { prop: ***REMOVED***recordings[].recording_device_depth_m***REMOVED*** },
            { prop: ***REMOVED***recordings[].recording_sample_rate_khz***REMOVED*** },
            { prop: ***REMOVED***recordings[].recording_duration_secs***REMOVED*** },
            { prop: ***REMOVED***recordings[].recording_interval_secs***REMOVED*** },
            { prop: ***REMOVED***recordings[].recording_bit_depth***REMOVED*** },
            { prop: ***REMOVED***recordings[].recording_n_channels***REMOVED*** },
            { prop: ***REMOVED***recordings[].recording_timezone***REMOVED*** },
          ]},
          { id: ***REMOVED***analyses***REMOVED***, label: ***REMOVED***Analyses***REMOVED***, fields: [
            { prop: ***REMOVED***recordings[].analyses***REMOVED***, type: ***REMOVED***object***REMOVED***, multiple: true, tabs: [
              { id: ***REMOVED***analysis_info***REMOVED***, label: ***REMOVED***Analysis***REMOVED***, fields: [
                { prop: ***REMOVED***recordings[].analyses[].analysis_organization_code***REMOVED*** },
                { prop: ***REMOVED***recordings[].analyses[].analysis_sound_source_codes***REMOVED*** },
                { prop: ***REMOVED***recordings[].analyses[].analysis_start_datetime***REMOVED***, type: ***REMOVED***datetime***REMOVED*** },
                { prop: ***REMOVED***recordings[].analyses[].analysis_end_datetime***REMOVED***, type: ***REMOVED***datetime***REMOVED*** },
                { prop: ***REMOVED***recordings[].analyses[].analysis_processing_code***REMOVED*** },
                { prop: ***REMOVED***recordings[].analyses[].analysis_detector_code***REMOVED*** },
                { prop: ***REMOVED***recordings[].analyses[].analysis_detector_version***REMOVED*** },
                { prop: ***REMOVED***recordings[].analyses[].analysis_sample_rate_khz***REMOVED*** },
                { prop: ***REMOVED***recordings[].analyses[].analysis_min_frequency_khz***REMOVED*** },
                { prop: ***REMOVED***recordings[].analyses[].analysis_max_frequency_khz***REMOVED*** },
                { prop: ***REMOVED***recordings[].analyses[].analysis_protocol_reference***REMOVED*** },
                { prop: ***REMOVED***recordings[].analyses[].analysis_citations***REMOVED***, type: ***REMOVED***long_text***REMOVED*** },
                { prop: ***REMOVED***recordings[].analyses[].detections_data_uri***REMOVED*** },
              ]},
            ]},
          ]},
        ]},
      ],
    },
  ],
}
