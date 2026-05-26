import { IForm } from '@/Form/Creator/FormCreatorTypes'
import { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'
import { ReactElement, useState } from 'react'

const form: IForm = {
  id: 'objectWrapper',
  label: 'Object wrapper test',
  fields: [
    {
      id: 'wrapper',
      label: 'Wrapper object',
      type: 'objectWrapper',
      fields: [
        {
          id: 'field1',
          label: 'Field 1',
          type: 'text',
        },
        {
          id: 'field2',
          label: 'Field 2',
          type: 'text',
        },
      ],
    },
  ],
}

const ObjectWrapper = (): ReactElement => {
  const formState = useState<IForm | undefined>(form)

  return <FormWithEditorOverlay formState={formState} />
}
