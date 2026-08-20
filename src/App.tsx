***REMOVED***use client***REMOVED***

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
import {
  type INumberField,
  type IForm,
  type IFormValues,
  type IFieldInputProps,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
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
import MODLForm from ***REMOVED***@/Form/MODL/MODLForm***REMOVED***
import COLLABWaterLevelForm from ***REMOVED***@/WaterLevel/COLLAB/COLLABWaterLevelForm***REMOVED***
import COLLABWaterLevelFormSheet from ***REMOVED***@/WaterLevel/COLLAB/COLLABWaterLevelFormFromSheet***REMOVED***
import MakaraForm from ***REMOVED***@/Form/PAM/MakaraForm***REMOVED***
import COLLABWaterLevelFormDev from ***REMOVED***@/WaterLevel/COLLAB/COLLABWaterLevelFormDev***REMOVED***
import TestForm from ***REMOVED***@/WaterLevel/tester/Form***REMOVED***
import AssetForm from ***REMOVED***@/WaterLevel/COLLAB/AssetManager/Form***REMOVED***
import errorRenderer from ***REMOVED***@/utils/errorRenderer***REMOVED***
import OverrideOfSchemaArray from ***REMOVED***@/Form/TestForms/OverrideOfSchemaArray/OverrideOfSchemaArray***REMOVED***
import DefaultValueThatIsDependent from ***REMOVED***@/Form/TestForms/DefaultValue/DefaultValueThatIsDependent***REMOVED***
import ObjectListExample from ***REMOVED***@/Form/TestForms/ObjectListExample/ObjectListExample***REMOVED***
import ObjectWrapperWithSchema from ***REMOVED***@/Form/TestForms/ObjectWrapperWithSchema/ObjectWrapperWithSchema***REMOVED***
import TabsInPagesWithWrapper from ***REMOVED***@/Form/TestForms/TabsInPagesWithWrapper/TabsInPagesWithWrapper***REMOVED***
import ObjectListExampleWithSelectAsKeyField from ***REMOVED***@/Form/TestForms/ObjectListExample/ObjectListExampleWithSelectAsKeyField***REMOVED***
import FormWithCustomGeom from ***REMOVED***@/Form/TestForms/Geom/FormWithCustomGeom***REMOVED***
import ArrayWithWrapperObjects from ***REMOVED***@/Form/TestForms/ArrayWithWrapperObjects/ArrayWithWrapperObjects***REMOVED***
import ArrayWithTabs from ***REMOVED***@/Form/TestForms/ArrayWithTabs/ArrayWithTabs***REMOVED***
import MultiTabs from ***REMOVED***@/Form/TestForms/MultiTabs/MultiTabs***REMOVED***
import NestedLayoutInMultiTab from ***REMOVED***@/Form/TestForms/NestedLayoutInMultiTab***REMOVED***
import AllForms from ***REMOVED***@/Form/TestForms/AllForms***REMOVED***
import NestedDependents from ***REMOVED***@/Form/TestForms/NestedDependents/NestedDependents***REMOVED***
import { DragDropSandbox, ManagementUI } from ***REMOVED***@/Management***REMOVED***
import COLLABDebug from ***REMOVED***@/WaterLevel/COLLAB/Debug/COLLABDebug***REMOVED***

const PagedFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
      <Form
        form={pagedFormJson as IForm}
        formValueState={formValueState}
        className="p-20"
        urlNavigable={true}
      />
      <pre className="p-20 bg-slate-200 text-xs">{JSON.stringify(formValueState[0], null, 2)}</pre>
    </div>
  )
}

const WizardFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <div>
      <Form
        form={wizardFormJson as IForm}
        formValueState={formValueState}
        className="p-20"
        urlNavigable={true}
      />
      <pre className="p-20 bg-slate-200 text-xs">{JSON.stringify(formValueState[0], null, 2)}</pre>
    </div>
  )
}

interface ICustomFormProp {
  label: string
}
const CustomContext = createContext<ICustomFormProp>({ label: ***REMOVED******REMOVED*** })

const CustomElementFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <CustomContext.Provider value={{ label: ***REMOVED***Custom Label***REMOVED*** }}>
      <div>
        <Form
          form={customElementFormJson as IForm}
          formValueState={formValueState}
          className="p-20"
          urlNavigable={false}
          inputOverrides={{
            ***REMOVED***custom:number***REMOVED***: ({ field, value, onChange }: IFieldInputProps) => {
              const { label: labelFromContext } = useContext(CustomContext)
              const numberField = field as INumberField
              const [tempValue, setTempValue] = useState<number>(
                value !== undefined && value !== null ? +value : 0
              )
              const min = numberField?.constraints?.min ?? 0
              const max = numberField?.constraints?.max ?? 100
              const step = Number(numberField?.settings?.step ?? (max - min) / 100)
              return (
                <div>
                  <h2 className="p-4 text-xl bg-rose-800 text-white">{labelFromContext}</h2>
                  <FieldLabel field={field} />
                  <div className="flex flex-row gap-4">
                    <p className="font-bold w-20">{tempValue}</p>
                    <Slider
                      className="grow max-w-100 mt-1"
                      size="sm"
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
                </div>
              )
            },
          }}
        />
        <pre className="p-20 bg-slate-200 text-xs">
          {JSON.stringify(formValueState[0], null, 2)}
        </pre>
      </div>
    </CustomContext.Provider>
  )
}

