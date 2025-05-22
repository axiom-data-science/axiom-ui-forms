import { type IFormOverride } from '@/Form/Creator/FormCreatorTypes'

const oilFormOverride: IFormOverride = {
  id: 'oil',
  label: 'Oil and Gas',
  description: 'Oil and Gas Form',
  wizard_steps: [
    {
      id: 'title',
      label: 'Title',
      description: 'Title of the form',
      fields: [
        {
          prop: 'title',
          label: 'Title',
          type: 'text',
          required: true,
          description: 'Title of your simulation'
        }
      ]
    }

  ]
}

export default oilFormOverride
