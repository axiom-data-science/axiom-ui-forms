import MODLS3Form from ***REMOVED***@/Form/MODL/s3/MODLS3Form***REMOVED***
import MODLS3SchemaForm from ***REMOVED***@/Form/MODL/s3/MODLS3SchemaForm***REMOVED***
import AnyOfObjectSchema, {
  AnyOfObjectSchemaSingleProp,
} from ***REMOVED***@/Form/AnyOfSchema/AnyOfObjectSchema***REMOVED***
import AnyOfSimpleSchema from ***REMOVED***@/Form/AnyOfSchema/AnyOfSimpleSchema***REMOVED***
import AnyOfObjectSchemaWithOverrides from ***REMOVED***@/Form/AnyOfSchema/AnyOfObjectSchemaWithOverrides***REMOVED***
import OneOfObjectSchema, {
  OneOfObjectSchemaSingleProp,
} from ***REMOVED***@/Form/OneOfSchema/OneOfObjectSchema***REMOVED***
import OneOfSimpleSchema from ***REMOVED***@/Form/OneOfSchema/OneOfSimpleSchema***REMOVED***
import OneOfObjectSchemaWithOverrides from ***REMOVED***@/Form/OneOfSchema/OneOfObjectSchemaWithOverrides***REMOVED***
import ArrayWithTabs from ***REMOVED***@/Form/TestForms/ArrayWithTabs/ArrayWithTabs***REMOVED***
import DefaultValueThatIsDependent from ***REMOVED***@/Form/TestForms/DefaultValue/DefaultValueThatIsDependent***REMOVED***
import ERDDAPForm from ***REMOVED***@/Form/TestForms/ERDDAP/ERDDAPForm***REMOVED***
import FormWithCustomGeom from ***REMOVED***@/Form/TestForms/Geom/FormWithCustomGeom***REMOVED***
import MultiTabs from ***REMOVED***@/Form/TestForms/MultiTabs/MultiTabs***REMOVED***
import NestedDependents from ***REMOVED***@/Form/TestForms/NestedDependents/NestedDependents***REMOVED***
import NestedLayoutInMultiTab from ***REMOVED***@/Form/TestForms/NestedLayoutInMultiTab***REMOVED***
import ObjectListExample, {
  NestedObjectListExample,
} from ***REMOVED***@/Form/TestForms/ObjectListExample/ObjectListExample***REMOVED***
import ObjectListExampleWithSelectAsKeyField from ***REMOVED***@/Form/TestForms/ObjectListExample/ObjectListExampleWithSelectAsKeyField***REMOVED***
import ObjectListKeyValueExample from ***REMOVED***@/Form/TestForms/ObjectListExample/ObjectListKeyValueExample***REMOVED***
import ObjectListWithSchemaExample, {
  ObjectListKeyValueWithSchemaExample,
} from ***REMOVED***@/Form/TestForms/ObjectListExample/ObjectListWithSchemaExample***REMOVED***
import ObjectWrapper from ***REMOVED***@/Form/TestForms/ObjectWrapper/ObjectWrapper***REMOVED***
import ObjectWrapperWithSchema from ***REMOVED***@/Form/TestForms/ObjectWrapperWithSchema/ObjectWrapperWithSchema***REMOVED***
import OverrideOfSchemaArray, {
  OverrideOfSchemaArrayWithTabs,
} from ***REMOVED***@/Form/TestForms/OverrideOfSchemaArray/OverrideOfSchemaArray***REMOVED***
import PopulateHeadersFromUpload, {
  PrePopulatedPopulateHeadersFromUpload,
} from ***REMOVED***@/Form/TestForms/PopulateHeadersFromUpload.tsx/PopulateHeadersFromUpload***REMOVED***
import TabsInPagesWithWrapper from ***REMOVED***@/Form/TestForms/TabsInPagesWithWrapper/TabsInPagesWithWrapper***REMOVED***
import { Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { CaretLeftIcon, CaretRightIcon, ListBulletIcon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import { ReactElement, useEffect, useRef, useState } from ***REMOVED***react***REMOVED***
import { Link, useLocation } from ***REMOVED***react-router-dom***REMOVED***
import MergeFieldTestForm from ***REMOVED***@/Form/TestForms/MergeFieldTest/MergeFieldTest***REMOVED***
import DeepNestedObjectWrapper from ***REMOVED***@/Form/TestForms/DeepNestedObjectWrapper/DeepNestedObjectWrapper***REMOVED***
import JSONWithOtherFields, {
  JSONWithOtherFieldsForm,
} from ***REMOVED***@/Form/TestForms/JSONWithOtherFields/JSONWithOtherFields***REMOVED***
import FormWithPagesAndSubmitButton from ***REMOVED***@/Form/TestForms/FormWithPagesAndSubmitButton/FormWithPagesAndSubmitButton***REMOVED***
import SchemaValidationExample from ***REMOVED***@/Form/TestForms/OverrideOfSchemaArray/SchemaValidationExample***REMOVED***
import {
  EmbeddedArraysForm,
  EmbeddedArraysFromSchemaWithOverrides,
} from ***REMOVED***@/Form/TestForms/EmbeddedArrays/EmbeddedArrays***REMOVED***
import ObjectSchemaOverride from ***REMOVED***@/Form/TestForms/ObjectSchemaOverride/ObjectSchemaOverride***REMOVED***
import SchemaWithOverridesAndEmbeddedObjectWrapperInArray from ***REMOVED***@/Form/TestForms/SchemaWithOverridesAndEmbeddedObjectWrapperInArray/SchemaWithOverridesAndEmbeddedObjectWrapperInArray***REMOVED***

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
    label: ***REMOVED***Object list (key-value)***REMOVED***,
    path: ***REMOVED***object-list-key-value***REMOVED***,
    view: ObjectListKeyValueExample,
  },
  {
    label: ***REMOVED***Object list with select***REMOVED***,
    path: ***REMOVED***object-list-with-select***REMOVED***,
    view: ObjectListExampleWithSelectAsKeyField,
  },
  {
    label: ***REMOVED***Object list with schema***REMOVED***,
    path: ***REMOVED***object-list-with-schema***REMOVED***,
    view: ObjectListWithSchemaExample,
  },
  {
    label: ***REMOVED***Object list with key/value and schema***REMOVED***,
    path: ***REMOVED***object-list-with-key-value-and-schema***REMOVED***,
    view: ObjectListKeyValueWithSchemaExample,
  },
  {
    label: ***REMOVED***Nested object list***REMOVED***,
    path: ***REMOVED***nested-object-list***REMOVED***,
    view: NestedObjectListExample,
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
    label: ***REMOVED***Override of schema array with embedded tabs***REMOVED***,
    path: ***REMOVED***override-of-schema-array-with-embedded-tabs***REMOVED***,
    view: OverrideOfSchemaArrayWithTabs,
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
    label: ***REMOVED***MODL S3 - schema***REMOVED***,
    path: ***REMOVED***modl-s3-schema-form***REMOVED***,
    view: MODLS3SchemaForm,
  },
  {
    label: ***REMOVED***AnyOf schema (object)***REMOVED***,
    path: ***REMOVED***anyof-schema-object***REMOVED***,
    view: AnyOfObjectSchema,
  },
  {
    label: ***REMOVED***AnyOf schema (single prop override)***REMOVED***,
    path: ***REMOVED***anyof-schema-object-single-prop***REMOVED***,
    view: AnyOfObjectSchemaSingleProp,
  },
  {
    label: ***REMOVED***AnyOf schema (object, overrides)***REMOVED***,
    path: ***REMOVED***anyof-schema-object-overrides***REMOVED***,
    view: AnyOfObjectSchemaWithOverrides,
  },
  {
    label: ***REMOVED***AnyOf schema (simple)***REMOVED***,
    path: ***REMOVED***anyof-schema-simple***REMOVED***,
    view: AnyOfSimpleSchema,
  },
  {
    label: ***REMOVED***OneOf schema (object)***REMOVED***,
    path: ***REMOVED***oneof-schema-object***REMOVED***,
    view: OneOfObjectSchema,
  },
  {
    label: ***REMOVED***OneOf schema (single prop override)***REMOVED***,
    path: ***REMOVED***oneof-schema-single-prop-override***REMOVED***,
    view: OneOfObjectSchemaSingleProp,
  },
  {
    label: ***REMOVED***OneOf schema (object, overrides)***REMOVED***,
    path: ***REMOVED***oneof-schema-object-overrides***REMOVED***,
    view: OneOfObjectSchemaWithOverrides,
  },
  {
    label: ***REMOVED***OneOf schema (simple)***REMOVED***,
    path: ***REMOVED***oneof-schema-simple***REMOVED***,
    view: OneOfSimpleSchema,
  },
  {
    label: ***REMOVED***MODL S3***REMOVED***,
    path: ***REMOVED***modl-s3-form***REMOVED***,
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
  {
    label: ***REMOVED***Merge field test***REMOVED***,
    path: ***REMOVED***merge-field-test***REMOVED***,
    view: MergeFieldTestForm,
  },
  {
    label: ***REMOVED***Deep nested object wrapper***REMOVED***,
    path: ***REMOVED***deep-nested-object-wrapper***REMOVED***,
    view: DeepNestedObjectWrapper,
  },
  {
    label: ***REMOVED***JSON with other fields***REMOVED***,
    path: ***REMOVED***json-with-other-fields***REMOVED***,
    view: JSONWithOtherFields,
  },
  {
    label: ***REMOVED***JSON with other fields form***REMOVED***,
    path: ***REMOVED***json-with-other-fields-form***REMOVED***,
    view: JSONWithOtherFieldsForm,
  },
  {
    label: ***REMOVED***Form with pages and submit button***REMOVED***,
    path: ***REMOVED***form-with-pages-and-submit-button***REMOVED***,
    view: FormWithPagesAndSubmitButton,
  },
  {
    label: ***REMOVED***Embedded Arrays***REMOVED***,
    path: ***REMOVED***embedded-arrays***REMOVED***,
    view: EmbeddedArraysForm,
  },
  {
    label: ***REMOVED***Embedded Arrays from schema with overrides***REMOVED***,
    path: ***REMOVED***embedded-arrays-schema-with-overrides***REMOVED***,
    view: EmbeddedArraysFromSchemaWithOverrides,
  },
  {
    label: ***REMOVED***Schema validation examples***REMOVED***,
    path: ***REMOVED***schema-validation-examples***REMOVED***,
    view: SchemaValidationExample,
  },
  {
    label: ***REMOVED***Object schema override***REMOVED***,
    path: ***REMOVED***object-schema-override***REMOVED***,
    view: ObjectSchemaOverride,
  },
  {
    label: ***REMOVED***Schema with Overrides and Embedded Object Wrapper in Array***REMOVED***,
    path: ***REMOVED***schema-with-overrides-and-embedded-object-wrapper-in-array***REMOVED***,
    view: SchemaWithOverridesAndEmbeddedObjectWrapperInArray,
  },
]

const AllForms = (): ReactElement => {
  const [showNav, setShowNav] = useState(true)
  const nav = useLocation()
  const selectedFormKey = nav.pathname.split(***REMOVED***/***REMOVED***)[2] ?? null
  const View = forms.find((f) => f.path === selectedFormKey)?.view ?? null
  const navItemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})

  useEffect(() => {
    if (!showNav || selectedFormKey === null) {
      return
    }

    const selectedLink = navItemRefs.current[selectedFormKey]
    if (selectedLink !== undefined && selectedLink !== null) {
      selectedLink.scrollIntoView({ block: ***REMOVED***center***REMOVED*** })
    }
  }, [selectedFormKey, showNav])

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
                ref={(element) => {
                  navItemRefs.current[form.path] = element
                }}
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
