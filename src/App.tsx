import FormManager from ***REMOVED***@/Form/Manage/Manage***REMOVED***
import React, { useEffect, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { BrowserRouter, Route, Routes } from ***REMOVED***react-router-dom***REMOVED***
import SetTester from ***REMOVED***@/SetTester***REMOVED***
import MapTester from ***REMOVED***@/Form/MapTester***REMOVED***
import SchemaToForm from ***REMOVED***@/Form/SchemaToForm***REMOVED***
import pagedFormJson from ***REMOVED***@/Form/testData/pagedForm.json***REMOVED***
import wizardFormJson from ***REMOVED***@/Form/testData/wizardForm.json***REMOVED***
import customElementFormJson from ***REMOVED***@/Form/testData/customElementForm.json***REMOVED***
import { type INumberField, type IForm, type IFormValues, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import Form from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { Slider } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***

const PagedFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
  <Form form={pagedFormJson as IForm} formValueState={formValueState} className=***REMOVED***p-20***REMOVED*** />
  <pre className=***REMOVED***p-20 bg-slate-200 text-xs***REMOVED***>{JSON.stringify(formValueState[0], null, 2)}</pre>
  </div>
  )
}

const WizardFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
        <Form form={wizardFormJson as IForm} formValueState={formValueState} className=***REMOVED***p-20***REMOVED*** urlNavigable={false} />
        <pre className=***REMOVED***p-20 bg-slate-200 text-xs***REMOVED***>{JSON.stringify(formValueState[0], null, 2)}</pre>
      </div>
  )
}

const CustomElementFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
      <Form
        form={customElementFormJson as IForm}
        formValueState={formValueState}
        className=***REMOVED***p-20***REMOVED***
        urlNavigable={false}
        inputOverrides={{
          ***REMOVED***custom:number***REMOVED***: ({ field, value, onChange }: IFieldInputProps) => {
            const numberField = field as INumberField
            const [tempValue, setTempValue] = useState<number>(value !== undefined && value !== null ? +value : 0)
            useEffect(() => {
              if (value !== undefined && value !== null) {
                setTempValue(+value)
              }
            }, [value])
            const min = numberField?.constraints?.min ?? 0
            const max = numberField?.constraints?.max ?? 100
            const step = Number(numberField?.settings?.step ?? (max - min) / 100)
            return (<div>
              <FieldLabel {...field} />
              <div className=***REMOVED***flex flex-row gap-4***REMOVED***>
                <p className=***REMOVED***font-bold w-[80px]***REMOVED***>{tempValue}</p>
                <Slider
                  className=***REMOVED***flex-grow max-w-[400px] mt-1***REMOVED***
                  size=***REMOVED***sm***REMOVED***
                  value={tempValue}
                  min={min}
                  max={max}
                  onChange={(v: number): void => {
                    setTempValue(v)
                  }}
                  onChangeComplete={(v: number): void => {
                    setTempValue(v)
                    onChange(v)
                  }}
                  id={field.id}
                  testId={field.id}
                  step={step}
                  />
              </div>
            </div>)
          }
        }}
        />
      <pre className=***REMOVED***p-20 bg-slate-200 text-xs***REMOVED***>{JSON.stringify(formValueState[0], null, 2)}</pre>
    </div>
  )
}

const App = (): ReactElement => {
  return (

    <div className=***REMOVED***h-screen flex flex-col gap-4***REMOVED***>
      <BrowserRouter>
          <Routes>
            <Route path=***REMOVED***/***REMOVED*** element={<FormManager />}>
              <Route path=***REMOVED*******REMOVED*** element={<FormManager />} />
            </Route>
            <Route path=***REMOVED***/schema-to-form***REMOVED*** element={<SchemaToForm />} />
            <Route path="/set-tester" element={<SetTester />} />
            <Route path="/map-tester" element={<MapTester />} />
            <Route path="/page-form/" element={<PagedFormWrap />}>
              <Route path=***REMOVED*******REMOVED*** element={<PagedFormWrap />} />
            </Route>
            <Route path=***REMOVED***/wizard-form***REMOVED*** element={<WizardFormWrap />}>
              <Route path=***REMOVED*******REMOVED*** element={<WizardFormWrap />} />
            </Route>
            <Route path="/custom-form-element" element={<CustomElementFormWrap />}>
              <Route path=***REMOVED*******REMOVED*** element={<CustomElementFormWrap />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </div>

  )
}

export default App
