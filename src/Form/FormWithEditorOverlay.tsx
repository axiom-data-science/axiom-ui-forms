import React, { type ReactNode, useContext, useState, type ReactElement, useEffect } from 'react'
import FormCreator, { IFormCreatorProps, SchemaFormCreator } from '@/Form/Creator/FormCreator'
import { type JSONSchema6 } from 'json-schema'
import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'
import { FormContext, IFormContextValue, useFormContext } from '@/Form/Creator/FormContextProvider'
import { CheckIcon, CopyIcon, Cross2Icon, DragHandleDots2Icon, Pencil2Icon } from '@radix-ui/react-icons'
import { type IFormOverride, type IFormFieldOverride, type IFieldInputProps, type IForm, type IFormValueState, IFormValues } from '@/Form/Creator/FormCreatorTypes'
import { Tabs, Tooltip } from '@axdspub/axiom-ui-utilities'
import { JSONInput } from '@/Form/Components/Inputs'
import { useAtom } from 'jotai'
import layoutAtom from '@/utils/responsive/layoutState'
import { ObjectToSchemaButton } from '@/Form/Creator/ObjectToSchema'
import formValuesAtom from '@/state/formValuesAtom'
import { getFormPayload } from '@/utils/getters'
import { overridesAndSchemaToFormObject, schemaToFormObject } from '@/utils/schemaToFormHelpers'

