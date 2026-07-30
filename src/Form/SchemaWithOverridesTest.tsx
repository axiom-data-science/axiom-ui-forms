import React, { type ReactElement } from ***REMOVED***react***REMOVED***
import { schema, fieldOverrides, fieldOverrides2, formOverrides } from ***REMOVED***@/Form/testData/schemaWithOverrides***REMOVED***
import { SchemaFormCreator } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Tabs } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { atom, useAtom } from ***REMOVED***jotai***REMOVED***
import { cloneObject } from ***REMOVED***@/utils/manipulators***REMOVED***

const formValueAtom = atom<IFormValues>({})
const allFormOverrides = [cloneObject(formOverrides)]
const allFieldOverrides = [fieldOverrides, fieldOverrides2].map(d => cloneObject(d))

const Debug = (): ReactElement => {
  const allFormOverrides = [formOverrides]
  const allFieldOverrides = [fieldOverrides, fieldOverrides2]
  const [formValues] = useAtom(formValueAtom)
  return (
    <Tabs
              className=***REMOVED***m-5***REMOVED***
              tabs={[
                {
                  id: ***REMOVED***schema***REMOVED***,
                  label: ***REMOVED***Schema***REMOVED***,
                  content: <pre className=***REMOVED***p-5 bg-slate-200 text-xs***REMOVED***>{JSON.stringify(schema, null, 2)}</pre>
                },
                {
                  id: ***REMOVED***fieldOverrides***REMOVED***,
                  label: ***REMOVED***Field Overrides***REMOVED***,
                  content: <div className=***REMOVED***flex flex-row gap-4 flex-justify-center***REMOVED***>
                    {
                    allFieldOverrides.map(o => {
                      return <pre key={JSON.stringify(o)} className=***REMOVED***p-5 bg-slate-200 text-xs grow flex-1***REMOVED***>{JSON.stringify(o, null, 2)}</pre>
                    })
                    }
                    </div>
                },
                {
                  id: ***REMOVED***formOverrides***REMOVED***,
                  label: ***REMOVED***Form Overrides***REMOVED***,
                  content: <div className=***REMOVED***flex flex-row gap-4***REMOVED***>
                    {
                      allFormOverrides.map(o => {
                        return <pre key={JSON.stringify(o)} className=***REMOVED***p-5 bg-slate-200 text-xs grow***REMOVED***>{JSON.stringify(o, null, 2)}</pre>
                      })
                    }
                    </div>
                },
                {
                  id: ***REMOVED***formValues***REMOVED***,
                  label: ***REMOVED***Form Values***REMOVED***,
                  content: <pre className=***REMOVED***p-5 bg-slate-200 text-xs***REMOVED***>{JSON.stringify(formValues, null, 2)}</pre>
                }

              ]}
            />
  )
}

const SchemaWithOverridesTest = (): ReactElement => {
  const [formValues, setFormValues] = useAtom(formValueAtom)

  return (
      <div className=***REMOVED***flex flex-col***REMOVED***>
          <SchemaFormCreator
            schema={schema}
            formOverrides={allFormOverrides}
            formFieldOverrides={allFieldOverrides}
            formValueState={[formValues, setFormValues]}
            className=***REMOVED***m-5 p-5 max-h-125 border-2 border-dashed border-slate-400 overflow-y-scroll bg-white***REMOVED***
            />

           <Debug />

        </div>

  )
}

export default SchemaWithOverridesTest
