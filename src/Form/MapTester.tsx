import { type IFormField, type IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type IFormMapping } from ***REMOVED***@/Form/FormMappingTypes***REMOVED***
import { getPathFromField } from ***REMOVED***@/utils/getters***REMOVED***
import { copyAndAddPathToFields } from ***REMOVED***@/utils/manipulators***REMOVED***
import { CopyButton } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***
import FormMappingInput from ***REMOVED***@/Form/Manage/FormMappingInput***REMOVED***
import testForm from ***REMOVED***@/Form/testData/nestedForm.json***REMOVED***
import { Checkbox, Input, TextArea } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { useState, type ReactElement } from ***REMOVED***react***REMOVED***

const FieldMap = ({ field, mappingState }: { field: IFormField, mappingState: [IFormMapping, (m: IFormMapping) => void] }): ReactElement => {
  const isContainer = field.type === ***REMOVED***object***REMOVED*** || field.type === ***REMOVED***section***REMOVED***
  const [include, setInclude] = useState<boolean>(true)
  const [path, setPath] = useState<string | undefined>(undefined)
  return (
    <div className={`${isContainer ? ***REMOVED***px-4 py-6 border-2 border-slate-400 border-dotted***REMOVED*** : ***REMOVED***px-4 py-1***REMOVED***} m-2 bg-slate-400 [&>.bg-slate-400]:bg-slate-200 [&>.bg-slate-200]:bg-slate-100 bg-opacity-50`}>
      <p>{field.label}</p>
      <p className=***REMOVED***text-xs***REMOVED***>{`${getPathFromField(field)}`}</p>
      <div className=***REMOVED***flex flex-row p-2***REMOVED***>
      <Checkbox id={`${field.id}-include`} testId={`${field.id}-include`} value={include} onChange={(e) => {
        setInclude(e)
      }} />
      <Input size=***REMOVED***xs***REMOVED*** wrapperClassName=***REMOVED***flex-grow***REMOVED*** id={`${field.id}-target`} testId={`${field.id}-target`} value={path} onChange={(e) => {
        setPath(e === ***REMOVED******REMOVED*** ? undefined : e)
      }} />
      </div>
      {
        field.type === ***REMOVED***object***REMOVED*** && field.fields?.map(f => {
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
    $targetSchema: ***REMOVED******REMOVED***
  })
  // const [error, setError] = useState<string | undefined>(undefined)
  const [str, setStr] = useState<string | undefined>(JSON.stringify(testForm, null, 2))

  let error
  let inputObjectNoPaths: IForm | undefined
  let inputObject: IForm | undefined

  try {
    const ob = JSON.parse(str === ***REMOVED******REMOVED*** || str === undefined ? ***REMOVED***{}***REMOVED*** : str)
    inputObjectNoPaths = {
      fields: [],
      label: ***REMOVED******REMOVED***,
      id: ***REMOVED******REMOVED***,
      ...ob
    } satisfies IForm

    inputObject = copyAndAddPathToFields({
      fields: [],
      label: ***REMOVED******REMOVED***,
      id: ***REMOVED******REMOVED***,
      ...ob
    })
  } catch {
    error = ***REMOVED***Invalid JSON***REMOVED***
  }

  return (
        <div className=***REMOVED***p-20 h-full***REMOVED***>
            <h1 className=***REMOVED***font-bold***REMOVED***>Map Tester</h1>
            <div className=***REMOVED***grid grid-cols-3 gap-8 flex-grow h-full***REMOVED***>
                <div className=***REMOVED***h-full***REMOVED***>
                    { error !== undefined
                      ? <p className=***REMOVED***text-red-500 py-4***REMOVED***>
                         {error}
                     </p>
                      : ***REMOVED******REMOVED***
                    }

                <TextArea
                    label=***REMOVED***Input object***REMOVED***
                    id=***REMOVED***object***REMOVED***
                    testId=***REMOVED***object***REMOVED***
                    wrapperClassName=***REMOVED***h-full relative***REMOVED***
                    className=***REMOVED***h-full***REMOVED***
                    value={inputObjectNoPaths !== undefined ? JSON.stringify(inputObjectNoPaths, null, 2) : str}
                    onChange={(e) => {
                      setStr(e)
                    }}
                    after={<CopyButton string={JSON.stringify(inputObjectNoPaths, null, 2)} className=***REMOVED***pointer-events-auto absolute right-8 top-12***REMOVED*** />}
                />
                </div>
                <div>
                    <div className=***REMOVED***hidden***REMOVED***>
                      {
                        inputObject !== undefined
                          ? <FormMappingInput form={inputObject} mappingState={[mapping, setMapping]} />
                          : ***REMOVED******REMOVED***
                      }
                    </div>
                    <div className=***REMOVED***flex flex-col gap-2***REMOVED***>
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
