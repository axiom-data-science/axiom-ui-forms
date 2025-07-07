// edit metadata associated with a binninator dataset

import { type IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { FormWithEditorOverlay } from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { binner } from ***REMOVED***@axdspub/axiom-ui-data-services***REMOVED***
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

const MetadataManagementForm = ({ data, dataset }: { data: binner.IBinningServiceDatasetMetadata, dataset: string }): ReactElement => {
  console.log(useParams())

  const columnOptions = Object.keys(data.metadata.columns).sort((a, b) => a.localeCompare(b)).map(c => {
    return {
      label: `${c}: [${data.metadata.columns[c].type}]`,
      value: c
    }
  })

  const operationOptions = [
    { label: ***REMOVED***=***REMOVED***, value: ***REMOVED***eq***REMOVED*** },
    { label: ***REMOVED***!=***REMOVED***, value: ***REMOVED***neq***REMOVED*** },
    { label: ***REMOVED***>***REMOVED***, value: ***REMOVED***gt***REMOVED*** },
    { label: ***REMOVED***>=***REMOVED***, value: ***REMOVED***gte***REMOVED*** },
    { label: ***REMOVED***<***REMOVED***, value: ***REMOVED***lt***REMOVED*** },
    { label: ***REMOVED***<=***REMOVED***, value: ***REMOVED***lte***REMOVED*** },
    { label: ***REMOVED***NOT NULL***REMOVED***, value: ***REMOVED***is.notnull***REMOVED*** }
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
        label: ***REMOVED***Visualizations***REMOVED***
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
                id: ***REMOVED***type***REMOVED***,
                label: ***REMOVED***Type***REMOVED***,
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
                id: ***REMOVED***manual_option_entry***REMOVED***,
                label: ***REMOVED***Manually enter options***REMOVED***,
                type: ***REMOVED***select***REMOVED***,
                conditions: {
                  field: ***REMOVED***type***REMOVED***
                },
                defaultValue: ***REMOVED***manual***REMOVED***,
                options: [
                  { label: ***REMOVED***Yes***REMOVED***, value: ***REMOVED***manual***REMOVED*** },
                  { label: ***REMOVED***No***REMOVED***, value: ***REMOVED***auto***REMOVED*** }
                ]
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
                  field: ***REMOVED***manual_option_entry***REMOVED***,
                  operator: ***REMOVED***!=***REMOVED***,
                  value: ***REMOVED***manual***REMOVED***
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
                }
              },
              {
                id: ***REMOVED***numericColumn***REMOVED***,
                label: ***REMOVED***Column***REMOVED***,
                destPath: ***REMOVED***column***REMOVED***,
                type: ***REMOVED***select***REMOVED***,
                required: true,
                options: Object.keys(data.metadata.columns).sort((a, b) => a.localeCompare(b)).filter(c => data.metadata.columns[c].type !== ***REMOVED***String***REMOVED***).map(c => {
                  return {
                    label: `${c}: [${data.metadata.columns[c].type}]`,
                    value: c
                  }
                }),
                conditions: {
                  field: ***REMOVED***manual_option_entry***REMOVED***,
                  operator: ***REMOVED***!=***REMOVED***,
                  value: ***REMOVED***manual***REMOVED***
                },
                conditionsSet: {
                  logic: ***REMOVED***and***REMOVED***,
                  conditions: [
                    {
                      field: ***REMOVED***type***REMOVED***,
                      operator: ***REMOVED***eq***REMOVED***,
                      value: ***REMOVED***range***REMOVED***
                    }
                  ]
                }

              },
              {
                id: ***REMOVED***options***REMOVED***,
                label: ***REMOVED***Options***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                multiple: true,
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
                conditions: {
                  field: ***REMOVED***manual_option_entry***REMOVED***,
                  operator: ***REMOVED***eq***REMOVED***,
                  value: ***REMOVED***manual***REMOVED***
                },
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
                  },

                  {
                    id: ***REMOVED***query***REMOVED***,
                    label: ***REMOVED***Query***REMOVED***,
                    type: ***REMOVED***object***REMOVED***,
                    layout: ***REMOVED***grid3***REMOVED***,
                    multiple: true,
                    fields: [
                      {
                        id: ***REMOVED***column***REMOVED***,
                        label: ***REMOVED***Column***REMOVED***,
                        type: ***REMOVED***select***REMOVED***,
                        required: true,
                        options: Object.keys(data.metadata.columns).sort((a, b) => a.localeCompare(b)).map(c => {
                          return {
                            label: `${c}: [${data.metadata.columns[c].type}]`,
                            value: c
                          }
                        })
                      },
                      {
                        id: ***REMOVED***operation***REMOVED***,
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
          }
        ]
      }
    ]
  }

  const formState = useState<IForm | undefined>(form)

  return (
        <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
                <FormWithEditorOverlay
                    formState={formState}
                />
        </div>
  )
}

const Metadata = ({ dataset }: { dataset: string }): ReactElement => {
  const { data, isLoading, error } = binner.useBinningServiceMetadata({ uuid: dataset })

  return (
        <div className=***REMOVED***flex flex-col gap-4 p-10***REMOVED***>
            {
                isLoading || data === undefined
                  ? <Loader className=***REMOVED***pt-20***REMOVED*** />
                  : error
                    ? <div className=***REMOVED***text-red-500***REMOVED***>Error loading metadata: {error.message}</div>
                    : <MetadataManagementForm data={data} dataset={dataset} />
            }
        </div>
  )
}

export default Metadata
