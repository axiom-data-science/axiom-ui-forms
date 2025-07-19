// edit metadata associated with a binninator dataset

import { type IFormField, type IForm, type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'
import { binner, oikos } from '@axdspub/axiom-ui-data-services'
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
      label: `${c}: [${allColumns[c]?.type ?? 'NA'}]`,
      value: c
    }
  })

  const functionOptions = [
    { label: 'Count', value: 'count' },
    { label: 'Distinct Count', value: 'distinctCount' },
    { label: 'Sum', value: 'sum' },
    { label: 'Average', value: 'avg' },
    { label: 'Min', value: 'min' },
    { label: 'Max', value: 'max' }
  ]

  const unitOptions = units.map(u => {
    return {
      label: typeof u === 'string' ? u : u.code,
      value: typeof u === 'string' ? u : u.code
    }
  }).sort((a, b) => a.label.localeCompare(b.label))

  const parameterMap = Object.fromEntries(parameters.map(p => [p.parameterName, p]))
  const parameterOptions = Object.values(parameterMap).map(p => {
    return {
      label: p.label,
      value: p.parameterName
    }
  }).sort((a, b) => a.label.localeCompare(b.label))

  console.log('functionOptions', functionOptions)

  const getQuery = ({
    id = 'query',
    label = 'Query',
    description = 'Query to derive options from the column. This will be used to populate the options for the filter.',
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
    conditions?: IFormField['conditions']
    conditionsSet?: IFormField['conditionsSet']
  }): IFormField => {
    return {
      id,
      label,
      description,
      type: 'object',
      conditions,
      conditionsSet,
      fields: [
        {
          id: 'select',
          label: 'Select',
          type: 'object',
          multiple: true,
          layout: 'grid3',
          fields: [
            {
              id: 'column',
              label: 'Column',
              type: 'select',
              options: columnOptions
            },
            {
              id: 'function',
              label: 'Function',
              type: 'select',
              options: functionOptions
            },
            {
              id: 'alias',
              label: 'Alias',
              type: 'text'
            }
          ]
        }

      ]
    }
  }

  const operationOptions = [
    { label: '=', value: '=' },
    { label: '!=', value: '!=' },
    { label: '>', value: '>' },
    { label: '>=', value: '>=' },
    { label: '<', value: '<' },
    { label: '<=', value: '<=' },
    { label: 'NOT NULL', value: 'is.notnull' },
    { label: 'ILIKE', value: 'ilike' }
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
                id: 'location_id',
                label: 'Location ID field',
                description: 'The field that contains the location ID for this dataset. This will be used to filter data by location.',
                type: 'select',
                required: true,
                defaultValue: allColumns.location_id !== undefined ? 'location_id' : undefined,
                options: columnOptions
              },
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
        label: 'Visualizations',
        fields: [
          {
            id: 'visualizations',
            label: 'Visualizations',
            description: 'Configure visualizations that will be presented to the user.',
            type: 'object',
            multiple: true,
            fields: [
              {
                id: 'visualization-intro-wrap',
                label: '',
                skip_path: true,
                type: 'object',
                layout: 'grid3',
                fields: [
                  {
                    id: 'column',
                    label: 'Column',
                    type: 'select',
                    required: true,
                    options: columnOptions
                  },
                  {
                    id: 'unit',
                    label: 'Unit',
                    type: 'select',
                    options: unitOptions
                  },
                  {
                    id: 'parameter',
                    label: 'Parameter',
                    type: 'select',
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
                id: 'filter-intro-wrap',
                label: '',
                skip_path: true,
                type: 'object',
                layout: 'grid3',
                fields: [
                  {
                    id: 'type',
                    label: 'Filter Type',
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
                    id: 'label',
                    label: 'Label',
                    type: 'text'
                  },
                  {
                    id: 'order',
                    label: 'Order',
                    type: 'number'
                  }

                ]

              },
              {
                id: 'description',
                label: 'Description',
                type: 'long_text'
              },
              {
                id: 'advanced',
                label: 'Advanced',
                type: 'boolean'
              },
              {
                id: 'string-column-options',
                label: 'String Column Options',
                type: 'object',
                skip_path: true,
                conditions: {
                  field: 'type'
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
                },
                fields: [
                  {
                    id: 'manualOptionEntry',
                    label: 'Options',
                    type: 'select',
                    options: [
                      { label: 'Manually enter options', value: 'manual' },
                      { label: 'Automatically derive options from column', value: 'auto' }
                    ],
                    conditionsSet: {
                      logic: 'or',
                      conditions: [
                        {
                          field: '.type',
                          operator: 'eq',
                          value: 'select'
                        },
                        {
                          field: '.type',
                          operator: 'eq',
                          value: 'multi-select'
                        }
                      ]
                    }
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
                      field: '.manualOptionEntry',
                      operator: '=',
                      value: 'auto'
                    },
                    conditionsSet: {
                      logic: 'or',
                      conditions: [
                        {
                          field: '.type',
                          operator: 'eq',
                          value: 'select'
                        },
                        {
                          field: '.type',
                          operator: 'eq',
                          value: 'multi-select'
                        }
                      ]
                    }
                  },
                  {
                    id: 'options',
                    label: 'Options',
                    type: 'object',
                    multiple: true,
                    conditions: {
                      field: '.manualOptionEntry',
                      operator: 'eq',
                      value: 'manual'
                    },
                    conditionsSet: {
                      logic: 'or',
                      conditions: [
                        {
                          field: '.type',
                          operator: 'eq',
                          value: 'select'
                        },
                        {
                          field: '.type',
                          operator: 'eq',
                          value: 'multi-select'
                        }
                      ]
                    },
                    fields: [
                      {
                        id: 'option-label-value-wrap',
                        label: '',
                        type: 'object',
                        layout: 'grid2',
                        skip_path: true,
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
                          }
                        ]
                      },
                      getQuery({
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
                      })
                    ]

                  }

                ]
              },
              {
                id: 'numeric-column-options',
                label: 'Numeric Column Options',
                type: 'object',
                skip_path: true,
                conditionsSet: {
                  logic: 'or',
                  conditions: [
                    {
                      field: 'type',
                      operator: 'eq',
                      value: 'range'
                    }
                  ]
                },
                fields: [
                  {
                    id: 'numericColumn',
                    label: 'Column',
                    destPath: 'column',
                    type: 'select',
                    required: true,
                    conditionsSet: {
                      logic: 'or',
                      conditions: [
                        {
                          field: '.type',
                          operator: 'eq',
                          value: 'range'
                        }
                      ]
                    },
                    options: Object.keys(allColumns).sort((a, b) => a.localeCompare(b)).filter(c => allColumns[c]?.type === 'Float64' || allColumns[c]?.type === 'Int32').map(c => {
                      return {
                        label: `${c}: [${allColumns[c]?.type}]`,
                        value: c
                      }
                    })
                  },
                  {
                    id: 'overrideMinMax',
                    label: 'Override Min/Max',
                    type: 'boolean',
                    description: 'Override the minimum and maximum values for the range filter. If not set, the minimum and maximum values will be derived from the data in the column.'
                  },
                  {
                    id: 'min-max-wrap',
                    label: '',
                    type: 'object',
                    skip_path: true,
                    layout: 'grid3',
                    conditions: {
                      field: '.overrideMinMax',
                      operator: '=',
                      value: true
                    },
                    fields: [
                      {
                        id: 'min',
                        label: 'Minimum Value',
                        type: 'number'
                      },
                      {
                        id: 'max',
                        label: 'Maximum Value',
                        type: 'number'
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

  console.log('form', form)

  const formState = useState<IForm | undefined>(form)
  const formValueState = useState<IFormValues>({})

  return (
        <div className='flex flex-col gap-4'>
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
        <div className='flex flex-col gap-4 p-10'>
            {
                isLoading
                  ? <Loader className='pt-20' />
                  : error
                    ? <div className='text-red-500'>Error loading metadata: {error.message}</div>
                    : <MetadataManagementForm data={binnerData} dataset={dataset} units={oikosData.units} parameters={oikosData.parameters} />
            }
        </div>
  )
}

export default Metadata
