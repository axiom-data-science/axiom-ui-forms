import { IForm } from '@/Form/Creator/FormCreatorTypes'
import { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'
import { useState, type ReactElement } from 'react'

const form: IForm = {
  id: 'multiTabs',
  label: 'Test: Multiple Tabs',
  fields: [
    {
      id: 'field1',
      type: 'object',
      multiple: true,
      tabs: [
        {
          id: 'tab1',
          label: 'Tab 1',
          fields: [
            { id: 'field1-1', label: 'Field 1', type: 'text' },
            { id: 'field1-2', label: 'Field 2', type: 'text' },
          ],
        },
        {
          id: 'tab2',
          label: 'Tab 2',
          fields: [
            { id: 'field2-1', label: 'Field 2-1', type: 'text' },
            { id: 'field2-2', label: 'Field 2-2', type: 'text' },
            {
              id: 'field2-3',
              label: 'Field 2-3',
              type: 'object',
              multiple: true,
              tabs: [
                {
                  id: 'tab2-3-1',
                  label: 'Tab 2-3-1',
                  fields: [
                    { id: 'field2-3-1-1', label: 'Field 2-3-1-1', type: 'text' },
                    { id: 'field2-3-1-2', label: 'Field 2-3-1-2', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 'tab3',
          label: 'Tab 3',
          fields: [
            {
              id: 'field3-1',
              type: 'object',
              multiple: true,
              pages: [
                {
                  id: 'page3-1-1',
                  label: 'Page 3-1-1',
                  fields: [
                    { id: 'field3-1-1-1', label: 'Field 3-1-1-1', type: 'text' },
                    { id: 'field3-1-1-2', label: 'Field 3-1-1-2', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const MultiTabs = (): ReactElement => {
  const formState = useState<IForm | undefined>(form)

  return <FormWithEditorOverlay formState={formState} />
}

export default MultiTabs
