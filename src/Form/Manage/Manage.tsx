import { MultiAccordion, Tabs } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import FormOutput from ***REMOVED***@/Form/Manage/FormMappedOutput***REMOVED***
import FormConfigInput from ***REMOVED***@/Form/Manage/FormConfigInput***REMOVED***
import FormMappingInput from ***REMOVED***@/Form/Manage/FormMappingInput***REMOVED***
import Form from ***REMOVED***@/Form/FormCreator***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import formAtom from ***REMOVED***@/state/formAtom***REMOVED***
import { RawFormOutput } from ***REMOVED***@/Form/Manage/RawFormOutput***REMOVED***

type IDisplayType = ***REMOVED***stack***REMOVED*** | ***REMOVED***tab***REMOVED***

const FormManager = (): ReactElement => {
  const [form] = useAtom(formAtom)
  const sections = [
    {
      id: ***REMOVED***config***REMOVED***,
      label: ***REMOVED***Form config***REMOVED***,
      content: <FormConfigInput />
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
      content: <RawFormOutput />
    }
  ]
  const params = Object.fromEntries(new URLSearchParams(window.location.search))
  const display: IDisplayType = params.display === ***REMOVED***stack***REMOVED*** ? ***REMOVED***stack***REMOVED*** : ***REMOVED***tab***REMOVED***
  return (
          <div className=***REMOVED***flex flex-col h-full gap-4 p-20***REMOVED***>
               <div className=***REMOVED***grid grid-cols-2 gap-8 flex-grow***REMOVED***>

               <Form form={form} />

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
