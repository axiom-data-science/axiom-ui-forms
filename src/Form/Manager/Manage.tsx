import { MultiAccordion, Tabs } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'
import FormOutput from '@/Form/Manager/FormOutput'
import FormSchemaInput from '@/Form/Manager/FormSchemaInput'
import FormMappingInput from '@/Form/Manager/FormMappingInput'
import Form from '@/Form/Manager/Form'
import { useAtom } from 'jotai'
import formValuesAtom from '@/state/formValuesAtom'

type IDisplayType = 'stack' | 'tab'

const FormManager = (): ReactElement => {
  const [formValues] = useAtom(formValuesAtom)
  const sections = [
    {
      id: 'config',
      label: 'Form config',
      content: <FormSchemaInput />
    },
    {
      id: 'mapping',
      label: 'Form mapping',
      content: <FormMappingInput />
    },
    {
      id: 'output',
      label: 'Mapped Output',
      content: <FormOutput />
    },
    {
      id: 'raw_output',
      label: 'Raw Output',
      content: <pre>{JSON.stringify(formValues, null, 2)}</pre>
    }
  ]
  const params = Object.fromEntries(new URLSearchParams(window.location.search))
  const display: IDisplayType = params.display === 'stack' ? 'stack' : 'tab'
  return (
          <div className='flex flex-col h-full gap-4 p-20'>
               <div className='grid grid-cols-2 gap-8 flex-grow'>

               <Form />

                    <div className='flex flex-col gap-4'>
                      {
                        display !== 'tab'
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
