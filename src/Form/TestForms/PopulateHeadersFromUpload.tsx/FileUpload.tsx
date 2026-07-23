import { parseCSV, type ParsedCSV } from ***REMOVED***./csvParser***REMOVED***
import { CloudUpload, File, X } from ***REMOVED***lucide-react***REMOVED***
import { useState, useRef, type ReactElement } from ***REMOVED***react***REMOVED***
import { Loader, Table, Tooltip, utils, ViewWithLoader } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const CSVPreview = ({ file, parsedData }: { file: File, parsedData: ParsedCSV | null }) => {
  if(!parsedData) {
    return <Loader size=***REMOVED***xs***REMOVED*** className=***REMOVED***align-left***REMOVED*** />
  }
  const maxRows = 500
  return (
    <>
    <div className=***REMOVED***flex flex-col relative max-h-100 w-full overflow-auto***REMOVED***>
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
          Showing first {maxRows} rows of {parsedData.data.length} total rows in {file.name}
        </p>
      )
    }
    </>
  )
}


const FileUploadPreview = ({ file, csvData }: { file: File, csvData: ParsedCSV | null }) => {
  return (
    <>
    {file.type}
      {
        file.type.match(/^image/) ? (
          <img
            src={URL.createObjectURL(file)}
            alt="Uploaded file preview"
            className="mt-2 max-h-100 rounded-md shadow-lg"
          />
        ) : file.type.match(/^video/) ? (
          <video
            src={URL.createObjectURL(file)}
            controls
            className="mt-2 max-h-100 rounded-md shadow-lg"
          />
        ) : file.type.match(/^audio/) ? (
          <audio
            src={URL.createObjectURL(file)}
            controls
            className="mt-2 max-h-100 rounded-md"
          />
        ) : file.type.match(/csv/) ?  (
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

      // This event fires when the file reading is complete
      reader.onload = function (event) {
        const text = event.target?.result
        if (typeof text === ***REMOVED***string***REMOVED***) {
          const data = parseCSV(text)
          setCsvData(data)
          if (onFileUploaded) {
            onFileUploaded(text, data)
          }
        } else if (onFileUploaded) {
          onFileUploaded(event.target?.result, null)
        }
      }

      // Read the file object as a plain text string
      reader.readAsText(_file)
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
        {file && (
          <>
          <span className="text-sm text-gray-700">
            <span className="bg-slate-200 p-2 my-2 inline-flex items-baseline gap-2 rounded-md">
              <File size={14} /> {file.name}{***REMOVED*** ***REMOVED***}{file.size ? <span className=***REMOVED***text-slate-500 text-xs border-b border-slate-400 border-dashed***REMOVED***>{(file.size / 1024).toFixed(2)} KB</span> : ***REMOVED******REMOVED***}
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
          <FileUploadPreview file={file} csvData={csvData} />
          </>
        )}
      </label>
      {fileRef && (
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
      )}
    </div>
  )
}

export default FileUpload
