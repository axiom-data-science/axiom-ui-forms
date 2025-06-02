import React, { useContext, useState, type ReactElement } from 'react'
import { SchemaFormCreator } from '@/Form/Creator/FormCreator'
import { type JSONSchema6 } from 'json-schema'
import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'
import { FormContext } from '@/Form/Creator/FormContextProvider'
import { CheckIcon, CopyIcon, Cross2Icon, DragHandleDots2Icon, Pencil2Icon } from '@radix-ui/react-icons'
import { type IFormOverride, type IFormFieldOverride } from '@/Form/Creator/FormCreatorTypes'
import { Tabs, Tooltip } from '@axdspub/axiom-ui-utilities'
import { JSONInput } from '@/Form/Components/Inputs'
import { useAtom } from 'jotai'
import rootFieldAtom from '@/PTT/rootFieldAtom'
import layoutAtom from '@/utils/responsive/layoutState'

const Footer = (): ReactElement => {
  const { formValues } = useContext(FormContext)
  return (
        <div className='p-20'>
        <CopyButton
            string={JSON.stringify(formValues, null, 2)}
            OnCopiedElement={<><CheckIcon className=' inline' /> Copied to clipboard</>}
            ToCopyElement={<><CopyIcon className=' inline' /> Copy form output</>}
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
    <div className={`${layout.size === 'sm' || layout.size === 'md' ? 'm-4' : 'm-10 mt-4'} relative`}>
      {
            schemaInput !== undefined
              ? <SchemaFormCreator
              id='ptt-form'
              label={label}
              schema={schemaInput}
              formOverrides={formOverrideInput !== undefined ? [formOverrideInput] : undefined}
              formFieldOverrides={[rootFieldOverridesInput, fieldOverridesInput]}
              footer={
                  <Footer />
              }
          />
              : 'No schema provided'
            }
            <>
            {

                  !editing
                    ? <Tooltip
                      content='Edit schema and field overrides'
                      side='left'
                      className='bg-white text-black p-2 rounded-md absolute top-0 right-0'
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
                    style={{ width: `${sidebarWidth}px` }}
                  >
                  <Cross2Icon className='cursor-pointer w-6 h-6 absolute top-4 left-4' onClick={() => {
                    setEditing(false)
                  }} />
                    <div className='w-[10px] cursor-ew-resize h-full bg-slate-100 px-1 shadow-md flex flex-col items-center justify-center'
                              onMouseDown={(e) => {
                                const startX = e.clientX
                                const startWidth = sidebarWidth

                                const onMouseMove = (event: MouseEvent): void => {
                                  const newWidth = Math.max(200, startWidth - (event.clientX - startX))
                                  setSidebarWidth(newWidth)
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
              <Tabs
                className='flex flex-col h-full p-8 flex-grow'
                defaultContentClassName='h-full overflow-auto p-4'
                tabs={[
                  {
                    id: 'scenarioFormOverride',
                    label: 'Scenario: Form Override',
                    content: <JSONInput
                    value={formOverrideInput !== undefined ? JSON.stringify(formOverrideInput, null, 2) : ''}
                    onChange={(e) => {
                      setFormOverrideInput(e !== undefined ? e as unknown as IFormOverride : undefined)
                    } }
                    field={{
                      id: 'formOverrideInput',
                      label: '',
                      type: 'json'
                    }}
                    />
                  },
                  {
                    id: 'scenarioFieldOverrides',
                    label: 'Scenario: Field Overrides',
                    content: <JSONInput
                    value={fieldOverridesInput !== undefined ? JSON.stringify(fieldOverridesInput, null, 2) : ''}
                    onChange={(e) => {
                      setFieldOverridesInput(e !== undefined ? e as unknown as IFormFieldOverride[] : [])
                    } }
                    field={{
                      id: 'fieldOverridesInput',
                      label: '',
                      type: 'json'
                    }}
                    />
                  },
                  {
                    id: 'schema',
                    label: 'Scenario: Schema',
                    content: <JSONInput
                    value={schemaInput !== undefined ? JSON.stringify(schemaInput, null, 2) : ''}
                    onChange={(e) => {
                      setSchemaInput(e !== undefined ? e as JSONSchema6 : undefined)
                    } }
                    field={{
                      id: 'schemaInput',
                      label: '',
                      type: 'json'
                    }}
                    />
                  },
                  {
                    id: 'rootFieldOverrides',
                    label: 'Root: Field Overrides',
                    content: <JSONInput
                    value={rootFieldOverridesInput !== undefined ? JSON.stringify(rootFieldOverridesInput, null, 2) : ''}
                    onChange={(e) => {
                      setRootFieldOverridesInput(e !== undefined ? e as unknown as IFormFieldOverride[] : [])
                    } }
                    field={{
                      id: 'rootFieldOverridesInput',
                      label: '',
                      type: 'json'
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
