import {FormWithEditorOverlay} from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { ReactElement, useEffect, useMemo, useState } from ***REMOVED***react***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { IFormFieldOverride } from ***REMOVED***@/library***REMOVED***
import { IFieldInputProps, IForm, type IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import FolderUpload from ***REMOVED***@/Form/Components/Inputs/FolderUpload/FolderUpload***REMOVED***
import { type FolderFileEntry, type FolderPreviewProps } from ***REMOVED***@/Form/Components/Inputs/FolderUpload/folderUploadTypes***REMOVED***
import { ChevronDown, ChevronRight, Check, Copy, FileAudio, File, X } from ***REMOVED***lucide-react***REMOVED***


const form:IForm = {
    id: ***REMOVED***qc-tools***REMOVED***,
    label: ***REMOVED***QC Tools***REMOVED***,
    fields:[
        {
            id:***REMOVED***qc-tools-field***REMOVED***,
            type:***REMOVED***custom:qc-tools***REMOVED***,
            label: ***REMOVED***QC Tools***REMOVED***
        }
    ]
}

const formatBytes = (value: number): string => {
    if (!Number.isFinite(value) || value <= 0) {
        return ***REMOVED***0 B***REMOVED***
    }

    const units = [***REMOVED***B***REMOVED***, ***REMOVED***KB***REMOVED***, ***REMOVED***MB***REMOVED***, ***REMOVED***GB***REMOVED***, ***REMOVED***TB***REMOVED***]
    const unitIndex = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1)
    const normalized = value / 1024 ** unitIndex

    return `${normalized.toFixed(normalized >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

const formatDateTime = (value: Date | null): string => {
    if (!value || Number.isNaN(value.getTime())) {
        return ***REMOVED***Unknown***REMOVED***
    }

    return value.toLocaleString()
}

const formatDuration = (seconds: number | null): string => {
    if (seconds === null || !Number.isFinite(seconds) || seconds < 0) {
        return ***REMOVED***Unavailable***REMOVED***
    }

    if (seconds < 60) {
        return `${seconds.toFixed(2)} s`
    }

    const wholeSeconds = Math.floor(seconds % 60)
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ${wholeSeconds.toString().padStart(2, ***REMOVED***0***REMOVED***)}s`
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

        const [, year, month, day, hour = ***REMOVED***00***REMOVED***, minute = ***REMOVED***00***REMOVED***, second = ***REMOVED***00***REMOVED***] = match
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
        const audio = document.createElement(***REMOVED***audio***REMOVED***)

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

        audio.preload = ***REMOVED***metadata***REMOVED***
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
        return ***REMOVED***Unavailable***REMOVED***
    }

    const absoluteSeconds = Math.abs(seconds)
    const label = formatDuration(absoluteSeconds)
    if (seconds > 0) {
        return `Gap of ${label}`
    }

    if (seconds < 0) {
        return `Overlap of ${label}`
    }

    return ***REMOVED***No gap***REMOVED***
}

