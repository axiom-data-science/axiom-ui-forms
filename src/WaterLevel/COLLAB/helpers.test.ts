import { describe, expect, it } from ***REMOVED***vitest***REMOVED***
import { parseMetadataFieldsIntoSchema } from ***REMOVED***./helpers***REMOVED***
import { type IMetadataField } from ***REMOVED***./types***REMOVED***

const makeField = (overrides: Partial<IMetadataField>): IMetadataField => {
  return {
    label: ***REMOVED***Field***REMOVED***,
    id: ***REMOVED***id***REMOVED***,
    is_erddap: false,
    remove_field: false,
    path: ***REMOVED******REMOVED***,
    field_grouping: null,
    form_section: ***REMOVED***section***REMOVED***,
    secondary_form_section: null,
    description: null,
    requirement_status: ***REMOVED***optional***REMOVED***,
    response_type: ***REMOVED***Text***REMOVED***,
    filter_control: ***REMOVED***N***REMOVED***,
    option1: null,
    option2: null,
    option3: null,
    option4: null,
    option5: null,
    option6: null,
    option7: null,
    option8: null,
    ***REMOVED***NOAA requirement for NWS***REMOVED***: null,
    ***REMOVED***SECOORA Log***REMOVED***: null,
    ***REMOVED***AOOS Log***REMOVED***: null,
    ***REMOVED***CO-OPS Spec***REMOVED***: null,
    SECOORA: null,
    NERACOOS: null,
    ***REMOVED***CO-OPS***REMOVED***: null,
    AOOS: null,
    CARICOOS: null,
    ***REMOVED***R count***REMOVED***: null,
    ...overrides,
  }
}

