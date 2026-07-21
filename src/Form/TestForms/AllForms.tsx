import MODLS3Form from ***REMOVED***@/Form/MODL/s3/MODLS3Form***REMOVED***
import ArrayWithTabs from ***REMOVED***@/Form/TestForms/ArrayWithTabs/ArrayWithTabs***REMOVED***
import DefaultValueThatIsDependent from ***REMOVED***@/Form/TestForms/DefaultValue/DefaultValueThatIsDependent***REMOVED***
import ERDDAPForm from ***REMOVED***@/Form/TestForms/ERDDAP/ERDDAPForm***REMOVED***
import FormWithCustomGeom from ***REMOVED***@/Form/TestForms/Geom/FormWithCustomGeom***REMOVED***
import MultiTabs from ***REMOVED***@/Form/TestForms/MultiTabs/MultiTabs***REMOVED***
import NestedDependents from ***REMOVED***@/Form/TestForms/NestedDependents/NestedDependents***REMOVED***
import NestedLayoutInMultiTab from ***REMOVED***@/Form/TestForms/NestedLayoutInMultiTab***REMOVED***
import ObjectListExample from ***REMOVED***@/Form/TestForms/ObjectListExample/ObjectListExample***REMOVED***
import ObjectListExampleWithSelectAsKeyField from ***REMOVED***@/Form/TestForms/ObjectListExample/ObjectListExampleWithSelectAsKeyField***REMOVED***
import ObjectWrapper from ***REMOVED***@/Form/TestForms/ObjectWrapper/ObjectWrapper***REMOVED***
import ObjectWrapperWithSchema from ***REMOVED***@/Form/TestForms/ObjectWrapperWithSchema/ObjectWrapperWithSchema***REMOVED***
import OverrideOfSchemaArray from ***REMOVED***@/Form/TestForms/OverrideOfSchemaArray/OverrideOfSchemaArray***REMOVED***
import PopulateHeadersFromUpload, {
  PrePopulatedPopulateHeadersFromUpload,
} from ***REMOVED***@/Form/TestForms/PopulateHeadersFromUpload.tsx/PopulateHeadersFromUpload***REMOVED***
import TabsInPagesWithWrapper from ***REMOVED***@/Form/TestForms/TabsInPagesWithWrapper/TabsInPagesWithWrapper***REMOVED***
import { Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import {
  ArrowLeftIcon,
  CaretLeftIcon,
  CaretRightIcon,
  Cross1Icon,
  ListBulletIcon,
} from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { ReactElement, useState } from ***REMOVED***react***REMOVED***
import { Link, useLocation } from ***REMOVED***react-router-dom***REMOVED***

const forms = [
  {
    label: ***REMOVED***Nested Layout in Multi-Tabs***REMOVED***,
    path: ***REMOVED***nested-layout-in-multi-tabs***REMOVED***,
    view: NestedLayoutInMultiTab,
  },
  {
    label: ***REMOVED***Array with tabs***REMOVED***,
    path: ***REMOVED***array-with-tabs***REMOVED***,
    view: ArrayWithTabs,
  },
  {
    label: ***REMOVED***Default value that is dependent***REMOVED***,
    path: ***REMOVED***default-value-that-is-dependent***REMOVED***,
    view: DefaultValueThatIsDependent,
  },
  {
    label: ***REMOVED***Custom geom***REMOVED***,
    path: ***REMOVED***custom-geom***REMOVED***,
    view: FormWithCustomGeom,
  },
  {
    label: ***REMOVED***Multi tabs***REMOVED***,
    path: ***REMOVED***multi-tabs***REMOVED***,
    view: MultiTabs,
  },
  {
    label: ***REMOVED***Object list***REMOVED***,
    path: ***REMOVED***object-list***REMOVED***,
    view: ObjectListExample,
  },
  {
    label: ***REMOVED***Object list with select***REMOVED***,
    path: ***REMOVED***object-list-with-select***REMOVED***,
    view: ObjectListExampleWithSelectAsKeyField,
  },
  {
    label: ***REMOVED***Object wrapper***REMOVED***,
    path: ***REMOVED***object-wrapper***REMOVED***,
    view: ObjectWrapper,
  },
  {
    label: ***REMOVED***Object wrapper with schema***REMOVED***,
    path: ***REMOVED***object-wrapper-with-schema***REMOVED***,
    view: ObjectWrapperWithSchema,
  },
  {
    label: ***REMOVED***Override of schema array***REMOVED***,
    path: ***REMOVED***override-of-schema-array***REMOVED***,
    view: OverrideOfSchemaArray,
  },
  {
    label: ***REMOVED***Tabs in page with wrapper***REMOVED***,
    path: ***REMOVED***tabs-in-page-with-wrapper***REMOVED***,
    view: TabsInPagesWithWrapper,
  },
  {
    label: ***REMOVED***Custom Geometry Input***REMOVED***,
    path: ***REMOVED***custom-geometry-input***REMOVED***,
    view: FormWithCustomGeom,
  },
  {
    label: ***REMOVED***ERDDAP***REMOVED***,
    path: ***REMOVED***erddap***REMOVED***,
    view: ERDDAPForm,
  },
  {
    label: ***REMOVED***Nested dependents***REMOVED***,
    path: ***REMOVED***nested-dependents***REMOVED***,
    view: NestedDependents,
  },
  {
    label: ***REMOVED***MODL S3***REMOVED***,
    path: ***REMOVED***modl-s3***REMOVED***,
    view: MODLS3Form,
  },
  {
    label: ***REMOVED***File upload***REMOVED***,
    path: ***REMOVED***file-upload***REMOVED***,
    view: PopulateHeadersFromUpload,
  },
  {
    label: ***REMOVED***File upload (edit)***REMOVED***,
    path: ***REMOVED***file-upload-edit***REMOVED***,
    view: PrePopulatedPopulateHeadersFromUpload,
  },
]

const AllForms = (): ReactElement => {
  const [showNav, setShowNav] = useState(true)
  const nav = useLocation()
  const selectedFormKey = nav.pathname.split(***REMOVED***/***REMOVED***)[2] ?? null
  const View = forms.find((f) => f.path === selectedFormKey)?.view ?? null
  return (
    <div className={`h-full flex flex-row gap-4${showNav ? ***REMOVED******REMOVED*** : ***REMOVED*** pl-20***REMOVED***}`}>
      {showNav ? (
        <div className="w-70 h-full relative bg-white/80 border-2 border-slate-200 rounded shadow-lg overflow-auto z-50">
          <CaretLeftIcon
            className="absolute top-4 right-2 cursor-pointer w-8 h-8"
            onClick={() => setShowNav(false)}
          />
          <h2 className="text-xl font-bold mb-4 flex flex-row gap-2 items-center bg-white p-6 py-4">
            <ListBulletIcon className=" w-6 h-6" /> All Forms
          </h2>
          <div className="flex flex-col absolute left-0 right-0 top-20 bottom-0 overflow-auto">
            {forms.map((form) => (
              <Link
                key={form.path}
                to={`/all-forms/${form.path}`}
                className={`block rounded  p-4 px-6 ${selectedFormKey === form.path ? ***REMOVED***bg-slate-200 font-semibold***REMOVED*** : ***REMOVED***hover:bg-slate-100***REMOVED***}`}
              >
                {form.label}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <span onClick={() => setShowNav(true)} className="fixed top-4 left-4  z-50 cursor-pointer">
          <Tooltip content="Show form navigation" side="right" dark={true}>
            <span className="flex flex-row gap-1 items-center bg-white/80 rounded shadow-lg p-2 text-slate-400 hover:text-slate-800">
              <ListBulletIcon className="w-6 h-6" />
              <CaretRightIcon className="w-6 h-6" />
            </span>
          </Tooltip>
        </span>
      )}
      <div className="overflow-auto grow">{View && <View />}</div>
    </div>
  )
}

export default AllForms
