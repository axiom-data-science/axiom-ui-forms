import { type IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const oilFormOverride: IFormOverride = {
  id: ***REMOVED***oil***REMOVED***,
  label: ***REMOVED***Oil and Gas***REMOVED***,
  description: ***REMOVED***Oil and Gas Form***REMOVED***,
  wizard_steps: [
    {
      id: ***REMOVED***title***REMOVED***,
      label: ***REMOVED***Title***REMOVED***,
      description: ***REMOVED***Title of the form***REMOVED***,
      fields: [
        {
          prop: ***REMOVED***title***REMOVED***,
          label: ***REMOVED***Title***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          required: true,
          description: ***REMOVED***Title of your simulation***REMOVED***
        }
      ]
    }

  ]
}

export default oilFormOverride
