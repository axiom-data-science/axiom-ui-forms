import { parseCSV, type ParsedCSV } from ***REMOVED***./csvParser***REMOVED***
import { CloudUpload, File, FileImage, FilePlay, FileSpreadsheet, FileText, X } from ***REMOVED***lucide-react***REMOVED***
import { useEffect, useState, useRef, type ReactElement } from ***REMOVED***react***REMOVED***
import { Loader, Table, Tooltip, utils } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

type FileTypeFlags = {
  lowerName: string
  isImage: boolean
  isVideo: boolean
  isAudio: boolean
  isPdf: boolean
  isCsv: boolean
  isText: boolean
}

const getFileTypeFlags = (file?: File | null): FileTypeFlags => {
  const lowerName = file?.name.toLowerCase() ?? ***REMOVED******REMOVED***
  const type = file?.type ?? ***REMOVED******REMOVED***

  return {
    lowerName,
    isImage: type.startsWith(***REMOVED***image/***REMOVED***) || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(lowerName),
    isVideo: type.startsWith(***REMOVED***video/***REMOVED***) || /\.(mp4|webm|ogg|mov|m4v)$/i.test(lowerName),
    isAudio: type.startsWith(***REMOVED***audio/***REMOVED***) || /\.(mp3|wav|ogg|m4a|flac|aac)$/i.test(lowerName),
    isPdf: type === ***REMOVED***application/pdf***REMOVED*** || lowerName.endsWith(***REMOVED***.pdf***REMOVED***),
    isCsv: Boolean(type.match(/csv/)) || lowerName.endsWith(***REMOVED***.csv***REMOVED***),
    isText: type.startsWith(***REMOVED***text/***REMOVED***) || /\.(txt|md|csv|log)$/i.test(lowerName)
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
  } else if(fileType.isText) {
    return <FileText size={14} />
  }
  return <File size={14} />
}

const CSVPreview = ({ file, parsedData }: { file: File, parsedData: ParsedCSV | null }) => {
  if(!parsedData) {
    return <Loader size=***REMOVED***xs***REMOVED*** className=***REMOVED***align-left***REMOVED*** />
  }
  const maxRows = 500
  return (
    <>
    <div className=***REMOVED***flex flex-col relative max-h-100 max-w-200 w-full overflow-auto***REMOVED***>
    <Table
      columns={parsedData.headers.map((h) => ({ 
        id: h.key, 
        label:h.key.length > 20
            ? <Tooltip content={h.key} dark={true}>
                <span className=***REMOVED***truncate max-w-[50vw] inline-block***REMOVED***>{h.key.slice(0,20)}...</span>
              </Tooltip>
            : h.key,
        accessor: (row: Record<string, any>) => {
          const val = row[h.key]
          return val.length > 20
            ? <Tooltip content={val} dark={true}>
                <span className=***REMOVED***truncate max-w-[50vw] inline-block***REMOVED***>{val.slice(0,20)}...</span>
              </Tooltip>
            : val
        },
        cellClassName: ***REMOVED***text-xs***REMOVED***,
        headerClassName: ***REMOVED******REMOVED***
      }))}
      data={parsedData.data.slice(0, maxRows)}
      rowClassName=***REMOVED***event:bg-slate-100 odd:bg-slate-50 hover:bg-slate-200***REMOVED***
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


const FileUploadPreview = ({
  file,
  csvData,
  fileType,
}: {
  file: File
  csvData: ParsedCSV | null
  fileType: FileTypeFlags
}) => {
  const [fileUrl, setFileUrl] = useState(***REMOVED******REMOVED***)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    setFileUrl(objectUrl)

    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  return (
    <>
      {
        fileType.isImage ? (
          <img
            src={fileUrl}
            alt="Uploaded file preview"
            className="mt-2 max-h-100 rounded-md shadow-lg"
          />
        ) : fileType.isVideo ? (
          <video
            src={fileUrl}
            controls
            className="mt-2 max-h-100 rounded-md shadow-lg"
          />
        ) : fileType.isAudio ? (
          <audio
            src={fileUrl}
            controls
            className="mt-2 max-h-100 rounded-md"
          />
        ) : fileType.isPdf ? (
          <iframe
            src={fileUrl}
            title="Uploaded PDF preview"
            className="mt-2 h-125 w-full rounded-md border border-slate-200 shadow-lg"
          />
        ) : fileType.isCsv ?  (
          <CSVPreview file={file} parsedData={csvData} />
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
  onFileUploaded,
}: IFieldInputProps & {
  acceptFileTypes?: string[]
  onFileUploaded?: (
    fileData: string | ArrayBuffer | undefined | null,
    csvData: ParsedCSV | null
  ) => void
}): ReactElement => {
  const [file, setFile] = useState<File | null>(null)
  const [fileRef, setFileRef] = useState<string | null>(
    value !== null && value !== undefined ? String(value) : null
  )
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [csvData, setCsvData] = useState<ParsedCSV | null>(null)
  const fileType = file ? getFileTypeFlags(file) : null
  const fileInputRef = useRef<HTMLInputElement>(null)
  const settingsAcceptedFileTypes = (field.settings as { acceptedFileTypes?: string[] | string })?.acceptedFileTypes
  const settingsAcceptedFileTypesArray = Array.isArray(settingsAcceptedFileTypes)
    ? settingsAcceptedFileTypes
    : settingsAcceptedFileTypes
      ? [settingsAcceptedFileTypes]
      : undefined
  const acceptFileTypeToUse = settingsAcceptedFileTypesArray ?? acceptFileTypes

  const onUpload = async (f?: File | null) => {
    const _file = f ?? file
    setCsvData(null)
    if (!_file) return
    setUploading(true)
    try {
      const reader = new FileReader()

      const { isCsv } = getFileTypeFlags(_file)

      // This event fires when the file reading is complete
      reader.onload = function (event) {
        const result = event.target?.result
        if (isCsv && typeof result === ***REMOVED***string***REMOVED***) {
          // Parse uploaded CSV text into preview rows/headers.
          const text = result
          const data = parseCSV(text)
          setCsvData(data)
          if (onFileUploaded) {
            onFileUploaded(text, data)
          }
        } else if (onFileUploaded) {
          onFileUploaded(result, null)
        }
      }

      if (isCsv) {
        // Read CSV uploads as text for parsing.
        reader.readAsText(_file)
      } else {
        // Read non-CSV uploads as binary for downstream consumers.
        reader.readAsArrayBuffer(_file)
      }
      // Clear the input value so the same file can be selected again
      setFileRef(_file.name)
      if (onChange) {
        onChange(_file.name)
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = ***REMOVED******REMOVED***
      }
    } catch (error) {
      console.error(***REMOVED***File upload failed:***REMOVED***, error)
      setError(`File upload failed. ${(error as Error)?.message ?? ***REMOVED******REMOVED***}`)
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
        <span className="sr-only">Choose profile photo</span>
        <input
          type="file"
          id="file_input"
          ref={fileInputRef}
          className="sr-only"
          disabled={file !== null}
          onChange={handleFileChange}
          accept={acceptFileTypeToUse ? acceptFileTypeToUse.join(***REMOVED***, ***REMOVED***) : undefined}
        />
        {!fileRef && (
          <div
            className={`${utils.createButtonClass({
              size: ***REMOVED***sm***REMOVED***,
              variant: ***REMOVED***create***REMOVED***,
            })} px-4 py-2 rounded-lg cursor-pointer inline-block ${file !== null ? ***REMOVED***bg-slate-200 text-slate-400***REMOVED*** : ***REMOVED******REMOVED***}`}
          >
            {uploading ? (
              <span className="flex flex-row gap-1">Uploading ...</span>
            ) : (
              ***REMOVED***Browse Files***REMOVED***
            )}
          </div>
        )}
        {(file || fileRef) && (
          <>
          <span className="text-sm text-gray-700">
            <span className="bg-slate-200 p-2 my-2 inline-flex items-baseline gap-2 rounded-md shadow-md">
              <FileTypeIcon fileType={fileType ?? getFileTypeFlags(file)} /> {file?.name ?? fileRef}{***REMOVED*** ***REMOVED***}{file?.size ? <span className=***REMOVED***text-slate-500 text-xs border-b border-slate-400 border-dashed***REMOVED***>{(file.size / 1024).toFixed(2)} KB</span> : ***REMOVED******REMOVED***}
              {
                file?.type && <span className=***REMOVED***bg-slate-400 text-white text-xs p-1 rounded-md shadow-sm***REMOVED***>{file.type}</span>
              }
            </span>
            {!fileRef && (
              <CloudUpload
                className="inline-block ml-1 cursor-pointer"
                onClick={() => onUpload()}
              />
            )}
            <X
              className="inline-block ml-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                setFile(null)
                setFileRef(null)
                setCsvData(null)
                onChange(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ***REMOVED******REMOVED***
                }
              }}
            />
          </span>
          {file &&
            <FileUploadPreview file={file} csvData={csvData} fileType={fileType ?? getFileTypeFlags(file)} />
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
                  fileInputRef.current.value = ***REMOVED******REMOVED***
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
