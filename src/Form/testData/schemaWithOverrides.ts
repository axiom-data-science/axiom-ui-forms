import { type IFormFieldOverride } from '@/library'
import { type JSONSchema6 } from 'json-schema'

export const schema: JSONSchema6 = {
  $schema: 'http://json-schema.org/draft-06/schema#',
  title: 'Test Schema',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name'
    },
    age: {
      type: 'number',
      title: 'Age'
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email'
    },
    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
          title: 'Street'
        },
        city: {
          type: 'string',
          title: 'City'
        }
      }
    }
  }
}

export const fieldOverrides: IFormFieldOverride[] = [
  {
    prop: 'name',
    label: 'Full Name',
    description: 'Please enter your full name.',
    required: true
  },
  {
    prop: 'address.street',
    label: 'Street Address',
    description: 'Please enter your street address.'
  }
]

export const fieldOverrides2: IFormFieldOverride[] = [
  {
    prop: 'name',
    label: 'Just your name please'
  },
  {
    prop: 'address.street',
    label: 'Street address where you live'
  }
]

export const formOverrides = {
  label: 'A little bit about yourself',
  pages: [
    {
      id: 'personal-info',
      label: 'Personal Information',
      description: 'Please provide your personal information.',
      fields: [
        {
          prop: 'name'
        },
        {
          prop: 'age',
          constraints: {
            max: 120
          }
        },
        {
          prop: 'email'
        }
      ]
    },
    {
      id: 'address-info',
      label: 'Address Information',
      fields: [
        {
          prop: 'address.street'
        },
        {
          prop: 'address.city'
        }
      ]
    }
  ]
}
