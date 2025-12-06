"use client";
import FormCreator from '@/Form/Creator/FormCreator'
import { type IForm, type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import { assignDefaultValuesToFormValues } from '@/utils/manipulators'
import React, { type ReactElement, useState } from 'react'

const form: IForm = {
  label: 'Form with preset defaults',
  id: 'hasDefaults',
  description: 'This form has preset default values for the fields',
  fields: [
    {
      type: 'text',
      id: 'name',
      label: 'Name',
      defaultValue: 'John Doe'
    },
    {
      type: 'long_text',
      id: 'description',
      label: 'Description',
      defaultValue: 'This is a long string'
    },
    {
      type: 'text',
      id: 'mult',
      label: 'A list',
      defaultValue: ['First', 'Second', 'Third'],
      multiple: true
    },
    {
      type: 'number',
      id: 'num',
      label: 'A number',
      defaultValue: 10
    },
    {
      type: 'geometry',
      id: 'geom',
      label: 'A geometry',
      settings: {
        drawEnabled: true,
        drawPolygonEnabled: false,
        drawPathEnabled: false,
        drawPointEnabled: true,
        showCoordinateInput: false
      },
      defaultValue: {
        coordinates: [
          -120,
          34
        ],
        type: 'Point'
      }
    },
    {
      type: 'object',
      id: 'obj',
      label: 'Object Wrapper',
      fields: [
        {
          id: 'ob-wrap',
          type: 'object',
          layout: 'horizontal',
          skip_path: true,
          fields: [
            {
              id: 'val1',
              label: 'Value 1',
              type: 'text',
              defaultValue: 'Value 1 Default'
            },
            {
              id: 'val2',
              label: 'Value 2',
              type: 'number',
              defaultValue: 42
            }
          ]

        }
      ]

    }
  ]
}

const FormWithDefaults = (): ReactElement => {
  const formValueState = useState<IFormValues>(assignDefaultValuesToFormValues(form, {}))
  return (
    <div className='p-20 flex-col gap-10'>
        <FormCreator form={form} formValueState={formValueState} />
        <pre className='p-10 bg-slate-100 text-sm font-mono'>
            {JSON.stringify(formValueState[0], null, 2)}
        </pre>
    </div>
  )
}

export default FormWithDefaults
