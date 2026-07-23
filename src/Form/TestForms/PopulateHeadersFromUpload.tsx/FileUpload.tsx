import { parseCSV, type ParsedCSV } from './csvParser'
import { CloudUpload, File, X } from 'lucide-react'
import { useState, useRef, type ReactElement } from 'react'
import { Loader, Table, Tooltip, utils, ViewWithLoader } from '@axdspub/axiom-ui-utilities'
import { IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'

const CSVPreview = ({ file, parsedData }: { file: File, parsedData: ParsedCSV | null }) => {
  if(!parsedData) {
    return <Loader size='xs' className='align-left' />
  }
  const maxRows = 500
  return (
    <>
    <div className='flex flex-col relative max-h-100 w-full overflow-auto'>
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
        if (typeof text === 'string') {
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
        <span className="sr-only">Choose profile photo</span>
        <input
          type="file"
          id="file_input"
          ref={fileInputRef}
          className="sr-only"
          disabled={file !== null}
          onChange={handleFileChange}
          accept={acceptFileTypeToUse ? acceptFileTypeToUse.join(', ') : undefined}
        />
        {!fileRef && (
          <div
            className={`${utils.createButtonClass({
              size: 'sm',
              variant: 'create',
            })} px-4 py-2 rounded-lg cursor-pointer inline-block ${file !== null ? 'bg-slate-200 text-slate-400' : ''}`}
          >
            {uploading ? (
              <span className="flex flex-row gap-1">Uploading ...</span>
            ) : (
              'Browse Files'
            )}
          </div>
        )}
        {file && (
          <>
          <span className="text-sm text-gray-700">
            <span className="bg-slate-200 p-2 my-2 inline-flex items-baseline gap-2 rounded-md">
              <File size={14} /> {file.name}{' '}{file.size ? <span className='text-slate-500 text-xs border-b border-slate-400 border-dashed'>{(file.size / 1024).toFixed(2)} KB</span> : ''}
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
                  fileInputRef.current.value = ''
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
                  fileInputRef.current.value = ''
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
