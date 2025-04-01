import { type IFormFieldOverride } from ***REMOVED***@/library***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***

export const schema: JSONSchema6 = {
  $schema: ***REMOVED***http://json-schema.org/draft-06/schema#***REMOVED***,
  title: ***REMOVED***Test Schema***REMOVED***,
  type: ***REMOVED***object***REMOVED***,
  properties: {
    name: {
      type: ***REMOVED***string***REMOVED***,
      title: ***REMOVED***Name***REMOVED***
    },
    age: {
      type: ***REMOVED***number***REMOVED***,
      title: ***REMOVED***Age***REMOVED***
    },
    email: {
      type: ***REMOVED***string***REMOVED***,
      format: ***REMOVED***email***REMOVED***,
      title: ***REMOVED***Email***REMOVED***
    },
    address: {
      type: ***REMOVED***object***REMOVED***,
      properties: {
        street: {
          type: ***REMOVED***string***REMOVED***,
          title: ***REMOVED***Street***REMOVED***
        },
        city: {
          type: ***REMOVED***string***REMOVED***,
          title: ***REMOVED***City***REMOVED***
        }
      }
    }
  }
}

export const fieldOverrides: IFormFieldOverride[] = [
  {
    prop: ***REMOVED***name***REMOVED***,
    label: ***REMOVED***Full Name***REMOVED***,
    description: ***REMOVED***Please enter your full name.***REMOVED***,
    required: true
  },
  {
    prop: ***REMOVED***address.street***REMOVED***,
    label: ***REMOVED***Street Address***REMOVED***,
    description: ***REMOVED***Please enter your street address.***REMOVED***
  }
]

export const fieldOverrides2: IFormFieldOverride[] = [
  {
    prop: ***REMOVED***name***REMOVED***,
    label: ***REMOVED***Just your name please***REMOVED***
  },
  {
    prop: ***REMOVED***address.street***REMOVED***,
    label: ***REMOVED***Street address where you live***REMOVED***
  }
]

export const formOverrides = {
  label: ***REMOVED***A little bit about yourself***REMOVED***,
  pages: [
    {
      id: ***REMOVED***personal-info***REMOVED***,
      label: ***REMOVED***Personal Information***REMOVED***,
      description: ***REMOVED***Please provide your personal information.***REMOVED***,
      fields: [
        {
          prop: ***REMOVED***name***REMOVED***
        },
        {
          prop: ***REMOVED***age***REMOVED***,
          constraints: {
            max: 120
          }
        },
        {
          prop: ***REMOVED***email***REMOVED***
        }
      ]
    },
    {
      id: ***REMOVED***address-info***REMOVED***,
      label: ***REMOVED***Address Information***REMOVED***,
      fields: [
        {
          prop: ***REMOVED***address.street***REMOVED***
        },
        {
          prop: ***REMOVED***address.city***REMOVED***
        }
      ]
    }
  ]
}
