import React, { type ReactElement } from 'react'
import { schema, fieldOverrides, fieldOverrides2, formOverrides } from '@/Form/testData/schemaWithOverrides'
import { SchemaFormCreator } from '@/Form/Creator/FormCreator'
import { type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import { Tabs } from '@axdspub/axiom-ui-utilities'
import { atom, useAtom } from 'jotai'
import { cloneObject } from '@/utils/manipulators'

const formValueAtom = atom<IFormValues>({})
const allFormOverrides = [cloneObject(formOverrides)]
const allFieldOverrides = [fieldOverrides, fieldOverrides2].map(d => cloneObject(d))

const Debug = (): ReactElement => {
  const allFormOverrides = [formOverrides]
  const allFieldOverrides = [fieldOverrides, fieldOverrides2]
  const [formValues] = useAtom(formValueAtom)
  return (
    <Tabs
              className='m-5'
              tabs={[
                {
                  id: 'schema',
                  label: 'Schema',
                  content: <pre className='p-5 bg-slate-200 text-xs'>{JSON.stringify(schema, null, 2)}</pre>
                },
                {
                  id: 'fieldOverrides',
                  label: 'Field Overrides',
                  content: <div className='flex flex-row gap-4 flex-justify-center'>
                    {
                    allFieldOverrides.map(o => {
                      return <pre key={JSON.stringify(o)} className='p-5 bg-slate-200 text-xs flex-grow flex-1'>{JSON.stringify(o, null, 2)}</pre>
                    })
                    }
                    </div>
                },
                {
                  id: 'formOverrides',
                  label: 'Form Overrides',
                  content: <div className='flex flex-row gap-4'>
                    {
                      allFormOverrides.map(o => {
                        return <pre key={JSON.stringify(o)} className='p-5 bg-slate-200 text-xs flex-grow'>{JSON.stringify(o, null, 2)}</pre>
                      })
                    }
                    </div>
                },
                {
                  id: 'formValues',
                  label: 'Form Values',
                  content: <pre className='p-5 bg-slate-200 text-xs'>{JSON.stringify(formValues, null, 2)}</pre>
                }

              ]}
            />
  )
}

const SchemaWithOverridesTest = (): ReactElement => {
  const [formValues, setFormValues] = useAtom(formValueAtom)

  return (
      <div className='flex flex-col'>
          <SchemaFormCreator
            schema={schema}
            formOverrides={allFormOverrides}
            formFieldOverrides={allFieldOverrides}
            formValueState={[formValues, setFormValues]}
            className='m-5 p-5 max-h-[500px] border-2 border-dashed border-slate-400 overflow-y-scroll bg-white'
            />

           <Debug />

        </div>

  )
}

export default SchemaWithOverridesTest
