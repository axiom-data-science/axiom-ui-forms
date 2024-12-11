import { MultiAccordion, Tabs } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import FormOutput from ***REMOVED***@/Form/Manager/FormOutput***REMOVED***
import FormSchemaInput from ***REMOVED***@/Form/Manager/FormSchemaInput***REMOVED***
import FormMappingInput from ***REMOVED***@/Form/Manager/FormMappingInput***REMOVED***
import Form from ***REMOVED***@/Form/Manager/Form***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***

type IDisplayType = ***REMOVED***stack***REMOVED*** | ***REMOVED***tab***REMOVED***

const FormManager = (): ReactElement => {
  const [formValues] = useAtom(formValuesAtom)
  const sections = [
    {
      id: ***REMOVED***config***REMOVED***,
      label: ***REMOVED***Form config***REMOVED***,
      content: <FormSchemaInput />
    },
    {
      id: ***REMOVED***mapping***REMOVED***,
      label: ***REMOVED***Form mapping***REMOVED***,
      content: <FormMappingInput />
    },
    {
      id: ***REMOVED***output***REMOVED***,
      label: ***REMOVED***Mapped Output***REMOVED***,
      content: <FormOutput />
    },
    {
      id: ***REMOVED***raw_output***REMOVED***,
      label: ***REMOVED***Raw Output***REMOVED***,
      content: <pre>{JSON.stringify(formValues, null, 2)}</pre>
    }
  ]
  const params = Object.fromEntries(new URLSearchParams(window.location.search))
  const display: IDisplayType = params.display === ***REMOVED***stack***REMOVED*** ? ***REMOVED***stack***REMOVED*** : ***REMOVED***tab***REMOVED***
  return (
          <div className=***REMOVED***flex flex-col h-full gap-4 p-20***REMOVED***>
               <div className=***REMOVED***grid grid-cols-2 gap-8 flex-grow***REMOVED***>

               <Form />

                    <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
                      {
                        display !== ***REMOVED***tab***REMOVED***
                          ? <MultiAccordion tabs={sections} />
                          : <Tabs
                              tabs={sections}
                         />
                      }

                    </div>
               </div>
          </div>
  )
}

export default FormManager
