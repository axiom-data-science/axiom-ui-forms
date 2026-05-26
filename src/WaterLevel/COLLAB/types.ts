export interface IMetadataField {
  label: string
  id: string
  is_erddap: boolean
  remove_field: boolean
  path: string | null
  form_section: string
  secondary_form_section?: string | null
  description: string | null
  requirement_status: 'na' | 'recommended' | 'required' | 'optional' | 'unknown' | null | string
  response_type:
    | 'Text-short'
    | 'Text-long'
    | 'Text'
    | 'Date'
    | 'Multichoice'
    | 'Float'
    | 'Link'
    | 'Email'
    | 'Phone number'
    | 'Boolean'
    | null
    | string
  filter_control: 'Y' | 'N' | 'Update' | string | null
  option1: string | null
  option2: string | null
  option3: string | null
  option4: string | null
  option5: string | null
  option6: string | null
  option7: string | null
  option8: string | null
  'NOAA requirement for NWS': 'R' | 'O' | 'N' | string | null
  'SECOORA Log': 'R' | 'O' | 'N' | string | null
  'AOOS Log': 'R' | 'O' | 'N' | string | null
  'CO-OPS Spec': 'R' | 'O' | 'N' | string | null
  SECOORA: 'R' | 'O' | 'N' | string | null
  NERACOOS: 'R' | 'O' | 'N' | string | null
  'CO-OPS': 'R' | 'O' | 'N' | string | null
  AOOS: 'R' | 'O' | 'N' | string | null
  CARICOOS: 'R' | 'O' | 'N' | string | null
  'R count': number | null
}

export interface IMetadataFormSection {
  id: string
  label: string
  description: string | null
  order: number
}
