import { Folder, File, FileText, FileImage, FilePlay, FileSpreadsheet, Map as MapIcon, X } from ***REMOVED***lucide-react***REMOVED***
import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactElement } from ***REMOVED***react***REMOVED***
import { Loader, Tooltip, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type FolderFileEntry, type FolderInputAttributes, type FolderPreviewProps } from ***REMOVED***./folderUploadTypes***REMOVED***

type FileTypeFlags = FolderFileEntry[***REMOVED***fileType***REMOVED***]

type FolderUploadProps = IFieldInputProps & {
  acceptFileTypes?: string[]
  folderPreviewComponent?: ComponentType<FolderPreviewProps>
}

const getFileTypeFlags = (file?: File | null, fileName?: string | null): FileTypeFlags => {
  const lowerName = (file?.name ?? fileName ?? ***REMOVED******REMOVED***).toLowerCase()
  const type = file?.type ?? ***REMOVED******REMOVED***

  return {
    lowerName,
    isImage: type.startsWith(***REMOVED***image/***REMOVED***) || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(lowerName),
    isVideo: type.startsWith(***REMOVED***video/***REMOVED***) || /\.(mp4|webm|ogg|mov|m4v)$/i.test(lowerName),
    isAudio: type.startsWith(***REMOVED***audio/***REMOVED***) || /\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(lowerName),
    isPdf: type === ***REMOVED***application/pdf***REMOVED*** || lowerName.endsWith(***REMOVED***.pdf***REMOVED***),
    isCsv: Boolean(type.match(/csv/)) || lowerName.endsWith(***REMOVED***.csv***REMOVED***),
    isText: type.startsWith(***REMOVED***text/***REMOVED***) || /\.(txt|md|csv|log)$/i.test(lowerName),
    isGeojson: Boolean(type.match(/geojson/)) || lowerName.endsWith(***REMOVED***.geojson***REMOVED***),
  }
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

const FileTypeIcon = ({ fileType }: { fileType: FileTypeFlags }) => {
  if (fileType.isImage) {
    return <FileImage size={14} />
  }

  if (fileType.isVideo || fileType.isAudio) {
    return <FilePlay size={14} />
  }

  if (fileType.isCsv) {
    return <FileSpreadsheet size={14} />
  }

  if (fileType.isGeojson) {
    return <MapIcon size={14} />
  }

  if (fileType.isPdf || fileType.isText) {
    return <FileText size={14} />
  }

  return <File size={14} />
}

type SelectedFolderFile = {
  file: File
  relativePath: string
}

const isFileSystemFileEntry = (entry: any): entry is { isFile: true; file: (callback: (file: File) => void) => void } =>
  Boolean(entry && entry.isFile && typeof entry.file === ***REMOVED***function***REMOVED***)

const isFileSystemDirectoryEntry = (entry: any): entry is {
  isDirectory: true
  name: string
  createReader: () => { readEntries: (callback: (entries: any[]) => void) => void }
} => Boolean(entry && entry.isDirectory && typeof entry.createReader === ***REMOVED***function***REMOVED***)

const readAllDirectoryEntries = async (reader: { readEntries: (callback: (entries: any[]) => void) => void }): Promise<any[]> => {
  const allEntries: any[] = []

  return await new Promise((resolve) => {
    const readBatch = () => {
      reader.readEntries((entries) => {
        if (!entries.length) {
          resolve(allEntries)
          return
        }

        allEntries.push(...entries)
        readBatch()
      })
    }

    try {
      readBatch()
    } catch {
      resolve(allEntries)
    }
  })
}

const collectFilesFromFileSystemEntry = async (entry: any, pathPrefix = ***REMOVED******REMOVED***): Promise<SelectedFolderFile[]> => {
  if (isFileSystemFileEntry(entry)) {
    return await new Promise((resolve) => {
      entry.file((file: File) => {
        resolve([{ file, relativePath: pathPrefix ? `${pathPrefix}${file.name}` : file.name }])
      })
    })
  }

  if (isFileSystemDirectoryEntry(entry)) {
    const nextPrefix = pathPrefix ? `${pathPrefix}${entry.name}/` : `${entry.name}/`
    const directoryEntries = await readAllDirectoryEntries(entry.createReader())
    const childFiles = await Promise.all(
      directoryEntries.map(async (childEntry) => await collectFilesFromFileSystemEntry(childEntry, nextPrefix))
    )

    return childFiles.flat()
  }

  return []
}

const collectSelectedFiles = async (dataTransfer: DataTransfer): Promise<SelectedFolderFile[]> => {
  const dataTransferItems = Array.from(dataTransfer.items ?? [])

  if (dataTransferItems.length) {
    const entryLoader = (item: DataTransferItem): any =>
      typeof (item as any).webkitGetAsEntry === ***REMOVED***function***REMOVED*** ? (item as any).webkitGetAsEntry() : null

    const entries = dataTransferItems.map(entryLoader).filter(Boolean)

    if (entries.length) {
      const collected = await Promise.all(entries.map(async (entry) => await collectFilesFromFileSystemEntry(entry)))
      return collected.flat()
    }
  }

  return Array.from(dataTransfer.files ?? []).map((file) => ({
    file,
    relativePath: file.webkitRelativePath || file.name,
  }))
}

const FolderPreview = ({ files, folderName }: FolderPreviewProps) => {
  const totalBytes = useMemo<number>(() => files.reduce((total, entry) => total + entry.file.size, 0), [files])

  return (
    <div className="mt-2 overflow-hidden rounded-md border border-slate-200 bg-slate-50 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <Folder size={15} />
          <span className="truncate">{folderName || ***REMOVED***Selected folder***REMOVED***}</span>
        </div>
        <div className="text-xs text-slate-500">
          {files.length} file{files.length === 1 ? ***REMOVED******REMOVED*** : ***REMOVED***s***REMOVED***} · {formatBytes(totalBytes)}
        </div>
      </div>

      <div className="max-h-96 overflow-auto">
        <ul className="divide-y divide-slate-200">
          {files.map((entry) => (
            <li key={entry.relativePath} className="flex items-start gap-3 px-3 py-2">
              <span className="mt-0.5 rounded-full bg-slate-200 p-1 text-slate-600">
                <FileTypeIcon fileType={entry.fileType} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Tooltip content={entry.file.name} dark={true}>
                    <span className="truncate text-sm font-medium text-slate-800">{entry.file.name}</span>
                  </Tooltip>
                  <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-600">
                    {entry.file.type || ***REMOVED***unknown type***REMOVED***}
                  </span>
                </div>
                <div className="mt-0.5 truncate text-xs text-slate-500">{entry.relativePath}</div>
              </div>
              <span className="whitespace-nowrap text-xs text-slate-500">{formatBytes(entry.file.size)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const FolderUpload = ({
  field,
  value,
  onChange,
  acceptFileTypes,
  disabled,
  folderPreviewComponent: FolderPreviewComponent = FolderPreview,
}: FolderUploadProps): ReactElement => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<FolderFileEntry[]>([])
  const [folderName, setFolderName] = useState<string>(value !== null && value !== undefined ? String(value) : ***REMOVED******REMOVED***)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDropActive, setIsDropActive] = useState(false)

  const settingsAcceptedFileTypes =
    (field.settings as { acceptedFileTypes?: string[] | string } | undefined)?.acceptedFileTypes
  const settingsAcceptedFileTypesArray = Array.isArray(settingsAcceptedFileTypes)
    ? settingsAcceptedFileTypes
    : settingsAcceptedFileTypes
      ? [settingsAcceptedFileTypes]
      : undefined
  const acceptFileTypeToUse = settingsAcceptedFileTypesArray ?? acceptFileTypes
  const folderInputAttributes: FolderInputAttributes = {
    webkitdirectory: ***REMOVED******REMOVED***,
  }

  useEffect(() => {
    setFolderName(value !== null && value !== undefined ? String(value) : ***REMOVED******REMOVED***)
  }, [value])

  const applySelectedFiles = async (selectedFiles: SelectedFolderFile[]) => {
    if (!selectedFiles.length) {
      setUploading(false)
      return
    }

    setError(null)
    setUploading(true)

    try {
      const mappedFiles = selectedFiles
        .map((entry) => ({
          file: entry.file,
          relativePath: entry.relativePath,
          fileType: getFileTypeFlags(entry.file),
        }))
        .sort((left, right) => left.relativePath.localeCompare(right.relativePath))

      const selectedFolderName = mappedFiles[0]?.relativePath.split(***REMOVED***/***REMOVED***)[0] || mappedFiles[0]?.file.name || ***REMOVED******REMOVED***

      setFiles(mappedFiles)
      setFolderName(selectedFolderName)
      onChange(selectedFolderName)

      if (fileInputRef.current) {
        fileInputRef.current.value = ***REMOVED******REMOVED***
      }
    } catch (caughtError) {
      console.error(***REMOVED***Folder upload failed:***REMOVED***, caughtError)
      setError(`Folder upload failed. ${(caughtError as Error)?.message ?? ***REMOVED******REMOVED***}`)
    } finally {
      setUploading(false)
    }
  }

  const clearSelection = () => {
    setFiles([])
    setFolderName(***REMOVED******REMOVED***)
    setError(null)
    onChange(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ***REMOVED******REMOVED***
    }
  }

  const handleFolderChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []).map((file) => ({
      file,
      relativePath: file.webkitRelativePath || file.name,
    }))

    await applySelectedFiles(selectedFiles)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDropActive(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDropActive(false)
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDropActive(false)
    setError(null)
    setUploading(true)

    const selectedFilesPromise = collectSelectedFiles(event.dataTransfer)

    await new Promise<void>((resolve) => {
      window.requestAnimationFrame(() => resolve())
    })

    try {
      const selectedFiles = await selectedFilesPromise
      await applySelectedFiles(selectedFiles)
    } catch (caughtError) {
      console.error(***REMOVED***Folder upload failed:***REMOVED***, caughtError)
      setError(`Folder upload failed. ${(caughtError as Error)?.message ?? ***REMOVED******REMOVED***}`)
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <p>{field.label}</p>
      {field.description && <p className="mb-2 text-sm text-gray-600">{field.description}</p>}

      <div
        className={`rounded-md border border-dashed p-3 transition-colors ${
          isDropActive ? ***REMOVED***border-amber-300 bg-amber-50***REMOVED*** : ***REMOVED***border-slate-200 bg-transparent***REMOVED***
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <label className="block">
          {error && <span className="mb-2 block text-sm text-red-500">{error}</span>}
          <input
            {...folderInputAttributes}
            type="file"
            ref={fileInputRef}
            className="sr-only"
            disabled={disabled || uploading}
            onChange={handleFolderChange}
            accept={acceptFileTypeToUse ? acceptFileTypeToUse.join(***REMOVED***, ***REMOVED***) : undefined}
            multiple
          />

          {!files.length && !uploading && (
            <div
              className={`${utils.createButtonClass({
                size: ***REMOVED***sm***REMOVED***,
                variant: ***REMOVED***create***REMOVED***,
              })} inline-block cursor-pointer rounded-lg px-4 py-2 ${disabled ? ***REMOVED***bg-slate-200 text-slate-400***REMOVED*** : ***REMOVED******REMOVED***}`}
            >
              Browse Folder
            </div>
          )}

          {uploading && (
            <div className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 text-center">
              <span>Processing folder contents...</span>
              <Loader size="xs" className="align-left" />
            </div>
          )}

          {!!files.length && !uploading && (
            <span className="my-2 inline-flex max-w-full flex-nowrap items-center gap-2 text-sm text-gray-700">
              <span className="inline-flex min-w-0 items-baseline gap-2 rounded-md bg-slate-200 p-2 shadow-md">
                <Folder size={14} />
                <Tooltip content={folderName} dark={true}>
                  <span className="inline-block max-w-[60vw] truncate whitespace-nowrap align-bottom sm:max-w-88">
                    {folderName || ***REMOVED***Selected folder***REMOVED***}
                  </span>
                </Tooltip>
                <span className="whitespace-nowrap border-b border-dashed border-slate-400 text-xs text-slate-500">
                  {files.length} file{files.length === 1 ? ***REMOVED******REMOVED*** : ***REMOVED***s***REMOVED***}
                </span>
              </span>
              <X
                className="inline-block shrink-0 cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation()
                  event.preventDefault()
                  clearSelection()
                }}
              />
            </span>
          )}

          {!files.length && !uploading && (
            <p className="mt-2 text-xs text-slate-500">Drag and drop a folder here, or browse to select one.</p>
          )}
        </label>

        {!!files.length && <FolderPreviewComponent files={files} folderName={folderName} />}
      </div>
    </div>
  )
}

export default FolderUpload