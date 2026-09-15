import { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { IFieldInputProps, IForm } from '@/Form/Creator/FormCreatorTypes'
import FolderUpload from '@/Form/Components/Inputs/FolderUpload/FolderUpload'
import {
  type FolderFileEntry,
  type FolderPreviewProps,
} from '@/Form/Components/Inputs/FolderUpload/folderUploadTypes'
import {
  ChevronDown,
  ChevronRight,
  Check,
  Copy,
  Download,
  FileAudio,
  File,
  Loader,
  X,
} from 'lucide-react'
import { Button, Tooltip } from '@axdspub/axiom-ui-utilities'

const form: IForm = {
  id: 'qc-tools',
  label: 'QC Tools POC',
  settings: {
    show_progress: false,
  },
  fields: [
    {
      id: 'qc-tools-field',
      type: 'custom:qc-tools',
      label: '',
    },
  ],
}

const formatBytes = (value: number): string => {
  if (!Number.isFinite(value) || value <= 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const unitIndex = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1)
  const normalized = value / 1024 ** unitIndex

  return `${normalized.toFixed(normalized >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

const formatDateTime = (value: Date | null): string => {
  if (!value || Number.isNaN(value.getTime())) {
    return 'Unknown'
  }

  return value.toLocaleString()
}

const formatDuration = (seconds: number | null): string => {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) {
    return 'Unavailable'
  }

  if (seconds < 60) {
    return `${seconds.toFixed(2)} s`
  }

  const wholeSeconds = Math.floor(seconds % 60)
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ${wholeSeconds.toString().padStart(2, '0')}s`
}

const isValidUtcDate = (
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0
): boolean => {
  if (month < 1 || month > 12) return false
  if (day < 1 || day > 31) return false
  if (hour < 0 || hour > 23) return false
  if (minute < 0 || minute > 59) return false
  if (second < 0 || second > 59) return false

  const utc = new Date(Date.UTC(year, month - 1, day, hour, minute, second))

  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day &&
    utc.getUTCHours() === hour &&
    utc.getUTCMinutes() === minute &&
    utc.getUTCSeconds() === second
  )
}

const normalizeTwoDigitYear = (value: string): number => {
  const numeric = Number(value)
  if (value.length === 2) {
    return numeric >= 70 ? 1900 + numeric : 2000 + numeric
  }

  return numeric
}

const parseDateTimeFromFilename = (filename: string): Date | null => {
  const buildDate = (
    year: number,
    month: number,
    day: number,
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0
  ): Date | null => {
    const parsed = new Date(year, month - 1, day, hour, minute, second, millisecond)

    if (Number.isNaN(parsed.getTime())) {
      return null
    }

    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day ||
      parsed.getHours() !== hour ||
      parsed.getMinutes() !== minute ||
      parsed.getSeconds() !== second
    ) {
      return null
    }

    return parsed
  }

  const patterns: Array<{ pattern: RegExp; parse: (match: RegExpMatchArray) => Date | null }> = [
    {
      pattern:
        /(?:^|[^\d])(20\d{2})[-_.]?(0[1-9]|1[0-2])[-_.]?(0[1-9]|[12]\d|3[01])[T _-]?([01]\d|2[0-3])[:._-]?([0-5]\d)[:._-]?([0-5]\d)(?:[^\d]|$)/,
      parse: (match) =>
        buildDate(
          Number(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ),
    },
    {
      pattern: /(?:^|[^\d])(20\d{2})[-_.]?(0[1-9]|1[0-2])[-_.]?(0[1-9]|[12]\d|3[01])(?:[^\d]|$)/,
      parse: (match) => buildDate(Number(match[1]), Number(match[2]), Number(match[3])),
    },
    {
      pattern: /_HMS_(\d{1,2})_\s*(\d{1,2})_\s*(\d{1,2})__DMY_(\d{1,2})_\s*(\d{1,2})_(\d{1,2})/, // _HMS_%H_%M_%S__DMY_%d_%m_%y
      parse: (match) =>
        buildDate(
          normalizeTwoDigitYear(match[6]),
          Number(match[5]),
          Number(match[4]),
          Number(match[1]),
          Number(match[2]),
          Number(match[3])
        ),
    },
    {
      pattern: /\.(\d{4})-(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{2})\./, // AMAR_v0: .%Y-%m-%d-%H-%M-%S.
      parse: (match) =>
        buildDate(
          Number(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ),
    },
    {
      pattern: /_(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})\.(\d{3})Z\./, // AMAR_v1: _%Y%m%dT%H%M%S.%fZ.
      parse: (match) =>
        buildDate(
          Number(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6]),
          Number(match[7])
        ),
    },
    {
      pattern: /\.(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z\./, // AMARS_v2: .%Y%m%dT%H%M%SZ.
      parse: (match) =>
        buildDate(
          Number(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ),
    },
    {
      pattern: /\.(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\./, // SOUNDTRAPS: .%y%m%d%H%M%S.
      parse: (match) =>
        buildDate(
          normalizeTwoDigitYear(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ),
    },
    {
      pattern: /_(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\./, // SOUNDTRAPS_UAberdeen: _%y%m%d%H%M%S.
      parse: (match) =>
        buildDate(
          normalizeTwoDigitYear(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ),
    },
    {
      pattern: /_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})\./, // MARU: _%Y%m%d_%H%M%S.
      parse: (match) =>
        buildDate(
          Number(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ),
    },
    {
      pattern: /_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})_(\d{3})\./, // MARU_with_ms: _%Y%m%d_%H%M%S_%f.
      parse: (match) =>
        buildDate(
          Number(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6]),
          Number(match[7])
        ),
    },
    {
      pattern: /_(\d{2})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})_/, // MARU_variant: _%y%m%d_%H%M%S_
      parse: (match) =>
        buildDate(
          normalizeTwoDigitYear(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ),
    },
    {
      pattern: /-(\d{2})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})\./, // PMEL: -%y%m%d-%H%M%S.
      parse: (match) =>
        buildDate(
          normalizeTwoDigitYear(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ),
    },
    {
      pattern: /_(\d{4})-(\d{2})-(\d{2})_(\d{2})-(\d{2})-(\d{2})\./, // SAMS: _%Y-%m-%d_%H-%M-%S.
      parse: (match) =>
        buildDate(
          Number(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ),
    },
    {
      pattern: /_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})Z\./, // PAMGuard: _%Y%m%d_%H%M%SZ.
      parse: (match) =>
        buildDate(
          Number(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ),
    },
    {
      pattern: /\.(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})\./, // NOAA_SOUNDTRAPS_v2: .%Y%m%d%H%M%S.
      parse: (match) =>
        buildDate(
          Number(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ),
    },
    {
      pattern: /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})\./, // Loggerhead: %Y%m%dT%H%M%S.
      parse: (match) =>
        buildDate(
          Number(match[1]),
          Number(match[2]),
          Number(match[3]),
          Number(match[4]),
          Number(match[5]),
          Number(match[6])
        ),
    },
  ]

  for (const { pattern, parse } of patterns) {
    const match = filename.match(pattern)
    if (!match) {
      continue
    }

    const parsed = parse(match)
    if (parsed !== null) {
      return parsed
    }
  }

  return null
}

