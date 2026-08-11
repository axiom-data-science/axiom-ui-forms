import { type JSONSchema6 } from 'json-schema'
import { type IFormOverride } from '@/library'

export const pamSchema: JSONSchema6 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'PAM',
  type: 'object',
  properties: {
    pam_project: {
      type: 'object',
      title: 'PAM Project',
      properties: {
        project_organization_code: { type: 'string', title: 'Organization Code', description: 'PARS controlled vocabulary organization code' },
        project_name: { type: 'string', title: 'Project Name' },
        project_funding: { type: 'string', title: 'Project Funding', description: 'Funding source or award number' },
      },
      required: ['project_organization_code', 'project_name'],
    },
    pam_site: {
      type: 'object',
      title: 'PAM Site',
      description: 'Fixed monitoring location reused across deployments',
      properties: {
        site_code: { type: 'string', title: 'Site Code', description: 'Unique site identifier' },
        site_latitude: { type: 'number', title: 'Latitude', minimum: -90, maximum: 90 },
        site_longitude: { type: 'number', title: 'Longitude', minimum: -180, maximum: 180 },
      },
      required: ['site_code', 'site_latitude', 'site_longitude'],
    },
    pam_deployment: {
      type: 'object',
      title: 'PAM Deployment',
      description: 'One deployment event including recorders, recording configurations, and analyses',
      properties: {
        deployment_organization_code: { type: 'string', title: 'Organization Code', description: 'PARS controlled vocabulary organization code for the deploying org' },
        deployment_code: { type: 'string', title: 'Deployment Code', description: 'Unique deployment identifier (links all PARS CSVs)' },
        deployment_water_depth_m: { type: 'number', title: 'Water Depth (m)', minimum: 0 },
        monitoring_start_datetime: { type: 'string', format: 'date-time', title: 'Monitoring Start' },
        monitoring_end_datetime: { type: 'string', format: 'date-time', title: 'Monitoring End' },
        deployment_platform_type_code: { type: 'string', title: 'Platform Type', enum: ['BOTTOM_MOUNTED_MOORING', 'DRIFTING_BUOY', 'ELECTRIC_GLIDER', 'MOORED_SURFACE_BUOY', 'TOWED_ARRAY', 'WAVE_GLIDER'] },
        deployment_platform_id: { type: 'string', title: 'Platform ID', description: 'Optional unique platform identifier, e.g. SLOCUM-WE16' },
        deployment_url: { type: 'string', format: 'uri', title: 'Deployment URL', description: 'Link to external status page' },
        dynamic_management_platform: { type: 'boolean', title: 'Dynamic Management Platform', description: 'True if this deployment generates real-time detections for management' },
        gps_data_uri: { type: 'string', format: 'uri', title: 'GPS Track File', description: 'URI of uploaded GPS CSV file (mobile platforms only)' },
        points_of_contact: {
          type: 'array',
          title: 'Points of Contact',
          items: {
            type: 'object',
            properties: {
              contact_name: { type: 'string', title: 'Full Name' },
              contact_email: { type: 'string', format: 'email', title: 'Email' },
            },
            required: ['contact_name', 'contact_email'],
          },
        },
        recordings: {
          type: 'array',
          title: 'Recordings',
          items: {
            type: 'object',
            properties: {
              recording_device_code: { type: 'string', title: 'Device Code', description: 'Unique recorder identifier, e.g. SOUNDTRAP-6078' },
              recording_device_type_code: { type: 'string', title: 'Device Type Code', description: 'PARS controlled vocabulary device type, e.g. SOUNDTRAP, DMON' },
              recording_device_depth_m: { type: 'number', title: 'Hydrophone Depth (m)', minimum: 0 },
              recording_sample_rate_khz: { type: 'number', title: 'Sample Rate (kHz)', minimum: 0 },
              recording_duration_secs: { type: 'number', title: 'Recording Duration (s)', description: 'Duty cycle on-time in seconds', minimum: 0 },
              recording_interval_secs: { type: 'number', title: 'Recording Interval (s)', description: 'Duty cycle total period in seconds', minimum: 0 },
              recording_bit_depth: { type: 'integer', title: 'Bit Depth', minimum: 0 },
              recording_n_channels: { type: 'integer', title: 'Number of Channels', minimum: 0, default: 1 },
              recording_timezone: { type: 'string', title: 'Recording Timezone', description: 'Timezone of raw soundfiles, e.g. UTC' },
              analyses: {
                type: 'array',
                title: 'Analyses',
                items: {
                  type: 'object',
                  properties: {
                    analysis_organization_code: { type: 'string', title: 'Analysis Organization Code', description: 'PARS controlled vocabulary organization code for the analyzing org' },
                    analysis_sound_source_codes: { type: 'array', title: 'Sound Source Codes', description: 'PARS species/sound source codes, e.g. RIWH, HUWH', items: { type: 'string' } },
                    analysis_start_datetime: { type: 'string', format: 'date-time', title: 'Analysis Start' },
                    analysis_end_datetime: { type: 'string', format: 'date-time', title: 'Analysis End' },
                    analysis_sample_rate_khz: { type: 'number', title: 'Analysis Sample Rate (kHz)', description: 'Sample rate used for analysis; may differ from recording sample rate if resampled', minimum: 0 },
                    analysis_min_frequency_khz: { type: 'number', title: 'Min Frequency (kHz)', minimum: 0, default: 0 },
                    analysis_max_frequency_khz: { type: 'number', title: 'Max Frequency (kHz)', minimum: 0 },
                    analysis_processing_code: { type: 'string', title: 'Processing Code', enum: ['POST_PROCESSED', 'REAL_TIME'] },
                    analysis_protocol_reference: { type: 'string', title: 'Protocol Reference', description: 'Citation/URL for the analysis protocol document' },
                    analysis_citations: { type: 'string', title: 'Citations' },
                    analysis_detector_code: { type: 'string', title: 'Detector Code', description: 'PARS controlled vocabulary, e.g. LFDCS, MANUAL, PAMGUARD' },
                    analysis_detector_version: { type: 'string', title: 'Detector Version' },
                    detections_data_uri: { type: 'string', format: 'uri', title: 'Detections File', description: 'URI of the detections data produced by this analysis' },
                  },
                  required: [
                    'analysis_organization_code',
                    'analysis_sound_source_codes',
                    'analysis_start_datetime',
                    'analysis_end_datetime',
                    'analysis_sample_rate_khz',
                    'analysis_min_frequency_khz',
                    'analysis_max_frequency_khz',
                    'analysis_processing_code',
                    'analysis_protocol_reference',
                    'analysis_detector_code',
                    'analysis_detector_version',
                  ],
                },
              },
            },
            required: [
              'recording_sample_rate_khz',
              'recording_duration_secs',
              'recording_interval_secs',
              'recording_bit_depth',
              'recording_n_channels',
              'recording_timezone',
              'recording_device_code',
              'recording_device_type_code',
              'recording_device_depth_m'
            ],
          },
        },
      },
      required: [
        'deployment_organization_code',
        'deployment_code',
        'monitoring_start_datetime',
        'monitoring_end_datetime',
        'deployment_platform_type_code',
        'deployment_water_depth_m',
        'points_of_contact',
        'recordings',
      ],
    },
  },
}

