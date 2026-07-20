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
        deployment_organization_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Organization Code***REMOVED***, description: ***REMOVED***PARS controlled vocabulary organization code***REMOVED*** },
        project_name: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Project Name***REMOVED*** },
        project_funding: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Project Funding***REMOVED***, description: ***REMOVED***Funding source or award number***REMOVED*** },
      },
      required: [***REMOVED***deployment_organization_code***REMOVED***, ***REMOVED***project_name***REMOVED***],
    },
    pam_site: {
      type: ***REMOVED***object***REMOVED***,
      title: ***REMOVED***PAM Site***REMOVED***,
      description: ***REMOVED***Fixed monitoring location reused across deployments***REMOVED***,
      properties: {
        site_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Site Code***REMOVED***, description: ***REMOVED***Unique site identifier***REMOVED*** },
        deployment_latitude: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Latitude***REMOVED***, minimum: -90, maximum: 90 },
        deployment_longitude: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Longitude***REMOVED***, minimum: -180, maximum: 180 },
        deployment_water_depth_m: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Water Depth (m)***REMOVED***, minimum: 0 },
      },
      required: [***REMOVED***site_code***REMOVED***, ***REMOVED***deployment_latitude***REMOVED***, ***REMOVED***deployment_longitude***REMOVED***],
    },
    pam_recorder: {
      type: ***REMOVED***object***REMOVED***,
      title: ***REMOVED***PAM Recorder***REMOVED***,
      description: ***REMOVED***Physical recording device***REMOVED***,
      properties: {
        recording_device_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Device Code***REMOVED***, description: ***REMOVED***Unique device identifier, e.g. SOUNDTRAP-6078***REMOVED*** },
        recording_device_type_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Device Type Code***REMOVED***, description: ***REMOVED***PARS controlled vocabulary device type***REMOVED*** },
      },
      required: [***REMOVED***recording_device_code***REMOVED***, ***REMOVED***recording_device_type_code***REMOVED***],
    },
    pam_recording_config: {
      type: ***REMOVED***object***REMOVED***,
      title: ***REMOVED***PAM Recording Configuration***REMOVED***,
      description: ***REMOVED***Reusable instrument settings (sample rate, duty cycle, etc.)***REMOVED***,
      properties: {
        recording_sample_rate_khz: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Sample Rate (kHz)***REMOVED***, minimum: 0 },
        recording_duration_secs: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Recording Duration (s)***REMOVED***, description: ***REMOVED***Duty cycle on-time in seconds***REMOVED***, minimum: 0 },
        recording_interval_secs: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Recording Interval (s)***REMOVED***, description: ***REMOVED***Duty cycle total period in seconds***REMOVED***, minimum: 0 },
        recording_bit_depth: { type: ***REMOVED***integer***REMOVED***, title: ***REMOVED***Bit Depth***REMOVED***, enum: [16, 24, 32] },
        recording_n_channels: { type: ***REMOVED***integer***REMOVED***, title: ***REMOVED***Number of Channels***REMOVED***, minimum: 1 },
        recording_timezone: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Recording Timezone***REMOVED***, description: ***REMOVED***Timezone of recording timestamps, e.g. UTC***REMOVED*** },
      },
      required: [***REMOVED***recording_sample_rate_khz***REMOVED***],
    },
    pam_deployment: {
      type: ***REMOVED***object***REMOVED***,
      title: ***REMOVED***PAM Deployment***REMOVED***,
      description: ***REMOVED***One deployment event linking project, site, recorder, and config***REMOVED***,
      properties: {
        deployment_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Deployment Code***REMOVED***, description: ***REMOVED***Unique deployment identifier (links all PARS CSVs)***REMOVED*** },
        monitoring_start_datetime: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***date-time***REMOVED***, title: ***REMOVED***Monitoring Start***REMOVED*** },
        monitoring_end_datetime: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***date-time***REMOVED***, title: ***REMOVED***Monitoring End***REMOVED*** },
        recording_device_depth_m: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Hydrophone Depth (m)***REMOVED***, description: ***REMOVED***Depth of recording device for this deployment***REMOVED***, minimum: 0 },
        deployment_url: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***uri***REMOVED***, title: ***REMOVED***Deployment URL***REMOVED***, description: ***REMOVED***Link to external status page***REMOVED*** },
        platform_type: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Platform Type***REMOVED***, enum: [***REMOVED***fixed***REMOVED***, ***REMOVED***mobile***REMOVED***] },
        gps_track_uri: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***uri***REMOVED***, title: ***REMOVED***GPS Track File***REMOVED***, description: ***REMOVED***URI of uploaded GPS CSV file (mobile platforms only)***REMOVED*** },
      },
      required: [***REMOVED***deployment_code***REMOVED***, ***REMOVED***monitoring_start_datetime***REMOVED***, ***REMOVED***platform_type***REMOVED***],
    },
    pam_analysis: {
      type: ***REMOVED***object***REMOVED***,
      title: ***REMOVED***PAM Analysis***REMOVED***,
      description: ***REMOVED***One analysis run against a deployment***REMOVED***,
      properties: {
        analysis_sound_source_codes: { type: ***REMOVED***array***REMOVED***, title: ***REMOVED***Sound Source Codes***REMOVED***, description: ***REMOVED***PARS species/sound source codes, e.g. RIWH, HUWH***REMOVED***, items: { type: ***REMOVED***string***REMOVED*** } },
        analysis_start_datetime: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***date-time***REMOVED***, title: ***REMOVED***Analysis Start***REMOVED*** },
        analysis_end_datetime: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***date-time***REMOVED***, title: ***REMOVED***Analysis End***REMOVED*** },
        analysis_min_frequency_khz: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Min Frequency (kHz)***REMOVED***, minimum: 0 },
        analysis_max_frequency_khz: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Max Frequency (kHz)***REMOVED***, minimum: 0 },
        analysis_processing_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Processing Code***REMOVED***, enum: [***REMOVED***real-time***REMOVED***, ***REMOVED***post-processed***REMOVED***] },
        analysis_protocol_reference: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Protocol Reference***REMOVED*** },
        analysis_citations: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Citations***REMOVED*** },
        analysis_detector_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Detector Code***REMOVED***, description: ***REMOVED***Detection software/method, e.g. LFDCS, MANUAL, PAMGUARD***REMOVED*** },
        analysis_detector_version: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Detector Version***REMOVED*** },
      },
      required: [***REMOVED***analysis_sound_source_codes***REMOVED***, ***REMOVED***analysis_start_datetime***REMOVED***, ***REMOVED***analysis_end_datetime***REMOVED***, ***REMOVED***analysis_processing_code***REMOVED***, ***REMOVED***analysis_detector_code***REMOVED***],
    },
    pam_detection: {
      type: ***REMOVED***object***REMOVED***,
      title: ***REMOVED***PAM Detection***REMOVED***,
      description: ***REMOVED***Individual detection period (bulk import from CSV)***REMOVED***,
      properties: {
        detection_start_datetime: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***date-time***REMOVED***, title: ***REMOVED***Detection Start***REMOVED*** },
        detection_end_datetime: { type: ***REMOVED***string***REMOVED***, format: ***REMOVED***date-time***REMOVED***, title: ***REMOVED***Detection End***REMOVED*** },
        detection_effort_secs: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Effort (s)***REMOVED***, minimum: 0 },
        detection_sound_source_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Sound Source Code***REMOVED***, description: ***REMOVED***Constrained to parent analysis sound_source_codes***REMOVED*** },
        detection_call_type_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Call Type Code***REMOVED***, description: ***REMOVED***PARS controlled vocabulary call type***REMOVED*** },
        detection_n_validated: { type: ***REMOVED***integer***REMOVED***, title: ***REMOVED***Number Validated***REMOVED***, minimum: 0 },
        detection_result_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Detection Result***REMOVED***, enum: [***REMOVED***DETECTED***REMOVED***, ***REMOVED***POSSIBLY_DETECTED***REMOVED***, ***REMOVED***NOT_DETECTED***REMOVED***] },
        localization_method_code: { type: ***REMOVED***string***REMOVED***, title: ***REMOVED***Localization Method***REMOVED*** },
        localization_latitude: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Localization Latitude***REMOVED***, minimum: -90, maximum: 90 },
        localization_longitude: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Localization Longitude***REMOVED***, minimum: -180, maximum: 180 },
        localization_distance_m: { type: ***REMOVED***number***REMOVED***, title: ***REMOVED***Localization Distance (m)***REMOVED***, minimum: 0 },
      },
      required: [***REMOVED***detection_start_datetime***REMOVED***, ***REMOVED***detection_end_datetime***REMOVED***, ***REMOVED***detection_sound_source_code***REMOVED***, ***REMOVED***detection_result_code***REMOVED***],
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
          { prop: ***REMOVED***pam_project.deployment_organization_code***REMOVED*** },
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
          { prop: ***REMOVED***pam_site.deployment_latitude***REMOVED*** },
          { prop: ***REMOVED***pam_site.deployment_longitude***REMOVED*** },
          { prop: ***REMOVED***pam_site.deployment_water_depth_m***REMOVED*** },
        ]},
      ],
    },
    {
      id: ***REMOVED***pam_recorder***REMOVED***,
      label: ***REMOVED***PAM Recorder***REMOVED***,
      description: ***REMOVED***Physical recording device***REMOVED***,
      fields: [
        { prop: ***REMOVED***_pam_recorder***REMOVED***, type: ***REMOVED***object***REMOVED***, skip_path: true, label: ***REMOVED******REMOVED***, fields: [
          { prop: ***REMOVED***pam_recorder.recording_device_code***REMOVED*** },
          { prop: ***REMOVED***pam_recorder.recording_device_type_code***REMOVED*** },
        ]},
      ],
    },
    {
      id: ***REMOVED***pam_recording_config***REMOVED***,
      label: ***REMOVED***Recording Configuration***REMOVED***,
      description: ***REMOVED***Reusable instrument settings***REMOVED***,
      fields: [
        { prop: ***REMOVED***_pam_recording_config***REMOVED***, type: ***REMOVED***object***REMOVED***, skip_path: true, label: ***REMOVED******REMOVED***, fields: [
          { prop: ***REMOVED***pam_recording_config.recording_sample_rate_khz***REMOVED*** },
          { prop: ***REMOVED***pam_recording_config.recording_duration_secs***REMOVED*** },
          { prop: ***REMOVED***pam_recording_config.recording_interval_secs***REMOVED*** },
          { prop: ***REMOVED***pam_recording_config.recording_bit_depth***REMOVED***, type: ***REMOVED***select***REMOVED***, options: [{ label: ***REMOVED***16-bit***REMOVED***, value: 16 }, { label: ***REMOVED***24-bit***REMOVED***, value: 24 }, { label: ***REMOVED***32-bit***REMOVED***, value: 32 }] },
          { prop: ***REMOVED***pam_recording_config.recording_n_channels***REMOVED*** },
          { prop: ***REMOVED***pam_recording_config.recording_timezone***REMOVED*** },
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
          { prop: ***REMOVED***pam_deployment.platform_type***REMOVED***, type: ***REMOVED***select***REMOVED***, options: [{ label: ***REMOVED***Fixed***REMOVED***, value: ***REMOVED***fixed***REMOVED*** }, { label: ***REMOVED***Mobile***REMOVED***, value: ***REMOVED***mobile***REMOVED*** }] },
          { prop: ***REMOVED***pam_deployment.monitoring_start_datetime***REMOVED***, type: ***REMOVED***datetime***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.monitoring_end_datetime***REMOVED***, type: ***REMOVED***datetime***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.recording_device_depth_m***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.deployment_url***REMOVED*** },
          { prop: ***REMOVED***pam_deployment.gps_track_uri***REMOVED*** },
        ]},
      ],
    },
    {
      id: ***REMOVED***pam_analysis***REMOVED***,
      label: ***REMOVED***PAM Analysis***REMOVED***,
      description: ***REMOVED***Analysis run details***REMOVED***,
      fields: [
        { prop: ***REMOVED***_pam_analysis***REMOVED***, type: ***REMOVED***object***REMOVED***, skip_path: true, label: ***REMOVED******REMOVED***, fields: [
          { prop: ***REMOVED***pam_analysis.analysis_sound_source_codes***REMOVED*** },
          { prop: ***REMOVED***pam_analysis.analysis_start_datetime***REMOVED***, type: ***REMOVED***datetime***REMOVED*** },
          { prop: ***REMOVED***pam_analysis.analysis_end_datetime***REMOVED***, type: ***REMOVED***datetime***REMOVED*** },
          { prop: ***REMOVED***pam_analysis.analysis_processing_code***REMOVED***, type: ***REMOVED***select***REMOVED***, options: [{ label: ***REMOVED***Real-time***REMOVED***, value: ***REMOVED***real-time***REMOVED*** }, { label: ***REMOVED***Post-processed***REMOVED***, value: ***REMOVED***post-processed***REMOVED*** }] },
          { prop: ***REMOVED***pam_analysis.analysis_detector_code***REMOVED*** },
          { prop: ***REMOVED***pam_analysis.analysis_detector_version***REMOVED*** },
          { prop: ***REMOVED***pam_analysis.analysis_min_frequency_khz***REMOVED*** },
          { prop: ***REMOVED***pam_analysis.analysis_max_frequency_khz***REMOVED*** },
          { prop: ***REMOVED***pam_analysis.analysis_protocol_reference***REMOVED*** },
          { prop: ***REMOVED***pam_analysis.analysis_citations***REMOVED***, type: ***REMOVED***long_text***REMOVED*** },
        ]},
      ],
    },
    {
      id: ***REMOVED***pam_detection***REMOVED***,
      label: ***REMOVED***PAM Detection***REMOVED***,
      description: ***REMOVED***Individual detection period***REMOVED***,
      fields: [
        { prop: ***REMOVED***_pam_detection***REMOVED***, type: ***REMOVED***object***REMOVED***, skip_path: true, label: ***REMOVED******REMOVED***, fields: [
          { prop: ***REMOVED***pam_detection.detection_start_datetime***REMOVED***, type: ***REMOVED***datetime***REMOVED*** },
          { prop: ***REMOVED***pam_detection.detection_end_datetime***REMOVED***, type: ***REMOVED***datetime***REMOVED*** },
          { prop: ***REMOVED***pam_detection.detection_sound_source_code***REMOVED*** },
          { prop: ***REMOVED***pam_detection.detection_result_code***REMOVED***, type: ***REMOVED***select***REMOVED***, options: [{ label: ***REMOVED***Detected***REMOVED***, value: ***REMOVED***DETECTED***REMOVED*** }, { label: ***REMOVED***Possibly Detected***REMOVED***, value: ***REMOVED***POSSIBLY_DETECTED***REMOVED*** }, { label: ***REMOVED***Not Detected***REMOVED***, value: ***REMOVED***NOT_DETECTED***REMOVED*** }] },
          { prop: ***REMOVED***pam_detection.detection_effort_secs***REMOVED*** },
          { prop: ***REMOVED***pam_detection.detection_call_type_code***REMOVED*** },
          { prop: ***REMOVED***pam_detection.detection_n_validated***REMOVED*** },
          { prop: ***REMOVED***pam_detection.localization_method_code***REMOVED*** },
          { prop: ***REMOVED***pam_detection.localization_latitude***REMOVED*** },
          { prop: ***REMOVED***pam_detection.localization_longitude***REMOVED*** },
          { prop: ***REMOVED***pam_detection.localization_distance_m***REMOVED*** },
        ]},
      ],
    },
  ],
}
