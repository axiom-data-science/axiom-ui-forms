import { IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { FormWithEditorOverlay } from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const form: IForm = {
  id: ***REMOVED***multiTabs***REMOVED***,
  label: ***REMOVED***Test: Multiple Tabs***REMOVED***,
  fields: [
    {
      id: ***REMOVED***field1***REMOVED***,
      type: ***REMOVED***object***REMOVED***,
      multiple: true,
      tabs: [
        {
          id: ***REMOVED***tab1***REMOVED***,
          label: ***REMOVED***Tab 1***REMOVED***,
          fields: [
            { id: ***REMOVED***field1-1***REMOVED***, label: ***REMOVED***Field 1***REMOVED***, type: ***REMOVED***text***REMOVED*** },
            { id: ***REMOVED***field1-2***REMOVED***, label: ***REMOVED***Field 2***REMOVED***, type: ***REMOVED***text***REMOVED*** },
          ],
        },
        {
          id: ***REMOVED***tab2***REMOVED***,
          label: ***REMOVED***Tab 2***REMOVED***,
          fields: [
            { id: ***REMOVED***field2-1***REMOVED***, label: ***REMOVED***Field 2-1***REMOVED***, type: ***REMOVED***text***REMOVED*** },
            { id: ***REMOVED***field2-2***REMOVED***, label: ***REMOVED***Field 2-2***REMOVED***, type: ***REMOVED***text***REMOVED*** },
            {
              id: ***REMOVED***field2-3***REMOVED***,
              label: ***REMOVED***Field 2-3***REMOVED***,
              type: ***REMOVED***object***REMOVED***,
              multiple: true,
              tabs: [
                {
                  id: ***REMOVED***tab2-3-1***REMOVED***,
                  label: ***REMOVED***Tab 2-3-1***REMOVED***,
                  fields: [
                    { id: ***REMOVED***field2-3-1-1***REMOVED***, label: ***REMOVED***Field 2-3-1-1***REMOVED***, type: ***REMOVED***text***REMOVED*** },
                    { id: ***REMOVED***field2-3-1-2***REMOVED***, label: ***REMOVED***Field 2-3-1-2***REMOVED***, type: ***REMOVED***text***REMOVED*** },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: ***REMOVED***tab3***REMOVED***,
          label: ***REMOVED***Tab 3***REMOVED***,
          fields: [
            {
              id: ***REMOVED***field3-1***REMOVED***,
              type: ***REMOVED***object***REMOVED***,
              multiple: true,
              pages: [
                {
                  id: ***REMOVED***page3-1-1***REMOVED***,
                  label: ***REMOVED***Page 3-1-1***REMOVED***,
                  fields: [
                    { id: ***REMOVED***field3-1-1-1***REMOVED***, label: ***REMOVED***Field 3-1-1-1***REMOVED***, type: ***REMOVED***text***REMOVED*** },
                    { id: ***REMOVED***field3-1-1-2***REMOVED***, label: ***REMOVED***Field 3-1-1-2***REMOVED***, type: ***REMOVED***text***REMOVED*** },
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
