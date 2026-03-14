import { Button, SelectInput } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import React, { type ReactNode, useState, type ReactElement, useEffect } from ***REMOVED***react***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import formAtom from ***REMOVED***@/state/formAtom***REMOVED***
import formValuesAtom from ***REMOVED***@/state/formValuesAtom***REMOVED***
import { CheckIcon, Cross1Icon, ReloadIcon, TrashIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { type IForm, type IFormValues } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type IFormMapping } from ***REMOVED***@/Form/FormMappingTypes***REMOVED***
import { assignDefaultValuesToFormValues, cloneObject } from ***REMOVED***@/utils/manipulators***REMOVED***
import { FormWithEditorOverlay } from ***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***
import { updateUrlParam } from ***REMOVED***@/helpers***REMOVED***

const formConfigs = import.meta.glob<IForm>(***REMOVED***/src/Form/testData/forms/**/*.json***REMOVED***, { eager: true, import: ***REMOVED***default***REMOVED*** })

const testForm = (formConfigs?.[***REMOVED***/src/Form/testData/forms/formObject.json***REMOVED***] ?? { id: ***REMOVED***testForm***REMOVED***, label: ***REMOVED***Test Form***REMOVED*** })

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
            <Button size=***REMOVED***sm***REMOVED*** type=***REMOVED***submit***REMOVED***
              onClick={() => {
                onConfirm()
                setConfirm(false)
              }}>Yes <CheckIcon className=***REMOVED***inline ml-2***REMOVED*** />
            </Button>
            <Button size=***REMOVED***sm***REMOVED*** type=***REMOVED***alert***REMOVED***
              onClick={() => {
                setConfirm(false)
              }}>Cancel <Cross1Icon className=***REMOVED***inline ml-2***REMOVED*** />
            </Button>
          </p>
          : <Button size=***REMOVED***sm***REMOVED*** type=***REMOVED***alert***REMOVED*** onClick={() => { setConfirm(true) }}>
            {message} <TrashIcon className=***REMOVED***inline ml-2 fill-white***REMOVED*** />
          </Button>
      }
    </>
  )
}

const SelectNewForm = ({
  onChange,
  files,
  fileParam = ***REMOVED***form-init***REMOVED***
}: {
  files: Record<string, any>
  fileParam?: string
  onChange: (key: string) => void
}): ReactElement => {
  const url = new URL(document.location.href)
  const formInitParam = url.searchParams.get(fileParam) ?? ***REMOVED******REMOVED***
  return <div className=***REMOVED***text-sm flex flex-row gap-2 items-center***REMOVED***>
    <SelectInput
      id=***REMOVED***select-new-form***REMOVED***
      variant=***REMOVED***submit***REMOVED***
      testId=***REMOVED***select-new-form***REMOVED***
      size=***REMOVED***sm***REMOVED***
      placeholder=***REMOVED***Select new form config***REMOVED***
      value={formInitParam}
      options={Object.keys(files).map(k => {
        return {
          label: k.replace(***REMOVED***/src/Form/testData/forms/***REMOVED***, ***REMOVED******REMOVED***).replace(***REMOVED***.json***REMOVED***, ***REMOVED******REMOVED***),
          value: k
        }
      })}
      onChange={(e) => {
        if (e?.value !== undefined && files[e.value] !== undefined) {
          updateUrlParam(fileParam, e.value)
          onChange(e.value !== undefined ? String(e.value) : ***REMOVED******REMOVED***)
        }
      }}
    />
    <ReloadIcon className=***REMOVED***inline w-5 h-5 cursor-pointer hover:text-blue-900***REMOVED***
      onClick={() => {
        if (formInitParam !== null && formInitParam !== ***REMOVED******REMOVED***) {
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
    setForm(cloneObject(testForm))
  }
  const [formValues, setFormValues] = formValueState ?? useAtom(formValuesAtom)
  useEffect(() => {
    if (form !== undefined) {
      setFormValues(assignDefaultValuesToFormValues(form, formValues ?? {}))
    }
  }, [form])
  return (
    <div className=***REMOVED***flex flex-col h-full gap-4***REMOVED***>
      <div className=***REMOVED***flex flex-row gap-4 bg-white sticky top-0 left-0 right-0 shadow-lg z-10 p-4***REMOVED***>
        <SelectNewForm
          files={formConfigs}
          onChange={key => {
            const form = formConfigs[key]
            setForm(cloneObject({
              ...form,
              description: `From: [${key.replace(***REMOVED***/src/Form/testData/forms/***REMOVED***, ***REMOVED******REMOVED***)}](http://git.axiom/axiom/axiom-ui-forms/-/tree/main${key})${form.description !== undefined ? `\n\n${form.description}` : ***REMOVED******REMOVED***}`
            }))
            setFormValues(assignDefaultValuesToFormValues(form, {}))
          }}

        />
        <ClearForm onConfirm={() => {
          setFormValues({})
        }} />
        <ClearForm message=***REMOVED***Clear form config***REMOVED*** onConfirm={() => {
          setForm(cloneObject(testForm))
        }} />

      </div>
      <div className=***REMOVED***px-20 h-full overflow-auto***REMOVED***>
        <FormWithEditorOverlay formState={[form, setForm]} />
      </div>
    </div>
  )
}

export default FormManager
