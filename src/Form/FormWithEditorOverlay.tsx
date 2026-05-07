import React, { type ReactNode, useContext, useState, type ReactElement, useEffect } from ***REMOVED***react***REMOVED***
import FormCreator, { IFormCreatorProps, SchemaFormCreator } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { CopyButton } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***
import { FormContext, IFormContextValue, useFormContext, useFormValues } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { CheckIcon, CopyIcon, Cross2Icon, DragHandleDots2Icon, Pencil2Icon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { type IFormOverride, type IFormFieldOverride, type IFieldInputProps, type IForm, type IFormValueState, IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { Tabs, Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { JSONInput } from ***REMOVED***@/Form/Components/Inputs***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import layoutAtom from ***REMOVED***@/utils/responsive/layoutState***REMOVED***
import { ObjectToSchemaButton } from ***REMOVED***@/Form/Creator/ObjectToSchema***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { getFormPayload } from ***REMOVED***@/utils/getters***REMOVED***
import { overridesAndSchemaToFormObject, schemaToFormObject } from ***REMOVED***@/utils/schemaToFormHelpers***REMOVED***

const Footer = ({ formValues, form }: { formValues?: IFormValues, form?: IForm }): ReactElement => {
  const payload = form && formValues ? getFormPayload(formValues, form) : formValues ?? {}
  return (
    <div className=***REMOVED***py-20***REMOVED***>
      <CopyButton
        string={JSON.stringify(payload, null, 2)}
        OnCopiedElement={<><CheckIcon className=***REMOVED*** inline***REMOVED*** /> Copied to clipboard</>}
        ToCopyElement={<><CopyIcon className=***REMOVED*** inline***REMOVED*** /> Copy form output</>}
      />
    </div>
  )
}

const fixOverLayWidth = (width: number): number => {
  const maxWidth = window.innerWidth - (window.innerWidth * 0.05) // 5% of the window width
  return Math.max(
    300,
    Math.min(width, maxWidth)
  )
}

const FormOutput = ({ form }: { form: IForm }): ReactElement => {
  const formValues = useFormValues()
  const [formOutput, setFormOutput] = useState<string>(JSON.stringify(getFormPayload(formValues, form), null, 2))
  useEffect(() => {
    setFormOutput(JSON.stringify(getFormPayload(formValues, form), null, 2))
  }, [formValues, form])
  return (
    <pre className=***REMOVED***h-full whitespace-pre-wrap overflow-auto p-4 bg-slate-100 text-xs***REMOVED***>
      {formOutput}
    </pre>
  )
}

const FormEditor = ({
  children
}: {
  children: ReactNode
}): ReactElement => {
  const [editing, setEditing] = useState<boolean>(false)
  const [sidebarWidth, setSidebarWidth] = useState<number>(Math.max(300, window.innerWidth * 0.4))

  return <>
    {

      !editing
        ? <Tooltip
          content=***REMOVED***Edit schema and field overrides***REMOVED***
          side=***REMOVED***left***REMOVED***
          className=***REMOVED***bg-white bg-opacity-50 hover:bg-opacity-100 text-black p-2 rounded-md top-20 right-10 fixed z-10 shadow-lg***REMOVED***
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
          style={{ width: `${fixOverLayWidth(sidebarWidth)}px` }}
        >
          <Cross2Icon className=***REMOVED***cursor-pointer w-6 h-6 absolute top-4 left-8***REMOVED*** onClick={() => {
            setEditing(false)
          }} />
          <div className=***REMOVED***w-4 cursor-ew-resize h-full bg-slate-100 px-1 shadow-md flex flex-col items-center justify-center***REMOVED***
            onMouseDown={(e) => {
              const startX = e.clientX
              const startWidth = sidebarWidth

              const onMouseMove = (event: MouseEvent): void => {
                const newWidth = startWidth - (event.clientX - startX)
                setSidebarWidth(fixOverLayWidth(newWidth))
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
          {children}
        </div>
    }
  </>
}

export const FormWithEditorOverlay = ({
  formState,
  formValueState
}: {
  formState: [IForm | undefined, (form: IForm | undefined) => void]
  formValueState?: IFormValueState
}): ReactElement => {
  const [formInput, setFormInput] = formState ?? useState<IForm | undefined>(undefined)
  const [layout] = useAtom(layoutAtom)
  const [formValues, setFormValues] = formValueState ?? useAtom(formValuesAtom)

  return (
    <>
      <div className={`${layout.size === ***REMOVED***sm***REMOVED*** || layout.size === ***REMOVED***md***REMOVED*** ? ***REMOVED***m-4***REMOVED*** : ***REMOVED***m-10 mt-4***REMOVED***} relative`}>
        {
          formInput !== undefined
            ? <FormCreator
              form={formInput}
              formValueState={[formValues, setFormValues]}
              Footer={Footer}
              Header={
                <FormEditor>
                  <Tabs
                    className=***REMOVED***flex flex-col h-full p-8 grow***REMOVED***
                    defaultContentClassName=***REMOVED***h-full overflow-auto p-4***REMOVED***
                    tabs={[
                      {
                        id: ***REMOVED***form-override***REMOVED***,
                        label: ***REMOVED***Form Override***REMOVED***,
                        content: <JSONInput
                          value={formInput !== undefined ? JSON.stringify(formInput, null, 2) : ***REMOVED******REMOVED***}
                          onChange={(e) => {
                            setFormInput(e !== undefined ? e as unknown as IForm : undefined)
                          }}
                          field={{
                            id: ***REMOVED***formInput***REMOVED***,
                            label: ***REMOVED******REMOVED***,
                            type: ***REMOVED***json***REMOVED***
                          }}
                        />
                      },
                      {
                        id: ***REMOVED***form-output***REMOVED***,
                        label: ***REMOVED***Form output***REMOVED***,
                        content: <FormOutput form={formInput} />
                      }

                    ].filter(t => t !== undefined)}
                  />
                </FormEditor>
              }
            />
            : ***REMOVED***No form config provided***REMOVED***
        }
      </div>
    </>

  )
}

const SchemaFormWithEditorOverlay = ({
  label,
  schemaState,
  formOverrideState,
  rootFieldOverrideState,
  fieldOverrideState,
  inputOverrides,
  ...props
}: {
  label: string
  schemaState?: [JSONSchema6 | undefined, (schema: JSONSchema6 | undefined) => void]
  formOverrideState?: [IFormOverride | undefined, (override: IFormOverride | undefined) => void]
  fieldOverrideState?: [IFormFieldOverride[], (overrides: IFormFieldOverride[]) => void]
  rootFieldOverrideState?: [IFormFieldOverride[], (overrides: IFormFieldOverride[]) => void]
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
} & Omit<IFormCreatorProps, ***REMOVED***Header***REMOVED*** | ***REMOVED***Footer***REMOVED*** | ***REMOVED***form***REMOVED***>): ReactElement => {
  const [schemaInput, setSchemaInput] = schemaState ?? useState<JSONSchema6 | undefined>(undefined)
  const [rootFieldOverridesInput, setRootFieldOverridesInput] = rootFieldOverrideState ?? []
  const [fieldOverridesInput, setFieldOverridesInput] = fieldOverrideState ?? useState<IFormFieldOverride[]>([])
  const [formOverrideInput, setFormOverrideInput] = formOverrideState ?? useState<IFormOverride | undefined>(undefined)
  const [layout] = useAtom(layoutAtom)

  const formOverrides = formOverrideInput !== undefined ? [formOverrideInput] : undefined
  const formFieldOverrides = [rootFieldOverridesInput, fieldOverridesInput].filter(o => o !== undefined)

  return (

    <div className={`${layout.size === ***REMOVED***sm***REMOVED*** || layout.size === ***REMOVED***md***REMOVED*** ? ***REMOVED***m-4***REMOVED*** : ***REMOVED***m-10 mt-4***REMOVED***} relative`}>
      {
        schemaInput !== undefined
          ? <SchemaFormCreator
            {...props}
            id={schemaState?.[0]?.$id ?? ***REMOVED***default***REMOVED***}
            label={label}
            inputOverrides={inputOverrides}
            schema={schemaInput}
            formOverrides={formOverrides}
            formFieldOverrides={formFieldOverrides}
            Footer={Footer}
            Header={<FormEditor>
              <>
                <ObjectToSchemaButton
                  size=***REMOVED***xs***REMOVED***
                  className=***REMOVED***top-2 right-2 absolute***REMOVED***
                  onUpdate={(newSchema: JSONSchema6 | undefined) => {
                    setSchemaInput(newSchema)
                  }}
                />

                <Tabs
                  className=***REMOVED***flex flex-col h-full p-8 grow***REMOVED***
                  defaultContentClassName=***REMOVED***h-full overflow-auto p-4***REMOVED***
                  tabs={[
                    {
                      id: ***REMOVED***scenarioFormOverride***REMOVED***,
                      label: ***REMOVED***Scenario: Form Override***REMOVED***,
                      content: <JSONInput
                        value={formOverrideInput !== undefined ? JSON.stringify(formOverrideInput, null, 2) : ***REMOVED******REMOVED***}
                        onChange={(e) => {
                          setFormOverrideInput(e !== undefined ? e as unknown as IFormOverride : undefined)
                        }}
                        field={{
                          id: ***REMOVED***formOverrideInput***REMOVED***,
                          label: ***REMOVED******REMOVED***,
                          type: ***REMOVED***json***REMOVED***
                        }}
                      />
                    },
                    setFieldOverridesInput !== undefined
                      ? {
                        id: ***REMOVED***scenarioFieldOverrides***REMOVED***,
                        label: ***REMOVED***Scenario: Field Overrides***REMOVED***,
                        content: <JSONInput
                          value={fieldOverridesInput !== undefined ? JSON.stringify(fieldOverridesInput, null, 2) : ***REMOVED******REMOVED***}
                          onChange={(e) => {
                            setFieldOverridesInput(e !== undefined ? e as unknown as IFormFieldOverride[] : [])
                          }}
                          field={{
                            id: ***REMOVED***fieldOverridesInput***REMOVED***,
                            label: ***REMOVED******REMOVED***,
                            type: ***REMOVED***json***REMOVED***
                          }}
                        />
                      }
                      : undefined,
                    setSchemaInput !== undefined
                      ? {
                        id: ***REMOVED***schema***REMOVED***,
                        label: ***REMOVED***Scenario: Schema***REMOVED***,
                        content: <JSONInput
                          value={schemaInput !== undefined ? JSON.stringify(schemaInput, null, 2) : ***REMOVED******REMOVED***}
                          onChange={(e) => {
                            setSchemaInput(e !== undefined ? e as JSONSchema6 : undefined)
                          }}
                          field={{
                            id: ***REMOVED***schemaInput***REMOVED***,
                            label: ***REMOVED******REMOVED***,
                            type: ***REMOVED***json***REMOVED***
                          }}
                        />
                      }
                      : undefined,
                    setRootFieldOverridesInput !== undefined
                      ? {
                        id: ***REMOVED***rootFieldOverrides***REMOVED***,
                        label: ***REMOVED***Root: Field Overrides***REMOVED***,
                        content: <JSONInput
                          value={rootFieldOverridesInput !== undefined ? JSON.stringify(rootFieldOverridesInput, null, 2) : ***REMOVED******REMOVED***}
                          onChange={(e) => {
                            setRootFieldOverridesInput(e !== undefined ? e as unknown as IFormFieldOverride[] : [])
                          }}
                          field={{
                            id: ***REMOVED***rootFieldOverridesInput***REMOVED***,
                            label: ***REMOVED******REMOVED***,
                            type: ***REMOVED***json***REMOVED***
                          }}
                        />
                      }
                      : undefined,
                    {
                      id: ***REMOVED***form-output***REMOVED***,
                      label: ***REMOVED***Form output***REMOVED***,
                      content: <FormOutput form={formOverrides === undefined && formFieldOverrides === undefined
                          ? schemaToFormObject(schemaInput)
                          : overridesAndSchemaToFormObject({
                            formOverrides,
                            formFieldOverrides,
                            schema: schemaInput
                          }) } />
                    }

                  ].filter(t => t !== undefined)}
                />
              </>
            </FormEditor>}
          />
          : ***REMOVED******REMOVED***
      }
    </div>

  )
}

export default SchemaFormWithEditorOverlay
