// edit metadata associated with a binninator dataset

import { type IForm } from '@/Form/Creator/FormCreatorTypes'
import { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'
import { binner } from '@axdspub/axiom-ui-data-services'
import { Loader } from '@axdspub/axiom-ui-utilities'
import React, { useState, type ReactElement } from 'react'
import { useParams } from 'react-router-dom'

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
    { label: '=', value: 'eq' },
    { label: '!=', value: 'neq' },
    { label: '>', value: 'gt' },
    { label: '>=', value: 'gte' },
    { label: '<', value: 'lt' },
    { label: '<=', value: 'lte' },
    { label: 'NOT NULL', value: 'is.notnull' }
  ]

  const form: IForm = {
    id: 'metadata-management-form',
    label: `Metadata Management for ${dataset}`,
    wizard_steps: [
      {
        id: 'global',
        label: 'Global Settings',
        pages: [

          {
            id: 'global-filters',
            label: 'Filters',
            fields: [
              {
                id: 'and-filter-wrap',
                label: '',
                skip_path: true,
                type: 'object',
                fields: [
                  {
                    id: 'and-global-filters',
                    label: 'And Filters',
                    description: 'Configure global *and* filters (all conditions must be met). These will be applied to any call for data, along with any user-set filters',
                    type: 'object',
                    multiple: true,
                    layout: 'horizontal',
                    fields: [
                      {
                        id: 'column',
                        label: 'Column',
                        type: 'select',
                        required: true,
                        options: columnOptions
                      },
                      {
                        id: 'op',
                        label: 'Operation',
                        type: 'select',
                        required: true,
                        options: operationOptions
                      },
                      {
                        id: 'value',
                        label: 'Value',
                        type: 'text'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            id: 'time-series',
            label: 'Time Series'

          }
        ]
      },
      {
        id: 'visualizations',
        label: 'Visualizations'
      },
      {
        id: 'filters',
        label: 'Filters',
        fields: [

          {
            id: 'filters',
            label: 'Filters',
            description: 'Configure filters that will be presented to the user.',
            type: 'object',
            multiple: true,
            fields: [
              {
                id: 'type',
                label: 'Type',
                type: 'select',
                required: true,
                options: [
                  { label: 'Select', value: 'select' },
                  { label: 'Multi-select', value: 'multi-select' },
                  { label: 'Range', value: 'range' },
                  { label: 'Boolean', value: 'boolean' }
                ]
              },
              {
                id: 'manual_option_entry',
                label: 'Manually enter options',
                type: 'select',
                conditions: {
                  field: 'type'
                },
                defaultValue: 'manual',
                options: [
                  { label: 'Yes', value: 'manual' },
                  { label: 'No', value: 'auto' }
                ]
              },
              {
                id: 'stringColumn',
                label: 'Column',
                type: 'select',
                destPath: 'column',
                required: true,
                options: Object.keys(data.metadata.columns).sort((a, b) => a.localeCompare(b)).filter(c => data.metadata.columns[c].type === 'String').map(c => {
                  return {
                    label: `${c}: [${data.metadata.columns[c].type}]`,
                    value: c
                  }
                }),
                conditions: {
                  field: 'manual_option_entry',
                  operator: '!=',
                  value: 'manual'
                },
                conditionsSet: {
                  logic: 'or',
                  conditions: [
                    {
                      field: 'type',
                      operator: 'eq',
                      value: 'select'
                    },
                    {
                      field: 'type',
                      operator: 'eq',
                      value: 'multi-select'
                    }
                  ]
                }
              },
              {
                id: 'numericColumn',
                label: 'Column',
                destPath: 'column',
                type: 'select',
                required: true,
                options: Object.keys(data.metadata.columns).sort((a, b) => a.localeCompare(b)).filter(c => data.metadata.columns[c].type !== 'String').map(c => {
                  return {
                    label: `${c}: [${data.metadata.columns[c].type}]`,
                    value: c
                  }
                }),
                conditions: {
                  field: 'manual_option_entry',
                  operator: '!=',
                  value: 'manual'
                },
                conditionsSet: {
                  logic: 'and',
                  conditions: [
                    {
                      field: 'type',
                      operator: 'eq',
                      value: 'range'
                    }
                  ]
                }

              },
              {
                id: 'options',
                label: 'Options',
                type: 'object',
                multiple: true,
                conditionsSet: {
                  logic: 'or',
                  conditions: [
                    {
                      field: 'type',
                      operator: 'eq',
                      value: 'select'
                    },
                    {
                      field: 'type',
                      operator: 'eq',
                      value: 'multi-select'
                    }
                  ]
                },
                conditions: {
                  field: 'manual_option_entry',
                  operator: 'eq',
                  value: 'manual'
                },
                fields: [
                  {
                    id: 'label',
                    label: 'Label',
                    type: 'text',
                    required: true
                  },
                  {
                    id: 'value',
                    label: 'Value',
                    type: 'text',
                    required: true
                  },

                  {
                    id: 'query',
                    label: 'Query',
                    type: 'object',
                    layout: 'grid3',
                    multiple: true,
                    fields: [
                      {
                        id: 'column',
                        label: 'Column',
                        type: 'select',
                        required: true,
                        options: Object.keys(data.metadata.columns).sort((a, b) => a.localeCompare(b)).map(c => {
                          return {
                            label: `${c}: [${data.metadata.columns[c].type}]`,
                            value: c
                          }
                        })
                      },
                      {
                        id: 'operation',
                        label: 'Operation',
                        type: 'select',
                        required: true,
                        options: operationOptions
                      },
                      {
                        id: 'value',
                        label: 'Value',
                        type: 'text'
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
        <div className='flex flex-col gap-4'>
                <FormWithEditorOverlay
                    formState={formState}
                />
        </div>
  )
}

const Metadata = ({ dataset }: { dataset: string }): ReactElement => {
  const { data, isLoading, error } = binner.useBinningServiceMetadata({ uuid: dataset })

  return (
        <div className='flex flex-col gap-4 p-10'>
            {
                isLoading || data === undefined
                  ? <Loader className='pt-20' />
                  : error
                    ? <div className='text-red-500'>Error loading metadata: {error.message}</div>
                    : <MetadataManagementForm data={data} dataset={dataset} />
            }
        </div>
  )
}

export default Metadata
