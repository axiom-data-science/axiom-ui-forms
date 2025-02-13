import { Button, MultiAccordion, Tabs } from '@axdspub/axiom-ui-utilities'
import React, { type ReactNode, useState, type ReactElement } from 'react'
import FormOutput from '@/Form/Manage/FormMappedOutput'
import FormConfigInput from '@/Form/Manage/FormConfigInput'
import FormMappingInput from '@/Form/Manage/FormMappingInput'
import Form from '@/Form/FormCreator'
import { useAtom } from 'jotai'
import formAtom from '@/state/formAtom'
import { RawFormOutput } from '@/Form/Manage/RawFormOutput'
import formMappingAtom from '@/state/formMappingAtom'
import { getQueryParam, updateUrlParam } from '@/helpers'
import formValuesAtom from '@/state/formValuesAtom'
import { CheckIcon, Cross1Icon, TrashIcon } from '@radix-ui/react-icons'
import testForm from '@/Form/testData/nestedForm.json'
import { type IForm, type IFormValues } from '@/Form/FormCreatorTypes'
import { type IFormMapping } from '@/Form/FormMappingTypes'

type IDisplayType = 'stack' | 'tab'

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

const FormManager = ({
  formValueState,
  mappingState,
  formState
}: {
  formValueState?: [IFormValues, (v: IFormValues) => void]
  mappingState?: [IFormMapping, (v: IFormMapping) => void]
  formState?: [IForm, (v: IForm) => void]
}): ReactElement => {
  const [form, setForm] = formState ?? useAtom(formAtom)
  const [mapping, setMapping] = mappingState ?? useAtom(formMappingAtom)
  const [formValues, setFormValues] = formValueState ?? useAtom(formValuesAtom)
  const sections = [
    {
      id: 'config',
      label: 'Form config',
      content: <FormConfigInput
          formState={[form, setForm]}
        />
    },
    {
      id: 'mapping',
      label: 'Form mapping',
      content: <FormMappingInput
          form={form}
          mappingState={[mapping, setMapping]}
        />
    },
    {
      id: 'output',
      label: 'Mapped Output',
      content: <FormOutput
        form={form}
        formMapping={mapping}
      />
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
            <div className='flex flex-row gap-4 justify-end'>
                <ClearForm onConfirm={() => {
                  setFormValues({})
                }} />
                <ClearForm message='Clear form config' onConfirm={() => {
                  setForm(structuredClone(testForm as IForm))
                }} />
            </div>
               <div className='grid grid-cols-2 gap-8 flex-grow'>

               <Form form={form} formValueState={[formValues, setFormValues]} />

                    <div className='flex flex-col gap-4'>
                      {
                        display !== 'tab'
                          ? <MultiAccordion tabs={sections} />
                          : <Tabs
                              tabs={sections}
                              selectedTab={getQueryParam('tab') ?? undefined}
                              onChange={(tab) => {
                                updateUrlParam('tab', tab)
                              }}
                         />
                      }

                    </div>
               </div>
          </div>
  )
}

export default FormManager
