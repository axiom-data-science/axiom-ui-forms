import { Button, SelectInput, Tabs } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { Cross2Icon, HamburgerMenuIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import React, { useState } from ***REMOVED***react***REMOVED***
import { type ReactElement } from ***REMOVED***react***REMOVED***
import openOil from ***REMOVED***@/Form/testData/schemas/openOils-2025-04-11.json***REMOVED***
import { SchemaFormCreator } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type IValueType, type IFormFieldOverride, type IFormValues, type IFormOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import JSONInputLoader from ***REMOVED***@/Form/Components/Inputs/JSONInputLoader***REMOVED***
import { getSchemaPaths } from ***REMOVED***@/utils/schemaToFormHelpers***REMOVED***

const schemaMap: Record<string, JSONSchema6> = {
  openOil: openOil as JSONSchema6
}

const formFieldOverridesInit: IFormFieldOverride[] = [
  {
    prop: ***REMOVED***geojson***REMOVED***,
    type: ***REMOVED***geometry***REMOVED***,
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
        id: ***REMOVED***map***REMOVED***,
        label: ***REMOVED***Map***REMOVED***,
        description: ***REMOVED***Map step***REMOVED***,
        fields: [
          {
            prop: ***REMOVED***geojson***REMOVED***
          }
        ]
      }
    ]
  }
]

const SchemaToFormPTT = (): ReactElement => {
  const [selectedSchema, setSelectedSchema] = useState<string | undefined>(***REMOVED***openOil***REMOVED***)
  const [controlsExpanded, setControlsExpanded] = useState(false)
  const formValueState = useState<IFormValues>({})
  const [formFieldOverrides, setFormFieldOverrides] = useState<IFormFieldOverride[][]>([formFieldOverridesInit.slice()])
  const [formOverrides, setFormOverrides] = useState<IFormOverride[]>([])
  const schema = selectedSchema !== undefined ? schemaMap[selectedSchema] : undefined
  const schemaPaths = schema !== undefined ? getSchemaPaths(schema) : undefined
  return <>
    <div className=***REMOVED***h-full max-h-full overflow-auto bg-slate-100 flex flex-col***REMOVED***>
        <div className=***REMOVED***h-20  z-50***REMOVED***>
            <Button
                onClick={() => { setControlsExpanded(!controlsExpanded) }}
                className=***REMOVED***border-0 border-radius-0 float-right mt-4 mr-4***REMOVED***>
                    {
                controlsExpanded ? <Cross2Icon /> : <HamburgerMenuIcon />
                    }

            </Button>
        </div>
        <div className=***REMOVED***h-full max-h-full overflow-auto bg-slate-100 flex flex-col pt-0 p-20***REMOVED***>
        {
            schema !== undefined
              ? <SchemaFormCreator schema={schema} formValueState={formValueState} formFieldOverrides={formFieldOverrides} formOverrides={formOverrides} />
              : <p>Pick a schema</p>
        }
        </div>

    </div>
    {
        controlsExpanded && <div className=***REMOVED***fixed top-0 right-0 bottom-0 w-[75%] bg-slate-300 shadow-xl z-40 p-20***REMOVED***>
            <Tabs
                tabs={[
                  {
                    id: ***REMOVED***schema***REMOVED***,
                    label: ***REMOVED***Schema selection***REMOVED***,
                    content: <SelectInput id=***REMOVED***schemaSelect***REMOVED*** testId=***REMOVED***schemaSelect***REMOVED***
                        label=***REMOVED***Select a schema***REMOVED***
                        value={selectedSchema}
                        onChange={e => {
                          setSelectedSchema(e?.value !== undefined ? String(e.value) : undefined)
                        }}
                        options={[
                          { value: ***REMOVED***openOil***REMOVED***, label: ***REMOVED***Open Oil***REMOVED*** }
                        ]}
                        className=***REMOVED***w-full***REMOVED***
                        />
                  },
                  {
                    id: ***REMOVED***form_values***REMOVED***,
                    label: ***REMOVED***Form output***REMOVED***,
                    content: <div className=***REMOVED***text-xs h-full overflow-auto***REMOVED***>
                            <pre className=***REMOVED***p-20 bg-slate-200 text-xs***REMOVED***>{JSON.stringify(formValueState[0], null, 2)}</pre>
                        </div>
                  },
                  {
                    id: ***REMOVED***fields_override***REMOVED***,
                    label: ***REMOVED***Fields override***REMOVED***,
                    content: <div className=***REMOVED***text-xs h-full overflow-auto flex flex-row gap-7***REMOVED***>
                            <div className=***REMOVED***h-full w-200 bg-white p-4 overflow-y-scroll whitespace-pre text-xs***REMOVED***>
                                {
                                    schemaPaths !== undefined
                                      ? schemaPaths.map(path => {
                                        return <p key={path}>{path}</p>
                                      })
                                      : <p>Loading...</p>
                                }
                                </div>
                            <div className=***REMOVED***grow h-full***REMOVED***>
                            <JSONInputLoader
                                field={{
                                  id: ***REMOVED***formFieldOverrides***REMOVED***,
                                  label: ***REMOVED***Form field overrides***REMOVED***,
                                  type: ***REMOVED***json***REMOVED***
                                }}
                                className=***REMOVED***h-full***REMOVED***
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
                    id: ***REMOVED***form_override***REMOVED***,
                    label: ***REMOVED***Form override***REMOVED***,
                    content: <JSONInputLoader
                    field={{
                      id: ***REMOVED***formOverrides***REMOVED***,
                      label: ***REMOVED***Form overrides***REMOVED***,
                      type: ***REMOVED***json***REMOVED***
                    }}
                    className=***REMOVED***h-full***REMOVED***
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
