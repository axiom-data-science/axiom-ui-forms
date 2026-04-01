"use client";

import FormManager from ***REMOVED***@/Form/Manage/Manage***REMOVED***
import React, { createContext, useContext, useState, type ReactElement } from ***REMOVED***react***REMOVED***
import { BrowserRouter, Route, Routes, useParams } from ***REMOVED***react-router-dom***REMOVED***
import SetTester from ***REMOVED***@/SetTester***REMOVED***
import MapTester from ***REMOVED***@/Form/MapTester***REMOVED***
import SchemaToForm from ***REMOVED***@/Form/SchemaToForm***REMOVED***
import pagedFormJson from ***REMOVED***@/Form/testData/forms/pagedForm.json***REMOVED***
import wizardFormJson from ***REMOVED***@/Form/testData/forms/wizardForm.json***REMOVED***
import pttOilSpillForm from ***REMOVED***@/Form/testData/forms/pttFormConfigOpenOilModel.json***REMOVED***
import customElementFormJson from ***REMOVED***@/Form/testData/forms/customElementForm.json***REMOVED***
import { type INumberField, type IForm, type IFormValues, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import Form from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import FieldLabel from ***REMOVED***@/Form/Components/FieldLabel***REMOVED***
import { Slider } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import ExternalMetadataExample from ***REMOVED***@/Form/ExternalMetadataExample***REMOVED***
import FormWithDefaults from ***REMOVED***@/Form/FormWithDefaults***REMOVED***

import { CopyableJSONOutput } from ***REMOVED***@/Form/Manage/CopyableJSONOutput***REMOVED***
import SchemaToFormWizard from ***REMOVED***@/Form/Creator/SchemaToFormWizard***REMOVED***
import CodeEditor from ***REMOVED***@/Form/CodeEditor***REMOVED***
import SchemaWithOverridesTest from ***REMOVED***@/Form/SchemaWithOverridesTest***REMOVED***
import { assignDefaultValuesToFormValues } from ***REMOVED***@/utils/manipulators***REMOVED***
import { ErrorBoundary } from ***REMOVED***react-error-boundary***REMOVED***
import SchemaToFormPTT from ***REMOVED***@/Form/SchemaToFormPTT***REMOVED***
import OilForm from ***REMOVED***@/PTT/Oil/OilForm***REMOVED***
import LeewayForm from ***REMOVED***@/PTT/Leeway/LeewayForm***REMOVED***
import LarvalForm from ***REMOVED***@/PTT/Larval/LarvalForm***REMOVED***
import OceanDriftForm from ***REMOVED***@/PTT/OceanDrift/OceanDriftForm***REMOVED***
import AllPTT from ***REMOVED***@/PTT/All***REMOVED***
import ResizableSidebar from ***REMOVED***@/TestResize***REMOVED***
import layoutAtom, { getWindowSize } from ***REMOVED***@/utils/responsive/layoutState***REMOVED***
import { useAtom } from ***REMOVED***jotai***REMOVED***
import { debounce } from ***REMOVED***lodash-es***REMOVED***
import MeditorForm from ***REMOVED***@/Meditor/MeditorForm***REMOVED***
import WaterLevelForm from ***REMOVED***@/WaterLevel/WaterLevelForm***REMOVED***
import { QueryClient, QueryClientProvider } from ***REMOVED***@tanstack/react-query***REMOVED***
import Metadata from ***REMOVED***@/Binner/Metadata***REMOVED***
import NestedDataTest from ***REMOVED***@/Form/NestedDataTest***REMOVED***
import JsonPathTester from ***REMOVED***@/Form/JSONPathTester***REMOVED***
import PlatformsMetadata from ***REMOVED***@/Platforms/PlatformsMetadata***REMOVED***
import MODLForm from ***REMOVED***@/Form/MODL/MODLForm***REMOVED***;
import COLLABWaterLevelForm from ***REMOVED***@/WaterLevel/COLLAB/COLLABWaterLevelForm***REMOVED***;
import COLLABWaterLevelFormSheet from ***REMOVED***@/WaterLevel/COLLAB/COLLABWaterLevelFormFromSheet***REMOVED***;
import MAKRAForm from ***REMOVED***@/Form/PAM/MAKRAForm***REMOVED***;

const PagedFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
      <Form form={pagedFormJson as IForm} formValueState={formValueState} className=***REMOVED***p-20***REMOVED*** urlNavigable={true} />
      <pre className=***REMOVED***p-20 bg-slate-200 text-xs***REMOVED***>{JSON.stringify(formValueState[0], null, 2)}</pre>
    </div>
  )
}

const WizardFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
      <Form form={wizardFormJson as IForm} formValueState={formValueState} className=***REMOVED***p-20***REMOVED*** urlNavigable={true} />
      <pre className=***REMOVED***p-20 bg-slate-200 text-xs***REMOVED***>{JSON.stringify(formValueState[0], null, 2)}</pre>
    </div>
  )
}

interface ICustomFormProp { label: string }
const CustomContext = createContext<ICustomFormProp>({ label: ***REMOVED******REMOVED*** })

const CustomElementFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <CustomContext.Provider value={{ label: ***REMOVED***Custom Label***REMOVED*** }}>
      <div>
        <Form
          form={customElementFormJson as IForm}
          formValueState={formValueState}
          className=***REMOVED***p-20***REMOVED***
          urlNavigable={false}
          inputOverrides={{
            ***REMOVED***custom:number***REMOVED***: ({ field, value, onChange }: IFieldInputProps) => {
              const { label: labelFromContext } = useContext(CustomContext)
              const numberField = field as INumberField
              const [tempValue, setTempValue] = useState<number>(value !== undefined && value !== null ? +value : 0)
              const min = numberField?.constraints?.min ?? 0
              const max = numberField?.constraints?.max ?? 100
              const step = Number(numberField?.settings?.step ?? (max - min) / 100)
              return (<div>
                <h2 className=***REMOVED***p-4 text-xl bg-rose-800 text-white***REMOVED***>{labelFromContext}</h2>
                <FieldLabel field={field} />
                <div className=***REMOVED***flex flex-row gap-4***REMOVED***>
                  <p className=***REMOVED***font-bold w-20***REMOVED***>{tempValue}</p>
                  <Slider
                    className=***REMOVED***grow max-w-100 mt-1***REMOVED***
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
                    step={step} />
                </div>
              </div>)
            }
          }} />
        <pre className=***REMOVED***p-20 bg-slate-200 text-xs***REMOVED***>{JSON.stringify(formValueState[0], null, 2)}</pre>
      </div>
    </CustomContext.Provider>
  )
}

const PTTOilFormWrap = (): ReactElement => {
  const form = pttOilSpillForm as IForm
  const formValueState = useState<IFormValues>(assignDefaultValuesToFormValues(form, {}))
  return (
    <>
      <Form className=***REMOVED***p-20***REMOVED*** formValueState={formValueState} form={form} />
      <CopyableJSONOutput string={JSON.stringify(formValueState[0], null, 2)} />
    </>
  )
}

function fallbackRender({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }): ReactElement {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert" className=***REMOVED***p-20***REMOVED***>
      <p>Something went wrong:</p>
      <pre style={{ color: ***REMOVED***red***REMOVED*** }}>{error.message}</pre>
    </div>
  )
}

const queryClient = new QueryClient()

function BinnerMetadataRoute(): ReactElement {
  const { dataset } = useParams<{ dataset: string }>()
  if (!dataset) {
    return <div>Dataset not specified</div>
  }
  return <QueryClientProvider client={queryClient}>
    <Metadata dataset={dataset} />
  </QueryClientProvider>
}

