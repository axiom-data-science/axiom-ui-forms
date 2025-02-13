import { Button, MultiAccordion, Tabs } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactNode, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import FormOutput from ***REMOVED***@/Form/Manage/FormMappedOutput***REMOVED***
import FormConfigInput from ***REMOVED***@/Form/Manage/FormConfigInput***REMOVED***
import FormMappingInput from ***REMOVED***@/Form/Manage/FormMappingInput***REMOVED***
import Form from ***REMOVED***@/Form/FormCreator***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import formAtom from ***REMOVED***@/state/formAtom***REMOVED***
import { RawFormOutput } from ***REMOVED***@/Form/Manage/RawFormOutput***REMOVED***
import formMappingAtom from ***REMOVED***@/state/formMappingAtom***REMOVED***
import { getQueryParam, updateUrlParam } from ***REMOVED***@/helpers***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { CheckIcon, Cross1Icon, TrashIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import testForm from ***REMOVED***@/Form/testData/nestedForm.json***REMOVED***
import { type IForm, type IFormValues } from ***REMOVED***@/Form/FormCreatorTypes***REMOVED***
import { type IFormMapping } from ***REMOVED***@/Form/FormMappingTypes***REMOVED***

type IDisplayType = ***REMOVED***stack***REMOVED*** | ***REMOVED***tab***REMOVED***

const ClearForm = ({
  message = ***REMOVED***Clear form***REMOVED***,
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
          ? <p className=***REMOVED***flex flex-row gap-2 text-sm***REMOVED***><span className=***REMOVED***text-slate-600***REMOVED***>Deleting: </span> Are you sure?
              <Button size=***REMOVED***xs***REMOVED*** type=***REMOVED***submit***REMOVED***
                onClick={() => {
                  onConfirm()
                  setConfirm(false)
                }}>Yes <CheckIcon className=***REMOVED***inline ml-2***REMOVED*** />
              </Button>
              <Button size=***REMOVED***xs***REMOVED*** type=***REMOVED***alert***REMOVED***
                onClick={() => {
                  setConfirm(false)
                }}>Cancel <Cross1Icon className=***REMOVED***inline ml-2***REMOVED*** />
              </Button>
            </p>
          : <Button size=***REMOVED***xs***REMOVED*** type=***REMOVED***alert***REMOVED*** onClick={() => { setConfirm(true) }}>
              {message} <TrashIcon className=***REMOVED***inline ml-2 fill-white***REMOVED*** />
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
      id: ***REMOVED***config***REMOVED***,
      label: ***REMOVED***Form config***REMOVED***,
      content: <FormConfigInput
          formState={[form, setForm]}
        />
    },
    {
      id: ***REMOVED***mapping***REMOVED***,
      label: ***REMOVED***Form mapping***REMOVED***,
      content: <FormMappingInput
          form={form}
          mappingState={[mapping, setMapping]}
        />
    },
    {
      id: ***REMOVED***output***REMOVED***,
      label: ***REMOVED***Mapped Output***REMOVED***,
      content: <FormOutput
        form={form}
        formMapping={mapping}
      />
    },
    {
      id: ***REMOVED***raw_output***REMOVED***,
      label: ***REMOVED***Raw Output***REMOVED***,
      content: <RawFormOutput />
    }
  ]
  const params = Object.fromEntries(new URLSearchParams(window.location.search))
  const display: IDisplayType = params.display === ***REMOVED***stack***REMOVED*** ? ***REMOVED***stack***REMOVED*** : ***REMOVED***tab***REMOVED***
  return (
          <div className=***REMOVED***flex flex-col h-full gap-4 p-20***REMOVED***>
            <div className=***REMOVED***flex flex-row gap-4 justify-end***REMOVED***>
                <ClearForm onConfirm={() => {
                  setFormValues({})
                }} />
                <ClearForm message=***REMOVED***Clear form config***REMOVED*** onConfirm={() => {
                  setForm(structuredClone(testForm as IForm))
                }} />
            </div>
               <div className=***REMOVED***grid grid-cols-2 gap-8 flex-grow***REMOVED***>

               <Form form={form} formValueState={[formValues, setFormValues]} />

                    <div className=***REMOVED***flex flex-col gap-4***REMOVED***>
                      {
                        display !== ***REMOVED***tab***REMOVED***
                          ? <MultiAccordion tabs={sections} />
                          : <Tabs
                              tabs={sections}
                              selectedTab={getQueryParam(***REMOVED***tab***REMOVED***) ?? undefined}
                              onChange={(tab) => {
                                updateUrlParam(***REMOVED***tab***REMOVED***, tab)
                              }}
                         />
                      }

                    </div>
               </div>
          </div>
  )
}

export default FormManager
