import { IFormValues, IFormValueState, type IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import { FormWithEditorOverlay } from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import CSVUploadForSampleFile from ***REMOVED***@/Form/TestForms/PopulateHeadersFromUpload.tsx/CSVUploadForSampleFile***REMOVED***

const form: IForm = {
  id: ***REMOVED***populate-headers-from-upload***REMOVED***,
  label: ***REMOVED***Populate Headers From Upload***REMOVED***,
  fields: [
    {
      id: ***REMOVED***sample_file.file_name***REMOVED***,
      type: ***REMOVED***custom:csv_upload_for_sample_file***REMOVED***,
      label: ***REMOVED***Upload CSV File***REMOVED***,
    },
    {
      id: ***REMOVED***sample_file.headers***REMOVED***,
      type: ***REMOVED***object***REMOVED***,
      label: ***REMOVED***Headers***REMOVED***,
      multiple: true,
      layout: ***REMOVED***grid2***REMOVED***,
      conditions: {
        field: ***REMOVED***sample_file.file_name***REMOVED***,
      },
      fields: [
        {
          id: ***REMOVED***cell_header***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          label: ***REMOVED***Cell Header***REMOVED***,
        },
        {
          id: ***REMOVED***cell_units***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          label: ***REMOVED***Cell Units***REMOVED***,
        },
        {
          id: ***REMOVED***cell_parameter***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          label: ***REMOVED***Cell Parameter***REMOVED***,
        },
        {
          id: ***REMOVED***data_type***REMOVED***,
          type: ***REMOVED***select***REMOVED***,
          label: ***REMOVED***Data Type***REMOVED***,
          options: [
            {
              value: ***REMOVED***string***REMOVED***,
              label: ***REMOVED***String***REMOVED***,
            },
            {
              value: ***REMOVED***float***REMOVED***,
              label: ***REMOVED***Float***REMOVED***,
            },
            {
              value: ***REMOVED***dateString***REMOVED***,
              label: ***REMOVED***Date string***REMOVED***,
            },
          ],
        },
        {
          id: ***REMOVED***time_format***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          label: ***REMOVED***Time Format***REMOVED***,
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
        ***REMOVED***custom:csv_upload_for_sample_file***REMOVED***: CSVUploadForSampleFile,
      }}
    />
  )
}

const formValues: IFormValues = {
  sample_file: {
    file_name: ***REMOVED***test_homer_data - test_data_homer.csv.csv***REMOVED***,
    headers: [
      {
        cell_header: ***REMOVED***height***REMOVED***,
        cell_parameter: null,
        data_type: ***REMOVED***float***REMOVED***,
      },
      {
        cell_header: ***REMOVED***dateTime***REMOVED***,
        cell_parameter: ***REMOVED***time***REMOVED***,
        data_type: ***REMOVED***dateString***REMOVED***,
        time_format: ***REMOVED***YYYY-MM-ddTHH:mm:ss.s***REMOVED***,
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
        ***REMOVED***custom:csv_upload_for_sample_file***REMOVED***: CSVUploadForSampleFile,
      }}
    />
  )
}

export default PopulateHeadersFromUpload