const App = (): ReactElement => {
  const [layout, setLayout] = useAtom(layoutAtom)
  const updateLayoutValue = (): void => {
    const newSize = getWindowSize()
    if (layout.size !== newSize) {
      setLayout({ size: newSize })
    }
  }
  const debounceUpdateLayout = debounce(function updateSize(): void {
    updateLayoutValue()
  }, 200)

  window.addEventListener(***REMOVED***resize***REMOVED***, debounceUpdateLayout)
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
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
            <Route path=***REMOVED***/custom-element-context***REMOVED*** element={<ExternalMetadataExample />} />
            <Route path=***REMOVED***/form-with-defaults***REMOVED*** element={<FormWithDefaults />} />
            <Route path="/ptt-oil" element={<PTTOilFormWrap />}>
              <Route path="*" element={<PTTOilFormWrap />} />
            </Route>
            <Route path="/schema-to-form-wizard" element={<SchemaToFormWizard />}>
              <Route path="*" element={<SchemaToFormWizard />} />
            </Route>
            <Route path="/schema-override-test" element={<SchemaWithOverridesTest />}>
              <Route path="*" element={<SchemaWithOverridesTest />} />
            </Route>
            <Route path="/json-editor" element={<CodeEditor />} />
            <Route path="/schema-to-form-ptt" element={<SchemaToFormPTT />} />
            <Route path="/ptt/oil" element={<OilForm />}>
              <Route path="*" element={<OilForm />} />
            </Route>
            <Route path="/ptt/leeway" element={<LeewayForm />}>
              <Route path="*" element={<LeewayForm />} />
            </Route>
            <Route path="/ptt/larval" element={<LarvalForm />}>
              <Route path="*" element={<LarvalForm />} />
            </Route>
            <Route path="/ptt/ocean-drift" element={<OceanDriftForm />}>
              <Route path="*" element={<OceanDriftForm />} />
            </Route>
            <Route path="/all-ptt" element={<AllPTT />} />
            <Route path="/all-ptt/:scenario" element={<AllPTT />}>
              <Route path="*" element={<AllPTT />} />
            </Route>
            <Route path=***REMOVED***/resizer***REMOVED*** element={<ResizableSidebar />} />
            <Route path=***REMOVED***/meditor***REMOVED*** element={<MeditorForm />}>
              <Route path=***REMOVED*******REMOVED*** element={<MeditorForm />} />
            </Route>
            <Route path="/water-level" element={<WaterLevelForm />}>
              <Route path="*" element={<WaterLevelForm />} />
            </Route>
            <Route path="/water-level-collab" element={<COLLABWaterLevelForm />}>
              <Route path="*" element={<COLLABWaterLevelForm />} />
            </Route>
            <Route path="/water-level-collab-sheet" element={<COLLABWaterLevelFormSheet />}>
              <Route path="*" element={<COLLABWaterLevelFormSheet />} />
            </Route>
            <Route path="/binner-metadata/:dataset" element={<BinnerMetadataRoute />}>
              <Route path="*" element={<BinnerMetadataRoute />} />
            </Route>
            <Route path="/nested-data-test" element={<NestedDataTest />} />
            <Route path=***REMOVED***/json-path-tester***REMOVED*** element={<JsonPathTester />} />
            <Route path=***REMOVED***/platform-metadata***REMOVED*** element={<PlatformsMetadata />}>
              <Route path=***REMOVED*******REMOVED*** element={<PlatformsMetadata />} />
            </Route>
            <Route path=***REMOVED***/binner-metadata***REMOVED*** element={<></>}>
              <Route path=***REMOVED*******REMOVED*** element={<></>} />
            </Route>
            <Route path=***REMOVED***/modl***REMOVED*** element={<MODLForm />}>
              <Route path=***REMOVED*******REMOVED*** element={<MODLForm />} />
            </Route>
            <Route path=***REMOVED***/makra***REMOVED*** element={<MAKRAForm />}>
              <Route path=***REMOVED*******REMOVED*** element={<MAKRAForm />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ErrorBoundary>

  )
}

export default App