const Footer = ({ formValues }: { formValues?: IFormValues }): ReactElement => {
  return (
    <div className='py-20'>
      <CopyButton
        string={JSON.stringify(formValues ?? {}, null, 2)}
        OnCopiedElement={<><CheckIcon className=' inline' /> Copied to clipboard</>}
        ToCopyElement={<><CopyIcon className=' inline' /> Copy form output</>}
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
  const { formValues } = useFormContext()
  const [formOutput, setFormOutput] = useState<string>(JSON.stringify(getFormPayload(formValues, form), null, 2))
  useEffect(() => {
    setFormOutput(JSON.stringify(getFormPayload(formValues, form), null, 2))
  }, [formValues, form])
  return (
    <pre className='h-full whitespace-pre-wrap overflow-auto p-4 bg-slate-100 text-xs'>
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
  const [sidebarWidth, setSidebarWidth] = useState<number>(1200)

  return <>
    {

      !editing
        ? <Tooltip
          content='Edit schema and field overrides'
          side='left'
          className='bg-white bg-opacity-50 hover:bg-opacity-100 text-black p-2 rounded-md top-20 right-10 fixed z-10 shadow-lg'
        ><Pencil2Icon className='cursor-pointer w-6 h-6' onClick={() => {
          setEditing(true)
        }} /></Tooltip>
        : ''

    }
    {
      !editing
        ? ''
        : <div
          className='fixed bottom-0 right-0 h-full bg-white shadow-2xl z-50  flex flex-row'
          style={{ width: `${fixOverLayWidth(sidebarWidth)}px` }}
        >
          <Cross2Icon className='cursor-pointer w-6 h-6 absolute top-4 left-8' onClick={() => {
            setEditing(false)
          }} />
          <div className='w-4 cursor-ew-resize h-full bg-slate-100 px-1 shadow-md flex flex-col items-center justify-center'
            onMouseDown={(e) => {
              const startX = e.clientX
              const startWidth = sidebarWidth

              const onMouseMove = (event: MouseEvent): void => {
                const newWidth = startWidth - (event.clientX - startX)
                setSidebarWidth(fixOverLayWidth(newWidth))
                document.body.classList.add('cursor-ew-resize')
                document.body.classList.add('select-none')
                event.preventDefault() // Prevent text selection
                event.stopPropagation()
              }

              const onMouseUp = (): void => {
                document.removeEventListener('mousemove', onMouseMove)
                document.removeEventListener('mouseup', onMouseUp)
                document.body.classList.remove('cursor-ew-resize')
                document.body.classList.remove('select-none')
              }

              document.addEventListener('mousemove', onMouseMove)
              document.addEventListener('mouseup', onMouseUp)
            }}
          >
            <DragHandleDots2Icon />
            <DragHandleDots2Icon className='-mt-1' />
            <DragHandleDots2Icon className='-mt-1' />
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
      <div className={`${layout.size === 'sm' || layout.size === 'md' ? 'm-4' : 'm-10 mt-4'} relative`}>
        {
          formInput !== undefined
            ? <FormCreator
              form={formInput}
              formValueState={[formValues, setFormValues]}
              Footer={Footer}
              Header={
                <FormEditor>
                  <Tabs
                    className='flex flex-col h-full p-8 grow'
                    defaultContentClassName='h-full overflow-auto p-4'
                    tabs={[
                      {
                        id: 'form-override',
                        label: 'Form Override',
                        content: <JSONInput
                          value={formInput !== undefined ? JSON.stringify(formInput, null, 2) : ''}
                          onChange={(e) => {
                            setFormInput(e !== undefined ? e as unknown as IForm : undefined)
                          }}
                          field={{
                            id: 'formInput',
                            label: '',
                            type: 'json'
                          }}
                        />
                      },
                      {
                        id: 'form-output',
                        label: 'Form output',
                        content: <FormOutput form={formInput} />
                      }

                    ].filter(t => t !== undefined)}
                  />
                </FormEditor>
              }
            />
            : 'No form config provided'
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
} & Omit<IFormCreatorProps, 'Header' | 'Footer' | 'form'>): ReactElement => {
  const [schemaInput, setSchemaInput] = schemaState ?? useState<JSONSchema6 | undefined>(undefined)
  const [rootFieldOverridesInput, setRootFieldOverridesInput] = rootFieldOverrideState ?? []
  const [fieldOverridesInput, setFieldOverridesInput] = fieldOverrideState ?? useState<IFormFieldOverride[]>([])
  const [formOverrideInput, setFormOverrideInput] = formOverrideState ?? useState<IFormOverride | undefined>(undefined)
  const [layout] = useAtom(layoutAtom)

  const formOverrides = formOverrideInput !== undefined ? [formOverrideInput] : undefined
  const formFieldOverrides = [rootFieldOverridesInput, fieldOverridesInput].filter(o => o !== undefined)

  return (

    <div className={`${layout.size === 'sm' || layout.size === 'md' ? 'm-4' : 'm-10 mt-4'} relative`}>
      {
        schemaInput !== undefined
          ? <SchemaFormCreator
            {...props}
            id={schemaState?.[0]?.$id ?? 'default'}
            label={label}
            inputOverrides={inputOverrides}
            schema={schemaInput}
            formOverrides={formOverrides}
            formFieldOverrides={formFieldOverrides}
            Footer={Footer}
            Header={<FormEditor>
              <>
                <ObjectToSchemaButton
                  size='xs'
                  className='top-2 right-2 absolute'
                  onUpdate={(newSchema: JSONSchema6 | undefined) => {
                    setSchemaInput(newSchema)
                  }}
                />

                <Tabs
                  className='flex flex-col h-full p-8 grow'
                  defaultContentClassName='h-full overflow-auto p-4'
                  tabs={[
                    {
                      id: 'scenarioFormOverride',
                      label: 'Scenario: Form Override',
                      content: <JSONInput
                        value={formOverrideInput !== undefined ? JSON.stringify(formOverrideInput, null, 2) : ''}
                        onChange={(e) => {
                          setFormOverrideInput(e !== undefined ? e as unknown as IFormOverride : undefined)
                        }}
                        field={{
                          id: 'formOverrideInput',
                          label: '',
                          type: 'json'
                        }}
                      />
                    },
                    setFieldOverridesInput !== undefined
                      ? {
                        id: 'scenarioFieldOverrides',
                        label: 'Scenario: Field Overrides',
                        content: <JSONInput
                          value={fieldOverridesInput !== undefined ? JSON.stringify(fieldOverridesInput, null, 2) : ''}
                          onChange={(e) => {
                            setFieldOverridesInput(e !== undefined ? e as unknown as IFormFieldOverride[] : [])
                          }}
                          field={{
                            id: 'fieldOverridesInput',
                            label: '',
                            type: 'json'
                          }}
                        />
                      }
                      : undefined,
                    setSchemaInput !== undefined
                      ? {
                        id: 'schema',
                        label: 'Scenario: Schema',
                        content: <JSONInput
                          value={schemaInput !== undefined ? JSON.stringify(schemaInput, null, 2) : ''}
                          onChange={(e) => {
                            setSchemaInput(e !== undefined ? e as JSONSchema6 : undefined)
                          }}
                          field={{
                            id: 'schemaInput',
                            label: '',
                            type: 'json'
                          }}
                        />
                      }
                      : undefined,
                    setRootFieldOverridesInput !== undefined
                      ? {
                        id: 'rootFieldOverrides',
                        label: 'Root: Field Overrides',
                        content: <JSONInput
                          value={rootFieldOverridesInput !== undefined ? JSON.stringify(rootFieldOverridesInput, null, 2) : ''}
                          onChange={(e) => {
                            setRootFieldOverridesInput(e !== undefined ? e as unknown as IFormFieldOverride[] : [])
                          }}
                          field={{
                            id: 'rootFieldOverridesInput',
                            label: '',
                            type: 'json'
                          }}
                        />
                      }
                      : undefined,
                    {
                      id: 'form-output',
                      label: 'Form output',
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
          : ''
      }
    </div>

  )
}

export default SchemaFormWithEditorOverlay
