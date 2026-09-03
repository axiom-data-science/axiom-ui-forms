import { parseCSV, type ParsedCSV } from './csvParser'
import { CloudUpload, File, FileImage, FilePlay, FileSpreadsheet, FileText, Map as MapIcon, X } from 'lucide-react'
import { useEffect, useState, useRef, type ReactElement } from 'react'
import { Loader, Table, Tooltip, utils } from '@axdspub/axiom-ui-utilities'
import { IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import { IMap, IStyleableMapProps, MapLoader } from '@axdspub/axiom-maps'

type IStoredFileEntry = {
  file: File
  fileData: string | ArrayBuffer | undefined | null
  csvData: ParsedCSV | null
}

// Session-only memory cache: survives component unmount/remount, resets on browser reload.
const inMemoryFileStore = new Map<string, IStoredFileEntry>()

type FileTypeFlags = {
  lowerName: string
  isImage: boolean
  isVideo: boolean
  isAudio: boolean
  isPdf: boolean
  isCsv: boolean
  isText: boolean
  isGeojson: boolean
}

const getFileTypeFlags = (file?: File | null, fileName?: string | null): FileTypeFlags => {
  const lowerName = (file?.name ?? fileName ?? '').toLowerCase()
  const type = file?.type ?? ''

  return {
    lowerName,
    isImage: type.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(lowerName),
    isVideo: type.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(lowerName),
    isAudio: type.startsWith('audio/') || /\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(lowerName),
    isPdf: type === 'application/pdf' || lowerName.endsWith('.pdf'),
    isCsv: Boolean(type.match(/csv/)) || lowerName.endsWith('.csv'),
    isText: type.startsWith('text/') || /\.(txt|md|csv|log)$/i.test(lowerName),
    isGeojson: Boolean(type.match(/geojson/)) || lowerName.endsWith('.geojson')
  }
}

const FileTypeIcon = ({ fileType }: { fileType: FileTypeFlags }) => {
  if (fileType.isImage) {
    return <FileImage size={14} />
  } else if (fileType.isVideo) {
    return <FilePlay size={14} />
  } else if (fileType.isAudio) {
    return <FilePlay size={14} />
  } else if (fileType.isPdf) {
    return <FileText size={14} />
  } else if (fileType.isCsv) {
    return <FileSpreadsheet size={14} />
  } else if(fileType.isGeojson) {
    return <MapIcon size={14} />
  } else if(fileType.isText) {
    return <FileText size={14} />
  }
  return <File size={14} />
}

const CSVPreview = ({ file, parsedData }: { file: File, parsedData: ParsedCSV | null }) => {
  if(!parsedData) {
    return <Loader size='xs' className='align-left' />
  }
  const maxRows = 500
  return (
    <>
    <div className='flex flex-col relative max-h-100 max-w-200 w-full overflow-auto'>
    <Table
      columns={parsedData.headers.map((h) => ({ 
        id: h.key, 
        label:h.key.length > 20
            ? <Tooltip content={h.key} dark={true}>
                <span className='truncate max-w-[50vw] inline-block'>{h.key.slice(0,20)}...</span>
              </Tooltip>
            : h.key,
        accessor: (row: Record<string, any>) => {
          const val = row[h.key]
          return val.length > 20
            ? <Tooltip content={val} dark={true}>
                <span className='truncate max-w-[50vw] inline-block'>{val.slice(0,20)}...</span>
              </Tooltip>
            : val
        },
        cellClassName: 'text-xs',
        headerClassName: ''
      }))}
      data={parsedData.data.slice(0, maxRows)}
      rowClassName='event:bg-slate-100 odd:bg-slate-50 hover:bg-slate-200'
      className="table-auto mt-2 max-h-100 overflow-y-auto rounded-md shadow-lg"
    />
</div>
        {
      parsedData.data.length > maxRows && (
        <p className="text-sm text-gray-500 mt-2">
          Showing first {maxRows} rows of {parsedData.data.length} total rows and {parsedData.headers.length} columns in {file.name}
        </p>
      )
    }
    </>
  )
}

const GeojsonPreview = ({ file }: { file: File }) => {
  const [geoJson, setGeoJson] = useState<object | null>(null)

  useEffect(() => {
    file.text().then((text) => {
      try {
        setGeoJson(JSON.parse(text))
      } catch {
        setGeoJson(null)
      }
    })
  }, [file])

  if (!geoJson) {
    return <Loader size='xs' className='align-left' />
  }

  const MAP_CONFIG: IStyleableMapProps = {
    baseLayerKey: 'hybrid',
    height: '500px',
    width: '100%',
    mapLibraryKey: 'mapbox',
    

    onMapLoaded: (mapInstance) => {
      const m = mapInstance?.data?.map
      if (m) {
        m.addLayer({
          id: 'geojson-layer',
          type: 'geoJson',
          label: '',
          zIndex: 0,
          isBaseLayer: false,
          options: {
            geoJson:(geoJson as {features: any[]}).features.map(f=>{
              return {
                ...f,
                properties:{
                  color:'#FFF',
                  ...f.properties
                }
              }
            })
          }
        })


      }
    }
  }
  return (
    <MapLoader {...MAP_CONFIG} />
  )
}


const FileUploadPreview = ({
  file,
  previewUrl,
  csvData,
  fileType,
}: {
  file?: File | null
  previewUrl?: string | null
  csvData: ParsedCSV | null
  fileType: FileTypeFlags
}) => {
  const [fileUrl, setFileUrl] = useState('')

  useEffect(() => {
    if (!file) {
      setFileUrl('')
      return
    }
    const objectUrl = URL.createObjectURL(file)
    setFileUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  const resolvedPreviewUrl = file ? fileUrl : (previewUrl ?? '')

  return (
    <>
      {
        fileType.isImage && resolvedPreviewUrl ? (
          <img
            src={resolvedPreviewUrl}
            alt="Uploaded file preview"
            className="mt-2 max-h-100 rounded-md shadow-lg"
          />
        ) : fileType.isVideo && resolvedPreviewUrl ? (
          <video
            src={resolvedPreviewUrl}
            controls
            className="mt-2 max-h-100 rounded-md shadow-lg"
          />
        ) : fileType.isAudio && resolvedPreviewUrl ? (
          <audio
            src={resolvedPreviewUrl}
            controls
            className="mt-2 max-h-100 rounded-md"
          />
        ) : fileType.isPdf && resolvedPreviewUrl ? (
          <iframe
            src={resolvedPreviewUrl}
            title="Uploaded PDF preview"
            className="mt-2 h-125 w-full rounded-md border border-slate-200 shadow-lg"
          />
        ) : fileType.isGeojson && file ?  (
          <GeojsonPreview file={file} />
        )  : fileType.isCsv && file ?  (
          <CSVPreview file={file} parsedData={csvData} />
        ) : resolvedPreviewUrl ? (
          <a
            className="mt-2 text-sm text-blue-700 underline"
            href={resolvedPreviewUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open uploaded file preview
          </a>
        ) : null
      }
    </>
  )
}

const FileUpload = ({
  field,
  value,
  onChange,
  acceptFileTypes,
  onFileUpload,
  getPreviewUrl,
}: IFieldInputProps & {
  acceptFileTypes?: string[]
  onFileUpload?: (
    fileName: string,
    fileData: string | ArrayBuffer | undefined | null,
    parsedCsvData: ParsedCSV | null
  ) => void | Promise<void>
  getPreviewUrl?: (fileName: string) => string | null | undefined | Promise<string | null | undefined>
}): ReactElement => {
  const [file, setFile] = useState<File | null>(null)
  const [fileRef, setFileRef] = useState<string | null>(
    value !== null && value !== undefined ? String(value) : null
  )
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [csvData, setCsvData] = useState<ParsedCSV | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileType = (file || fileRef) ? getFileTypeFlags(file, fileRef) : null
  const displayFileName = file?.name ?? fileRef ?? ''
  const fileInputRef = useRef<HTMLInputElement>(null)
  const settingsAcceptedFileTypes =
    (field.settings as { acceptedFileTypes?: string[] | string } | undefined)?.acceptedFileTypes
  const settingsAcceptedFileTypesArray = Array.isArray(settingsAcceptedFileTypes)
    ? settingsAcceptedFileTypes
    : settingsAcceptedFileTypes
      ? [settingsAcceptedFileTypes]
      : undefined
  const acceptFileTypeToUse = settingsAcceptedFileTypesArray ?? acceptFileTypes

  useEffect(() => {
    setFileRef(value !== null && value !== undefined ? String(value) : null)
  }, [value])

  useEffect(() => {
    if (!fileRef || file) {
      return
    }

    let mounted = true

    const restorePreviewState = async (): Promise<void> => {
      if (getPreviewUrl) {
        const serviceUrl = await getPreviewUrl(fileRef)
        if (mounted) {
          setPreviewUrl(serviceUrl ?? null)
        }
        return
      }

      const cached = inMemoryFileStore.get(fileRef)
      if (cached && mounted) {
        setFile(cached.file)
        setCsvData(cached.csvData)
      }
    }

    restorePreviewState().catch((e) => {
      if (mounted) {
        setError(`Could not load file preview. ${(e as Error)?.message ?? ''}`)
      }
    })

    return () => {
      mounted = false
    }
  }, [file, fileRef, getPreviewUrl])

  const readFileData = async (_file: File, isCsv: boolean): Promise<string | ArrayBuffer> => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        resolve(event.target?.result as string | ArrayBuffer)
      }
      reader.onerror = () => reject(reader.error)

      if (isCsv) {
        reader.readAsText(_file)
      } else {
        reader.readAsArrayBuffer(_file)
      }
    })
  }

  const onUpload = async (f?: File | null) => {
    const _file = f ?? file
    setCsvData(null)
    if (!_file) return
    setUploading(true)
    try {
      const { isCsv } = getFileTypeFlags(_file)
      const fileData = await readFileData(_file, isCsv)
      const parsedCsvData = isCsv && typeof fileData === 'string' ? parseCSV(fileData) : null

      setCsvData(parsedCsvData)
      setPreviewUrl(null)

      if (onFileUpload) {
        await onFileUpload(_file.name, fileData, parsedCsvData)
      } else {
        inMemoryFileStore.set(_file.name, {
          file: _file,
          fileData,
          csvData: parsedCsvData,
        })
      }

      // Clear the input value so the same file can be selected again
      setFileRef(_file.name)
      if (onChange) {
        onChange(_file.name)
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('File upload failed:', error)
      setError(`File upload failed. ${(error as Error)?.message ?? ''}`)
    } finally {
      setUploading(false)
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null
    setFile(file)
    onUpload(file)
  }
  return (
    <div className="flex flex-col gap-2">
      <p>{field.label}</p>
      {field.description && <p className="text-sm text-gray-600 mb-2">{field.description}</p>}

      <label className="block">
        {error && <span className="text-red-500 text-sm mb-2 block">{error}</span>}
        <input
          type="file"
          id="file_input"
          ref={fileInputRef}
          className="sr-only"
          disabled={file !== null}
          onChange={handleFileChange}
          accept={acceptFileTypeToUse ? acceptFileTypeToUse.join(', ') : undefined}
        />
        {!fileRef && !uploading && (
          <div
            className={`${utils.createButtonClass({
              size: 'sm',
              variant: 'create',
            })} px-4 py-2 rounded-lg cursor-pointer inline-block ${file !== null ? 'bg-slate-200 text-slate-400' : ''}`}
          >
            Browse Files
          </div>
        )}
        {(file || fileRef) && (
          <>
          <span className="my-2 inline-flex max-w-full flex-nowrap items-center gap-2 text-sm text-gray-700">
            <span className="inline-flex min-w-0 items-baseline gap-2 rounded-md bg-slate-200 p-2 shadow-md">
              <FileTypeIcon fileType={fileType ?? getFileTypeFlags(file)} />
              <Tooltip content={displayFileName} dark={true}>
                <span className='inline-block max-w-[60vw] truncate whitespace-nowrap align-bottom sm:max-w-88'>
                  {displayFileName}
                </span>
              </Tooltip>
              {file?.size ? <span className='whitespace-nowrap text-xs text-slate-500 border-b border-slate-400 border-dashed'>{(file.size / 1024).toFixed(2)} KB</span> : ''}
              {
                file?.type && <span className='whitespace-nowrap rounded-md bg-slate-400 p-1 text-xs text-white shadow-sm'>{file.type}</span>
              }
            </span>
            {!fileRef && (
              <CloudUpload
                className="inline-block cursor-pointer shrink-0"
                onClick={() => onUpload()}
              />
            )}
            <X
              className="inline-block cursor-pointer shrink-0"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                if (fileRef) {
                  inMemoryFileStore.delete(fileRef)
                }
                setFile(null)
                setFileRef(null)
                setCsvData(null)
                setPreviewUrl(null)
                onChange(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
            />
          </span>
          {(file || previewUrl) && fileType &&
            <FileUploadPreview
              file={file}
              previewUrl={previewUrl}
              csvData={csvData}
              fileType={fileType}
            />
          }
          </>
        )}
      </label>
      {/* {fileRef && (
        <div className="flex flex-row gap-2">
          {!file && (
            <X
              className="inline-block ml-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setFile(null)
                setFileRef(null)
                onChange(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
            />
          )}
        </div>
      )} */}
    </div>
  )
}

export default FileUpload
