import { Button, SelectInput, Tabs } from '@axdspub/axiom-ui-utilities'
import { Cross2Icon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { type JSONSchema6 } from 'json-schema'
import React, { useState } from 'react'
import { type ReactElement } from 'react'
import openOil from '@/Form/testData/schemas/openOils-2025-04-11.json'
import { SchemaFormCreator } from '@/Form/Creator/FormCreator'
import { type IValueType, type IFormFieldOverride, type IFormValues, type IFormOverride } from '@/Form/Creator/FormCreatorTypes'
import JSONInputLoader from '@/Form/Components/Inputs/JSONInputLoader'
import { getSchemaPaths } from '@/utils/schemaToFormHelpers'

const schemaMap: Record<string, JSONSchema6> = {
  openOil: openOil as JSONSchema6
}

const formFieldOverridesInit: IFormFieldOverride[] = [
  {
    prop: 'geojson',
    type: 'geometry',
    settings: {
      drawEnabled: true,
      drawPolygonEnabled: false,
      drawPathEnabled: false,
      drawPointEnabled: true,
      showCoordinateInput: false
    }

  }
]

export const formOverridesInit: IFormOverride[] = [
  {
    wizard_steps: [
      {
        id: 'map',
        label: 'Map',
        description: 'Map step',
        fields: [
          {
            prop: 'geojson'
          }
        ]
      }
    ]
  }
]

const SchemaToFormPTT = (): ReactElement => {
  const [selectedSchema, setSelectedSchema] = useState<string | undefined>('openOil')
  const [controlsExpanded, setControlsExpanded] = useState(false)
  const formValueState = useState<IFormValues>({})
  const [formFieldOverrides, setFormFieldOverrides] = useState<IFormFieldOverride[][]>([formFieldOverridesInit.slice()])
  const [formOverrides, setFormOverrides] = useState<IFormOverride[]>([])
  const schema = selectedSchema !== undefined ? schemaMap[selectedSchema] : undefined
  const schemaPaths = schema !== undefined ? getSchemaPaths(schema) : undefined
  return <>
    <div className='h-full max-h-full overflow-auto bg-slate-100 flex flex-col'>
        <div className='h-20  z-50'>
            <Button
                onClick={() => { setControlsExpanded(!controlsExpanded) }}
                className='border-0 border-radius-0 float-right mt-4 mr-4'>
                    {
                controlsExpanded ? <Cross2Icon /> : <HamburgerMenuIcon />
                    }

            </Button>
        </div>
        <div className='h-full max-h-full overflow-auto bg-slate-100 flex flex-col pt-0 p-20'>
        {
            schema !== undefined
              ? <SchemaFormCreator schema={schema} formValueState={formValueState} formFieldOverrides={formFieldOverrides} formOverrides={formOverrides} />
              : <p>Pick a schema</p>
        }
        </div>

    </div>
    {
        controlsExpanded && <div className='fixed top-0 right-0 bottom-0 w-[75%] bg-slate-300 shadow-xl z-40 p-20'>
            <Tabs
                tabs={[
                  {
                    id: 'schema',
                    label: 'Schema selection',
                    content: <SelectInput id='schemaSelect' testId='schemaSelect'
                        label='Select a schema'
                        value={selectedSchema}
                        onChange={e => {
                          setSelectedSchema(e?.value !== undefined ? String(e.value) : undefined)
                        }}
                        options={[
                          { value: 'openOil', label: 'Open Oil' }
                        ]}
                        className='w-full'
                        />
                  },
                  {
                    id: 'form_values',
                    label: 'Form output',
                    content: <div className='text-xs h-full overflow-auto'>
                            <pre className='p-20 bg-slate-200 text-xs'>{JSON.stringify(formValueState[0], null, 2)}</pre>
                        </div>
                  },
                  {
                    id: 'fields_override',
                    label: 'Fields override',
                    content: <div className='text-xs h-full overflow-auto flex flex-row gap-7'>
                            <div className='h-full w-200 bg-white p-4 overflow-y-scroll whitespace-pre text-xs'>
                                {
                                    schemaPaths !== undefined
                                      ? schemaPaths.map(path => {
                                        return <p key={path}>{path}</p>
                                      })
                                      : <p>Loading...</p>
                                }
                                </div>
                            <div className='flex-grow h-full'>
                            <JSONInputLoader
                                field={{
                                  id: 'formFieldOverrides',
                                  label: 'Form field overrides',
                                  type: 'json'
                                }}
                                className='h-full'
                                value={formFieldOverrides as unknown as IValueType}
                                onChange={(e) => {
                                  if (Array.isArray(e)) {
                                    setFormFieldOverrides(e as unknown as IFormFieldOverride[][])
                                  } else if (e === undefined || e === null) {
                                    setFormFieldOverrides([])
                                  }
                                }}
                                />
                                </div>
                        </div>
                  },
                  {
                    id: 'form_override',
                    label: 'Form override',
                    content: <JSONInputLoader
                    field={{
                      id: 'formOverrides',
                      label: 'Form overrides',
                      type: 'json'
                    }}
                    className='h-full'
                    value={formOverrides as unknown as IValueType}
                    onChange={(e) => {
                      if (Array.isArray(e)) {
                        setFormOverrides(e as unknown as IFormOverride[])
                      } else if (e === undefined || e === null) {
                        setFormOverrides([])
                      }
                    }}
                    />
                  }
                ]}
            />
        </div>
    }

  </>
}

export default SchemaToFormPTT
