import { type IFormField } from '@/Form/FormCreatorTypes'

export const testFields: IFormField[] = [
  {
    id: 'short',
    label: 'Test component',
    type: 'text',
    required: false
  },
  {
    id: 'long',
    label: 'Long string component',
    type: 'long_text',
    required: false
  },
  {
    id: 'description',
    label: 'Description',
    type: 'long_text',
    required: false
  },
  {
    id: 'agree',
    label: 'Do u agree?',
    type: 'boolean',
    required: true
  },
  {
    label: 'Select one',
    id: 'color',
    type: 'select',
    required: true,
    multiple: false,
    options: [
      {
        label: 'Red',
        value: 'red'
      },
      {
        label: 'Green',
        value: 'green'
      },
      {
        label: 'Blue',
        value: 'blue'
      }
    ]
  },
  {
    label: 'Pick a size',
    id: 'size',
    type: 'radio',
    required: false,
    layout: 'vertical',
    multiple: false,
    options: [
      {
        label: 'Small',
        value: 'small'
      },
      {
        label: 'Medium',
        value: 'medium'
      },
      {
        label: 'Large',
        value: 'large'
      }
    ]
  },
  {
    label: 'Address',
    id: 'address',
    type: 'object',
    required: true,
    layout: 'vertical',
    fields: [
      {
        id: 'street',
        label: 'Street',
        type: 'text',
        required: true
      },
      {
        id: 'city_state_zip',
        type: 'object',
        required: true,
        layout: 'horizontal',
        fields: [
          {
            id: 'city',
            label: 'City',
            type: 'text',
            required: true
          },
          {
            id: 'state',
            label: 'State',
            type: 'text',
            required: true
          },
          {
            id: 'zip',
            label: 'Zip',
            type: 'text',
            required: true
          }
        ]
      }
    ]
  }
]
