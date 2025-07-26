import { type IFormOverride } from '@/Form/Creator/FormCreatorTypes'

const formOverrides: IFormOverride = {

  label: 'Platform Metadata',
  description: 'Manage platform metadata',
  wizard_steps: [
    {
      id: 'base',
      label: 'Base',
      fields: [
        { prop: 'base' }
      ]
    },
    {
      id: 'meta',
      label: 'Meta',
      fields: [
        { prop: 'meta' }
      ]
    },
    {
      id: 'variables',
      label: 'Variables',
      fields: [
        { prop: 'variables' }
      ]
    }
  ]

}

export default formOverrides
