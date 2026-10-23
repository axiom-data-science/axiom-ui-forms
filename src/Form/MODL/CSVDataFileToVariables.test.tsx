import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FormContextProvider } from '@/Form/Creator/FormContextProvider'
import type { IFieldInputProps, IFormValues } from '@/Form/Creator/FormCreatorTypes'
import CSVDataFileToVariables from './CSVDataFileToVariables'

vi.mock('@/Form/Components/Inputs/FileUpload/FileUpload', async () => {
  const ReactModule = await import('react')
  const parsedCsvData = {
    headers: [
      { key: 'temperature', type: 'float' as const },
      { key: 'latitude', type: 'float' as const },
    ],
    data: [
      { temperature: 10, latitude: 41 },
      { temperature: 15, latitude: 42 },
    ],
  }

  return {
    default: ({ onFileUpload, onChange }: any) =>
      ReactModule.createElement(
        'button',
        {
          type: 'button',
          onClick: () => {
            onFileUpload({ parsedCsvData })
            onChange('observations.csv')
          },
        },
        'Choose test CSV'
      ),
  }
})

describe('CSVDataFileToVariables', () => {
  it('lets users select variables and edit units before adding them to the form', () => {
    const setFormValues = vi.fn()
    const onChange = vi.fn()
    const initialValues: IFormValues = { dataset_id: 'dataset-1' }
    const fieldProps: IFieldInputProps = {
      field: {
        id: 'variables_data_csv_upload',
        type: 'custom:csv-data-file-to-variables',
        label: 'Infer variables from data CSV',
      },
      value: undefined,
      onChange,
    }

    render(
      <FormContextProvider
        form={{ id: 'test-form' }}
        formValues={initialValues}
        setFormValues={setFormValues}
      >
        <CSVDataFileToVariables {...fieldProps} />
      </FormContextProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: 'Choose test CSV' }))

    expect(screen.getByRole('checkbox', { name: 'Include temperature' })).toBeChecked()
    expect(screen.getByRole('checkbox', { name: 'Include latitude' })).toBeChecked()
    expect(setFormValues).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('checkbox', { name: 'Include latitude' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Units for temperature' }), {
      target: { value: 'degree_Celsius' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Add 1 selected variables to form' }))

    expect(setFormValues).toHaveBeenCalledWith({
      dataset_id: 'dataset-1',
      variables: {
        temperature: {
          variable_name: 'temperature',
          long_name: 'Temperature',
          actual_range_min: 10,
          actual_range_max: 15,
          units: 'degree_Celsius',
        },
      },
    })
  })
})