const useAudioMetadata = (file: File) => {
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    const objectUrl = URL.createObjectURL(file)
    const audio = document.createElement('audio')

    const handleLoadedMetadata = () => {
      if (!active) {
        return
      }

      setDurationSeconds(Number.isFinite(audio.duration) ? audio.duration : null)
    }

    const handleError = () => {
      if (active) {
        setDurationSeconds(null)
      }
    }

    audio.preload = 'metadata'
    audio.onloadedmetadata = handleLoadedMetadata
    audio.onerror = handleError
    audio.src = objectUrl

    return () => {
      active = false
      audio.onloadedmetadata = null
      audio.onerror = null
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  return durationSeconds
}

const useObjectUrl = (file: File | null) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setObjectUrl(null)
      return
    }

    const nextObjectUrl = URL.createObjectURL(file)
    setObjectUrl(nextObjectUrl)

    return () => {
      URL.revokeObjectURL(nextObjectUrl)
    }
  }, [file])

  return objectUrl
}

const addSeconds = (value: Date, seconds: number): Date =>
  new Date(value.getTime() + seconds * 1000)

const formatGap = (seconds: number | null): string => {
  if (seconds === null || !Number.isFinite(seconds)) {
    return 'Unavailable'
  }

  const absoluteSeconds = Math.abs(seconds)
  const label = formatDuration(absoluteSeconds)
  if (seconds > 0) {
    return `Gap of ${label}`
  }

  if (seconds < 0) {
    return `Overlap of ${label}`
  }

  return 'No gap'
}

const getMedian = (values: number[]): number | null => {
  if (!values.length) {
    return null
  }

  const sortedValues = [...values].sort((left, right) => left - right)
  const middleIndex = Math.floor(sortedValues.length / 2)

  if (sortedValues.length % 2 === 0) {
    return (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2
  }

  return sortedValues[middleIndex]
}

const getMode = (values: number[]): number | null => {
  if (!values.length) {
    return null
  }

  const counts = new Map<number, number>()

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  let mostCommonValue = values[0]
  let highestCount = counts.get(mostCommonValue) ?? 0

  for (const [value, count] of counts.entries()) {
    if (count > highestCount) {
      mostCommonValue = value
      highestCount = count
    }
  }

  return mostCommonValue
}

const formatBitrate = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) {
    return 'Unavailable'
  }

  return `${Math.round(value / 1000)} kbps`
}

const formatSampleRate = (value: number | null): string => {
  if (value === null || !Number.isFinite(value)) {
    return 'Unavailable'
  }

  return value >= 1000 ? `${value / 1000} kHz` : `${value} Hz`
}

type AudioFileMetadata = {
  durationSeconds: number | null
  sampleRateHz: number | null
  numberOfChannels: number | null
  bitDepth: number | null
}

let musicMetadataModulePromise: Promise<typeof import('music-metadata')> | null = null

const loadMusicMetadata = () => {
  musicMetadataModulePromise ??= import('music-metadata')
  return musicMetadataModulePromise
}

const serializeTsvCell = (value: string): string => {
  if (!/[\t\r\n"]/.test(value)) {
    return value
  }

  return `"${value.replace(/"/g, '""')}"`
}

const downloadTsv = (filename: string, headers: string[], rows: string[][]): void => {
  const tsv = [headers, ...rows].map((row) => row.map(serializeTsvCell).join('\t')).join('\r\n')
  const objectUrl = URL.createObjectURL(
    new Blob(['\uFEFF', tsv], { type: 'text/tab-separated-values;charset=utf-8' })
  )
  const anchor = document.createElement('a')

  anchor.href = objectUrl
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(objectUrl)
}

const getAudioDuration = async (file: File): Promise<number | null> => {
  return await new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file)
    const audio = document.createElement('audio')

    const cleanup = () => {
      audio.onloadedmetadata = null
      audio.onerror = null
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      URL.revokeObjectURL(objectUrl)
    }

    audio.preload = 'metadata'
    audio.onloadedmetadata = () => {
      resolve(Number.isFinite(audio.duration) ? audio.duration : null)
      cleanup()
    }
    audio.onerror = () => {
      resolve(null)
      cleanup()
    }
    audio.src = objectUrl
  })
}

const getAudioMetadata = async (file: File): Promise<AudioFileMetadata> => {
  try {
    const { parseBlob } = await loadMusicMetadata()
    const metadata = await parseBlob(file, { duration: true })
    const durationSeconds = metadata.format.duration ?? (await getAudioDuration(file))

    return {
      durationSeconds: Number.isFinite(durationSeconds) ? durationSeconds : null,
      sampleRateHz: metadata.format.sampleRate ?? null,
      numberOfChannels: metadata.format.numberOfChannels ?? null,
      bitDepth: metadata.format.bitsPerSample ?? null,
    }
  } catch {
    return {
      durationSeconds: await getAudioDuration(file),
      sampleRateHz: null,
      numberOfChannels: null,
      bitDepth: null,
    }
  }
}

