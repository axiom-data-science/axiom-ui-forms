import { FormCreator } from '@/Form'
import FieldLabel from '@/Form/Components/FieldLabel'
import { type IFieldInputProps, type IForm, type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import { Loader, SelectInput } from '@axdspub/axiom-ui-utilities'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import React, { createContext, useContext, useState, type ReactElement } from 'react'

const form: IForm = {
  id: 'externalMetadata',
  label: 'External Metadata Example',
  fields: [
    {
      id: 'parameter',
      label: 'Select parameter and units when available',
      type: 'custom:parameter',
      required: true
    }
  ]
}

interface IOikosUnit { id: string, label: string, unit: string }
interface IOikosContext {
  'sensorParameters': Array<{ id: string }>
  'units': IOikosUnit[]
  'parameters': Array<{ id: string, label: string, parameterName: string, idParameterType: number }>
  'parameterTypes': Array<{ id: number, label: string }>
  'parameterTypeUnits': Array<{ parameterTypeDefault: boolean, idParameterType: number, idUnit: string }>
}

const OikosContext = createContext<IOikosContext>({
  sensorParameters: [],
  units: [],
  parameters: [],
  parameterTypes: [],
  parameterTypeUnits: []
})

interface IParameterValue { urn?: string, unit?: string }

const getUnitsForParameter = (parameterId: string, context: IOikosContext): IOikosUnit[] => {
  const { parameterTypeUnits, units } = context
  const parameterTypeUnitIds = parameterTypeUnits
    .filter((ptu) => ptu.idParameterType === context.parameters.find((p) => p.id === parameterId)?.idParameterType)
    .map((ptu) => ptu.idUnit)
  return units.filter((u) => parameterTypeUnitIds.includes(u.id))
}

const ExternalMetadataExample = (): ReactElement => {
  const { data, isLoading, error } = useQuery<IOikosContext>({
    queryKey: ['externalMetadata'],
    queryFn: async () => {
      const response = await fetch('https://oikos.axds.co/rest/context')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return await response.json()
    }
  })

  const formValueState = useState<IFormValues>({})

  return (
        <>
            {
                isLoading || data === undefined
                  ? (
                    <Loader className="pt-20" />
                    )
                  : error
                    ? (
                        <div className='p-4 text-rose-800'>Error: {error.message}</div>
                      )
                    : (
                        <OikosContext.Provider value={data}>
                          <FormCreator
                            form={form}
                            formValueState={formValueState}
                            inputOverrides={{
                              'custom:parameter': ({ field, value, onChange }: IFieldInputProps): ReactElement => {
                                const paramValue = value as IParameterValue
                                const oikos = useContext(OikosContext)
                                const { parameters } = oikos
                                const parametersById = Object.fromEntries(parameters.map((p) => [p.id, p]))
                                const parametersByUrn = Object.fromEntries(parameters.map((p) => [p.parameterName, p]))
                                const units = paramValue?.urn !== undefined && parametersByUrn[paramValue.urn] !== undefined
                                  ? getUnitsForParameter(parametersByUrn[paramValue.urn].id, oikos)
                                  : undefined

                                return (<div>
                                  <FieldLabel field={field} />
                                  <div className='flex flex-row gap-4 text-sm'>
                                    <SelectInput
                                        id='parameter'
                                        testId='parameter'
                                        options={parameters.map(
                                          (p) => ({
                                            label: p.label,
                                            value: p.id
                                          })
                                        ).sort((a, b) => a.label.localeCompare(b.label))
                                        }
                                        value={paramValue?.urn !== undefined
                                          ? parametersByUrn[paramValue.urn]?.id
                                          : undefined}
                                        onChange={(v) => {
                                          onChange({
                                            urn: v?.value !== undefined
                                              ? parametersById[v.value]?.parameterName
                                              : undefined,
                                            unit: getUnitsForParameter(v?.value ?? '', oikos)[0]?.unit
                                          })
                                        }}
                                        placeholder='Select parameter'
                                      />
                                      {
                                        units !== undefined && units.length > 0
                                          ? <SelectInput
                                        id='unit'
                                        testId='unit'
                                        options={units.map((u) => ({ label: u.label, value: u.unit })).sort((a, b) => a.label.localeCompare(b.label))}
                                        value={paramValue?.unit}
                                        onChange={(v) => {
                                          onChange({ urn: paramValue?.urn, unit: v?.value })
                                        }}
                                        includePrompt={false}
                                        />
                                          : '--'
                                      }
                                    </div>
                                  </div>

                                )
                              }
                            }}
                            />
                            <pre className='bg-slate-100 text-xs p-10'>
                              {JSON.stringify(formValueState[0], null, 2)}
                            </pre>
                        </OikosContext.Provider>
                      )
            }

        </>

  )
}

const ExternalMetadataExampleLoader = (): ReactElement => {
  const queryClient = new QueryClient()
  return (
    <div className='p-20'>
    <QueryClientProvider client={queryClient}>
      <ExternalMetadataExample />
    </QueryClientProvider>
    </div>
  )
}

export default ExternalMetadataExampleLoader
