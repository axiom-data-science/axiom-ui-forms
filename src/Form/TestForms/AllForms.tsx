import MODLS3Form from '@/Form/MODL/s3/MODLS3Form'
import MODLS3SchemaForm from '@/Form/MODL/s3/MODLS3SchemaForm'
import AnyOfObjectSchema, { AnyOfObjectSchemaSingleProp } from '@/Form/AnyOfSchema/AnyOfObjectSchema'
import AnyOfSimpleSchema from '@/Form/AnyOfSchema/AnyOfSimpleSchema'
import AnyOfObjectSchemaWithOverrides from '@/Form/AnyOfSchema/AnyOfObjectSchemaWithOverrides'
import OneOfObjectSchema, { OneOfObjectSchemaSingleProp } from '@/Form/OneOfSchema/OneOfObjectSchema'
import OneOfSimpleSchema from '@/Form/OneOfSchema/OneOfSimpleSchema'
import OneOfObjectSchemaWithOverrides from '@/Form/OneOfSchema/OneOfObjectSchemaWithOverrides'
import ArrayWithTabs from '@/Form/TestForms/ArrayWithTabs/ArrayWithTabs'
import DefaultValueThatIsDependent from '@/Form/TestForms/DefaultValue/DefaultValueThatIsDependent'
import ERDDAPForm from '@/Form/TestForms/ERDDAP/ERDDAPForm'
import FormWithCustomGeom from '@/Form/TestForms/Geom/FormWithCustomGeom'
import MultiTabs from '@/Form/TestForms/MultiTabs/MultiTabs'
import NestedDependents from '@/Form/TestForms/NestedDependents/NestedDependents'
import NestedLayoutInMultiTab from '@/Form/TestForms/NestedLayoutInMultiTab'
import ObjectListExample from '@/Form/TestForms/ObjectListExample/ObjectListExample'
import ObjectListExampleWithSelectAsKeyField from '@/Form/TestForms/ObjectListExample/ObjectListExampleWithSelectAsKeyField'
import ObjectListKeyValueExample from '@/Form/TestForms/ObjectListExample/ObjectListKeyValueExample'
import ObjectListWithSchemaExample, { ObjectListKeyValueWithSchemaExample } from '@/Form/TestForms/ObjectListExample/ObjectListWithSchemaExample'
import ObjectWrapper from '@/Form/TestForms/ObjectWrapper/ObjectWrapper'
import ObjectWrapperWithSchema from '@/Form/TestForms/ObjectWrapperWithSchema/ObjectWrapperWithSchema'
import OverrideOfSchemaArray, { OverrideOfSchemaArrayWithTabs } from '@/Form/TestForms/OverrideOfSchemaArray/OverrideOfSchemaArray'
import PopulateHeadersFromUpload, {
  PrePopulatedPopulateHeadersFromUpload,
} from '@/Form/TestForms/PopulateHeadersFromUpload.tsx/PopulateHeadersFromUpload'
import TabsInPagesWithWrapper from '@/Form/TestForms/TabsInPagesWithWrapper/TabsInPagesWithWrapper'
import { Tooltip } from '@axdspub/axiom-ui-utilities'
import {
  CaretLeftIcon,
  CaretRightIcon,
  ListBulletIcon,
} from '@radix-ui/react-icons'
import { ReactElement, useEffect, useRef, useState } from 'react'
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
    label: 'Object list (key-value)',
    path: 'object-list-key-value',
    view: ObjectListKeyValueExample,
  },
  {
    label: 'Object list with select',
    path: 'object-list-with-select',
    view: ObjectListExampleWithSelectAsKeyField,
  },
  {
    label: 'Object list with schema',
    path: 'object-list-with-schema',
    view: ObjectListWithSchemaExample,
  },
  {
    label: 'Object list with key/value and schema',
    path: 'object-list-with-key-value-and-schema',
    view: ObjectListKeyValueWithSchemaExample,
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
    label: 'Override of schema array with embedded tabs',
    path: 'override-of-schema-array-with-embedded-tabs',
    view: OverrideOfSchemaArrayWithTabs,
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
  {
    label: 'Nested dependents',
    path: 'nested-dependents',
    view: NestedDependents,
  },
  {
    label: 'MODL S3 - schema',
    path: 'modl-s3-schema-form',
    view: MODLS3SchemaForm,
  },
  {
    label: 'AnyOf schema (object)',
    path: 'anyof-schema-object',
    view: AnyOfObjectSchema,
  },
  {
    label: 'AnyOf schema (single prop override)',
    path: 'anyof-schema-object-single-prop',
    view: AnyOfObjectSchemaSingleProp,
  },
  {
    label: 'AnyOf schema (object, overrides)',
    path: 'anyof-schema-object-overrides',
    view: AnyOfObjectSchemaWithOverrides,
  },
  {
    label: 'AnyOf schema (simple)',
    path: 'anyof-schema-simple',
    view: AnyOfSimpleSchema,
  },
  {
    label: 'OneOf schema (object)',
    path: 'oneof-schema-object',
    view: OneOfObjectSchema,
  },
  {
    label: 'OneOf schema (single prop override)',
    path: 'oneof-schema-single-prop-override',
    view: OneOfObjectSchemaSingleProp,
  },
  {
    label: 'OneOf schema (object, overrides)',
    path: 'oneof-schema-object-overrides',
    view: OneOfObjectSchemaWithOverrides,
  },
  {
    label: 'OneOf schema (simple)',
    path: 'oneof-schema-simple',
    view: OneOfSimpleSchema,
  },
  {
    label: 'MODL S3',
    path: 'modl-s3-form',
    view: MODLS3Form,
  },
  {
    label: 'File upload',
    path: 'file-upload',
    view: PopulateHeadersFromUpload,
  },
  {
    label: 'File upload (edit)',
    path: 'file-upload-edit',
    view: PrePopulatedPopulateHeadersFromUpload,
  },
]

const AllForms = (): ReactElement => {
  const [showNav, setShowNav] = useState(true)
  const nav = useLocation()
  const selectedFormKey = nav.pathname.split('/')[2] ?? null
  const View = forms.find((f) => f.path === selectedFormKey)?.view ?? null
  const navItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  useEffect(() => {
    if (!showNav || selectedFormKey === null) {
      return
    }

    const selectedLink = navItemRefs.current[selectedFormKey]
    if (selectedLink !== undefined && selectedLink !== null) {
      selectedLink.scrollIntoView({ block: 'center' })
    }
  }, [selectedFormKey, showNav])

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
                ref={(element) => {
                  navItemRefs.current[form.path] = element
                }}
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