const useAudioMetadataMap = (files: FolderFileEntry[]) => {
  const [metadataMap, setMetadataMap] = useState<
    Record<string, AudioFileMetadata | null | undefined>
  >({})

  useEffect(() => {
    let active = true

    const initialMap = Object.fromEntries(
      files.map((entry) => [entry.relativePath, entry.fileType.isAudio ? undefined : null])
    )
    setMetadataMap(initialMap)

    const loadMetadata = async () => {
      const entries = await Promise.all(
        files.map(async (entry) => {
          if (!entry.fileType.isAudio) {
            return [entry.relativePath, null] as const
          }

          return [entry.relativePath, await getAudioMetadata(entry.file)] as const
        })
      )

      if (active) {
        setMetadataMap(Object.fromEntries(entries))
      }
    }

    loadMetadata().catch(() => {
      if (active) {
        setMetadataMap(initialMap)
      }
    })

    return () => {
      active = false
    }
  }, [files])

  return metadataMap
}

type ValidationStatus = 'pass' | 'fail' | 'pending'

const ValidationIndicator = ({
  status,
  expanded = false,
}: {
  status: ValidationStatus
  expanded: boolean
}) => {
  if (status === 'pending') {
    return <Loader className="text-slate-400" size={16} />
  }

  return status === 'pass' ? (
    <Check className={expanded ? 'text-emerald-300' : 'text-emerald-600'} size={16} />
  ) : (
    <X className={expanded ? 'text-rose-300' : 'text-rose-600'} size={16} />
  )
}

const ValidationOverviewItem = ({
  label,
  status,
  value,
  control,
}: {
  label: string
  status: ValidationStatus
  value: string
  control?: ReactElement
}) => {
  const labelClassName = status === 'fail' ? 'text-rose-700' : 'text-slate-800'
  const valueClassName = status === 'fail' ? 'text-rose-600' : 'text-slate-700'

  return (
    <div className="flex min-w-45 max-w-55 flex-1 flex-col gap-2 px-4 py-3 m-2 bg-slate-50">
      <div className="flex items-center gap-2">
        <div className={`text-sm font-medium ${labelClassName}`}>{label}</div>
        <ValidationIndicator status={status} expanded={false} />
      </div>
      <div className={`text-sm ${valueClassName}`}>{value}</div>
      {control ? <div>{control}</div> : null}
    </div>
  )
}

type RowValidationConfig = {
  expectedBitrateKbps: number | null
  expectedSampleRateHz: number | null
  expectedNumberOfChannels: number | null
  expectedBitDepth: number | null
  expectedGapSeconds: number | null
  expectedDurationSeconds: number | null
  gapToleranceSeconds: number
  durationToleranceSeconds: number
}

type RowValidationResult = {
  rowStatus: ValidationStatus
  timestampFailed: boolean
  bitrateFailed: boolean
  sampleRateFailed: boolean
  channelsFailed: boolean
  bitDepthFailed: boolean
  audioFormatFailed: boolean
  durationFailed: boolean
  gapFailed: boolean
}

const getRowValidationResult = ({
  inferredTimestamp,
  bitrateKbps,
  sampleRateHz,
  numberOfChannels,
  bitDepth,
  isAudio,
  durationSeconds,
  gapSeconds,
  config,
}: {
  inferredTimestamp: Date | null
  bitrateKbps: number | null
  sampleRateHz: number | null | undefined
  numberOfChannels: number | null | undefined
  bitDepth: number | null | undefined
  isAudio: boolean
  durationSeconds: number | null | undefined
  gapSeconds: number | null
  config: RowValidationConfig
}): RowValidationResult => {
  const timestampFailed = inferredTimestamp === null
  const bitrateFailed =
    config.expectedBitrateKbps !== null && bitrateKbps !== null
      ? bitrateKbps !== config.expectedBitrateKbps
      : false
  const sampleRateFailed =
    config.expectedSampleRateHz === null || sampleRateHz !== config.expectedSampleRateHz
  const channelsFailed =
    config.expectedNumberOfChannels === null || numberOfChannels !== config.expectedNumberOfChannels
  const bitDepthFailed = config.expectedBitDepth === null || bitDepth !== config.expectedBitDepth
  const audioFormatFailed = !isAudio
  const durationFailed =
    config.expectedDurationSeconds !== null && typeof durationSeconds === 'number'
      ? Math.abs(durationSeconds - config.expectedDurationSeconds) > config.durationToleranceSeconds
      : false
  const gapFailed =
    config.expectedGapSeconds !== null && gapSeconds !== null
      ? Math.abs(gapSeconds - config.expectedGapSeconds) > config.gapToleranceSeconds
      : false

  return {
    rowStatus:
      timestampFailed ||
      bitrateFailed ||
      sampleRateFailed ||
      channelsFailed ||
      bitDepthFailed ||
      audioFormatFailed ||
      durationFailed ||
      gapFailed
        ? 'fail'
        : 'pass',
    timestampFailed,
    bitrateFailed,
    sampleRateFailed,
    channelsFailed,
    bitDepthFailed,
    audioFormatFailed,
    durationFailed,
    gapFailed,
  }
}

