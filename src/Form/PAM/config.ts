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
        deployment_organization_code: { type: 'string', title: 'Organization Code', description: 'PARS controlled vocabulary organization code' },
        project_name: { type: 'string', title: 'Project Name' },
        project_funding: { type: 'string', title: 'Project Funding', description: 'Funding source or award number' },
      },
      required: ['deployment_organization_code', 'project_name'],
    },
    pam_site: {
      type: 'object',
      title: 'PAM Site',
      description: 'Fixed monitoring location reused across deployments',
      properties: {
        site_code: { type: 'string', title: 'Site Code', description: 'Unique site identifier' },
        deployment_latitude: { type: 'number', title: 'Latitude', minimum: -90, maximum: 90 },
        deployment_longitude: { type: 'number', title: 'Longitude', minimum: -180, maximum: 180 },
        deployment_water_depth_m: { type: 'number', title: 'Water Depth (m)', minimum: 0 },
      },
      required: ['site_code', 'deployment_latitude', 'deployment_longitude'],
    },
    pam_recorder: {
      type: 'object',
      title: 'PAM Recorder',
      description: 'Physical recording device',
      properties: {
        recording_device_code: { type: 'string', title: 'Device Code', description: 'Unique device identifier, e.g. SOUNDTRAP-6078' },
        recording_device_type_code: { type: 'string', title: 'Device Type Code', description: 'PARS controlled vocabulary device type' },
      },
      required: ['recording_device_code', 'recording_device_type_code'],
    },
    pam_recording_config: {
      type: 'object',
      title: 'PAM Recording Configuration',
      description: 'Reusable instrument settings (sample rate, duty cycle, etc.)',
      properties: {
        recording_sample_rate_khz: { type: 'number', title: 'Sample Rate (kHz)', minimum: 0 },
        recording_duration_secs: { type: 'number', title: 'Recording Duration (s)', description: 'Duty cycle on-time in seconds', minimum: 0 },
        recording_interval_secs: { type: 'number', title: 'Recording Interval (s)', description: 'Duty cycle total period in seconds', minimum: 0 },
        recording_bit_depth: { type: 'integer', title: 'Bit Depth', enum: [16, 24, 32] },
        recording_n_channels: { type: 'integer', title: 'Number of Channels', minimum: 1 },
        recording_timezone: { type: 'string', title: 'Recording Timezone', description: 'Timezone of recording timestamps, e.g. UTC' },
      },
      required: ['recording_sample_rate_khz'],
    },
    pam_deployment: {
      type: 'object',
      title: 'PAM Deployment',
      description: 'One deployment event linking project, site, recorder, and config',
      properties: {
        deployment_code: { type: 'string', title: 'Deployment Code', description: 'Unique deployment identifier (links all PARS CSVs)' },
        monitoring_start_datetime: { type: 'string', format: 'date-time', title: 'Monitoring Start' },
        monitoring_end_datetime: { type: 'string', format: 'date-time', title: 'Monitoring End' },
        recording_device_depth_m: { type: 'number', title: 'Hydrophone Depth (m)', description: 'Depth of recording device for this deployment', minimum: 0 },
        deployment_url: { type: 'string', format: 'uri', title: 'Deployment URL', description: 'Link to external status page' },
        platform_type: { type: 'string', title: 'Platform Type', enum: ['fixed', 'mobile'] },
        gps_track_uri: { type: 'string', format: 'uri', title: 'GPS Track File', description: 'URI of uploaded GPS CSV file (mobile platforms only)' },
      },
      required: ['deployment_code', 'monitoring_start_datetime', 'platform_type'],
    },
    pam_analysis: {
      type: 'object',
      title: 'PAM Analysis',
      description: 'One analysis run against a deployment',
      properties: {
        analysis_sound_source_codes: { type: 'array', title: 'Sound Source Codes', description: 'PARS species/sound source codes, e.g. RIWH, HUWH', items: { type: 'string' } },
        analysis_start_datetime: { type: 'string', format: 'date-time', title: 'Analysis Start' },
        analysis_end_datetime: { type: 'string', format: 'date-time', title: 'Analysis End' },
        analysis_min_frequency_khz: { type: 'number', title: 'Min Frequency (kHz)', minimum: 0 },
        analysis_max_frequency_khz: { type: 'number', title: 'Max Frequency (kHz)', minimum: 0 },
        analysis_processing_code: { type: 'string', title: 'Processing Code', enum: ['real-time', 'post-processed'] },
        analysis_protocol_reference: { type: 'string', title: 'Protocol Reference' },
        analysis_citations: { type: 'string', title: 'Citations' },
        analysis_detector_code: { type: 'string', title: 'Detector Code', description: 'Detection software/method, e.g. LFDCS, MANUAL, PAMGUARD' },
        analysis_detector_version: { type: 'string', title: 'Detector Version' },
      },
      required: ['analysis_sound_source_codes', 'analysis_start_datetime', 'analysis_end_datetime', 'analysis_processing_code', 'analysis_detector_code'],
    },
    pam_detection: {
      type: 'object',
      title: 'PAM Detection',
      description: 'Individual detection period (bulk import from CSV)',
      properties: {
        detection_start_datetime: { type: 'string', format: 'date-time', title: 'Detection Start' },
        detection_end_datetime: { type: 'string', format: 'date-time', title: 'Detection End' },
        detection_effort_secs: { type: 'number', title: 'Effort (s)', minimum: 0 },
        detection_sound_source_code: { type: 'string', title: 'Sound Source Code', description: 'Constrained to parent analysis sound_source_codes' },
        detection_call_type_code: { type: 'string', title: 'Call Type Code', description: 'PARS controlled vocabulary call type' },
        detection_n_validated: { type: 'integer', title: 'Number Validated', minimum: 0 },
        detection_result_code: { type: 'string', title: 'Detection Result', enum: ['DETECTED', 'POSSIBLY_DETECTED', 'NOT_DETECTED'] },
        localization_method_code: { type: 'string', title: 'Localization Method' },
        localization_latitude: { type: 'number', title: 'Localization Latitude', minimum: -90, maximum: 90 },
        localization_longitude: { type: 'number', title: 'Localization Longitude', minimum: -180, maximum: 180 },
        localization_distance_m: { type: 'number', title: 'Localization Distance (m)', minimum: 0 },
      },
      required: ['detection_start_datetime', 'detection_end_datetime', 'detection_sound_source_code', 'detection_result_code'],
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
          { prop: 'pam_project.deployment_organization_code' },
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
          { prop: 'pam_site.deployment_latitude' },
          { prop: 'pam_site.deployment_longitude' },
          { prop: 'pam_site.deployment_water_depth_m' },
        ]},
      ],
    },
    {
      id: 'pam_recorder',
      label: 'PAM Recorder',
      description: 'Physical recording device',
      fields: [
        { prop: '_pam_recorder', type: 'object', skip_path: true, label: '', fields: [
          { prop: 'pam_recorder.recording_device_code' },
          { prop: 'pam_recorder.recording_device_type_code' },
        ]},
      ],
    },
    {
      id: 'pam_recording_config',
      label: 'Recording Configuration',
      description: 'Reusable instrument settings',
      fields: [
        { prop: '_pam_recording_config', type: 'object', skip_path: true, label: '', fields: [
          { prop: 'pam_recording_config.recording_sample_rate_khz' },
          { prop: 'pam_recording_config.recording_duration_secs' },
          { prop: 'pam_recording_config.recording_interval_secs' },
          { prop: 'pam_recording_config.recording_bit_depth', type: 'select', options: [{ label: '16-bit', value: 16 }, { label: '24-bit', value: 24 }, { label: '32-bit', value: 32 }] },
          { prop: 'pam_recording_config.recording_n_channels' },
          { prop: 'pam_recording_config.recording_timezone' },
        ]},
      ],
    },
    {
      id: 'pam_deployment',
      label: 'PAM Deployment',
      description: 'Deployment event details',
      fields: [
        { prop: '_pam_deployment', type: 'object', skip_path: true, label: '', fields: [
          { prop: 'pam_deployment.deployment_code' },
          { prop: 'pam_deployment.platform_type', type: 'select', options: [{ label: 'Fixed', value: 'fixed' }, { label: 'Mobile', value: 'mobile' }] },
          { prop: 'pam_deployment.monitoring_start_datetime', type: 'datetime' },
          { prop: 'pam_deployment.monitoring_end_datetime', type: 'datetime' },
          { prop: 'pam_deployment.recording_device_depth_m' },
          { prop: 'pam_deployment.deployment_url' },
          { prop: 'pam_deployment.gps_track_uri' },
        ]},
      ],
    },
    {
      id: 'pam_analysis',
      label: 'PAM Analysis',
      description: 'Analysis run details',
      fields: [
        { prop: '_pam_analysis', type: 'object', skip_path: true, label: '', fields: [
          { prop: 'pam_analysis.analysis_sound_source_codes' },
          { prop: 'pam_analysis.analysis_start_datetime', type: 'datetime' },
          { prop: 'pam_analysis.analysis_end_datetime', type: 'datetime' },
          { prop: 'pam_analysis.analysis_processing_code', type: 'select', options: [{ label: 'Real-time', value: 'real-time' }, { label: 'Post-processed', value: 'post-processed' }] },
          { prop: 'pam_analysis.analysis_detector_code' },
          { prop: 'pam_analysis.analysis_detector_version' },
          { prop: 'pam_analysis.analysis_min_frequency_khz' },
          { prop: 'pam_analysis.analysis_max_frequency_khz' },
          { prop: 'pam_analysis.analysis_protocol_reference' },
          { prop: 'pam_analysis.analysis_citations', type: 'long_text' },
        ]},
      ],
    },
    {
      id: 'pam_detection',
      label: 'PAM Detection',
      description: 'Individual detection period',
      fields: [
        { prop: '_pam_detection', type: 'object', skip_path: true, label: '', fields: [
          { prop: 'pam_detection.detection_start_datetime', type: 'datetime' },
          { prop: 'pam_detection.detection_end_datetime', type: 'datetime' },
          { prop: 'pam_detection.detection_sound_source_code' },
          { prop: 'pam_detection.detection_result_code', type: 'select', options: [{ label: 'Detected', value: 'DETECTED' }, { label: 'Possibly Detected', value: 'POSSIBLY_DETECTED' }, { label: 'Not Detected', value: 'NOT_DETECTED' }] },
          { prop: 'pam_detection.detection_effort_secs' },
          { prop: 'pam_detection.detection_call_type_code' },
          { prop: 'pam_detection.detection_n_validated' },
          { prop: 'pam_detection.localization_method_code' },
          { prop: 'pam_detection.localization_latitude' },
          { prop: 'pam_detection.localization_longitude' },
          { prop: 'pam_detection.localization_distance_m' },
        ]},
      ],
    },
  ],
}
