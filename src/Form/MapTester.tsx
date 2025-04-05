import { type IFormField, type IForm } from '@/Form/Creator/FormCreatorTypes'
import { type IFormMapping } from '@/Form/FormMappingTypes'
import { getPathFromField } from '@/utils/getters'
import { copyAndAddPathToFields } from '@/utils/manipulators'
import { CopyButton } from '@/Form/Manage/CopyableJSONOutput'
import FormMappingInput from '@/Form/Manage/FormMappingInput'
import testForm from '@/Form/testData/nestedForm.json'
import { Checkbox, Input, TextArea } from '@axdspub/axiom-ui-utilities'
import React, { useState, type ReactElement } from 'react'

const FieldMap = ({ field, mappingState }: { field: IFormField, mappingState: [IFormMapping, (m: IFormMapping) => void] }): ReactElement => {
  const isContainer = field.type === 'object' || field.type === 'section'
  const [include, setInclude] = useState<boolean>(true)
  const [path, setPath] = useState<string | undefined>(undefined)
  return (
    <div className={`${isContainer ? 'px-4 py-6 border-2 border-slate-400 border-dotted' : 'px-4 py-1'} m-2 bg-slate-400 [&>.bg-slate-400]:bg-slate-200 [&>.bg-slate-200]:bg-slate-100 bg-opacity-50`}>
      <p>{field.label}</p>
      <p className='text-xs'>{`${getPathFromField(field)}`}</p>
      <div className='flex flex-row p-2'>
      <Checkbox id={`${field.id}-include`} testId={`${field.id}-include`} value={include} onChange={(e) => {
        setInclude(e)
      }} />
      <Input size='xs' wrapperClassName='flex-grow' id={`${field.id}-target`} testId={`${field.id}-target`} value={path} onChange={(e) => {
        setPath(e === '' ? undefined : e)
      }} />
      </div>
      {
        field.type === 'object' && field.fields?.map(f => {
          return (
            <FieldMap key={f.id} field={f} mappingState={mappingState} />
          )
        })
      }
    </div>
  )
}

const MapTester = (): ReactElement => {
  // const [inputObject, setInputObject] = useState<IForm>(copyAndAddPathToFields(testForm as IForm))
  const [mapping, setMapping] = useState<IFormMapping>({
    fields: {},
    $targetSchema: ''
  })
  // const [error, setError] = useState<string | undefined>(undefined)
  const [str, setStr] = useState<string | undefined>(JSON.stringify(testForm, null, 2))

  let error
  let inputObjectNoPaths: IForm | undefined
  let inputObject: IForm | undefined

  try {
    const ob = JSON.parse(str === '' || str === undefined ? '{}' : str)
    inputObjectNoPaths = {
      fields: [],
      label: '',
      id: '',
      ...ob
    } satisfies IForm

    inputObject = copyAndAddPathToFields({
      fields: [],
      label: '',
      id: '',
      ...ob
    })
  } catch {
    error = 'Invalid JSON'
  }

  return (
        <div className='p-20 h-full'>
            <h1 className='font-bold'>Map Tester</h1>
            <div className='grid grid-cols-3 gap-8 flex-grow h-full'>
                <div className='h-full'>
                    { error !== undefined
                      ? <p className='text-red-500 py-4'>
                         {error}
                     </p>
                      : ''
                    }

                <TextArea
                    label='Input object'
                    id='object'
                    testId='object'
                    wrapperClassName='h-full relative'
                    className='h-full'
                    value={inputObjectNoPaths !== undefined ? JSON.stringify(inputObjectNoPaths, null, 2) : str}
                    onChange={(e) => {
                      setStr(e)
                    }}
                    after={<CopyButton string={JSON.stringify(inputObjectNoPaths, null, 2)} className='pointer-events-auto absolute right-8 top-12' />}
                />
                </div>
                <div>
                    <div className='hidden'>
                      {
                        inputObject !== undefined
                          ? <FormMappingInput form={inputObject} mappingState={[mapping, setMapping]} />
                          : ''
                      }
                    </div>
                    <div className='flex flex-col gap-2'>
                    {
                      inputObject?.fields?.map(f => {
                        return (
                          <FieldMap key={f.id} field={f} mappingState={[mapping, setMapping]} />
                        )
                      })
                    }
                    </div>
                </div>
                <div>
                  <p>Mapped output will go here..</p>
                </div>

            </div>

        </div>
  )
}

export default MapTester
