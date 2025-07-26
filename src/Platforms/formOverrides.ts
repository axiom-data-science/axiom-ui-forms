import { type IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

const formOverrides: IFormOverride = {

  label: ***REMOVED***Platform Metadata***REMOVED***,
  description: ***REMOVED***Manage platform metadata***REMOVED***,
  wizard_steps: [
    {
      id: ***REMOVED***base***REMOVED***,
      label: ***REMOVED***Base***REMOVED***,
      fields: [
        { prop: ***REMOVED***base***REMOVED*** }
      ]
    },
    {
      id: ***REMOVED***meta***REMOVED***,
      label: ***REMOVED***Meta***REMOVED***,
      fields: [
        { prop: ***REMOVED***meta***REMOVED*** }
      ]
    },
    {
      id: ***REMOVED***variables***REMOVED***,
      label: ***REMOVED***Variables***REMOVED***,
      fields: [
        { prop: ***REMOVED***variables***REMOVED*** }
      ]
    }
  ]

}

export default formOverrides
