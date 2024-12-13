import { MultiAccordion, Tabs } from '@axdspub/axiom-ui-utilities'
import React, { type ReactElement } from 'react'
import FormOutput from '@/Form/Manage/FormMappedOutput'
import FormConfigInput from '@/Form/Manage/FormConfigInput'
import FormMappingInput from '@/Form/Manage/FormMappingInput'
import Form from '@/Form/FormCreator'
import { useAtom } from 'jotai'
import formAtom from '@/state/formAtom'
import { RawFormOutput } from '@/Form/Manage/RawFormOutput'

type IDisplayType = 'stack' | 'tab'

const FormManager = (): ReactElement => {
  const [form] = useAtom(formAtom)
  const sections = [
    {
      id: 'config',
      label: 'Form config',
      content: <FormConfigInput />
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
      content: <RawFormOutput />
    }
  ]
  const params = Object.fromEntries(new URLSearchParams(window.location.search))
  const display: IDisplayType = params.display === 'stack' ? 'stack' : 'tab'
  return (
          <div className='flex flex-col h-full gap-4 p-20'>
               <div className='grid grid-cols-2 gap-8 flex-grow'>

               <Form form={form} />

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
