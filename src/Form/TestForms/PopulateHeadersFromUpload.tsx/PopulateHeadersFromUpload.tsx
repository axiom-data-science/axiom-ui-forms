import { IFormValues, IFormValueState, type IForm } from '@/Form/Creator/FormCreatorTypes'
import { ReactElement, useState } from 'react'
import { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'
import CSVUploadForSampleFile from '@/Form/TestForms/PopulateHeadersFromUpload.tsx/CSVUploadForSampleFile'

const form: IForm = {
  id: 'populate-headers-from-upload',
  label: 'Populate Headers From Upload',
  fields: [
    {
      id: 'sample_file.file_name',
      type: 'custom:csv_upload_for_sample_file',
      label: 'Upload CSV File',
    },
    {
      id: 'sample_file.headers',
      type: 'object',
      label: 'Headers',
      multiple: true,
      layout: 'grid2',
      conditions: {
        field: 'sample_file.file_name',
      },
      fields: [
        {
          id: 'cell_header',
          type: 'text',
          label: 'Cell Header',
        },
        {
          id: 'cell_units',
          type: 'text',
          label: 'Cell Units',
        },
        {
          id: 'cell_parameter',
          type: 'text',
          label: 'Cell Parameter',
        },
        {
          id: 'data_type',
          type: 'select',
          label: 'Data Type',
          options: [
            {
              value: 'string',
              label: 'String',
            },
            {
              value: 'float',
              label: 'Float',
            },
            {
              value: 'dateString',
              label: 'Date string',
            },
          ],
        },
        {
          id: 'time_format',
          type: 'text',
          label: 'Time Format',
        },
      ],
    },
  ],
}

const PopulateHeadersFromUpload = (): ReactElement => {
  const formState = useState<IForm | undefined>(form)
  return (
    <FormWithEditorOverlay
      formState={formState}
      inputOverrides={{
        'custom:csv_upload_for_sample_file': CSVUploadForSampleFile,
      }}
    />
  )
}

const formValues: IFormValues = {
  sample_file: {
    file_name: 'test_homer_data - test_data_homer.csv.csv',
    headers: [
      {
        cell_header: 'height',
        cell_parameter: null,
        data_type: 'float',
      },
      {
        cell_header: 'dateTime',
        cell_parameter: 'time',
        data_type: 'dateString',
        time_format: 'YYYY-MM-ddTHH:mm:ss.s',
      },
    ],
  },
}

export const PrePopulatedPopulateHeadersFromUpload = (): ReactElement => {
  const formState = useState<IForm | undefined>(form)
  const formValueState: IFormValueState = useState<IFormValues>(formValues)
  return (
    <FormWithEditorOverlay
      formState={formState}
      formValueState={formValueState}
      inputOverrides={{
        'custom:csv_upload_for_sample_file': CSVUploadForSampleFile,
      }}
    />
  )
}

export default PopulateHeadersFromUpload
