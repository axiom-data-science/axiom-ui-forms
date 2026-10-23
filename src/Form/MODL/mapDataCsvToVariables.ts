import type { ParsedCSV } from '@/Form/Components/Inputs/FileUpload/csvParser'

type VariableMetadata = Record<string, string | number>

const getLongName = (header: string): string => {
  const words = header
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
  return words.length > 0 ? `${words[0].toUpperCase()}${words.slice(1)}` : header
}

const getCoordinateMetadata = (header: string): VariableMetadata => {
  const normalized = header.toLowerCase().replace(/[^a-z0-9]/g, '')

  if (['latitude', 'lat'].includes(normalized)) {
    return { axis: 'Y', _CoordinateAxisType: 'Lat', units: 'degrees_north' }
  }
  if (['longitude', 'lon', 'long', 'lng'].includes(normalized)) {
    return { axis: 'X', _CoordinateAxisType: 'Lon', units: 'degrees_east' }
  }
  if (['time', 'datetime', 'date', 'timestamp'].includes(normalized)) {
    return { axis: 'T', _CoordinateAxisType: 'Time' }
  }
  if (['depth', 'depthm', 'depthmeter', 'depthmeters', 'z'].includes(normalized)) {
    return { axis: 'Z' }
  }
  return {}
}

const getNumericRange = (
  csv: ParsedCSV,
  column: string,
  headerType: string
): { actual_range_min: number; actual_range_max: number } | undefined => {
  if (headerType !== 'float') {
    return undefined
  }

  const values = csv.data
    .map((row) => row[column])
    .filter((value) => value !== undefined && String(value).trim() !== '')

  if (values.length === 0 || values.some((value) => typeof value !== 'number' || !Number.isFinite(value))) {
    return undefined
  }

  const numericValues = values as number[]
  return {
    actual_range_min: numericValues.reduce((minimum, value) => Math.min(minimum, value), Infinity),
    actual_range_max: numericValues.reduce((maximum, value) => Math.max(maximum, value), -Infinity),
  }
}

export const mapDataCsvToVariables = (
  csv: ParsedCSV
): Record<string, VariableMetadata> => {
  if (csv.headers.length === 0) {
    throw new Error('The data file must include a header row.')
  }

  return Object.fromEntries(
    csv.headers.map(({ key, type }) => [
      key,
      {
        variable_name: key,
        long_name: getLongName(key),
        ...getCoordinateMetadata(key),
        ...getNumericRange(csv, key, type),
      },
    ])
  )
}