const copyToClipboard = async (value: string): Promise<void> => {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
        return
    }

    const textarea = document.createElement(***REMOVED***textarea***REMOVED***)
    textarea.value = value
    textarea.setAttribute(***REMOVED***readonly***REMOVED***, ***REMOVED***true***REMOVED***)
    textarea.style.position = ***REMOVED***absolute***REMOVED***
    textarea.style.left = ***REMOVED***-9999px***REMOVED***
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand(***REMOVED***copy***REMOVED***)
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
                    {file.file.type || ***REMOVED***unknown type***REMOVED***}
                </div>
            </div>

            <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Size</dt>
                    <dd className="text-slate-800">{formatBytes(file.file.size)}</dd>
                </div>
                <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Extension</dt>
                    <dd className="text-slate-800">{file.file.name.split(***REMOVED***.***REMOVED***).pop() || ***REMOVED***unknown***REMOVED***}</dd>
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
                        {durationSeconds !== null ? formatDuration(durationSeconds) : ***REMOVED***Loading metadata...***REMOVED***}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Approx. bitrate</dt>
                    <dd className="text-slate-800">
                        {bitrate !== null ? `${Math.round(bitrate / 1000)} kbps` : ***REMOVED***Unavailable***REMOVED***}
                    </dd>
                </div>
                <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Audio flag</dt>
                    <dd className="text-slate-800">{file.fileType.isAudio ? ***REMOVED***Yes***REMOVED*** : ***REMOVED***No***REMOVED***}</dd>
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
    const extension = file.file.name.split(***REMOVED***.***REMOVED***).pop() || ***REMOVED***unknown***REMOVED***
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
        [***REMOVED***Full name***REMOVED***, file.file.name],
        [***REMOVED***Relative path***REMOVED***, file.relativePath],
        [***REMOVED***Type***REMOVED***, file.file.type || ***REMOVED***unknown type***REMOVED***],
        [***REMOVED***Extension***REMOVED***, extension],
        [***REMOVED***Size***REMOVED***, formatBytes(file.file.size)],
        [***REMOVED***Last modified***REMOVED***, lastModified.toLocaleString()],
        [***REMOVED***Parsed filename timestamp***REMOVED***, inferredTimestamp ? inferredTimestamp.toLocaleString() : ***REMOVED***Not found***REMOVED***],
        [***REMOVED***Estimated end time***REMOVED***, estimatedEndTime ? estimatedEndTime.toLocaleString() : ***REMOVED***Unavailable***REMOVED***],
        [***REMOVED***Duration***REMOVED***, durationSeconds !== null ? formatDuration(durationSeconds) : ***REMOVED***Unavailable***REMOVED***],
        [***REMOVED***Gap to next file***REMOVED***, formatGap(gapToNextSeconds)],
        [***REMOVED***Next file starts***REMOVED***, nextInferredTimestamp ? nextInferredTimestamp.toLocaleString() : ***REMOVED***Unavailable***REMOVED***],
        [***REMOVED***Approx. bitrate***REMOVED***, bitrate !== null ? `${Math.round(bitrate / 1000)} kbps` : ***REMOVED***Unavailable***REMOVED***],
        [***REMOVED***Audio detected***REMOVED***, file.fileType.isAudio ? ***REMOVED***Yes***REMOVED*** : ***REMOVED***No***REMOVED***],
        [***REMOVED***Filename timestamp detected***REMOVED***, inferredTimestamp ? ***REMOVED***Yes***REMOVED*** : ***REMOVED***No***REMOVED***],
        [***REMOVED***Folder row path***REMOVED***, file.relativePath],
    ]
    const rowClassName = isExpanded
        ? ***REMOVED***border-b border-slate-600 bg-slate-600 text-slate-100 last:border-b-0***REMOVED***
        : ***REMOVED***border-b border-slate-200 last:border-b-0 hover:bg-slate-50***REMOVED***
    const rowTextClassName = isExpanded ? ***REMOVED***text-slate-100***REMOVED*** : ***REMOVED***text-slate-700***REMOVED***
    const mutedTextClassName = isExpanded ? ***REMOVED***text-slate-200***REMOVED*** : ***REMOVED***text-slate-500***REMOVED***
    const iconClassName = isExpanded ? ***REMOVED***text-slate-100***REMOVED*** : ***REMOVED***text-slate-400***REMOVED***
    const expandCellClassName = isExpanded ? ***REMOVED***bg-slate-600 px-2 py-2 text-center align-top***REMOVED*** : ***REMOVED***px-2 py-2 text-center align-top***REMOVED***
    const expandButtonClassName = isExpanded
        ? ***REMOVED***inline-flex items-center justify-center rounded-md p-1 text-slate-100 hover:bg-slate-500 hover:text-white***REMOVED***
        : ***REMOVED***inline-flex items-center justify-center rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800***REMOVED***

    return (
        <>
            <tr className={rowClassName}>
                <td className={`px-3 py-2 align-top ${isExpanded ? ***REMOVED***bg-slate-600***REMOVED*** : ***REMOVED******REMOVED***}`}>
                    <div className={`flex min-w-0 items-center gap-2 text-sm ${rowTextClassName}`}>
                        <button
                            type="button"
                            className={expandButtonClassName}
                            onClick={() => setIsExpanded((current) => !current)}
                            aria-label={isExpanded ? ***REMOVED***Collapse row***REMOVED*** : ***REMOVED***Expand row***REMOVED***}
                            aria-expanded={isExpanded}
                        >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        {file.fileType.isAudio ? (
                            <FileAudio className={`shrink-0 ${isExpanded ? ***REMOVED***text-emerald-200***REMOVED*** : ***REMOVED***text-emerald-600***REMOVED***}`} size={16} />
                        ) : (
                            <File className={`shrink-0 ${iconClassName}`} size={16} />
                        )}
                        <div className="min-w-0 flex-1">
                            <div className={`truncate text-sm font-medium ${rowTextClassName}`}>{file.file.name}</div>
                            <div className={`truncate text-xs ${mutedTextClassName}`}>{file.relativePath}</div>
                        </div>
                        <button
                            type="button"
                            className={`shrink-0 rounded p-1 ${isExpanded ? ***REMOVED***text-slate-100 hover:bg-slate-500 hover:text-white***REMOVED*** : ***REMOVED***text-slate-500 hover:bg-slate-100 hover:text-slate-800***REMOVED***}`}
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
                            <Check className={`shrink-0 ${isExpanded ? ***REMOVED***text-emerald-200***REMOVED*** : ***REMOVED***text-emerald-600***REMOVED***}`} size={16} />
                        ) : (
                            <X className={`shrink-0 ${isExpanded ? ***REMOVED***text-rose-200***REMOVED*** : ***REMOVED***text-rose-600***REMOVED***}`} size={16} />
                        )}
                        <span>{inferredTimestamp ? inferredTimestamp.toLocaleString() : ***REMOVED***Not found***REMOVED***}</span>
                    </div>
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-sm ${rowTextClassName} align-top`}>
                    {bitrate !== null ? `${Math.round(bitrate / 1000)} kbps` : ***REMOVED***—***REMOVED***}
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-sm ${rowTextClassName} align-top`}>
                    {durationSeconds !== null ? formatDuration(durationSeconds) : ***REMOVED***—***REMOVED***}
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-sm ${rowTextClassName} align-top`}>
                    {estimatedEndTime ? estimatedEndTime.toLocaleString() : ***REMOVED***—***REMOVED***}
                </td>
                <td className={`whitespace-nowrap px-3 py-2 text-sm ${rowTextClassName} align-top`}>
                    {gapToNextSeconds === null ? ***REMOVED***—***REMOVED*** : formatGap(gapToNextSeconds)}
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
                    {files.length} file{files.length === 1 ? ***REMOVED******REMOVED*** : ***REMOVED***s***REMOVED***} selected
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
      inputOverrides={{ ***REMOVED***custom:qc-tools***REMOVED***: QCField }}
    />
    </>
  )
}

export default QCToolsForm
