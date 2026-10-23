import FileUpload from '@/Form/Components/Inputs/FileUpload/FileUpload'
import type { ParsedCSV } from '@/Form/Components/Inputs/FileUpload/csvParser'
import { useFormContext, useFormValues } from '@/Form/Creator/FormContextProvider'
import type { IFieldInputProps, IFormValues } from '@/Form/Creator/FormCreatorTypes'
import { useState, type ReactElement } from 'react'
import { mapDataCsvToVariables } from './mapDataCsvToVariables'

interface IStagedVariable {
  name: string
  metadata: Record<string, string | number>
  included: boolean
  units: string
}

const CSVDataFileToVariables = ({ field, value, onChange }: IFieldInputProps): ReactElement => {
  const { setFormValues } = useFormContext()
  const formValues = useFormValues()
  const [stagedVariables, setStagedVariables] = useState<IStagedVariable[]>([])
  const [importedCount, setImportedCount] = useState<number | null>(null)

  const handleUpload = ({ parsedCsvData }: { parsedCsvData: ParsedCSV | null }): void => {
    if (parsedCsvData === null) {
      throw new Error('The uploaded file could not be parsed as a CSV.')
    }
    const variables = mapDataCsvToVariables(parsedCsvData)
    setStagedVariables(
      Object.entries(variables).map(([name, metadata]) => ({
        name,
        metadata,
        included: true,
        units: typeof metadata.units === 'string' ? metadata.units : '',
      }))
    )
    setImportedCount(null)
  }

  const allVariablesIncluded =
    stagedVariables.length > 0 && stagedVariables.every((variable) => variable.included)
  const selectedCount = stagedVariables.filter((variable) => variable.included).length

  const importSelectedVariables = (): void => {
    const variables = Object.fromEntries(
      stagedVariables
        .filter((variable) => variable.included)
        .map((variable) => {
          const metadata = { ...variable.metadata }
          if (variable.units.trim()) {
            metadata.units = variable.units.trim()
          } else {
            delete metadata.units
          }
          return [variable.name, metadata]
        })
    )
    const nextValues: IFormValues = { ...formValues, variables }
    setFormValues(nextValues)
    setImportedCount(selectedCount)
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-slate-600">
        Upload an observation data CSV to review inferred variables before adding them to the form.
        Common coordinate axes and numeric ranges are inferred where possible.
      </p>
      <FileUpload
        field={field}
        value={value}
        acceptFileTypes={['.csv', 'text/csv']}
        onFileUpload={handleUpload}
        onChange={(fileName) => {
          if (fileName === null) {
            setStagedVariables([])
            setImportedCount(null)
          }
          onChange(fileName)
        }}
      />
      {stagedVariables.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium">
              {stagedVariables.length} variables found. Select those to include and edit their
              units.
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={allVariablesIncluded}
                onChange={(event) => {
                  const included = event.currentTarget.checked
                  setStagedVariables((current) =>
                    current.map((variable) => ({ ...variable, included }))
                  )
                  setImportedCount(null)
                }}
              />
              Select all
            </label>
          </div>
          <div className="max-h-80 overflow-auto rounded border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-slate-100">
                <tr>
                  <th className="p-2">Include</th>
                  <th className="p-2">Variable</th>
                  <th className="p-2">Inferred metadata</th>
                  <th className="p-2">Units</th>
                </tr>
              </thead>
              <tbody>
                {stagedVariables.map((variable) => (
                  <tr key={variable.name} className="border-t border-slate-200">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        aria-label={`Include ${variable.name}`}
                        checked={variable.included}
                        onChange={(event) => {
                          const included = event.currentTarget.checked
                          setStagedVariables((current) =>
                            current.map((item) =>
                              item.name === variable.name ? { ...item, included } : item
                            )
                          )
                          setImportedCount(null)
                        }}
                      />
                    </td>
                    <th scope="row" className="p-2 font-medium">
                      {variable.name}
                    </th>
                    <td className="p-2 text-slate-600">
                      {[
                        variable.metadata.long_name,
                        variable.metadata.axis !== undefined
                          ? `Axis ${variable.metadata.axis}`
                          : undefined,
                        variable.metadata.actual_range_min !== undefined
                          ? `Range ${variable.metadata.actual_range_min} to ${variable.metadata.actual_range_max}`
                          : undefined,
                      ]
                        .filter((value) => value !== undefined)
                        .join(' · ') || 'Name only'}
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        aria-label={`Units for ${variable.name}`}
                        className="w-full rounded border border-slate-300 px-2 py-1"
                        value={variable.units}
                        onChange={(event) => {
                          const units = event.currentTarget.value
                          setStagedVariables((current) =>
                            current.map((item) =>
                              item.name === variable.name ? { ...item, units } : item
                            )
                          )
                          setImportedCount(null)
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded bg-slate-800 px-3 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              disabled={selectedCount === 0}
              onClick={importSelectedVariables}
            >
              Add {selectedCount} selected variables to form
            </button>
            {importedCount !== null && (
              <span role="status" className="text-sm text-green-700">
                Added {importedCount} variables to the form.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CSVDataFileToVariables
