import React, { useContext, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { SchemaFormCreator } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { CopyButton } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***
import { FormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { CheckIcon, CopyIcon, Cross2Icon, DragHandleDots2Icon, Pencil2Icon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { type IFormOverride, type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Tabs, Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { JSONInput } from ***REMOVED***@/Form/Components/Inputs***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import rootFieldAtom from ***REMOVED***@/PTT/rootFieldAtom***REMOVED***
import layoutAtom from ***REMOVED***@/utils/responsive/layoutState***REMOVED***

const Footer = (): ReactElement => {
  const { formValues } = useContext(FormContext)
  return (
        <div className=***REMOVED***p-20***REMOVED***>
        <CopyButton
            string={JSON.stringify(formValues, null, 2)}
            OnCopiedElement={<><CheckIcon className=***REMOVED*** inline***REMOVED*** /> Copied to clipboard</>}
            ToCopyElement={<><CopyIcon className=***REMOVED*** inline***REMOVED*** /> Copy form output</>}
        />
        </div>

  )
}

const PTTForm = ({
  label,
  schema,
  formOverride,
  fieldOverrides
}: {
  label: string
  schema: JSONSchema6
  formOverride: IFormOverride
  fieldOverrides: IFormFieldOverride[]
}): ReactElement => {
  const [editing, setEditing] = useState<boolean>(false)
  const [schemaInput, setSchemaInput] = useState<JSONSchema6 | undefined>(schema)
  const [fieldOverridesInput, setFieldOverridesInput] = useState(fieldOverrides)
  const [rootFieldOverridesInput, setRootFieldOverridesInput] = useAtom(rootFieldAtom)
  const [formOverrideInput, setFormOverrideInput] = useState<IFormOverride | undefined>(formOverride)
  const [sidebarWidth, setSidebarWidth] = useState<number>(600)
  const [layout] = useAtom(layoutAtom)

  return (
    <div className={`${layout.size === ***REMOVED***sm***REMOVED*** || layout.size === ***REMOVED***md***REMOVED*** ? ***REMOVED***m-4***REMOVED*** : ***REMOVED***m-10 mt-4***REMOVED***} relative`}>
      {
            schemaInput !== undefined
              ? <SchemaFormCreator
              id=***REMOVED***ptt-form***REMOVED***
              label={label}
              schema={schemaInput}
              formOverrides={formOverrideInput !== undefined ? [formOverrideInput] : undefined}
              formFieldOverrides={[rootFieldOverridesInput, fieldOverridesInput]}
              footer={
                  <Footer />
              }
          />
              : ***REMOVED***No schema provided***REMOVED***
            }
            <>
            {

                  !editing
                    ? <Tooltip
                      content=***REMOVED***Edit schema and field overrides***REMOVED***
                      side=***REMOVED***left***REMOVED***
                      className=***REMOVED***bg-white text-black p-2 rounded-md absolute top-0 right-0***REMOVED***
                      ><Pencil2Icon className=***REMOVED***cursor-pointer w-6 h-6***REMOVED*** onClick={() => {
                        setEditing(true)
                      }} /></Tooltip>
                    : ***REMOVED******REMOVED***

            }
            {
              !editing
                ? ***REMOVED******REMOVED***
                : <div
                    className=***REMOVED***fixed bottom-0 right-0 h-full bg-white shadow-2xl z-50  flex flex-row***REMOVED***
                    style={{ width: `${sidebarWidth}px` }}
                  >
                  <Cross2Icon className=***REMOVED***cursor-pointer w-6 h-6 absolute top-4 left-4***REMOVED*** onClick={() => {
                    setEditing(false)
                  }} />
                    <div className=***REMOVED***w-[10px] cursor-ew-resize h-full bg-slate-100 px-1 shadow-md flex flex-col items-center justify-center***REMOVED***
                              onMouseDown={(e) => {
                                const startX = e.clientX
                                const startWidth = sidebarWidth

                                const onMouseMove = (event: MouseEvent): void => {
                                  const newWidth = Math.max(200, startWidth - (event.clientX - startX))
                                  setSidebarWidth(newWidth)
                                  document.body.classList.add(***REMOVED***cursor-ew-resize***REMOVED***)
                                  document.body.classList.add(***REMOVED***select-none***REMOVED***)
                                  event.preventDefault() // Prevent text selection
                                  event.stopPropagation()
                                }

                                const onMouseUp = (): void => {
                                  document.removeEventListener(***REMOVED***mousemove***REMOVED***, onMouseMove)
                                  document.removeEventListener(***REMOVED***mouseup***REMOVED***, onMouseUp)
                                  document.body.classList.remove(***REMOVED***cursor-ew-resize***REMOVED***)
                                  document.body.classList.remove(***REMOVED***select-none***REMOVED***)
                                }

                                document.addEventListener(***REMOVED***mousemove***REMOVED***, onMouseMove)
                                document.addEventListener(***REMOVED***mouseup***REMOVED***, onMouseUp)
                              }}
                              >
                              <DragHandleDots2Icon />
                              <DragHandleDots2Icon className=***REMOVED***-mt-1***REMOVED*** />
                              <DragHandleDots2Icon className=***REMOVED***-mt-1***REMOVED*** />
                    </div>
              <Tabs
                className=***REMOVED***flex flex-col h-full p-8 flex-grow***REMOVED***
                defaultContentClassName=***REMOVED***h-full overflow-auto p-4***REMOVED***
                tabs={[
                  {
                    id: ***REMOVED***scenarioFormOverride***REMOVED***,
                    label: ***REMOVED***Scenario: Form Override***REMOVED***,
                    content: <JSONInput
                    value={formOverrideInput !== undefined ? JSON.stringify(formOverrideInput, null, 2) : ***REMOVED******REMOVED***}
                    onChange={(e) => {
                      setFormOverrideInput(e !== undefined ? e as unknown as IFormOverride : undefined)
                    } }
                    field={{
                      id: ***REMOVED***formOverrideInput***REMOVED***,
                      label: ***REMOVED******REMOVED***,
                      type: ***REMOVED***json***REMOVED***
                    }}
                    />
                  },
                  {
                    id: ***REMOVED***scenarioFieldOverrides***REMOVED***,
                    label: ***REMOVED***Scenario: Field Overrides***REMOVED***,
                    content: <JSONInput
                    value={fieldOverridesInput !== undefined ? JSON.stringify(fieldOverridesInput, null, 2) : ***REMOVED******REMOVED***}
                    onChange={(e) => {
                      setFieldOverridesInput(e !== undefined ? e as unknown as IFormFieldOverride[] : [])
                    } }
                    field={{
                      id: ***REMOVED***fieldOverridesInput***REMOVED***,
                      label: ***REMOVED******REMOVED***,
                      type: ***REMOVED***json***REMOVED***
                    }}
                    />
                  },
                  {
                    id: ***REMOVED***schema***REMOVED***,
                    label: ***REMOVED***Scenario: Schema***REMOVED***,
                    content: <JSONInput
                    value={schemaInput !== undefined ? JSON.stringify(schemaInput, null, 2) : ***REMOVED******REMOVED***}
                    onChange={(e) => {
                      setSchemaInput(e !== undefined ? e as JSONSchema6 : undefined)
                    } }
                    field={{
                      id: ***REMOVED***schemaInput***REMOVED***,
                      label: ***REMOVED******REMOVED***,
                      type: ***REMOVED***json***REMOVED***
                    }}
                    />
                  },
                  {
                    id: ***REMOVED***rootFieldOverrides***REMOVED***,
                    label: ***REMOVED***Root: Field Overrides***REMOVED***,
                    content: <JSONInput
                    value={rootFieldOverridesInput !== undefined ? JSON.stringify(rootFieldOverridesInput, null, 2) : ***REMOVED******REMOVED***}
                    onChange={(e) => {
                      setRootFieldOverridesInput(e !== undefined ? e as unknown as IFormFieldOverride[] : [])
                    } }
                    field={{
                      id: ***REMOVED***rootFieldOverridesInput***REMOVED***,
                      label: ***REMOVED******REMOVED***,
                      type: ***REMOVED***json***REMOVED***
                    }}
                    />
                  }

                ]}
                />
                </div>
        }
      </>
      </div>

  )
}

export default PTTForm
