import {FormWithEditorOverlay} from '@/Form/FormWithEditorOverlay'
import { ReactElement, useEffect, useMemo, useState } from 'react'
import { type JSONSchema6 } from 'json-schema'
import { IFormFieldOverride } from '@/library'
import { IFieldInputProps, IForm, type IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import FolderUpload from '@/Form/Components/Inputs/FolderUpload/FolderUpload'
import { type FolderFileEntry, type FolderPreviewProps } from '@/Form/Components/Inputs/FolderUpload/folderUploadTypes'
import { ChevronDown, ChevronRight, Check, Copy, FileAudio, File, X } from 'lucide-react'


const form:IForm = {
    id: 'qc-tools',
    label: 'QC Tools',
    fields:[
        {
            id:'qc-tools-field',
            type:'custom:qc-tools',
            label: 'QC Tools'
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
        /DSG_RAWD_HMS_(\d{1,2})_\s*(\d{1,2})_\s*(\d{1,2})__DMY_(\d{1,2})_\s*(\d{1,2})_(\d{1,2})/,
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

        const cleanup = () => {
            URL.revokeObjectURL(objectUrl)
        }

        const handleLoadedMetadata = () => {
            if (!active) {
                return
            }

            setDurationSeconds(Number.isFinite(audio.duration) ? audio.duration : null)
            cleanup()
        }

        const handleError = () => {
            if (active) {
                setDurationSeconds(null)
            }
            cleanup()
        }

        audio.preload = 'metadata'
        audio.onloadedmetadata = handleLoadedMetadata
        audio.onerror = handleError
        audio.src = objectUrl

        return () => {
            active = false
            audio.onloadedmetadata = null
            audio.onerror = null
            cleanup()
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
}: {
    file: FolderFileEntry
    inferredTimestamp: Date | null
    nextInferredTimestamp: Date | null
}) => {
    const durationSeconds = useAudioMetadata(file.file)
    const audioUrl = useObjectUrl(file.fileType.isAudio ? file.file : null)
    const [isExpanded, setIsExpanded] = useState(false)
    const extension = file.file.name.split('.').pop() || 'unknown'
    const lastModified = useMemo(() => new Date(file.file.lastModified), [file.file.lastModified])
    const estimatedEndTime = useMemo(() => {
        if (!inferredTimestamp || durationSeconds === null) {
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
        if (!durationSeconds || durationSeconds <= 0) {
            return null
        }

        return (file.file.size * 8) / durationSeconds
    }, [durationSeconds, file.file.size])

    const metadataRows = [
        ['Full name', file.file.name],
        ['Relative path', file.relativePath],
        ['Type', file.file.type || 'unknown type'],
        ['Extension', extension],
        ['Size', formatBytes(file.file.size)],
        ['Last modified', lastModified.toLocaleString()],
        ['Parsed filename timestamp', inferredTimestamp ? inferredTimestamp.toLocaleString() : 'Not found'],
        ['Estimated end time', estimatedEndTime ? estimatedEndTime.toLocaleString() : 'Unavailable'],
        ['Duration', durationSeconds !== null ? formatDuration(durationSeconds) : 'Unavailable'],
        ['Gap to next file', formatGap(gapToNextSeconds)],
        ['Next file starts', nextInferredTimestamp ? nextInferredTimestamp.toLocaleString() : 'Unavailable'],
        ['Approx. bitrate', bitrate !== null ? `${Math.round(bitrate / 1000)} kbps` : 'Unavailable'],
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
    const expandCellClassName = isExpanded ? 'bg-slate-600 px-2 py-2 text-center align-top' : 'px-2 py-2 text-center align-top'
    const expandButtonClassName = isExpanded
        ? 'inline-flex items-center justify-center rounded-md p-1 text-slate-100 hover:bg-slate-500 hover:text-white'
        : 'inline-flex items-center justify-center rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800'

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
                <td className={`whitespace-nowrap px-3 py-2 align-top text-sm ${rowTextClassName}`}>
                    <div className={`flex items-center gap-2 text-sm ${rowTextClassName}`}>
                        {inferredTimestamp ? (
                            <Check className={`shrink-0 ${isExpanded ? 'text-emerald-200' : 'text-emerald-600'}`} size={16} />
                        ) : (
                            <X className={`shrink-0 ${isExpanded ? 'text-rose-200' : 'text-rose-600'}`} size={16} />
                        )}
                        <span>{inferredTimestamp ? inferredTimestamp.toLocaleString() : 'Not found'}</span>
                    </div>
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-sm ${rowTextClassName} align-top`}>
                    {bitrate !== null ? `${Math.round(bitrate / 1000)} kbps` : '—'}
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-sm ${rowTextClassName} align-top`}>
                    {durationSeconds !== null ? formatDuration(durationSeconds) : '—'}
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-sm ${rowTextClassName} align-top`}>
                    {estimatedEndTime ? estimatedEndTime.toLocaleString() : '—'}
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-sm ${rowTextClassName} align-top`}>
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
    const sortedFiles = useMemo(() => {
        return files
            .map((file) => ({
                file,
                inferredTimestamp: parseDateTimeFromFilename(file.file.name),
            }))
            .sort((left, right) => {
                const leftTime = left.inferredTimestamp?.getTime() ?? Number.POSITIVE_INFINITY
                const rightTime = right.inferredTimestamp?.getTime() ?? Number.POSITIVE_INFINITY

                if (leftTime !== rightTime) {
                    return leftTime - rightTime
                }

                return left.file.relativePath.localeCompare(right.file.relativePath)
            })
    }, [files])

    return (
        <div className="flex flex-col gap-3">
            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <h3 className="text-base font-semibold text-slate-800">{folderName}</h3>
                <p className="text-sm text-slate-600">
                    {files.length} file{files.length === 1 ? '' : 's'} selected
                </p>
            </div>
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full table-fixed divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <th className="px-3 py-2">File</th>
                            <th className="px-3 py-2">Timestamp</th>
                            <th className="w-36 px-3 py-2">Approx bitrate</th>
                            <th className="w-28 px-3 py-2">Duration</th>
                            <th className="w-44 px-3 py-2">End time</th>
                            <th className="w-44 px-3 py-2">Gap</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFiles.map((entry, index) => (
                            <FolderFileRow
                                key={entry.file.relativePath}
                                file={entry.file}
                                inferredTimestamp={entry.inferredTimestamp}
                                nextInferredTimestamp={sortedFiles[index + 1]?.inferredTimestamp ?? null}
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
