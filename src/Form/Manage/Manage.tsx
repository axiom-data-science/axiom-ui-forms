import { Button, SelectInput } from '@axdspub/axiom-ui-utilities'
import React, { type ReactNode, useState, type ReactElement, useEffect } from 'react'
import { useAtom } from 'jotai'
import formAtom from '@/state/formAtom'
import formValuesAtom from '@/state/formValuesAtom'
import { CheckIcon, Cross1Icon, ReloadIcon, TrashIcon } from '@radix-ui/react-icons'
import { type IForm, type IFormValues } from '@/Form/Creator/FormCreatorTypes'
import { type IFormMapping } from '@/Form/FormMappingTypes'
import { assignDefaultValuesToFormValues } from '@/utils/manipulators'
import { FormWithEditorOverlay } from '@/Form/FormWithEditorOverlay'
import { updateUrlParam } from '@/helpers'

const formConfigs = import.meta.glob<IForm>('/src/Form/testData/forms/**/*.json', { eager: true, import: 'default' })

const testForm = (formConfigs?.['/src/Form/testData/forms/formObject.json'] ?? { id: 'testForm', label: 'Test Form' })

const ClearForm = ({
  message = 'Clear form',
  onConfirm
}: {
  message?: ReactNode
  onConfirm: () => void

}): ReactElement => {
  const [confirm, setConfirm] = useState(false)
  return (
    <>
      {
        confirm
          ? <p className='flex flex-row gap-2 text-sm'><span className='text-slate-600'>Deleting: </span> Are you sure?
              <Button size='xs' type='submit'
                onClick={() => {
                  onConfirm()
                  setConfirm(false)
                }}>Yes <CheckIcon className='inline ml-2' />
              </Button>
              <Button size='xs' type='alert'
                onClick={() => {
                  setConfirm(false)
                }}>Cancel <Cross1Icon className='inline ml-2' />
              </Button>
            </p>
          : <Button size='xs' type='alert' onClick={() => { setConfirm(true) }}>
              {message} <TrashIcon className='inline ml-2 fill-white' />
            </Button>
      }
    </>
  )
}

const SelectNewForm = ({
  onChange,
  files,
  fileParam = 'form-init'
}: {
  files: Record<string, any>
  fileParam?: string
  onChange: (key: string) => void
}): ReactElement => {
  const url = new URL(document.location.href)
  const formInitParam = url.searchParams.get(fileParam) ?? ''
  return <div className='text-sm flex flex-row gap-2 items-center'>
    <SelectInput
      className='bg-blue-600 text-white hover:bg-blue-900 rounded-md shadow-md'
      id='select-new-form'
      testId='select-new-form'
      size='xs'
      placeholder='Select new form config'
      value={formInitParam}
      options={Object.keys(files).map(k => {
        return {
          label: k.replace('/src/Form/testData/forms/', '').replace('.json', ''),
          value: k
        }
      })}
      onChange={(e) => {
        if (e?.value !== undefined && files[e.value] !== undefined) {
          updateUrlParam(fileParam, e.value)
          onChange(e.value)
        }
      }}
    />
    <ReloadIcon className='inline w-5 h-5 cursor-pointer hover:text-blue-900'
      onClick={() => {
        if (formInitParam !== null && formInitParam !== '') {
          onChange(formInitParam)
        }
      }} />

  </div>
}

const FormManager = ({
  formValueState,
  mappingState,
  formState
}: {
  formValueState?: [IFormValues, (v: IFormValues) => void]
  mappingState?: [IFormMapping, (v: IFormMapping) => void]
  formState?: [IForm, (v: IForm | undefined) => void]
}): ReactElement => {
  const [form, setForm] = formState ?? useAtom(formAtom)
  if (Object.values(form ?? {}).length === 0) {
    setForm(structuredClone(testForm))
  }
  const [formValues, setFormValues] = formValueState ?? useAtom(formValuesAtom)
  useEffect(() => {
    if (form !== undefined) {
      setFormValues(assignDefaultValuesToFormValues(form, formValues ?? {}))
    }
  }, [form])
  return (
          <div className='flex flex-col h-full gap-4'>
            <div className='flex flex-row gap-4 bg-white sticky top-0 left-0 right-0 shadow-lg z-10 p-4'>
                <SelectNewForm
                  files={formConfigs}
                  onChange={key => {
                    const form = formConfigs[key]
                    setForm(structuredClone({
                      ...form,
                      description: `*From: \`${key.replace('/src/Form/testData/forms/', '')}\`*${form.description !== undefined ? `\n\n${form.description}` : ''}`
                    }))
                    setFormValues(assignDefaultValuesToFormValues(form, {}))
                  }}

                  />
                <ClearForm onConfirm={() => {
                  setFormValues({})
                }} />
                <ClearForm message='Clear form config' onConfirm={() => {
                  setForm(structuredClone(testForm))
                }} />

            </div>
            <div className='px-20 h-full overflow-auto'>
             <FormWithEditorOverlay formState={[form, setForm]} />
             </div>
          </div>
  )
}

export default FormManager
