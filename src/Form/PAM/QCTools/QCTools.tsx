import {FormWithEditorOverlay} from '@/Form/FormWithEditorOverlay'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { IFormFieldOverride } from '@/library'
import { IFieldInputProps, IForm, type IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import FolderUpload from '@/Form/Components/Inputs/FolderUpload/FolderUpload'
import { type FolderFileEntry, type FolderPreviewProps } from '@/Form/Components/Inputs/FolderUpload/folderUploadTypes'
import { ChevronDown, ChevronRight, Check, Copy, FileAudio, File, Loader, X, Folder } from 'lucide-react'


const form:IForm = {
    id: 'qc-tools',
    label: 'QC Tools POC',
    settings:{
        show_progress: false
    },
    fields:[
        {
            id:'qc-tools-field',
            type:'custom:qc-tools',
            label: ''
        }
    ]
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
    const patterns = [
        /(?:^|[^\d])(20\d{2})[-_.]?(0[1-9]|1[0-2])[-_.]?(0[1-9]|[12]\d|3[01])[T _-]?([01]\d|2[0-3])[:._-]?([0-5]\d)[:._-]?([0-5]\d)(?:[^\d]|$)/,
        /(?:^|[^\d])(20\d{2})[-_.]?(0[1-9]|1[0-2])[-_.]?(0[1-9]|[12]\d|3[01])(?:[^\d]|$)/,
        /_HMS_(\d{1,2})_\s*(\d{1,2})_\s*(\d{1,2})__DMY_(\d{1,2})_\s*(\d{1,2})_(\d{1,2})/,
    ]

    for (const pattern of patterns) {
        const match = filename.match(pattern)
        if (!match) {
            continue
        }

        if (pattern === patterns[2]) {
            const [, hour, minute, second, day, month, year] = match
            const parsed = new Date(
                normalizeTwoDigitYear(year),
                Number(month) - 1,
                Number(day),
                Number(hour),
                Number(minute),
                Number(second)
            )

            if (!Number.isNaN(parsed.getTime()) && isValidUtcDate(
                parsed.getFullYear(),
                parsed.getMonth() + 1,
                parsed.getDate(),
                parsed.getHours(),
                parsed.getMinutes(),
                parsed.getSeconds()
            )) {
                return parsed
            }

            continue
        }

        const [, year, month, day, hour = '00', minute = '00', second = '00'] = match
        const parsed = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute),
            Number(second)
        )

        if (!Number.isNaN(parsed.getTime())) {
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

const addSeconds = (value: Date, seconds: number): Date => new Date(value.getTime() + seconds * 1000)

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

const useAudioDurationMap = (files: FolderFileEntry[]) => {
    const [durationMap, setDurationMap] = useState<Record<string, number | null | undefined>>({})

    useEffect(() => {
        let active = true

        const initialMap = Object.fromEntries(
            files.map((entry) => [entry.relativePath, entry.fileType.isAudio ? undefined : null])
        )
        setDurationMap(initialMap)

        const loadDurations = async () => {
            const entries = await Promise.all(
                files.map(async (entry) => {
                    if (!entry.fileType.isAudio) {
                        return [entry.relativePath, null] as const
                    }

                    return [entry.relativePath, await getAudioDuration(entry.file)] as const
                })
            )

            if (active) {
                setDurationMap(Object.fromEntries(entries))
            }
        }

        loadDurations().catch(() => {
            if (active) {
                setDurationMap(initialMap)
            }
        })

        return () => {
            active = false
        }
    }, [files])

    return durationMap
}

type ValidationStatus = 'pass' | 'fail' | 'pending'

const ValidationIndicator = ({ status }: { status: ValidationStatus }) => {
    if (status === 'pending') {
        return <Loader className="text-slate-400" size={16} />
    }

    return status === 'pass'
        ? <Check className="text-emerald-600" size={16} />
        : <X className="text-rose-600" size={16} />
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
        <div className="flex min-w-65 flex-1 flex-col gap-2 px-4 py-3">
            <div className="flex items-center gap-2">
                <div className={`text-sm font-medium ${labelClassName}`}>{label}</div>
                <ValidationIndicator status={status} />
            </div>
            <div className={`text-sm ${valueClassName}`}>{value}</div>
            {control ? <div>{control}</div> : null}
        </div>
    )
}

type RowValidationConfig = {
    expectedBitrateKbps: number | null
    expectedGapSeconds: number | null
    expectedDurationSeconds: number | null
    gapToleranceSeconds: number
    durationToleranceSeconds: number
}

type RowValidationResult = {
    rowStatus: ValidationStatus
    timestampFailed: boolean
    bitrateFailed: boolean
    durationFailed: boolean
    gapFailed: boolean
}

const getRowValidationResult = ({
    inferredTimestamp,
    bitrateKbps,
    durationSeconds,
    gapSeconds,
    config,
}: {
    inferredTimestamp: Date | null
    bitrateKbps: number | null
    durationSeconds: number | null | undefined
    gapSeconds: number | null
    config: RowValidationConfig
}): RowValidationResult => {
    const timestampFailed = inferredTimestamp === null
    const bitrateFailed = config.expectedBitrateKbps !== null && bitrateKbps !== null
        ? bitrateKbps !== config.expectedBitrateKbps
        : false
    const durationFailed =
        config.expectedDurationSeconds !== null && typeof durationSeconds === 'number'
            ? Math.abs(durationSeconds - config.expectedDurationSeconds) > config.durationToleranceSeconds
            : false
    const gapFailed =
        config.expectedGapSeconds !== null && gapSeconds !== null
            ? Math.abs(gapSeconds - config.expectedGapSeconds) > config.gapToleranceSeconds
            : false

    return {
        rowStatus: timestampFailed || bitrateFailed || durationFailed || gapFailed ? 'fail' : 'pass',
        timestampFailed,
        bitrateFailed,
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
    const inferredTimestamp = useMemo(() => parseDateTimeFromFilename(file.file.name), [file.file.name])
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
                    <dd className="truncate text-slate-800" title={file.relativePath}>{file.relativePath}</dd>
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
    validationConfig,
    previousGapFailed,
}: {
    file: FolderFileEntry
    inferredTimestamp: Date | null
    nextInferredTimestamp: Date | null
    durationSeconds: number | null | undefined
    validationConfig: RowValidationConfig
    previousGapFailed: boolean
}) => {
    const audioUrl = useObjectUrl(file.fileType.isAudio ? file.file : null)
    const [isExpanded, setIsExpanded] = useState(false)
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
        () => getRowValidationResult({
            inferredTimestamp,
            bitrateKbps,
            durationSeconds,
            gapSeconds: gapToNextSeconds,
            config: validationConfig,
        }),
        [bitrateKbps, durationSeconds, gapToNextSeconds, inferredTimestamp, validationConfig]
    )

    const metadataRows = [
        ['Full name', file.file.name],
        ['Relative path', file.relativePath],
        ['Type', file.file.type || 'unknown type'],
        ['Extension', extension],
        ['Size', formatBytes(file.file.size)],
        ['Last modified', lastModified.toLocaleString()],
        ['Parsed filename timestamp', inferredTimestamp ? inferredTimestamp.toLocaleString() : 'Not found'],
        ['Estimated end time', estimatedEndTime ? estimatedEndTime.toLocaleString() : 'Unavailable'],
        ['Duration', durationSeconds !== null && durationSeconds !== undefined ? formatDuration(durationSeconds) : 'Unavailable'],
        ['Gap to next file', formatGap(gapToNextSeconds)],
        ['Next file starts', nextInferredTimestamp ? nextInferredTimestamp.toLocaleString() : 'Unavailable'],
        ['Approx. bitrate', bitrate !== null ? formatBitrate(bitrate) : 'Unavailable'],
        ['Audio detected', file.fileType.isAudio ? 'Yes' : 'No'],
        ['Filename timestamp detected', inferredTimestamp ? 'Yes' : 'No'],
        ['Folder row path', file.relativePath],
    ]
    const rowClassName = isExpanded
        ? 'border-b border-slate-600 bg-slate-600 text-slate-100 last:border-b-0'
        : 'border-b border-slate-200 last:border-b-0 hover:bg-slate-50'
    const rowTextClassName = isExpanded ? 'text-slate-100' : 'text-slate-700'
    const mutedTextClassName = isExpanded ? 'text-slate-200' : 'text-slate-500'
    const iconClassName = isExpanded ? 'text-slate-100' : 'text-slate-400'
    const expandButtonClassName = isExpanded
        ? 'inline-flex items-center justify-center rounded-md p-1 text-slate-100 hover:bg-slate-500 hover:text-white'
        : 'inline-flex items-center justify-center rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
    const failingCellClassName = isExpanded ? 'text-rose-200' : 'text-rose-600'
    const timestampCellClassName = (
        rowValidation.timestampFailed ||
        (inferredTimestamp !== null && previousGapFailed)
    )
        ? failingCellClassName
        : rowTextClassName
    const bitrateCellClassName = rowValidation.bitrateFailed ? failingCellClassName : rowTextClassName
    const durationCellClassName = rowValidation.durationFailed ? failingCellClassName : rowTextClassName
    const gapCellClassName = rowValidation.gapFailed ? failingCellClassName : rowTextClassName

    return (
        <>
            <tr className={rowClassName}>
                <td className={`px-3 py-2 align-top ${isExpanded ? 'bg-slate-600' : ''}`}>
                    <div className={`flex min-w-0 items-center gap-2 text-sm ${rowTextClassName}`}>
                        <button
                            type="button"
                            className={expandButtonClassName}
                            onClick={() => setIsExpanded((current) => !current)}
                            aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                            aria-expanded={isExpanded}
                        >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <ValidationIndicator status={rowValidation.rowStatus} />
                        {file.fileType.isAudio ? (
                            <FileAudio className={`shrink-0 ${isExpanded ? 'text-emerald-200' : 'text-emerald-600'}`} size={16} />
                        ) : (
                            <File className={`shrink-0 ${iconClassName}`} size={16} />
                        )}
                        <div className="min-w-0 flex-1">
                            <div className={`truncate text-sm font-medium ${rowTextClassName}`}>{file.file.name}</div>
                            <div className={`truncate text-xs ${mutedTextClassName}`}>{file.relativePath}</div>
                        </div>
                        <button
                            type="button"
                            className={`shrink-0 rounded p-1 ${isExpanded ? 'text-slate-100 hover:bg-slate-500 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
                            title="Copy full filename"
                            aria-label="Copy full filename"
                            onClick={async (event) => {
                                event.stopPropagation()
                                event.preventDefault()
                                await copyToClipboard(file.file.name)
                            }}
                        >
                            <Copy size={14} />
                        </button>
                    </div>
                </td>
                <td className={`whitespace-nowrap px-3 py-2 align-top text-sm ${timestampCellClassName}`}>
                    <span>{inferredTimestamp ? inferredTimestamp.toLocaleString() : 'Not found'}</span>
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-sm ${bitrateCellClassName} align-top`}>
                    {bitrate !== null ? formatBitrate(bitrate) : '—'}
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-sm ${durationCellClassName} align-top`}>
                    {durationSeconds !== null && durationSeconds !== undefined ? formatDuration(durationSeconds) : '—'}
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-sm ${rowTextClassName} align-top`}>
                    {estimatedEndTime ? estimatedEndTime.toLocaleString() : '—'}
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-sm ${gapCellClassName} align-top`}>
                    {gapToNextSeconds === null ? '—' : formatGap(gapToNextSeconds)}
                </td>
            </tr>
            {isExpanded && (
                <tr className="border-b border-slate-600 bg-slate-600 last:border-b-0">
                    <td colSpan={6} className=" px-3 py-3">
                        <div className="flex flex-col gap-3">
                            {file.fileType.isAudio && audioUrl ? (
                                <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
                                    <div className="text-xs uppercase tracking-wide text-slate-500">Audio player</div>
                                    <audio
                                        controls
                                        preload="metadata"
                                        src={audioUrl}
                                        className="mt-2 w-full"
                                    />
                                </div>
                            ) : null}
                            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                                {metadataRows.map(([label, value]) => (
                                    <div key={label} className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
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

const QCFolderPreview = ({folderName, files}: FolderPreviewProps) => {
    const [periodicityToleranceSeconds, setPeriodicityToleranceSeconds] = useState(1)
    const [durationToleranceSeconds, setDurationToleranceSeconds] = useState(1)
    const durationMap = useAudioDurationMap(files)
    const sortedFiles = useMemo(() => {
        return files
            .map((file) => ({
                file,
                inferredTimestamp: parseDateTimeFromFilename(file.file.name),
                durationSeconds: durationMap[file.relativePath],
            }))
            .sort((left, right) => {
                const leftTime = left.inferredTimestamp?.getTime() ?? Number.POSITIVE_INFINITY
                const rightTime = right.inferredTimestamp?.getTime() ?? Number.POSITIVE_INFINITY

                if (leftTime !== rightTime) {
                    return leftTime - rightTime
                }

                return left.file.relativePath.localeCompare(right.file.relativePath)
            })
    }, [durationMap, files])

    const audioEntries = useMemo(
        () => sortedFiles.filter((entry) => entry.file.fileType.isAudio),
        [sortedFiles]
    )
    const resolvedDurations = useMemo(
        () => audioEntries.map((entry) => entry.durationSeconds).filter((value): value is number => typeof value === 'number'),
        [audioEntries]
    )
    const isDurationPending = useMemo(
        () => audioEntries.some((entry) => entry.durationSeconds === undefined),
        [audioEntries]
    )
    const bitrateValues = useMemo(
        () => audioEntries
            .map((entry) => {
                const durationSeconds = entry.durationSeconds
                if (typeof durationSeconds !== 'number' || durationSeconds <= 0) {
                    return null
                }

                return Math.round(((entry.file.file.size * 8) / durationSeconds) / 1000)
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
    const uniqueBitrates = useMemo(() => Array.from(new Set(bitrateValues)).sort((left, right) => left - right), [bitrateValues])
    const timestampedFileCount = useMemo(
        () => sortedFiles.filter((entry) => entry.inferredTimestamp !== null).length,
        [sortedFiles]
    )
    const rowValidationConfig = useMemo<RowValidationConfig>(
        () => ({
            expectedBitrateKbps: commonBitrateKbps,
            expectedGapSeconds: commonGapSeconds,
            expectedDurationSeconds: commonDurationSeconds,
            gapToleranceSeconds: periodicityToleranceSeconds,
            durationToleranceSeconds: durationToleranceSeconds,
        }),
        [commonBitrateKbps, commonDurationSeconds, commonGapSeconds, durationToleranceSeconds, periodicityToleranceSeconds]
    )
    const gapFailuresByIndex = useMemo(
        () => sortedFiles.map((entry, index) => {
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

            return Math.abs(gapSeconds - rowValidationConfig.expectedGapSeconds) > rowValidationConfig.gapToleranceSeconds
        }),
        [rowValidationConfig.expectedGapSeconds, rowValidationConfig.gapToleranceSeconds, sortedFiles]
    )

    const periodicityStatus: ValidationStatus = isDurationPending
        ? 'pending'
        : gapValues.length > 0 && periodicityMedian !== null && gapValues.every((gap) => Math.abs(gap - periodicityMedian) <= periodicityToleranceSeconds)
            ? 'pass'
            : 'fail'
    const timestampStatus: ValidationStatus = sortedFiles.length > 0 && timestampedFileCount === sortedFiles.length
        ? 'pass'
        : 'fail'
    const bitrateStatus: ValidationStatus = isDurationPending
        ? 'pending'
        : uniqueBitrates.length === 1 && uniqueBitrates.length > 0
            ? 'pass'
            : 'fail'
    const durationStatus: ValidationStatus = isDurationPending
        ? 'pending'
        : resolvedDurations.length > 0 && durationMedian !== null && resolvedDurations.every((duration) => Math.abs(duration - durationMedian) <= durationToleranceSeconds)
            ? 'pass'
            : 'fail'

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

    const periodicityValue = periodicityMedian !== null
        ? `Median gap: ${formatDuration(periodicityMedian)}`
        : isDurationPending
            ? 'Loading metadata...'
            : 'Unavailable'
    const durationValue = durationMedian !== null
        ? `Median duration: ${formatDuration(durationMedian)}`
        : isDurationPending
            ? 'Loading metadata...'
            : 'Unavailable'
    const timestampValue = sortedFiles.length
        ? `${timestampedFileCount}/${sortedFiles.length} files parsed`
        : 'No files loaded'

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white">
                <div className="px-4 py-3">
                    <h3 className="text-sm font-semibold text-slate-800">Validation Overview</h3>
                </div>
                <div className="flex flex-wrap items-stretch">
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
                                    onChange={(event) => setPeriodicityToleranceSeconds(Number(event.target.value) || 0)}
                                    className="w-20 rounded border border-slate-300 px-2 py-1 text-sm text-slate-700"
                                />
                                <span>s</span>
                            </label>
                        }
                    />
                    <div className="my-3 w-px self-stretch bg-slate-200" />
                    <ValidationOverviewItem
                        label="Timestamp evaluated"
                        status={timestampStatus}
                        value={timestampValue}
                    />
                    <div className="my-3 w-px self-stretch bg-slate-200" />
                    <ValidationOverviewItem
                        label="Bitrate"
                        status={bitrateStatus}
                        value={bitrateValue}
                    />
                    <div className="my-3 w-px self-stretch bg-slate-200" />
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
                </div>
            </div>
            <div className="relative max-h-150 overflow-auto rounded-md border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full table-fixed divide-y divide-slate-200">
                    <thead className="sticky top-0 z-10 bg-slate-50 shadow-[0_2px_6px_rgba(15,23,42,0.08)]">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <th className="bg-slate-50 px-3 py-2">File</th>
                            <th className="bg-slate-50 px-3 py-2">Timestamp</th>
                            <th className="w-36 bg-slate-50 px-3 py-2">Approx bitrate</th>
                            <th className="w-28 bg-slate-50 px-3 py-2">Duration</th>
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
                                validationConfig={rowValidationConfig}
                                previousGapFailed={index > 0 ? gapFailuresByIndex[index - 1] : false}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const QCField = (props:IFieldInputProps) => {
        return <FolderUpload 
        {...props}
        folderPreviewComponent={QCFolderPreview} 
        />
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