export const pamForm: IFormOverride = {
  id: 'pam-form',
  label: 'PAM',
  pages: [
    {
      id: 'pam_project',
      label: 'PAM Project',
      description: 'Organization and project details',
      fields: [
        { prop: '_pam_project', type: 'object', skip_path: true, label: '', fields: [
          { prop: 'pam_project.project_organization_code' },
          { prop: 'pam_project.project_name' },
          { prop: 'pam_project.project_funding' },
        ]},
      ],
    },
    {
      id: 'pam_site',
      label: 'PAM Site',
      description: 'Fixed monitoring location',
      fields: [
        { prop: '_pam_site', type: 'object', skip_path: true, label: '', fields: [
          { prop: 'pam_site.site_code' },
          { prop: 'pam_site.site_latitude' },
          { prop: 'pam_site.site_longitude' },
        ]},
      ],
    },
    {
      id: 'pam_deployment',
      label: 'PAM Deployment',
      description: 'Deployment event details',
      fields: [
        { prop: '_pam_deployment', type: 'object', skip_path: true, label: '', fields: [
          { prop: 'pam_deployment.deployment_organization_code' },
          { prop: 'pam_deployment.deployment_code' },
          { prop: 'pam_deployment.monitoring_start_datetime', type: 'datetime' },
          { prop: 'pam_deployment.monitoring_end_datetime', type: 'datetime' },
          { prop: 'pam_deployment.deployment_platform_type_code' },
          { prop: 'pam_deployment.deployment_platform_id' },
          { prop: 'pam_deployment.deployment_water_depth_m' },
          { prop: 'pam_deployment.points_of_contact' },
          { prop: 'pam_deployment.deployment_url' },
          { prop: 'pam_deployment.gps_data_uri' },
          { prop: 'pam_deployment.dynamic_management_platform', type: 'checkbox' },
        ]},
      ],
    },
    {
      id: 'pam_recordings',
      label: 'Recordings',
      description: 'Recording devices and analysis runs for this deployment',
      fields: [
        { prop: 'pam_deployment.recordings', type: 'object', multiple: true, tabs: [
          { id: 'recording_info', label: 'Device & Config', fields: [
            { prop: 'recordings[].recording_device_code' },
            { prop: 'recordings[].recording_device_type_code' },
            { prop: 'recordings[].recording_device_depth_m' },
            { prop: 'recordings[].recording_sample_rate_khz' },
            { prop: 'recordings[].recording_duration_secs' },
            { prop: 'recordings[].recording_interval_secs' },
            { prop: 'recordings[].recording_bit_depth' },
            { prop: 'recordings[].recording_n_channels' },
            { prop: 'recordings[].recording_timezone' },
          ]},
          { id: 'analyses', label: 'Analyses', fields: [
            { prop: 'recordings[].analyses', type: 'object', multiple: true, tabs: [
              { id: 'analysis_info', label: 'Analysis', fields: [
                { prop: 'recordings[].analyses[].analysis_organization_code' },
                { prop: 'recordings[].analyses[].analysis_sound_source_codes' },
                { prop: 'recordings[].analyses[].analysis_start_datetime', type: 'datetime' },
                { prop: 'recordings[].analyses[].analysis_end_datetime', type: 'datetime' },
                { prop: 'recordings[].analyses[].analysis_processing_code' },
                { prop: 'recordings[].analyses[].analysis_detector_code' },
                { prop: 'recordings[].analyses[].analysis_detector_version' },
                { prop: 'recordings[].analyses[].analysis_sample_rate_khz' },
                { prop: 'recordings[].analyses[].analysis_min_frequency_khz' },
                { prop: 'recordings[].analyses[].analysis_max_frequency_khz' },
                { prop: 'recordings[].analyses[].analysis_protocol_reference' },
                { prop: 'recordings[].analyses[].analysis_citations', type: 'long_text' },
                { prop: 'recordings[].analyses[].detections_data_uri' },
              ]},
            ]},
          ]},
        ]},
      ],
    },
  ],
}
