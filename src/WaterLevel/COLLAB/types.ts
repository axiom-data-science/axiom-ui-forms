export interface IMetadataField {
  label: string
  id: string
  is_erddap: boolean
  path: string | null
  form_section: string
  secondary_form_section?: string | null
  description: string | null
  requirement_status: ***REMOVED***na***REMOVED*** | ***REMOVED***recommended***REMOVED*** | ***REMOVED***required***REMOVED*** | ***REMOVED***optional***REMOVED*** | ***REMOVED***unknown***REMOVED*** | null | string
  response_type: ***REMOVED***Text-short***REMOVED*** | ***REMOVED***Text-long***REMOVED*** | ***REMOVED***Text***REMOVED*** | ***REMOVED***Date***REMOVED*** | ***REMOVED***Multichoice***REMOVED*** | ***REMOVED***Float***REMOVED*** | ***REMOVED***Link***REMOVED*** | ***REMOVED***Email***REMOVED*** | ***REMOVED***Phone number***REMOVED*** | ***REMOVED***Boolean***REMOVED*** | null | string
  filter_control: ***REMOVED***Y***REMOVED*** | ***REMOVED***N***REMOVED*** | ***REMOVED***Update***REMOVED*** | string | null
  option1: string | null
  option2: string | null
  option3: string | null
  option4: string | null
  option5: string | null
  option6: string | null
  option7: string | null
  option8: string | null
  ***REMOVED***NOAA requirement for NWS***REMOVED***: ***REMOVED***R***REMOVED*** | ***REMOVED***O***REMOVED*** | ***REMOVED***N***REMOVED*** | string | null
  ***REMOVED***SECOORA Log***REMOVED***: ***REMOVED***R***REMOVED*** | ***REMOVED***O***REMOVED*** | ***REMOVED***N***REMOVED*** | string | null
  ***REMOVED***AOOS Log***REMOVED***: ***REMOVED***R***REMOVED*** | ***REMOVED***O***REMOVED*** | ***REMOVED***N***REMOVED*** | string | null
  ***REMOVED***CO-OPS Spec***REMOVED***: ***REMOVED***R***REMOVED*** | ***REMOVED***O***REMOVED*** | ***REMOVED***N***REMOVED*** | string | null
  ***REMOVED***SECOORA***REMOVED***: ***REMOVED***R***REMOVED*** | ***REMOVED***O***REMOVED*** | ***REMOVED***N***REMOVED*** | string | null
  ***REMOVED***NERACOOS***REMOVED***: ***REMOVED***R***REMOVED*** | ***REMOVED***O***REMOVED*** | ***REMOVED***N***REMOVED*** | string | null
  ***REMOVED***CO-OPS***REMOVED***: ***REMOVED***R***REMOVED*** | ***REMOVED***O***REMOVED*** | ***REMOVED***N***REMOVED*** | string | null
  ***REMOVED***AOOS***REMOVED***: ***REMOVED***R***REMOVED*** | ***REMOVED***O***REMOVED*** | ***REMOVED***N***REMOVED*** | string | null
  ***REMOVED***CARICOOS***REMOVED***: ***REMOVED***R***REMOVED*** | ***REMOVED***O***REMOVED*** | ***REMOVED***N***REMOVED*** | string | null
  ***REMOVED***R count***REMOVED***: number | null
}

export interface IMetadataFormSection {
  id: string
  label: string
  description: string | null
  order: number
}
