'use client'

import FormManager from '@/Form/Manage/Manage'
import React, { createContext, useContext, useState, type ReactElement } from 'react'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import SetTester from '@/SetTester'
import MapTester from '@/Form/MapTester'
import SchemaToForm from '@/Form/SchemaToForm'
import pagedFormJson from '@/Form/testData/forms/pagedForm.json'
import wizardFormJson from '@/Form/testData/forms/wizardForm.json'
import pttOilSpillForm from '@/Form/testData/forms/pttFormConfigOpenOilModel.json'
import customElementFormJson from '@/Form/testData/forms/customElementForm.json'
import {
  type INumberField,
  type IForm,
  type IFormValues,
  type IFieldInputProps,
} from '@/Form/Creator/FormCreatorTypes'
import Form from '@/Form/Creator/FormCreator'
import FieldLabel from '@/Form/Components/FieldLabel'
import { Slider } from '@axdspub/axiom-ui-utilities'
import ExternalMetadataExample from '@/Form/ExternalMetadataExample'
import FormWithDefaults from '@/Form/FormWithDefaults'

import { CopyableJSONOutput } from '@/Form/Manage/CopyableJSONOutput'
import SchemaToFormWizard from '@/Form/Creator/SchemaToFormWizard'
import CodeEditor from '@/Form/CodeEditor'
import SchemaWithOverridesTest from '@/Form/SchemaWithOverridesTest'
import { assignDefaultValuesToFormValues } from '@/utils/manipulators'
import { ErrorBoundary } from 'react-error-boundary'
import SchemaToFormPTT from '@/Form/SchemaToFormPTT'
import OilForm from '@/PTT/Oil/OilForm'
import LeewayForm from '@/PTT/Leeway/LeewayForm'
import LarvalForm from '@/PTT/Larval/LarvalForm'
import OceanDriftForm from '@/PTT/OceanDrift/OceanDriftForm'
import AllPTT from '@/PTT/All'
import ResizableSidebar from '@/TestResize'
import layoutAtom, { getWindowSize } from '@/utils/responsive/layoutState'
import { useAtom } from 'jotai'
import { debounce } from 'lodash-es'
import MeditorForm from '@/Meditor/MeditorForm'
import WaterLevelForm from '@/WaterLevel/WaterLevelForm'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Metadata from '@/Binner/Metadata'
import NestedDataTest from '@/Form/NestedDataTest'
import JsonPathTester from '@/Form/JSONPathTester'
import PlatformsMetadata from '@/Platforms/PlatformsMetadata'
import MODLForm from '@/Form/MODL/MODLForm'
import COLLABWaterLevelForm from '@/WaterLevel/COLLAB/COLLABWaterLevelForm'
import COLLABWaterLevelFormSheet from '@/WaterLevel/COLLAB/COLLABWaterLevelFormFromSheet'
import PAMForm from '@/Form/PAM/PAMForm'
import COLLABWaterLevelFormDev from '@/WaterLevel/COLLAB/COLLABWaterLevelFormDev'
import TestForm from '@/WaterLevel/tester/Form'
import AssetForm from '@/WaterLevel/COLLAB/AssetManager/Form'
import errorRenderer from '@/utils/errorRenderer'
import OverrideOfSchemaArray from '@/Form/TestForms/OverrideOfSchemaArray/OverrideOfSchemaArray'
import DefaultValueThatIsDependent from '@/Form/TestForms/DefaultValue/DefaultValueThatIsDependent'
import ObjectListExample from '@/Form/TestForms/ObjectListExample/ObjectListExample'
import ObjectWrapperWithSchema from '@/Form/TestForms/ObjectWrapperWithSchema/ObjectWrapperWithSchema'
import TabsInPagesWithWrapper from '@/Form/TestForms/TabsInPagesWithWrapper/TabsInPagesWithWrapper'
import ObjectListExampleWithSelectAsKeyField from '@/Form/TestForms/ObjectListExample/ObjectListExampleWithSelectAsKeyField'
import FormWithCustomGeom from '@/Form/TestForms/Geom/FormWithCustomGeom'
import ArrayWithWrapperObjects from '@/Form/TestForms/ArrayWithWrapperObjects/ArrayWithWrapperObjects'
import ArrayWithTabs from '@/Form/TestForms/ArrayWithTabs/ArrayWithTabs'
import MultiTabs from '@/Form/TestForms/MultiTabs/MultiTabs'
import NestedLayoutInMultiTab from '@/Form/TestForms/NestedLayoutInMultiTab'
import AllForms from '@/Form/TestForms/AllForms'
import NestedDependents from '@/Form/TestForms/NestedDependents/NestedDependents'
import { DragDropSandbox, ManagementUI } from '@/Management'
import PARSForm from '@/Form/PAM/PARS/PARS'

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
const CustomContext = createContext<ICustomFormProp>({ label: '' })

const CustomElementFormWrap = (): ReactElement => {
  const formValueState = useState<IFormValues>({})
  return (
    <CustomContext.Provider value={{ label: 'Custom Label' }}>
      <div>
        <Form
          form={customElementFormJson as IForm}
          formValueState={formValueState}
          className="p-20"
          urlNavigable={false}
          inputOverrides={{
            'custom:number': ({ field, value, onChange }: IFieldInputProps) => {
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

  window.addEventListener('resize', debounceUpdateLayout)
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
            <Route path="/water-level-collab-sheet-so" element={<COLLABWaterLevelFormSheet useSchemaOnly={true} />}>
              <Route path="*" element={<COLLABWaterLevelFormSheet useSchemaOnly={true} />} />
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
            <Route path="/PAM" element={<PAMForm />}>
              <Route path="*" element={<PAMForm />} />
            </Route>
            <Route path="/PARS" element={<PARSForm />}>
              <Route path="*" element={<PARSForm />} />
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
