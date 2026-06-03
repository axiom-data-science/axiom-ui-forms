import ArrayWithTabs from '@/Form/TestForms/ArrayWithTabs/ArrayWithTabs'
import DefaultValueThatIsDependent from '@/Form/TestForms/DefaultValue/DefaultValueThatIsDependent'
import ERDDAPForm from '@/Form/TestForms/ERDDAP/ERDDAPForm'
import FormWithCustomGeom from '@/Form/TestForms/Geom/FormWithCustomGeom'
import MultiTabs from '@/Form/TestForms/MultiTabs/MultiTabs'
import NestedLayoutInMultiTab from '@/Form/TestForms/NestedLayoutInMultiTab'
import ObjectListExample from '@/Form/TestForms/ObjectListExample/ObjectListExample'
import ObjectListExampleWithSelectAsKeyField from '@/Form/TestForms/ObjectListExample/ObjectListExampleWithSelectAsKeyField'
import ObjectWrapper from '@/Form/TestForms/ObjectWrapper/ObjectWrapper'
import ObjectWrapperWithSchema from '@/Form/TestForms/ObjectWrapperWithSchema/ObjectWrapperWithSchema'
import OverrideOfSchemaArray from '@/Form/TestForms/OverrideOfSchemaArray/OverrideOfSchemaArray'
import TabsInPagesWithWrapper from '@/Form/TestForms/TabsInPagesWithWrapper/TabsInPagesWithWrapper'
import { Tooltip } from '@axdspub/axiom-ui-utilities'
import {
  ArrowLeftIcon,
  CaretLeftIcon,
  CaretRightIcon,
  Cross1Icon,
  ListBulletIcon,
} from '@radix-ui/react-icons'
import { ReactElement, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const forms = [
  {
    label: 'Nested Layout in Multi-Tabs',
    path: 'nested-layout-in-multi-tabs',
    view: NestedLayoutInMultiTab,
  },
  {
    label: 'Array with tabs',
    path: 'array-with-tabs',
    view: ArrayWithTabs,
  },
  {
    label: 'Default value that is dependent',
    path: 'default-value-that-is-dependent',
    view: DefaultValueThatIsDependent,
  },
  {
    label: 'Custom geom',
    path: 'custom-geom',
    view: FormWithCustomGeom,
  },
  {
    label: 'Multi tabs',
    path: 'multi-tabs',
    view: MultiTabs,
  },
  {
    label: 'Object list',
    path: 'object-list',
    view: ObjectListExample,
  },
  {
    label: 'Object list with select',
    path: 'object-list-with-select',
    view: ObjectListExampleWithSelectAsKeyField,
  },
  {
    label: 'Object wrapper',
    path: 'object-wrapper',
    view: ObjectWrapper,
  },
  {
    label: 'Object wrapper with schema',
    path: 'object-wrapper-with-schema',
    view: ObjectWrapperWithSchema,
  },
  {
    label: 'Override of schema array',
    path: 'override-of-schema-array',
    view: OverrideOfSchemaArray,
  },
  {
    label: 'Tabs in page with wrapper',
    path: 'tabs-in-page-with-wrapper',
    view: TabsInPagesWithWrapper,
  },
  {
    label: 'Custom Geometry Input',
    path: 'custom-geometry-input',
    view: FormWithCustomGeom,
  },
  {
    label: 'ERDDAP',
    path: 'erddap',
    view: ERDDAPForm,
  },
]

const AllForms = (): ReactElement => {
  const [showNav, setShowNav] = useState(true)
  const nav = useLocation()
  const selectedFormKey = nav.pathname.split('/')[2] ?? null
  const View = forms.find((f) => f.path === selectedFormKey)?.view ?? null
  return (
    <div className={`h-full flex flex-row gap-4${showNav ? '' : ' pl-20'}`}>
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
                className={`block rounded  p-4 px-6 ${selectedFormKey === form.path ? 'bg-slate-200 font-semibold' : 'hover:bg-slate-100'}`}
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