const copyToClipboard = async (value: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'absolute'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

const AudioFileDetails = ({ file }: { file: FolderFileEntry }) => {
  const durationSeconds = useAudioMetadata(file.file)
  const inferredTimestamp = useMemo(
    () => parseDateTimeFromFilename(file.file.name),
    [file.file.name]
  )
  const lastModified = useMemo(() => new Date(file.file.lastModified), [file.file.lastModified])
  const bitrate = useMemo(() => {
    if (!durationSeconds || durationSeconds <= 0) {
      return null
    }

    return (file.file.size * 8) / durationSeconds
  }, [durationSeconds, file.file.size])

  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-slate-800">{file.file.name}</div>
          <div className="truncate text-xs text-slate-500">{file.relativePath}</div>
        </div>
        <div className="rounded-md bg-slate-200 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-600">
          {file.file.type || 'unknown type'}
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">Size</dt>
          <dd className="text-slate-800">{formatBytes(file.file.size)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">Extension</dt>
          <dd className="text-slate-800">{file.file.name.split('.').pop() || 'unknown'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">Last modified</dt>
          <dd className="text-slate-800">{lastModified.toLocaleString()}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">Relative path</dt>
          <dd className="truncate text-slate-800" title={file.relativePath}>
            {file.relativePath}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">Filename timestamp</dt>
          <dd className="text-slate-800">{formatDateTime(inferredTimestamp)}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">Duration</dt>
          <dd className="text-slate-800">
            {durationSeconds !== null ? formatDuration(durationSeconds) : 'Loading metadata...'}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">Approx. bitrate</dt>
          <dd className="text-slate-800">
            {bitrate !== null ? `${Math.round(bitrate / 1000)} kbps` : 'Unavailable'}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-wide text-slate-500">Audio flag</dt>
          <dd className="text-slate-800">{file.fileType.isAudio ? 'Yes' : 'No'}</dd>
        </div>
      </dl>
    </div>
  )
}

const FolderFileRow = ({
  file,
  inferredTimestamp,
  nextInferredTimestamp,
  durationSeconds,
  sampleRateHz,
  numberOfChannels,
  bitDepth,
  validationConfig,
  previousGapFailed,
  isExpanded,
  onToggle,
}: {
  file: FolderFileEntry
  inferredTimestamp: Date | null
  nextInferredTimestamp: Date | null
  durationSeconds: number | null | undefined
  sampleRateHz: number | null | undefined
  numberOfChannels: number | null | undefined
  bitDepth: number | null | undefined
  validationConfig: RowValidationConfig
  previousGapFailed: boolean
  isExpanded: boolean
  onToggle: () => void
}) => {
  const audioUrl = useObjectUrl(file.fileType.isAudio ? file.file : null)
  const [isCopied, setIsCopied] = useState(false)
  const extension = file.file.name.split('.').pop() || 'unknown'
  const lastModified = useMemo(() => new Date(file.file.lastModified), [file.file.lastModified])
  const estimatedEndTime = useMemo(() => {
    if (!inferredTimestamp || durationSeconds === null || durationSeconds === undefined) {
      return null
    }

    return addSeconds(inferredTimestamp, durationSeconds)
  }, [durationSeconds, inferredTimestamp])
  const gapToNextSeconds = useMemo(() => {
    if (!estimatedEndTime || !nextInferredTimestamp) {
      return null
    }

    return (nextInferredTimestamp.getTime() - estimatedEndTime.getTime()) / 1000
  }, [estimatedEndTime, nextInferredTimestamp])
  const bitrate = useMemo(() => {
    if (durationSeconds === null || durationSeconds === undefined || durationSeconds <= 0) {
      return null
    }

    return (file.file.size * 8) / durationSeconds
  }, [durationSeconds, file.file.size])
  const bitrateKbps = useMemo(
    () => (bitrate !== null ? Math.round(bitrate / 1000) : null),
    [bitrate]
  )
  const rowValidation = useMemo(
    () =>
      getRowValidationResult({
        inferredTimestamp,
        bitrateKbps,
        sampleRateHz,
        numberOfChannels,
        bitDepth,
        isAudio: file.fileType.isAudio,
        durationSeconds,
        gapSeconds: gapToNextSeconds,
        config: validationConfig,
      }),
    [
      bitDepth,
      bitrateKbps,
      durationSeconds,
      file.fileType.isAudio,
      gapToNextSeconds,
      inferredTimestamp,
      numberOfChannels,
      sampleRateHz,
      validationConfig,
    ]
  )

  const metadataRows = [
    ['Full name', file.file.name],
    ['Relative path', file.relativePath],
    ['Type', file.file.type || 'unknown type'],
    ['Extension', extension],
    ['Size', formatBytes(file.file.size)],
    ['Last modified', lastModified.toLocaleString()],
    [
      'Parsed filename timestamp',
      inferredTimestamp ? inferredTimestamp.toLocaleString() : 'Not found',
    ],
    ['Estimated end time', estimatedEndTime ? estimatedEndTime.toLocaleString() : 'Unavailable'],
    [
      'Duration',
      durationSeconds !== null && durationSeconds !== undefined
        ? formatDuration(durationSeconds)
        : 'Unavailable',
    ],
    [
      'Sample rate',
      sampleRateHz !== null && sampleRateHz !== undefined
        ? formatSampleRate(sampleRateHz)
        : 'Unavailable',
    ],
    [
      'Channels',
      numberOfChannels !== null && numberOfChannels !== undefined
        ? String(numberOfChannels)
        : 'Unavailable',
    ],
    ['Bit depth', bitDepth !== null && bitDepth !== undefined ? `${bitDepth} bit` : 'Unavailable'],
    ['Gap to next file', formatGap(gapToNextSeconds)],
    [
      'Next file starts',
      nextInferredTimestamp ? nextInferredTimestamp.toLocaleString() : 'Unavailable',
    ],
    ['Approx. bitrate', bitrate !== null ? formatBitrate(bitrate) : 'Unavailable'],
    ['Audio detected', file.fileType.isAudio ? 'Yes' : 'No'],
    ['Filename timestamp detected', inferredTimestamp ? 'Yes' : 'No'],
    ['Folder row path', file.relativePath],
  ]
  const rowClassName = isExpanded
    ? 'border-b border-slate-600 border-t-slate-200 bg-slate-600 text-slate-100 last:border-b-0 first:border-t-0'
    : 'border-b border-slate-200 last:border-b-0 hover:bg-slate-50'
  const rowTextClassName = isExpanded ? 'text-slate-100' : 'text-slate-700'
  const mutedTextClassName = isExpanded ? 'text-slate-200' : 'text-slate-500'
  const iconClassName = isExpanded ? 'text-slate-100' : 'text-slate-400'
  const expandButtonClassName = isExpanded
    ? 'inline-flex items-center justify-center rounded-md p-1 text-slate-100 hover:bg-slate-500 hover:text-white'
    : 'inline-flex items-center justify-center rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
  const failingCellClassName = isExpanded ? 'text-rose-200' : 'text-rose-600'
  const timestampCellClassName =
    rowValidation.timestampFailed || (inferredTimestamp !== null && previousGapFailed)
      ? failingCellClassName
      : rowTextClassName
  const bitrateCellClassName = rowValidation.bitrateFailed ? failingCellClassName : rowTextClassName
  const durationCellClassName = rowValidation.durationFailed
    ? failingCellClassName
    : rowTextClassName
  const sampleRateCellClassName = rowValidation.sampleRateFailed
    ? failingCellClassName
    : rowTextClassName
  const channelsCellClassName = rowValidation.channelsFailed
    ? failingCellClassName
    : rowTextClassName
  const bitDepthCellClassName = rowValidation.bitDepthFailed
    ? failingCellClassName
    : rowTextClassName
  const gapCellClassName = rowValidation.gapFailed ? failingCellClassName : rowTextClassName

  useEffect(() => {
    if (!isCopied) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsCopied(false)
    }, 1200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isCopied])

  return (
    <>
      <tr className={rowClassName}>
        <td className={`px-3 py-2 align-top ${isExpanded ? 'bg-slate-600' : ''}`}>
          <div className={`flex min-w-0 items-center gap-2 text-sm ${rowTextClassName}`}>
            <button
              type="button"
              className={expandButtonClassName}
              onClick={onToggle}
              aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
              aria-expanded={isExpanded}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            <ValidationIndicator status={rowValidation.rowStatus} expanded={isExpanded} />
            {file.fileType.isAudio ? (
              <FileAudio className={`shrink-0`} size={16} />
            ) : (
              <File className={`shrink-0 ${iconClassName}`} size={16} />
            )}
            <div className="min-w-0 flex-1">
              <div className={`truncate text-sm font-medium ${rowTextClassName}`}>
                {file.file.name}
              </div>
              <div className={`truncate text-xs ${mutedTextClassName}`}>{file.relativePath}</div>
            </div>
            <Tooltip content={isCopied ? 'Copied filename' : 'Copy full filename'} dark={true}>
              <button
                type="button"
                className={`shrink-0 rounded p-1 ${isExpanded ? 'text-slate-100 hover:bg-slate-500 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
                title={isCopied ? 'Copied filename' : 'Copy full filename'}
                aria-label={isCopied ? 'Filename copied' : 'Copy full filename'}
                onClick={async (event) => {
                  event.stopPropagation()
                  event.preventDefault()
                  await copyToClipboard(file.file.name)
                  setIsCopied(true)
                }}
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </Tooltip>
          </div>
        </td>
        <td className={`whitespace-nowrap px-3 py-2 align-top text-sm ${timestampCellClassName}`}>
          <span>{inferredTimestamp ? inferredTimestamp.toLocaleString() : 'Not found'}</span>
        </td>
        <td className={`whitespace-nowrap px-3 py-2 text-sm ${bitrateCellClassName} align-top`}>
          {bitrate !== null ? formatBitrate(bitrate) : '—'}
        </td>
        <td className={`whitespace-nowrap px-3 py-2 text-sm ${durationCellClassName} align-top`}>
          {durationSeconds !== null && durationSeconds !== undefined
            ? formatDuration(durationSeconds)
            : '—'}
        </td>
        <td className={`whitespace-nowrap px-3 py-2 text-sm ${sampleRateCellClassName} align-top`}>
          {sampleRateHz !== null && sampleRateHz !== undefined
            ? formatSampleRate(sampleRateHz)
            : '—'}
        </td>
        <td className={`whitespace-nowrap px-3 py-2 text-sm ${channelsCellClassName} align-top`}>
          {numberOfChannels ?? '—'}
        </td>
        <td className={`whitespace-nowrap px-3 py-2 text-sm ${bitDepthCellClassName} align-top`}>
          {bitDepth !== null && bitDepth !== undefined ? `${bitDepth} bit` : '—'}
        </td>
        <td className={`whitespace-nowrap px-3 py-2 text-sm ${rowTextClassName} align-top`}>
          {estimatedEndTime ? estimatedEndTime.toLocaleString() : '—'}
        </td>
        <td className={`whitespace-nowrap px-3 py-2 text-sm ${gapCellClassName} align-top`}>
          {gapToNextSeconds === null ? '—' : formatGap(gapToNextSeconds)}
        </td>
      </tr>
      {isExpanded && (
        <tr className="border-b border-slate-600 bg-slate-600 border-b-slate-800 last:border-b-0">
          <td colSpan={9} className=" px-3 py-3">
            <div className="flex flex-col gap-3">
              {file.fileType.isAudio && audioUrl ? (
                <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                  <div className="text-xs uppercase tracking-wide text-slate-500">Audio player</div>
                  <audio controls preload="metadata" src={audioUrl} className="mt-2 w-full" />
                </div>
              ) : null}
              <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {metadataRows.map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm"
                  >
                    <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
                    <div className="mt-1 wrap-break-word text-slate-800">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

const QCFolderPreview = ({ folderName, files }: FolderPreviewProps) => {
  const [periodicityToleranceSeconds, setPeriodicityToleranceSeconds] = useState(1)
  const [durationToleranceSeconds, setDurationToleranceSeconds] = useState(1)
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<string>>(new Set())
  const metadataMap = useAudioMetadataMap(files)
  const sortedFiles = useMemo(() => {
    return files
      .map((file) => ({
        file,
        inferredTimestamp: parseDateTimeFromFilename(file.file.name),
        metadata: metadataMap[file.relativePath],
        durationSeconds: metadataMap[file.relativePath]?.durationSeconds,
      }))
      .sort((left, right) => {
        const leftTime = left.inferredTimestamp?.getTime() ?? Number.POSITIVE_INFINITY
        const rightTime = right.inferredTimestamp?.getTime() ?? Number.POSITIVE_INFINITY

        if (leftTime !== rightTime) {
          return leftTime - rightTime
        }

        return left.file.relativePath.localeCompare(right.file.relativePath)
      })
  }, [files, metadataMap])

  const audioEntries = useMemo(
    () => sortedFiles.filter((entry) => entry.file.fileType.isAudio),
    [sortedFiles]
  )
  const resolvedDurations = useMemo(
    () =>
      audioEntries
        .map((entry) => entry.durationSeconds)
        .filter((value): value is number => typeof value === 'number'),
    [audioEntries]
  )
  const isDurationPending = useMemo(
    () => audioEntries.some((entry) => entry.durationSeconds === undefined),
    [audioEntries]
  )
  const isMetadataPending = useMemo(
    () => audioEntries.some((entry) => entry.metadata === undefined),
    [audioEntries]
  )
  const hasNonAudioFiles = audioEntries.length !== sortedFiles.length
  const sampleRateValues = useMemo(
    () =>
      audioEntries
        .map((entry) => entry.metadata?.sampleRateHz)
        .filter((value): value is number => typeof value === 'number'),
    [audioEntries]
  )
  const channelValues = useMemo(
    () =>
      audioEntries
        .map((entry) => entry.metadata?.numberOfChannels)
        .filter((value): value is number => typeof value === 'number'),
    [audioEntries]
  )
  const bitDepthValues = useMemo(
    () =>
      audioEntries
        .map((entry) => entry.metadata?.bitDepth)
        .filter((value): value is number => typeof value === 'number'),
    [audioEntries]
  )
  const bitrateValues = useMemo(
    () =>
      audioEntries
        .map((entry) => {
          const durationSeconds = entry.durationSeconds
          if (typeof durationSeconds !== 'number' || durationSeconds <= 0) {
            return null
          }

          return Math.round((entry.file.file.size * 8) / durationSeconds / 1000)
        })
        .filter((value): value is number => value !== null),
    [audioEntries]
  )
  const gapValues = useMemo(() => {
    const values: number[] = []

    for (let index = 0; index < sortedFiles.length - 1; index += 1) {
      const current = sortedFiles[index]
      const next = sortedFiles[index + 1]

      if (
        !current.inferredTimestamp ||
        !next.inferredTimestamp ||
        typeof current.durationSeconds !== 'number'
      ) {
        continue
      }

      const estimatedEndTime = addSeconds(current.inferredTimestamp, current.durationSeconds)
      values.push((next.inferredTimestamp.getTime() - estimatedEndTime.getTime()) / 1000)
    }

    return values
  }, [sortedFiles])

  const periodicityMedian = useMemo(() => getMedian(gapValues), [gapValues])
  const durationMedian = useMemo(() => getMedian(resolvedDurations), [resolvedDurations])
  const commonGapSeconds = useMemo(() => getMode(gapValues), [gapValues])
  const commonDurationSeconds = useMemo(() => getMode(resolvedDurations), [resolvedDurations])
  const commonBitrateKbps = useMemo(() => getMode(bitrateValues), [bitrateValues])
  const commonSampleRateHz = useMemo(() => getMode(sampleRateValues), [sampleRateValues])
  const commonNumberOfChannels = useMemo(() => getMode(channelValues), [channelValues])
  const commonBitDepth = useMemo(() => getMode(bitDepthValues), [bitDepthValues])
  const uniqueBitrates = useMemo(
    () => Array.from(new Set(bitrateValues)).sort((left, right) => left - right),
    [bitrateValues]
  )
  const timestampedFileCount = useMemo(
    () => sortedFiles.filter((entry) => entry.inferredTimestamp !== null).length,
    [sortedFiles]
  )
  const rowValidationConfig = useMemo<RowValidationConfig>(
    () => ({
      expectedBitrateKbps: commonBitrateKbps,
      expectedSampleRateHz: commonSampleRateHz,
      expectedNumberOfChannels: commonNumberOfChannels,
      expectedBitDepth: commonBitDepth,
      expectedGapSeconds: commonGapSeconds,
      expectedDurationSeconds: commonDurationSeconds,
      gapToleranceSeconds: periodicityToleranceSeconds,
      durationToleranceSeconds: durationToleranceSeconds,
    }),
    [
      commonBitDepth,
      commonBitrateKbps,
      commonDurationSeconds,
      commonGapSeconds,
      commonNumberOfChannels,
      commonSampleRateHz,
      durationToleranceSeconds,
      periodicityToleranceSeconds,
    ]
  )
  const gapFailuresByIndex = useMemo(
    () =>
      sortedFiles.map((entry, index) => {
        const next = sortedFiles[index + 1]

        if (
          rowValidationConfig.expectedGapSeconds === null ||
          !entry.inferredTimestamp ||
          !next?.inferredTimestamp ||
          typeof entry.durationSeconds !== 'number'
        ) {
          return false
        }

        const estimatedEndTime = addSeconds(entry.inferredTimestamp, entry.durationSeconds)
        const gapSeconds = (next.inferredTimestamp.getTime() - estimatedEndTime.getTime()) / 1000

        return (
          Math.abs(gapSeconds - rowValidationConfig.expectedGapSeconds) >
          rowValidationConfig.gapToleranceSeconds
        )
      }),
    [rowValidationConfig.expectedGapSeconds, rowValidationConfig.gapToleranceSeconds, sortedFiles]
  )

  const periodicityStatus: ValidationStatus = isDurationPending
    ? 'pending'
    : gapValues.length > 0 &&
        periodicityMedian !== null &&
        gapValues.every((gap) => Math.abs(gap - periodicityMedian) <= periodicityToleranceSeconds)
      ? 'pass'
      : 'fail'
  const timestampStatus: ValidationStatus =
    sortedFiles.length > 0 && timestampedFileCount === sortedFiles.length ? 'pass' : 'fail'
  const bitrateStatus: ValidationStatus = isDurationPending
    ? 'pending'
    : uniqueBitrates.length === 1 && uniqueBitrates.length > 0
      ? 'pass'
      : 'fail'
  const durationStatus: ValidationStatus = isDurationPending
    ? 'pending'
    : resolvedDurations.length > 0 &&
        durationMedian !== null &&
        resolvedDurations.every(
          (duration) => Math.abs(duration - durationMedian) <= durationToleranceSeconds
        )
      ? 'pass'
      : 'fail'
  const getUniformMetadataStatus = (values: number[]): ValidationStatus => {
    if (isMetadataPending) {
      return 'pending'
    }

    return !hasNonAudioFiles &&
      audioEntries.length > 0 &&
      values.length === audioEntries.length &&
      new Set(values).size === 1
      ? 'pass'
      : 'fail'
  }
  const sampleRateStatus = getUniformMetadataStatus(sampleRateValues)
  const channelsStatus = getUniformMetadataStatus(channelValues)
  const bitDepthStatus = getUniformMetadataStatus(bitDepthValues)

  const bitrateValue = useMemo(() => {
    if (isDurationPending) {
      return 'Loading metadata...'
    }

    if (!uniqueBitrates.length) {
      return 'Unavailable'
    }

    if (uniqueBitrates.length === 1) {
      return `${uniqueBitrates[0]} kbps`
    }

    if (uniqueBitrates.length > 3) {
      return `${uniqueBitrates.length} bitrates present`
    }

    return uniqueBitrates.map((value) => `${value} kbps`).join(', ')
  }, [isDurationPending, uniqueBitrates])

  const periodicityValue =
    periodicityMedian !== null
      ? `Median gap: ${formatDuration(periodicityMedian)}`
      : isDurationPending
        ? 'Loading metadata...'
        : 'Unavailable'
  const durationValue =
    durationMedian !== null
      ? `Median duration: ${formatDuration(durationMedian)}`
      : isDurationPending
        ? 'Loading metadata...'
        : 'Unavailable'
  const timestampValue = sortedFiles.length
    ? `${timestampedFileCount}/${sortedFiles.length} files parsed`
    : 'No files loaded'
  const sampleRateValue = isMetadataPending
    ? 'Loading metadata...'
    : commonSampleRateHz !== null
      ? `Most common: ${formatSampleRate(commonSampleRateHz)}`
      : 'Unavailable'
  const channelsValue = isMetadataPending
    ? 'Loading metadata...'
    : commonNumberOfChannels !== null
      ? `Most common: ${commonNumberOfChannels}`
      : 'Unavailable'
  const bitDepthValue = isMetadataPending
    ? 'Loading metadata...'
    : commonBitDepth !== null
      ? `Most common: ${commonBitDepth} bit`
      : 'Unavailable'
  const allExpanded = sortedFiles.length > 0 && expandedRowKeys.size === sortedFiles.length

  useEffect(() => {
    setExpandedRowKeys((current) => {
      const availableKeys = new Set(sortedFiles.map((entry) => entry.file.relativePath))
      const next = new Set(Array.from(current).filter((key) => availableKeys.has(key)))

      return next.size === current.size ? current : next
    })
  }, [sortedFiles])

  const toggleAllRows = () => {
    if (allExpanded) {
      setExpandedRowKeys(new Set())
      return
    }

    setExpandedRowKeys(new Set(sortedFiles.map((entry) => entry.file.relativePath)))
  }

  const toggleRow = (rowKey: string) => {
    setExpandedRowKeys((current) => {
      const next = new Set(current)

      if (next.has(rowKey)) {
        next.delete(rowKey)
      } else {
        next.add(rowKey)
      }

      return next
    })
  }

  const handleDownloadTsv = () => {
    const headers = [
      'validates',
      'full_name',
      'relative_path',
      'type',
      'extension',
      'size_bytes',
      'last_modified',
      'parsed_filename_timestamp',
      'estimated_end_time',
      'duration_seconds',
      'sample_rate_hz',
      'channels',
      'bit_depth_bits',
      'gap_to_next_file_seconds',
      'next_file_starts',
      'approx_bitrate_kbps',
      'audio_detected',
      'filename_timestamp_detected',
    ]
    const rows = sortedFiles.map((entry, index) => {
      const { file, inferredTimestamp, durationSeconds, metadata } = entry
      const nextInferredTimestamp = sortedFiles[index + 1]?.inferredTimestamp ?? null
      const estimatedEndTime =
        inferredTimestamp && typeof durationSeconds === 'number'
          ? addSeconds(inferredTimestamp, durationSeconds)
          : null
      const gapToNextSeconds =
        estimatedEndTime && nextInferredTimestamp
          ? (nextInferredTimestamp.getTime() - estimatedEndTime.getTime()) / 1000
          : null
      const bitrate =
        typeof durationSeconds === 'number' && durationSeconds > 0
          ? (file.file.size * 8) / durationSeconds
          : null
      const rowValidation = getRowValidationResult({
        inferredTimestamp,
        bitrateKbps: bitrate !== null ? Math.round(bitrate / 1000) : null,
        sampleRateHz: metadata?.sampleRateHz,
        numberOfChannels: metadata?.numberOfChannels,
        bitDepth: metadata?.bitDepth,
        isAudio: file.fileType.isAudio,
        durationSeconds,
        gapSeconds: gapToNextSeconds,
        config: rowValidationConfig,
      })

      return [
        rowValidation.rowStatus === 'pass' ? 'TRUE' : 'FALSE',
        file.file.name,
        file.relativePath,
        file.file.type || 'unknown type',
        file.file.name.split('.').pop() || 'unknown',
        String(file.file.size),
        new Date(file.file.lastModified).toISOString(),
        inferredTimestamp ? inferredTimestamp.toISOString() : 'Not found',
        estimatedEndTime ? estimatedEndTime.toISOString() : 'Unavailable',
        typeof durationSeconds === 'number' ? String(durationSeconds) : 'Unavailable',
        typeof metadata?.sampleRateHz === 'number' ? String(metadata.sampleRateHz) : 'Unavailable',
        typeof metadata?.numberOfChannels === 'number'
          ? String(metadata.numberOfChannels)
          : 'Unavailable',
        typeof metadata?.bitDepth === 'number' ? String(metadata.bitDepth) : 'Unavailable',
        gapToNextSeconds !== null ? String(gapToNextSeconds) : 'Unavailable',
        nextInferredTimestamp ? nextInferredTimestamp.toISOString() : 'Unavailable',
        bitrate !== null ? String(Math.round(bitrate / 1000)) : 'Unavailable',
        file.fileType.isAudio ? 'TRUE' : 'FALSE',
        inferredTimestamp ? 'TRUE' : 'FALSE',
      ]
    })
    const safeFolderName = folderName
      .trim()
      .replace(/[^a-z0-9._-]+/gi, '-')
      .replace(/^-+|-+$/g, '')

    downloadTsv(`${safeFolderName || 'qc-audio-metadata'}.tsv`, headers, rows)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white">
        <div className="px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-800">Validation Overview</h3>
        </div>
        <div className="flex flex-wrap">
          <ValidationOverviewItem
            label="Periodicity"
            status={periodicityStatus}
            value={periodicityValue}
            control={
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <span>Tolerance</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={periodicityToleranceSeconds}
                  onChange={(event) =>
                    setPeriodicityToleranceSeconds(Number(event.target.value) || 0)
                  }
                  className="w-20 rounded border border-slate-300 px-2 py-1 text-sm text-slate-700"
                />
                <span>s</span>
              </label>
            }
          />

          <ValidationOverviewItem
            label="Timestamp evaluated"
            status={timestampStatus}
            value={timestampValue}
          />

          <ValidationOverviewItem label="Bitrate" status={bitrateStatus} value={bitrateValue} />
          <ValidationOverviewItem
            label="Duration"
            status={durationStatus}
            value={durationValue}
            control={
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <span>Tolerance</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={durationToleranceSeconds}
                  onChange={(event) => setDurationToleranceSeconds(Number(event.target.value) || 0)}
                  className="w-20 rounded border border-slate-300 px-2 py-1 text-sm text-slate-700"
                />
                <span>s</span>
              </label>
            }
          />
          <ValidationOverviewItem
            label="Sample rate"
            status={sampleRateStatus}
            value={sampleRateValue}
          />
          <ValidationOverviewItem label="Channels" status={channelsStatus} value={channelsValue} />
          <ValidationOverviewItem label="Bit depth" status={bitDepthStatus} value={bitDepthValue} />
        </div>
      </div>
      <div>
        <div className="flex justify-end m-0">
          <Button
            size="xs"
            type="ghost"
            onClick={handleDownloadTsv}
            disabled={!sortedFiles.length || isMetadataPending}
          >
            <Download size={16} />
            Download TSV
          </Button>
        </div>
        <div className="relative max-h-150 overflow-auto rounded-md border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full table-fixed divide-y divide-slate-200">
            <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_2px_6px_rgba(15,23,42,0.08)]">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="bg-slate-50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    {sortedFiles.length > 0 ? (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        onClick={toggleAllRows}
                        aria-label={allExpanded ? 'Collapse all rows' : 'Expand all rows'}
                        aria-expanded={allExpanded}
                        title={allExpanded ? 'Collapse all rows' : 'Expand all rows'}
                      >
                        {allExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    ) : null}
                    <span>File</span>
                  </div>
                </th>
                <th className="bg-slate-50 px-3 py-2">Timestamp</th>
                <th className="w-36 bg-slate-50 px-3 py-2">~ bitrate</th>
                <th className="w-28 bg-slate-50 px-3 py-2">Duration</th>
                <th className="w-28 bg-slate-50 px-3 py-2">Sample rate</th>
                <th className="w-24 bg-slate-50 px-3 py-2">Channels</th>
                <th className="w-24 bg-slate-50 px-3 py-2">Bit depth</th>
                <th className="w-44 bg-slate-50 px-3 py-2">End time</th>
                <th className="w-44 bg-slate-50 px-3 py-2">Gap</th>
              </tr>
            </thead>
            <tbody>
              {sortedFiles.map((entry, index) => (
                <FolderFileRow
                  key={entry.file.relativePath}
                  file={entry.file}
                  inferredTimestamp={entry.inferredTimestamp}
                  nextInferredTimestamp={sortedFiles[index + 1]?.inferredTimestamp ?? null}
                  durationSeconds={entry.durationSeconds}
                  sampleRateHz={entry.metadata?.sampleRateHz}
                  numberOfChannels={entry.metadata?.numberOfChannels}
                  bitDepth={entry.metadata?.bitDepth}
                  validationConfig={rowValidationConfig}
                  previousGapFailed={index > 0 ? gapFailuresByIndex[index - 1] : false}
                  isExpanded={expandedRowKeys.has(entry.file.relativePath)}
                  onToggle={() => toggleRow(entry.file.relativePath)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const QCField = (props: IFieldInputProps) => {
  return <FolderUpload {...props} folderPreviewComponent={QCFolderPreview} />
}

const QCToolsForm = (): ReactElement => {
  const formOverrideState = useState<IForm | undefined>(form)

  return (
    <>
      <FormWithEditorOverlay
        formState={formOverrideState}
        inputOverrides={{ 'custom:qc-tools': QCField }}
      />
    </>
  )
}

export default QCToolsForm
