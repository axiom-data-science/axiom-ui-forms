import { describe, expect, it } from 'vitest'
import { parseMetadataFieldsIntoSchema } from './helpers'
import { type IMetadataField } from './types'

const makeField = (overrides: Partial<IMetadataField>): IMetadataField => {
  return {
    label: 'Field',
    id: 'id',
    is_erddap: false,
    remove_field: false,
    path: '',
    field_grouping: null,
    form_section: 'section',
    secondary_form_section: null,
    description: null,
    requirement_status: 'optional',
    response_type: 'Text',
    filter_control: 'N',
    option1: null,
    option2: null,
    option3: null,
    option4: null,
    option5: null,
    option6: null,
    option7: null,
    option8: null,
    'NOAA requirement for NWS': null,
    'SECOORA Log': null,
    'AOOS Log': null,
    'CO-OPS Spec': null,
    SECOORA: null,
    NERACOOS: null,
    'CO-OPS': null,
    AOOS: null,
    CARICOOS: null,
    'R count': null,
    ...overrides,
  }
}

describe('parseMetadataFieldsIntoSchema', () => {
  it('treats dot-separated root ids as nested object paths', () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({
        id: 'station.location.lat',
        label: 'Latitude',
        response_type: 'Number',
        path: '',
      }),
    ])

    const station = schema.properties?.station as any
    expect(station?.type).toBe('object')

    const location = station?.properties?.location
    expect(location?.type).toBe('object')

    const lat = location?.properties?.lat
    expect(lat?.type).toBe('number')
    expect(lat?.title).toBe('Latitude')
  })

  it('treats dot-separated ids as nested paths under metadata path groups', () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({
        id: 'sensor.specs.model',
        label: 'Sensor Model',
        response_type: 'Text-short',
        path: '/instrument',
      }),
    ])

    const instrument = schema.properties?.instrument as any
    expect(instrument?.type).toBe('object')

    const sensor = instrument?.properties?.sensor
    expect(sensor?.type).toBe('object')

    const specs = sensor?.properties?.specs
    expect(specs?.type).toBe('object')

    const model = specs?.properties?.model
    expect(model?.type).toBe('string')
    expect(model?.title).toBe('Sensor Model')
  })

  it('uses contributors special-case once at root for contributors children', () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({ id: 'contributors.name', label: 'Contributor Name', path: '' }),
      makeField({ id: 'contributors.email', label: 'Contributor Email', path: '' }),
      makeField({ id: 'site.url', label: 'Site URL', path: '' }),
    ])

    const contributors = schema.properties?.contributors as any
    expect(contributors?.type).toBe('object')
    expect(contributors?.additionalProperties?.type).toBe('object')
    expect(contributors?.additionalProperties?.properties?.name?.title).toBe('Name')
    expect(contributors?.additionalProperties?.properties?.email?.format).toBe('email')

    const siteUrl = (schema.properties?.site as any)?.properties?.url
    expect(siteUrl?.title).toBe('Site URL')
  })

  it('uses contributors special-case once under nested path groups', () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({ id: 'contributors.phone', label: 'Contributor Phone', path: '/organization' }),
      makeField({ id: 'contributors.affiliation', label: 'Contributor Org', path: '/organization' }),
      makeField({ id: 'profile.id', label: 'Profile ID', path: '/organization' }),
    ])

    const org = schema.properties?.organization as any
    expect(org?.type).toBe('object')

    const contributors = org?.properties?.contributors
    expect(contributors?.type).toBe('object')
    expect(contributors?.additionalProperties?.properties?.phone?.title).toBe('Telephone (primary)')

    const profileId = org?.properties?.profile?.properties?.id
    expect(profileId?.title).toBe('Profile ID')
  })

  it('applies special-case for singular contributor root ids', () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({ id: 'contributor.custodian.name', label: 'Custodian Name', path: '' }),
      makeField({ id: 'contributor.custodian.email', label: 'Custodian Email', path: '' }),
    ])

    const contributor = schema.properties?.contributor as any
    expect(contributor?.type).toBe('object')
    expect(contributor?.additionalProperties?.type).toBe('object')
    expect(contributor?.additionalProperties?.properties?.name?.title).toBe('Name')
  })
})
