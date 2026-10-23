import { describe, expect, it } from 'vitest'
import type { ParsedCSV } from '@/Form/Components/Inputs/FileUpload/csvParser'
import { mapDataCsvToVariables } from './mapDataCsvToVariables'

describe('mapDataCsvToVariables', () => {
  it('infers variable names, readable labels, coordinate metadata, and numeric ranges', () => {
    const csv: ParsedCSV = {
      headers: [
        { key: 'water_temperature', type: 'float' },
        { key: 'latitude', type: 'float' },
        { key: 'time', type: 'dateString' },
        { key: 'stationCode', type: 'string' },
      ],
      data: [
        {
          water_temperature: 12.4,
          latitude: 41.2,
          time: '2026-01-01',
          stationCode: 'A1',
        },
        {
          water_temperature: -1.3,
          latitude: 41.3,
          time: '2026-01-02',
          stationCode: 'A2',
        },
      ],
    }

    expect(mapDataCsvToVariables(csv)).toEqual({
      water_temperature: {
        variable_name: 'water_temperature',
        long_name: 'Water temperature',
        actual_range_min: -1.3,
        actual_range_max: 12.4,
      },
      latitude: {
        variable_name: 'latitude',
        long_name: 'Latitude',
        axis: 'Y',
        _CoordinateAxisType: 'Lat',
        units: 'degrees_north',
        actual_range_min: 41.2,
        actual_range_max: 41.3,
      },
      time: {
        variable_name: 'time',
        long_name: 'Time',
        axis: 'T',
        _CoordinateAxisType: 'Time',
      },
      stationCode: {
        variable_name: 'stationCode',
        long_name: 'Station Code',
      },
    })
  })

  it('does not infer ranges when a numeric-looking column contains non-numeric data', () => {
    const csv: ParsedCSV = {
      headers: [{ key: 'measurement', type: 'float' }],
      data: [{ measurement: 3 }, { measurement: 'not available' }],
    }

    expect(mapDataCsvToVariables(csv).measurement).toEqual({
      variable_name: 'measurement',
      long_name: 'Measurement',
    })
  })

  it('rejects files without headers', () => {
    const csv: ParsedCSV = { headers: [], data: [] }
    expect(() => mapDataCsvToVariables(csv)).toThrow('The data file must include a header row.')
  })
})
