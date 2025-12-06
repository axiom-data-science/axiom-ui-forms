"use client";
import { FormCreator } from ***REMOVED***@/Form***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { type IFieldInputProps, type IForm, type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Loader, SelectInput } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { QueryClient, QueryClientProvider, useQuery } from ***REMOVED***@tanstack/react-query***REMOVED***
import React, { createContext, useContext, useState, type ReactElement } from ***REMOVED***react***REMOVED***

const form: IForm = {
  id: ***REMOVED***externalMetadata***REMOVED***,
  label: ***REMOVED***External Metadata Example***REMOVED***,
  fields: [
    {
      id: ***REMOVED***parameter***REMOVED***,
      label: ***REMOVED***Select parameter and units when available***REMOVED***,
      type: ***REMOVED***custom:parameter***REMOVED***,
      required: true
    }
  ]
}

interface IOikosUnit { id: string, label: string, unit: string }
interface IOikosContext {
  ***REMOVED***sensorParameters***REMOVED***: Array<{ id: string }>
  ***REMOVED***units***REMOVED***: IOikosUnit[]
  ***REMOVED***parameters***REMOVED***: Array<{ id: string, label: string, parameterName: string, idParameterType: number }>
  ***REMOVED***parameterTypes***REMOVED***: Array<{ id: number, label: string }>
  ***REMOVED***parameterTypeUnits***REMOVED***: Array<{ parameterTypeDefault: boolean, idParameterType: number, idUnit: string }>
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
    queryKey: [***REMOVED***externalMetadata***REMOVED***],
    queryFn: async () => {
      const response = await fetch(***REMOVED***https://oikos.axds.co/rest/context***REMOVED***)
      if (!response.ok) {
        throw new Error(***REMOVED***Network response was not ok***REMOVED***)
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
                        <div className=***REMOVED***p-4 text-rose-800***REMOVED***>Error: {error.message}</div>
                      )
                    : (
                        <OikosContext.Provider value={data}>
                          <FormCreator
                            form={form}
                            formValueState={formValueState}
                            inputOverrides={{
                              ***REMOVED***custom:parameter***REMOVED***: ({ field, value, onChange }: IFieldInputProps): ReactElement => {
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
                                  <div className=***REMOVED***flex flex-row gap-4 text-sm***REMOVED***>
                                    <SelectInput
                                        id=***REMOVED***parameter***REMOVED***
                                        testId=***REMOVED***parameter***REMOVED***
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
                                            unit: getUnitsForParameter(v?.value !== undefined ? String(v.value) : ***REMOVED******REMOVED***, oikos)[0]?.unit
                                          })
                                        }}
                                        placeholder=***REMOVED***Select parameter***REMOVED***
                                      />
                                      {
                                        units !== undefined && units.length > 0
                                          ? <SelectInput
                                        id=***REMOVED***unit***REMOVED***
                                        testId=***REMOVED***unit***REMOVED***
                                        options={units.map((u) => ({ label: u.label, value: u.unit })).sort((a, b) => a.label.localeCompare(b.label))}
                                        value={paramValue?.unit}
                                        onChange={(v) => {
                                          onChange({ urn: paramValue?.urn, unit: v?.value })
                                        }}
                                        includePrompt={false}
                                        />
                                          : ***REMOVED***--***REMOVED***
                                      }
                                    </div>
                                  </div>

                                )
                              }
                            }}
                            />
                            <pre className=***REMOVED***bg-slate-100 text-xs p-10***REMOVED***>
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
    <div className=***REMOVED***p-20***REMOVED***>
    <QueryClientProvider client={queryClient}>
      <ExternalMetadataExample />
    </QueryClientProvider>
    </div>
  )
}

export default ExternalMetadataExampleLoader