const PTTOilFormWrap = (): ReactElement => {
  const form = pttOilSpillForm as IForm
  const formValueState = useState<IFormValues>(assignDefaultValuesToFormValues(form, {}))
  return (
    <>
      <Form className="p-20" formValueState={formValueState} form={form} />
      <CopyableJSONOutput string={JSON.stringify(formValueState[0], null, 2)} />
    </>
  )
}

const queryClient = new QueryClient()

function BinnerMetadataRoute(): ReactElement {
  const { dataset } = useParams<{ dataset: string }>()
  if (!dataset) {
    return <div>Dataset not specified</div>
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Metadata dataset={dataset} />
    </QueryClientProvider>
  )
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
    <ErrorBoundary fallbackRender={errorRenderer}>
      <div className="h-screen flex flex-col gap-4">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<FormManager />}>
              <Route path="*" element={<FormManager />} />
            </Route>
            <Route path="/schema-to-form" element={<SchemaToForm />} />
            <Route path="/set-tester" element={<SetTester />} />
            <Route path="/map-tester" element={<MapTester />} />
            <Route path="/page-form/" element={<PagedFormWrap />}>
              <Route path="*" element={<PagedFormWrap />} />
            </Route>
            <Route path="/wizard-form" element={<WizardFormWrap />}>
              <Route path="*" element={<WizardFormWrap />} />
            </Route>
            <Route path="/custom-form-element" element={<CustomElementFormWrap />}>
              <Route path="*" element={<CustomElementFormWrap />} />
            </Route>
            <Route path="/custom-element-context" element={<ExternalMetadataExample />} />
            <Route path="/form-with-defaults" element={<FormWithDefaults />} />
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
            <Route path="/resizer" element={<ResizableSidebar />} />
            <Route path="/meditor" element={<MeditorForm />}>
              <Route path="*" element={<MeditorForm />} />
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
            <Route
              path="/water-level-collab-sheet-so"
              element={<COLLABWaterLevelFormSheet useSchemaOnly={true} />}
            >
              <Route path="*" element={<COLLABWaterLevelFormSheet useSchemaOnly={true} />} />
            </Route>
            <Route path="/water-level-collab-debug" element={<COLLABDebug />}>
              <Route path="*" element={<COLLABDebug />} />
            </Route>
            <Route path="/water-level-collab-dev" element={<COLLABWaterLevelFormDev />}>
              <Route path="*" element={<COLLABWaterLevelFormDev />} />
            </Route>
            <Route path="/binner-metadata/:dataset" element={<BinnerMetadataRoute />}>
              <Route path="*" element={<BinnerMetadataRoute />} />
            </Route>
            <Route path="/nested-data-test" element={<NestedDataTest />} />
            <Route path="/json-path-tester" element={<JsonPathTester />} />
            <Route path="/platform-metadata" element={<PlatformsMetadata />}>
              <Route path="*" element={<PlatformsMetadata />} />
            </Route>
            <Route path="/binner-metadata" element={<></>}>
              <Route path="*" element={<></>} />
            </Route>
            <Route path="/modl" element={<MODLForm />}>
              <Route path="*" element={<MODLForm />} />
            </Route>
            <Route path="/PAM/makara" element={<MakaraForm />}>
              <Route path="*" element={<MakaraForm />} />
            </Route>
            <Route path="/water-level-test" element={<TestForm />}>
              <Route path="*" element={<TestForm />} />
            </Route>
            <Route path="/water-level-asset" element={<AssetForm />}>
              <Route path="*" element={<AssetForm />} />
            </Route>
            <Route path="/water-level-asset-wizard" element={<AssetForm configKey="wizard" />}>
              <Route path="*" element={<AssetForm configKey="wizard" />} />
            </Route>
            <Route path="/test">
              <Route path="override-of-schema-array" element={<OverrideOfSchemaArray />} />
              <Route path="default-value" element={<DefaultValueThatIsDependent />} />
              <Route path="object-list" element={<ObjectListExample />} />
              <Route
                path="object-list-select-field"
                element={<ObjectListExampleWithSelectAsKeyField />}
              />
              <Route path="object-wrapper" element={<ObjectWrapperWithSchema />}>
                <Route path="*" element={<ObjectWrapperWithSchema />} />
              </Route>
              <Route path="tab-in-pages" element={<TabsInPagesWithWrapper />} />
              <Route path="form-with-custom-geom" element={<FormWithCustomGeom />} />
              <Route path="array-with-tabs" element={<ArrayWithTabs />}>
                <Route path="*" element={<ArrayWithTabs />} />
              </Route>
              <Route path="array-with-wrapper-objects" element={<ArrayWithWrapperObjects />}>
                <Route path="*" element={<ArrayWithWrapperObjects />} />
              </Route>
              <Route path="multi-tabs" element={<MultiTabs />}>
                <Route path="*" element={<MultiTabs />} />
              </Route>
              <Route path="nested-layout-in-multi-tabs" element={<NestedLayoutInMultiTab />}>
                <Route path="*" element={<NestedLayoutInMultiTab />} />
              </Route>
              <Route path="nested-dependents" element={<NestedDependents />}>
                <Route path="*" element={<NestedDependents />} />
              </Route>
            </Route>
            <Route path="all-forms" element={<AllForms />}>
              <Route path="*" element={<AllForms />} />
            </Route>
            <Route path="management" element={<ManagementUI />}>
              <Route path="*" element={<ManagementUI />} />
            </Route>
            <Route path="management-dd" element={<DragDropSandbox />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  )
}

export default App
