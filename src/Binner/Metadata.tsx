// edit metadata associated with a binninator dataset

import { type IFormField, type IForm, type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { FormWithEditorOverlay } from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { binner, oikos } from ***REMOVED***@axdspub/axiom-ui-data-services***REMOVED***
import { Loader } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { useParams } from ***REMOVED***react-router-dom***REMOVED***

/**
 *

- Global filters

- Filters
-- column
-- op
-- value

- Metrics
-- column
-- agg
-- selections

- Map hover

- Map select

- Time series

 *
 * @returns
 */

const MetadataManagementForm = ({
  data,
  dataset,
  units,
  parameters
}: {
  data: binner.IBinningServiceDatasetMetadata
  dataset: string
  units: oikos.IUnit[]
  parameters: oikos.IParameter[]
}): ReactElement => {
  console.log(useParams())

  const allColumns = {
    ...data.metadata.columns,
    ...data.metadata.dimensions
  }

  const columnOptions = Object.keys(allColumns).sort((a, b) => a.localeCompare(b)).map(c => {
    return {
      label: `${c}: [${allColumns[c]?.type ?? ***REMOVED***NA***REMOVED***}]`,
      value: c
    }
  })

  const functionOptions = [
    { label: ***REMOVED***Count***REMOVED***, value: ***REMOVED***count***REMOVED*** },
    { label: ***REMOVED***Distinct Count***REMOVED***, value: ***REMOVED***distinctCount***REMOVED*** },
    { label: ***REMOVED***Sum***REMOVED***, value: ***REMOVED***sum***REMOVED*** },
    { label: ***REMOVED***Average***REMOVED***, value: ***REMOVED***avg***REMOVED*** },
    { label: ***REMOVED***Min***REMOVED***, value: ***REMOVED***min***REMOVED*** },
    { label: ***REMOVED***Max***REMOVED***, value: ***REMOVED***max***REMOVED*** }
  ]

  const unitOptions = units.map(u => {
    return {
      label: typeof u === ***REMOVED***string***REMOVED*** ? u : u.code,
      value: typeof u === ***REMOVED***string***REMOVED*** ? u : u.code
    }
  }).sort((a, b) => a.label.localeCompare(b.label))

  const parameterMap = Object.fromEntries(parameters.map(p => [p.parameterName, p]))
  const parameterOptions = Object.values(parameterMap).map(p => {
    return {
      label: p.label,
      value: p.parameterName
    }
  }).sort((a, b) => a.label.localeCompare(b.label))

  console.log(***REMOVED***functionOptions***REMOVED***, functionOptions)

  const getQuery = ({
    id = ***REMOVED***query***REMOVED***,
    label = ***REMOVED***Query***REMOVED***,
    description = ***REMOVED***Query to derive options from the column. This will be used to populate the options for the filter.***REMOVED***,
    columnOptions = Object.keys(data.metadata.columns).sort((a, b) => a.localeCompare(b)).map(c => {
      return {
        label: `${c}: [${data.metadata.columns[c].type}]`,
        value: c
      }
    }),
    conditions,
    conditionsSet
  }: {
    id?: string
    label?: string
    description?: string
    columnOptions?: Array<{ label: string, value: string }>
    conditions?: IFormField[***REMOVED***conditions***REMOVED***]
    conditionsSet?: IFormField[***REMOVED***conditionsSet***REMOVED***]
  }): IFormField => {
    return {
      id,
      label,
      description,
      type: ***REMOVED***object***REMOVED***,
      conditions,
      conditionsSet,
      fields: [
        {
          id: ***REMOVED***select***REMOVED***,
          label: ***REMOVED***Select***REMOVED***,
          type: ***REMOVED***object***REMOVED***,
          multiple: true,
          layout: ***REMOVED***grid3***REMOVED***,
          fields: [
            {
              id: ***REMOVED***column***REMOVED***,
              label: ***REMOVED***Column***REMOVED***,
              type: ***REMOVED***select***REMOVED***,
              options: columnOptions
            },
            {
              id: ***REMOVED***function***REMOVED***,
              label: ***REMOVED***Function***REMOVED***,
              type: ***REMOVED***select***REMOVED***,
              options: functionOptions
            },
            {
              id: ***REMOVED***alias***REMOVED***,
              label: ***REMOVED***Alias***REMOVED***,
              type: ***REMOVED***text***REMOVED***
            }
          ]
        }

      ]
    }
  }

  const operationOptions = [
    { label: ***REMOVED***=***REMOVED***, value: ***REMOVED***=***REMOVED*** },
    { label: ***REMOVED***!=***REMOVED***, value: ***REMOVED***!=***REMOVED*** },
    { label: ***REMOVED***>***REMOVED***, value: ***REMOVED***>***REMOVED*** },
    { label: ***REMOVED***>=***REMOVED***, value: ***REMOVED***>=***REMOVED*** },
    { label: ***REMOVED***<***REMOVED***, value: ***REMOVED***<***REMOVED*** },
    { label: ***REMOVED***<=***REMOVED***, value: ***REMOVED***<=***REMOVED*** },
    { label: ***REMOVED***NOT NULL***REMOVED***, value: ***REMOVED***is.notnull***REMOVED*** },
    { label: ***REMOVED***ILIKE***REMOVED***, value: ***REMOVED***ilike***REMOVED*** }
  ]

  const form: IForm = {
    id: ***REMOVED***metadata-management-form***REMOVED***,
    label: `Metadata Management for ${dataset}`,
    wizard_steps: [
      {
        id: ***REMOVED***global***REMOVED***,
        label: ***REMOVED***Global Settings***REMOVED***,
        pages: [

          {
            id: ***REMOVED***global-filters***REMOVED***,
            label: ***REMOVED***Filters***REMOVED***,
            fields: [
              {
                id: ***REMOVED***location_id***REMOVED***,
                label: ***REMOVED***Location ID field***REMOVED***,
                description: ***REMOVED***The field that contains the location ID for this dataset. This will be used to filter data by location.***REMOVED***,
                type: ***REMOVED***select***REMOVED***,
                required: true,
                defaultValue: allColumns.location_id !== undefined ? ***REMOVED***location_id***REMOVED*** : undefined,
                options: columnOptions
              },
              {
                id: ***REMOVED***and-filter-wrap***REMOVED***,
                label: ***REMOVED******REMOVED***,
                skip_path: true,
                type: ***REMOVED***object***REMOVED***,
                fields: [
                  {
                    id: ***REMOVED***and-global-filters***REMOVED***,
                    label: ***REMOVED***And Filters***REMOVED***,
                    description: ***REMOVED***Configure global *and* filters (all conditions must be met). These will be applied to any call for data, along with any user-set filters***REMOVED***,
                    type: ***REMOVED***object***REMOVED***,
                    multiple: true,
                    layout: ***REMOVED***horizontal***REMOVED***,
                    fields: [
                      {
                        id: ***REMOVED***column***REMOVED***,
                        label: ***REMOVED***Column***REMOVED***,
                        type: ***REMOVED***select***REMOVED***,
                        required: true,
                        options: columnOptions
                      },
                      {
                        id: ***REMOVED***op***REMOVED***,
                        label: ***REMOVED***Operation***REMOVED***,
                        type: ***REMOVED***select***REMOVED***,
                        required: true,
                        options: operationOptions
                      },
                      {
                        id: ***REMOVED***value***REMOVED***,
                        label: ***REMOVED***Value***REMOVED***,
                        type: ***REMOVED***text***REMOVED***
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: ***REMOVED***time-series***REMOVED***,
            label: ***REMOVED***Time Series***REMOVED***

          }
        ]
      },
      {
        id: ***REMOVED***visualizations***REMOVED***,
        label: ***REMOVED***Visualizations***REMOVED***,
        fields: [
          {
            id: ***REMOVED***visualizations***REMOVED***,
            label: ***REMOVED***Visualizations***REMOVED***,
            description: ***REMOVED***Configure visualizations that will be presented to the user.***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            multiple: true,
            fields: [
              {
                id: ***REMOVED***visualization-intro-wrap***REMOVED***,
                label: ***REMOVED******REMOVED***,
                skip_path: true,
                type: ***REMOVED***object***REMOVED***,
                layout: ***REMOVED***grid3***REMOVED***,
                fields: [
                  {
                    id: ***REMOVED***column***REMOVED***,
                    label: ***REMOVED***Column***REMOVED***,
                    type: ***REMOVED***select***REMOVED***,
                    required: true,
                    options: columnOptions
                  },
                  {
                    id: ***REMOVED***unit***REMOVED***,
                    label: ***REMOVED***Unit***REMOVED***,
                    type: ***REMOVED***select***REMOVED***,
                    options: unitOptions
                  },
                  {
                    id: ***REMOVED***parameter***REMOVED***,
                    label: ***REMOVED***Parameter***REMOVED***,
                    type: ***REMOVED***select***REMOVED***,
                    options: parameterOptions
                  }

                ]
              },
              getQuery({})

            ]
          }
        ]
      },
      {
        id: ***REMOVED***filters***REMOVED***,
        label: ***REMOVED***Filters***REMOVED***,
        fields: [

          {
            id: ***REMOVED***filters***REMOVED***,
            label: ***REMOVED***Filters***REMOVED***,
            description: ***REMOVED***Configure filters that will be presented to the user.***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            multiple: true,
            fields: [
              {
                id: ***REMOVED***filter-intro-wrap***REMOVED***,
                label: ***REMOVED******REMOVED***,
                skip_path: true,
                type: ***REMOVED***object***REMOVED***,
                layout: ***REMOVED***grid3***REMOVED***,
                fields: [
                  {
                    id: ***REMOVED***type***REMOVED***,
                    label: ***REMOVED***Filter Type***REMOVED***,
                    type: ***REMOVED***select***REMOVED***,
                    required: true,
                    options: [
                      { label: ***REMOVED***Select***REMOVED***, value: ***REMOVED***select***REMOVED*** },
                      { label: ***REMOVED***Multi-select***REMOVED***, value: ***REMOVED***multi-select***REMOVED*** },
                      { label: ***REMOVED***Range***REMOVED***, value: ***REMOVED***range***REMOVED*** },
                      { label: ***REMOVED***Boolean***REMOVED***, value: ***REMOVED***boolean***REMOVED*** }
                    ]
                  },
                  {
                    id: ***REMOVED***label***REMOVED***,
                    label: ***REMOVED***Label***REMOVED***,
                    type: ***REMOVED***text***REMOVED***
                  },
                  {
                    id: ***REMOVED***order***REMOVED***,
                    label: ***REMOVED***Order***REMOVED***,
                    type: ***REMOVED***number***REMOVED***
                  }

                ]

              },
              {
                id: ***REMOVED***description***REMOVED***,
                label: ***REMOVED***Description***REMOVED***,
                type: ***REMOVED***long_text***REMOVED***
              },
              {
                id: ***REMOVED***advanced***REMOVED***,
                label: ***REMOVED***Advanced***REMOVED***,
                type: ***REMOVED***boolean***REMOVED***
              },
              {
                id: ***REMOVED***string-column-options***REMOVED***,
                label: ***REMOVED***String Column Options***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                skip_path: true,
                conditions: {
                  field: ***REMOVED***type***REMOVED***
                },
                conditionsSet: {
                  logic: ***REMOVED***or***REMOVED***,
                  conditions: [
                    {
                      field: ***REMOVED***type***REMOVED***,
                      operator: ***REMOVED***eq***REMOVED***,
                      value: ***REMOVED***select***REMOVED***
                    },
                    {
                      field: ***REMOVED***type***REMOVED***,
                      operator: ***REMOVED***eq***REMOVED***,
                      value: ***REMOVED***multi-select***REMOVED***
                    }
                  ]
                },
                fields: [
                  {
                    id: ***REMOVED***manualOptionEntry***REMOVED***,
                    label: ***REMOVED***Options***REMOVED***,
                    type: ***REMOVED***select***REMOVED***,
                    options: [
                      { label: ***REMOVED***Manually enter options***REMOVED***, value: ***REMOVED***manual***REMOVED*** },
                      { label: ***REMOVED***Automatically derive options from column***REMOVED***, value: ***REMOVED***auto***REMOVED*** }
                    ],
                    conditionsSet: {
                      logic: ***REMOVED***or***REMOVED***,
                      conditions: [
                        {
                          field: ***REMOVED***.type***REMOVED***,
                          operator: ***REMOVED***eq***REMOVED***,
                          value: ***REMOVED***select***REMOVED***
                        },
                        {
                          field: ***REMOVED***.type***REMOVED***,
                          operator: ***REMOVED***eq***REMOVED***,
                          value: ***REMOVED***multi-select***REMOVED***
                        }
                      ]
                    }
                  },
                  {
                    id: ***REMOVED***stringColumn***REMOVED***,
                    label: ***REMOVED***Column***REMOVED***,
                    type: ***REMOVED***select***REMOVED***,
                    destPath: ***REMOVED***column***REMOVED***,
                    required: true,
                    options: Object.keys(data.metadata.columns).sort((a, b) => a.localeCompare(b)).filter(c => data.metadata.columns[c].type === ***REMOVED***String***REMOVED***).map(c => {
                      return {
                        label: `${c}: [${data.metadata.columns[c].type}]`,
                        value: c
                      }
                    }),
                    conditions: {
                      field: ***REMOVED***.manualOptionEntry***REMOVED***,
                      operator: ***REMOVED***=***REMOVED***,
                      value: ***REMOVED***auto***REMOVED***
                    },
                    conditionsSet: {
                      logic: ***REMOVED***or***REMOVED***,
                      conditions: [
                        {
                          field: ***REMOVED***.type***REMOVED***,
                          operator: ***REMOVED***eq***REMOVED***,
                          value: ***REMOVED***select***REMOVED***
                        },
                        {
                          field: ***REMOVED***.type***REMOVED***,
                          operator: ***REMOVED***eq***REMOVED***,
                          value: ***REMOVED***multi-select***REMOVED***
                        }
                      ]
                    }
                  },
                  {
                    id: ***REMOVED***options***REMOVED***,
                    label: ***REMOVED***Options***REMOVED***,
                    type: ***REMOVED***object***REMOVED***,
                    multiple: true,
                    conditions: {
                      field: ***REMOVED***.manualOptionEntry***REMOVED***,
                      operator: ***REMOVED***eq***REMOVED***,
                      value: ***REMOVED***manual***REMOVED***
                    },
                    conditionsSet: {
                      logic: ***REMOVED***or***REMOVED***,
                      conditions: [
                        {
                          field: ***REMOVED***.type***REMOVED***,
                          operator: ***REMOVED***eq***REMOVED***,
                          value: ***REMOVED***select***REMOVED***
                        },
                        {
                          field: ***REMOVED***.type***REMOVED***,
                          operator: ***REMOVED***eq***REMOVED***,
                          value: ***REMOVED***multi-select***REMOVED***
                        }
                      ]
                    },
                    fields: [
                      {
                        id: ***REMOVED***option-label-value-wrap***REMOVED***,
                        label: ***REMOVED******REMOVED***,
                        type: ***REMOVED***object***REMOVED***,
                        layout: ***REMOVED***grid2***REMOVED***,
                        skip_path: true,
                        fields: [
                          {
                            id: ***REMOVED***label***REMOVED***,
                            label: ***REMOVED***Label***REMOVED***,
                            type: ***REMOVED***text***REMOVED***,
                            required: true
                          },
                          {
                            id: ***REMOVED***value***REMOVED***,
                            label: ***REMOVED***Value***REMOVED***,
                            type: ***REMOVED***text***REMOVED***,
                            required: true
                          }
                        ]
                      },
                      getQuery({
                        conditionsSet: {
                          logic: ***REMOVED***or***REMOVED***,
                          conditions: [
                            {
                              field: ***REMOVED***type***REMOVED***,
                              operator: ***REMOVED***eq***REMOVED***,
                              value: ***REMOVED***select***REMOVED***
                            },
                            {
                              field: ***REMOVED***type***REMOVED***,
                              operator: ***REMOVED***eq***REMOVED***,
                              value: ***REMOVED***multi-select***REMOVED***
                            }
                          ]
                        }
                      })
                    ]

                  }

                ]
              },
              {
                id: ***REMOVED***numeric-column-options***REMOVED***,
                label: ***REMOVED***Numeric Column Options***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                skip_path: true,
                conditionsSet: {
                  logic: ***REMOVED***or***REMOVED***,
                  conditions: [
                    {
                      field: ***REMOVED***type***REMOVED***,
                      operator: ***REMOVED***eq***REMOVED***,
                      value: ***REMOVED***range***REMOVED***
                    }
                  ]
                },
                fields: [
                  {
                    id: ***REMOVED***numericColumn***REMOVED***,
                    label: ***REMOVED***Column***REMOVED***,
                    destPath: ***REMOVED***column***REMOVED***,
                    type: ***REMOVED***select***REMOVED***,
                    required: true,
                    conditionsSet: {
                      logic: ***REMOVED***or***REMOVED***,
                      conditions: [
                        {
                          field: ***REMOVED***.type***REMOVED***,
                          operator: ***REMOVED***eq***REMOVED***,
                          value: ***REMOVED***range***REMOVED***
                        }
                      ]
                    },
                    options: Object.keys(allColumns).sort((a, b) => a.localeCompare(b)).filter(c => allColumns[c]?.type === ***REMOVED***Float64***REMOVED*** || allColumns[c]?.type === ***REMOVED***Int32***REMOVED***).map(c => {
                      return {
                        label: `${c}: [${allColumns[c]?.type}]`,
                        value: c
                      }
                    })
                  },
                  {
                    id: ***REMOVED***overrideMinMax***REMOVED***,
                    label: ***REMOVED***Override Min/Max***REMOVED***,
                    type: ***REMOVED***boolean***REMOVED***,
                    description: ***REMOVED***Override the minimum and maximum values for the range filter. If not set, the minimum and maximum values will be derived from the data in the column.***REMOVED***
                  },
                  {
                    id: ***REMOVED***min-max-wrap***REMOVED***,
                    label: ***REMOVED******REMOVED***,
                    type: ***REMOVED***object***REMOVED***,
                    skip_path: true,
                    layout: ***REMOVED***grid3***REMOVED***,
                    conditions: {
                      field: ***REMOVED***.overrideMinMax***REMOVED***,
                      operator: ***REMOVED***=***REMOVED***,
                      value: true
                    },
                    fields: [
                      {
                        id: ***REMOVED***min***REMOVED***,
                        label: ***REMOVED***Minimum Value***REMOVED***,
                        type: ***REMOVED***number***REMOVED***
                      },
                      {
                        id: ***REMOVED***max***REMOVED***,
                        label: ***REMOVED***Maximum Value***REMOVED***,
                        type: ***REMOVED***number***REMOVED***
                      }

                    ]
                  }

                ]
              }
            ]
          }
        ]
      }
    ]
  }

  console.log(***REMOVED***form***REMOVED***, form)

  const formState = useState<IForm | undefined>(form)
  const formValueState = useState<IFormValues>({})

  return (
        <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
                <FormWithEditorOverlay
                    formState={formState}
                    formValueState={formValueState}
                />
        </div>
  )
}

const Metadata = ({ dataset }: { dataset: string }): ReactElement => {
  const { data: binnerData, isLoading: binnerLoading, error: binnerError } = binner.useBinningServiceMetadata({ uuid: dataset })
  const { data: oikosData, isLoading: isLoadingOikos, error: errorOikos } = oikos.useOikosMetadata()

  const isLoading = binnerLoading || isLoadingOikos || binnerData === undefined || oikosData === undefined
  const error = (binnerError ?? errorOikos) ?? null

  return (
        <div className=***REMOVED***flex flex-col gap-4 p-10***REMOVED***>
            {
                isLoading
                  ? <Loader className=***REMOVED***pt-20***REMOVED*** />
                  : error
                    ? <div className=***REMOVED***text-red-500***REMOVED***>Error loading metadata: {error.message}</div>
                    : <MetadataManagementForm data={binnerData} dataset={dataset} units={oikosData.units} parameters={oikosData.parameters} />
            }
        </div>
  )
}

export default Metadata