describe(***REMOVED***parseMetadataFieldsIntoSchema***REMOVED***, () => {
  it(***REMOVED***treats dot-separated root ids as nested object paths***REMOVED***, () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({
        id: ***REMOVED***station.location.lat***REMOVED***,
        label: ***REMOVED***Latitude***REMOVED***,
        response_type: ***REMOVED***Number***REMOVED***,
        path: ***REMOVED******REMOVED***,
      }),
    ])

    const station = schema.properties?.station as any
    expect(station?.type).toBe(***REMOVED***object***REMOVED***)

    const location = station?.properties?.location
    expect(location?.type).toBe(***REMOVED***object***REMOVED***)

    const lat = location?.properties?.lat
    expect(lat?.type).toBe(***REMOVED***number***REMOVED***)
    expect(lat?.title).toBe(***REMOVED***Latitude***REMOVED***)
  })

  it(***REMOVED***treats dot-separated ids as nested paths under metadata path groups***REMOVED***, () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({
        id: ***REMOVED***sensor.specs.model***REMOVED***,
        label: ***REMOVED***Sensor Model***REMOVED***,
        response_type: ***REMOVED***Text-short***REMOVED***,
        path: ***REMOVED***/instrument***REMOVED***,
      }),
    ])

    const instrument = schema.properties?.instrument as any
    expect(instrument?.type).toBe(***REMOVED***object***REMOVED***)

    const sensor = instrument?.properties?.sensor
    expect(sensor?.type).toBe(***REMOVED***object***REMOVED***)

    const specs = sensor?.properties?.specs
    expect(specs?.type).toBe(***REMOVED***object***REMOVED***)

    const model = specs?.properties?.model
    expect(model?.type).toBe(***REMOVED***string***REMOVED***)
    expect(model?.title).toBe(***REMOVED***Sensor Model***REMOVED***)
  })

  it(***REMOVED***uses contributors special-case once at root for contributors children***REMOVED***, () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({ id: ***REMOVED***contributors.name***REMOVED***, label: ***REMOVED***Contributor Name***REMOVED***, path: ***REMOVED******REMOVED*** }),
      makeField({ id: ***REMOVED***contributors.email***REMOVED***, label: ***REMOVED***Contributor Email***REMOVED***, path: ***REMOVED******REMOVED*** }),
      makeField({ id: ***REMOVED***site.url***REMOVED***, label: ***REMOVED***Site URL***REMOVED***, path: ***REMOVED******REMOVED*** }),
    ])

    const contributors = schema.properties?.contributors as any
    expect(contributors?.type).toBe(***REMOVED***object***REMOVED***)
    expect(contributors?.additionalProperties?.type).toBe(***REMOVED***object***REMOVED***)
    expect(contributors?.additionalProperties?.properties?.name?.title).toBe(***REMOVED***Name***REMOVED***)
    expect(contributors?.additionalProperties?.properties?.email?.format).toBe(***REMOVED***email***REMOVED***)

    const siteUrl = (schema.properties?.site as any)?.properties?.url
    expect(siteUrl?.title).toBe(***REMOVED***Site URL***REMOVED***)
  })

  it(***REMOVED***uses contributors special-case once under nested path groups***REMOVED***, () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({ id: ***REMOVED***contributors.phone***REMOVED***, label: ***REMOVED***Contributor Phone***REMOVED***, path: ***REMOVED***/organization***REMOVED*** }),
      makeField({
        id: ***REMOVED***contributors.affiliation***REMOVED***,
        label: ***REMOVED***Contributor Org***REMOVED***,
        path: ***REMOVED***/organization***REMOVED***,
      }),
      makeField({ id: ***REMOVED***profile.id***REMOVED***, label: ***REMOVED***Profile ID***REMOVED***, path: ***REMOVED***/organization***REMOVED*** }),
    ])

    const org = schema.properties?.organization as any
    expect(org?.type).toBe(***REMOVED***object***REMOVED***)

    const contributors = org?.properties?.contributors
    expect(contributors?.type).toBe(***REMOVED***object***REMOVED***)
    expect(contributors?.additionalProperties?.properties?.phone?.title).toBe(***REMOVED***Telephone (primary)***REMOVED***)

    const profileId = org?.properties?.profile?.properties?.id
    expect(profileId?.title).toBe(***REMOVED***Profile ID***REMOVED***)
  })

  it(***REMOVED***applies special-case for singular contributor root ids***REMOVED***, () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({ id: ***REMOVED***contributor.custodian.name***REMOVED***, label: ***REMOVED***Custodian Name***REMOVED***, path: ***REMOVED******REMOVED*** }),
      makeField({ id: ***REMOVED***contributor.custodian.email***REMOVED***, label: ***REMOVED***Custodian Email***REMOVED***, path: ***REMOVED******REMOVED*** }),
    ])

    const contributor = schema.properties?.contributor as any
    expect(contributor?.type).toBe(***REMOVED***object***REMOVED***)
    expect(contributor?.additionalProperties?.type).toBe(***REMOVED***object***REMOVED***)
    expect(contributor?.additionalProperties?.properties?.name?.title).toBe(***REMOVED***Name***REMOVED***)
  })

  it(***REMOVED***marks root fields as required when requirement_status is required***REMOVED***, () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({
        id: ***REMOVED***station_id***REMOVED***,
        label: ***REMOVED***Station ID***REMOVED***,
        requirement_status: ***REMOVED***required***REMOVED***,
        path: ***REMOVED******REMOVED***,
      }),
      makeField({
        id: ***REMOVED***station_name***REMOVED***,
        label: ***REMOVED***Station Name***REMOVED***,
        requirement_status: ***REMOVED***optional***REMOVED***,
        path: ***REMOVED******REMOVED***,
      }),
    ])

    expect(schema.required).toContain(***REMOVED***station_id***REMOVED***)
    expect(schema.required).not.toContain(***REMOVED***station_name***REMOVED***)
  })

  it(***REMOVED***marks nested dot-path fields as required on their parent object***REMOVED***, () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({
        id: ***REMOVED***station.location.lat***REMOVED***,
        label: ***REMOVED***Latitude***REMOVED***,
        response_type: ***REMOVED***Number***REMOVED***,
        requirement_status: ***REMOVED***required***REMOVED***,
        path: ***REMOVED******REMOVED***,
      }),
      makeField({
        id: ***REMOVED***station.location.lon***REMOVED***,
        label: ***REMOVED***Longitude***REMOVED***,
        response_type: ***REMOVED***Number***REMOVED***,
        requirement_status: ***REMOVED***optional***REMOVED***,
        path: ***REMOVED******REMOVED***,
      }),
    ])

    const location = (schema.properties?.station as any)?.properties?.location
    expect(location?.required).toContain(***REMOVED***lat***REMOVED***)
    expect(location?.required).not.toContain(***REMOVED***lon***REMOVED***)
  })

  it(***REMOVED***marks required fields under metadata path groups***REMOVED***, () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({
        id: ***REMOVED***sensor.specs.model***REMOVED***,
        label: ***REMOVED***Sensor Model***REMOVED***,
        requirement_status: ***REMOVED***required***REMOVED***,
        path: ***REMOVED***/instrument***REMOVED***,
      }),
    ])

    const specs = (schema.properties?.instrument as any)?.properties?.sensor?.properties?.specs
    expect(specs?.required).toContain(***REMOVED***model***REMOVED***)
  })

  it(***REMOVED***builds nested array schemas under items.properties for array path groups***REMOVED***, () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({
        id: ***REMOVED***sensor-elevation-ortho***REMOVED***,
        label: ***REMOVED***Sensor elevation ortho***REMOVED***,
        path: ***REMOVED***/sensors[]/elevations[]***REMOVED***,
      }),
    ])

    const sensors = schema.properties?.sensors as any
    expect(sensors?.type).toBe(***REMOVED***array***REMOVED***)
    expect(sensors?.items?.type).toBe(***REMOVED***object***REMOVED***)

    const elevations = sensors?.items?.properties?.elevations
    expect(elevations?.type).toBe(***REMOVED***array***REMOVED***)
    expect(elevations?.items?.type).toBe(***REMOVED***object***REMOVED***)

    const ortho = elevations?.items?.properties?.[***REMOVED***sensor-elevation-ortho***REMOVED***]
    expect(ortho?.type).toBe(***REMOVED***string***REMOVED***)
    expect(ortho?.title).toBe(***REMOVED***Sensor elevation ortho***REMOVED***)
  })

  it(***REMOVED***builds top-level array schemas under items.properties for single array path groups***REMOVED***, () => {
    const schema = parseMetadataFieldsIntoSchema([
      makeField({
        id: ***REMOVED***sensor-offset***REMOVED***,
        label: ***REMOVED***Sensor offset***REMOVED***,
        path: ***REMOVED***/sensors[]***REMOVED***,
      }),
    ])

    const sensors = schema.properties?.sensors as any
    expect(sensors?.type).toBe(***REMOVED***array***REMOVED***)
    expect(sensors?.items?.type).toBe(***REMOVED***object***REMOVED***)

    const sensorOffset = sensors?.items?.properties?.[***REMOVED***sensor-offset***REMOVED***]
    expect(sensorOffset?.type).toBe(***REMOVED***string***REMOVED***)
    expect(sensorOffset?.title).toBe(***REMOVED***Sensor offset***REMOVED***)
  })
})
