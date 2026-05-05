# Axiom UI Forms - Architecture Overview

## Next Session Work Items
*(Added May 4 2026 — safe to delete once done)*

1. **Browser verification** — test nested multiple objects via `IFormOverride`/`IFormFieldOverride`; test `defaultValue` for nested + array fields (now seeded by `seedNestedDefaults` in formEngine.ts)
2. **Geometry.tsx refactor** (`src/Form/Components/Inputs/Geometry.tsx`) — enabled shape types should react to an external form field (needs `useFormValue` hook from formEngine/hooks.ts); add `settings.maxLineStringPoints` cap; add new optional props to `IGeometryField.settings` in FormCreatorTypes.ts
3. **Simplify `cleanAndUpdateFormValuesWithFieldValue`** (`src/utils/manipulators.ts:157`) — double-write pattern, large commented-out block, missing test coverage in manipulators.test.ts
4. **onChange propagation** — `onChange` prop drilled through FieldCreator → OneOfMultiple → InputComponent; most internal writes can go direct via `setFormValues` from FormContext; keep external `onChange` callback for consumers
5. **Tabs verification** — confirm override pipeline passes `tabs` (IFormLayoutTabOverride); test with multiple-object + tabs layout; key files: TabLayout.tsx, FormSection.tsx

**Test baseline:** 152/152 passing. 2 pre-existing failures (FieldLabel, Boolean — @axdspub/axiom-ui-utilities resolution in test env, unrelated).

---

## Table of Contents
1. [Core Architecture](#core-architecture)
2. [Key Files Map](#key-files-map)
3. [Rendering Flow](#rendering-flow)
4. [Condition Evaluation Logic](#condition-evaluation-logic)
5. [Nested Field Handling](#nested-field-handling)
6. [Multiple Fields Handling](#multiple-fields-handling)
7. [Override System](#override-system)
8. [State Management](#state-management)
9. [Root Causes of Known Bugs](#root-causes-of-known-bugs)

---

## Core Architecture

The axiom-ui-forms library is a React-based dynamic form builder that:
- Renders forms from JSON configuration (`IForm`)
- Supports conditional field visibility/disabling
- Handles nested object fields with recursive rendering
- Applies field and form-level overrides
- Manages form state through React state and Jotai atoms
- Generates forms from JSON Schemas with optional overrides

### Technology Stack
- **React** - Core rendering framework
- **TypeScript** - Type safety
- **Jotai** - State management (atoms)
- **Lodash** - Utility functions (get, set, merge)
- **AJV** - JSON Schema validation

---

## Key Files Map

### Type Definitions
| File | Purpose | Key Types |
|------|---------|-----------|
| `src/Form/Creator/FormCreatorTypes.ts` | Master type definitions | `IForm`, `IFormField`, `IFieldCondition`, `ICheckConditionResult`, `IFormOverride`, `IFormFieldOverride` |

### Core Components

| File | Purpose | Exports |
|------|---------|---------|
| `src/Form/Creator/FormCreator.tsx` | Main form rendering component | `FormCreator`, `SchemaFormCreator`, `seedFormValuesWithDefaults` |
| `src/Form/Creator/FormContextProvider.tsx` | React Context for form state | `FormContext`, `FormContextProvider`, `useFormContext`, `IFormContextValue` |
| `src/Form/Creator/FormFields.tsx` | Renders array of fields | `FormFields` |
| `src/Form/Creator/FormSection.tsx` | Layout wrapper for form sections | `FormSection` |
| `src/Form/Creator/Page.tsx` | Page/multi-page layout | `Page` |
| `src/Form/Creator/TabLayout.tsx` | Tab navigation layout | `TabLayout` |
| `src/Form/Creator/Wizard.tsx` | Wizard/step layout | `WizardLayout` |

### Field Rendering

| File | Purpose | Exports |
|------|---------|---------|
| `src/Form/Components/FieldCreator.tsx` | **Primary field dispatcher** - decides when/how to render fields; checks conditions | `FieldCreator`, `MultipleFieldCreator` |
| `src/Form/Components/FieldLabel.tsx` | Renders field labels | `FieldLabel` |
| `src/Form/Components/Inputs/inputMap.ts` | Maps field type → React component | input type registry |
| `src/Form/Components/Inputs/Object.tsx` | **Container field renderer** - renders nested object fields | `ObjectInput` |
| `src/Form/Components/Inputs/OneOfInput.tsx` | OneOf choice field (placeholder) | `OneOfInput` |
| `src/Form/Components/Inputs/String.tsx` | Text input | `StringInput` |
| `src/Form/Components/Inputs/Number.tsx` | Number input | `NumberInput` |
| `src/Form/Components/Inputs/Boolean.tsx` | Boolean checkbox | `BooleanInput` |
| `src/Form/Components/Inputs/SingleSelect.tsx` | Select/dropdown | `SingleSelect` |
| `src/Form/Components/Inputs/Date.tsx`, `Time.tsx`, `DateTime.tsx` | Date/time inputs | date/time inputs |

### Utilities

| File | Purpose | Key Functions |
|------|---------|---|
| `src/utils/validators.ts` | Condition checking engine | `checkCondition()`, `checkFieldCondition()`, `runCheck()`, `compare()`, `calculateSectionStatus()` |
| `src/utils/getters.ts` | Path/value extraction from forms | `getFieldValue()`, `getFieldsFromFormSection()`, `getPathFromField()`, `makeJsonPath()`, `getValueFromRelativePath()` |
| `src/utils/manipulators.ts` | Form structure operations | `addFieldPath()`, `copyAndAddPathToFields()`, `cleanFormValuesLevel()`, `updateFormValuesWithFieldValue()`, `assignDefaultValuesToFormValues()`, `createOneOfMultipleField()` |
| `src/utils/mergers.ts` | Override merging | `groupOverrideFieldsByProp()`, `buildFieldMapFromForm()`, `mergeField()`, `mergeFields()`, `mergeFormSections()` |
| `src/utils/schemaToFormHelpers.ts` | JSON Schema → Form conversion | `schemaToFormObject()`, `overridesAndSchemaToFormObject()`, `schemaToFormField()`, `mergeFormField()` |

### State Management

| File | Purpose | Exports |
|------|---------|---------|
| `src/state/formValuesAtom.ts` | Jotai atom for form values with URL persistence | `formValuesAtom` |
| `src/state/formAtom.ts` | Jotai atom for form configuration | Injected via context |
| `src/state/formMappingAtom.ts` | Jotai atom for form mapping | Form mapping state |
| `src/utils/responsive/layoutState.ts` | Responsive layout state | `layoutAtom` |

---

## Rendering Flow

### High-Level Flow
```
FormCreator (main component)
    ├─ copyAndAddPathToFields() - Add path metadata to fields
    ├─ seedFormValuesWithDefaults() - Apply top-level defaults
    ├─ create FormContext with form + values + setFormValues
    ├─ FormContextProvider wraps children
    └─ FormSection (dispatches to layouts)
        ├─ Pages/Tabs/Wizard/Fields (based on form.navigationType)
        └─ FormFields (renders field list)
            └─ FieldCreator (per field)
                ├─ checkCondition() - determine visibility/disabled
                ├─ MultipleFieldCreator (if field.multiple === true)
                │   └─ OneOfMultiple (for each array element)
                └─ InputComponent (type-specific renderer)
                    └─ ObjectInput (if type === ***REMOVED***object***REMOVED***)
                        └─ FieldCreator (recursively for nested fields)
```

### Step-by-Step: FormCreator

**Location**: [src/Form/Creator/FormCreator.tsx](src/Form/Creator/FormCreator.tsx#L98)

```typescript
const FormCreator = ({
  form,           // IForm - the form configuration
  formValueState, // Optional [values, setter]
  initialFormValues, // Default values to merge
  ...props
}) => {
  // 1. Clone form and add path metadata
  const activeForm = copyAndAddPathToFields(form)
  
  // 2. Seed form values with defaults from fields
  const [formValues, setFormValues] = formValueState ?? 
    useState({
      ...seedFormValuesWithDefaults(activeForm),
      ...initialFormValues
    })
  
  // 3. Provide context to children
  return (
    <FormContextProvider 
      form={activeForm}
      formValues={formValues}
      setFormValues={setFormValues}
      {...props}
    >
      <FormSection formSection={activeForm} onChange={...} />
    </FormContextProvider>
  )
}
```

### Step-by-Step: FieldCreator (Condition Check)

**Location**: [src/Form/Components/FieldCreator.tsx](src/Form/Components/FieldCreator.tsx#L206)

```typescript
const FieldCreator = ({
  field,
  value,
  onChange,
  conditionResult,      // Optional - can be pre-computed
  disabled
}) => {
  const { form, formValues, setFormValues } = useFormContext()
  
  // 1. Check condition (unless pre-computed)
  conditionResult = conditionResult ?? checkCondition(field, formValues)
  
  // 2. Apply condition result to visibility/disabled
  if (conditionResult.pass && conditionResult.result === ***REMOVED***exclude***REMOVED***) {
    return null  // Hide field
  } else if (conditionResult.pass && conditionResult.result === ***REMOVED***disable***REMOVED***) {
    disabled = true
  }
  
  // 3. Dispatch to handler based on multiple flag
  if (field.multiple === true) {
    return <MultipleFieldCreator field={field} onChange={...} />
  } else {
    return <InputComponent 
      field={field} 
      value={fieldValue}
      onChange={...}
      disabled={disabled}
    />
  }
}
```

### Step-by-Step: ObjectInput (Nested Fields)

**Location**: [src/Form/Components/Inputs/Object.tsx](src/Form/Components/Inputs/Object.tsx#L1)

```typescript
const ObjectInput = ({ field, onChange, value, disabled }) => {
  const initialValue = value ?? {}  // The object being edited
  
  if (field.fields !== undefined) {
    return (
      <div>
        {field.fields.map((childField) => {
          // BUG #1: Condition only checked when field.multiple === true
          const conditionResult = field.multiple
            ? checkCondition(childField, initialValue)
            : undefined
          
          return (
            <FieldCreator
              field={childField}
              value={initialValue[childField.id]}
              onChange={(e) => {
                const newValue = cloneObject(initialValue)
                newValue[childField.id] = e
                onChange(newValue)
              }}
              conditionResult={conditionResult}  // BUG #2: Wrong context
            />
          )
        })}
      </div>
    )
  }
}
```

---

## Condition Evaluation Logic

### Types

**IFieldCondition** - Single condition
```typescript
interface IFieldCondition {
  dependsOn?: string | string[]      // Field path to check
  field?: string | string[]           // Alias for dependsOn
  value?: string | number | boolean  // Expected value
  operator?: ***REMOVED***=***REMOVED*** | ***REMOVED***>***REMOVED*** | ***REMOVED***<***REMOVED*** | ***REMOVED***>=***REMOVED*** | ***REMOVED***<=***REMOVED*** | ***REMOVED***!=***REMOVED*** | ...
  result?: ***REMOVED***exclude***REMOVED*** | ***REMOVED***include***REMOVED*** | ***REMOVED***disable***REMOVED*** | ***REMOVED***enable***REMOVED***
  newDefaultValue?: IValueType | IValueType[]
}
```

**IFieldConditionsSet** - Multiple conditions with logic operator
```typescript
interface IFieldConditionsSet {
  logic?: ***REMOVED***and***REMOVED*** | ***REMOVED***or***REMOVED***                           // How to combine
  conditions: IFieldCondition[]                   // Conditions to evaluate
  result?: IFieldConditionResult                  // Result if conditions pass
  newDefaultValue?: IValueType | IValueType[]    // Default to apply
}
```

**ICheckConditionResult** - Result of evaluating a condition
```typescript
interface ICheckConditionResult {
  pass: boolean                              // Did condition pass?
  result: ***REMOVED***exclude***REMOVED*** | ***REMOVED***include***REMOVED*** | ***REMOVED***disable***REMOVED*** | ***REMOVED***enable***REMOVED***
  newDefaultValue?: IValueType | IValueType[]
}
```

### Evaluation Flow

**Location**: [src/utils/validators.ts](src/utils/validators.ts#L65)

```typescript
export const checkCondition = (field: IFormField, formValues: IFormValues): ICheckConditionResult => {
  let pass = true
  let result: IFieldConditionResult | undefined
  let newDefaultValue: IValueType | IValueType[] | undefined
  
  // Priority 1: Check conditionsSet (AND/OR logic)
  if (field.conditionsSet !== undefined) {
    const passingConditions = field.conditionsSet.conditions
      .filter(c => checkFieldCondition(field, c, formValues).pass)
    
    pass = field.conditionsSet.logic === ***REMOVED***or***REMOVED***
      ? passingConditions.length > 0                    // OR: any pass
      : passingConditions.length === conditions.length  // AND: all pass
    
    result = pass ? passingConditions[last].result : undefined
    newDefaultValue = pass ? passingConditions[last].newDefaultValue : undefined
  }
  
  // Priority 2: Check conditions (single)
  if (field.conditions !== undefined && pass) {
    const f = checkFieldCondition(field, field.conditions, formValues)
    pass = f.pass
    result = field.conditions.result
    newDefaultValue = f.newDefaultValue
  }
  
  return { pass, result: result ?? ***REMOVED***include***REMOVED***, newDefaultValue }
}

const checkFieldCondition = (
  field: IFormField, 
  condition: IFieldCondition, 
  formValues: IFormValues
): ICheckConditionResult => {
  const fieldToEval = condition.field ?? condition.dependsOn
  const dependsOn = Array.isArray(fieldToEval) ? fieldToEval : [fieldToEval]
  
  // ALL fields in dependsOn must pass
  const pass = dependsOn.every(d => {
    const fieldValue = getValueFromRelativePath(field, d, formValues)
    return runCheck(fieldValue, condition.operator ?? ***REMOVED***=***REMOVED***, condition.value)
  })
  
  return {
    pass,
    result: condition.result ?? ***REMOVED***include***REMOVED***,
    newDefaultValue: condition.newDefaultValue
  }
}
```

### How Results Are Applied

In FieldCreator:
- `result === ***REMOVED***exclude***REMOVED***` + `pass === true` → field not rendered (return null)
- `result === ***REMOVED***include***REMOVED***` + `pass === false` → field not rendered (return null)
- `result === ***REMOVED***disable***REMOVED***` + `pass === true` → field disabled
- `result === ***REMOVED***enable***REMOVED***` + `pass === false` → field disabled

### Relative Path Resolution

**Location**: [src/utils/getters.ts](src/utils/getters.ts#L75)

```typescript
export function getValueFromRelativePath(
  field: IFormField,        // Current field
  path: string,             // Path to evaluate (can start with ".")
  formValues: IFormValues
): IValueType | IValueType[] | undefined {
  // Count leading dots: "." = parent, ".." = grandparent, etc.
  const backPath = path.match(/^\.+/)?.[0]?.length ?? 0
  
  if (backPath > 0) {
    // Relative path from parent level
    const targetField = fieldPathFields[fieldPathFields.length - backPath - offset]
    const valueAtRoot = getFieldValue(targetField, formValues, ...)
    const pathToEval = path.replace(/^\.+/, ***REMOVED******REMOVED***)
    return get(valueAtRoot, pathToEval)
  } else {
    // Absolute path from root
    return getValueFromPath(path, formValues)
  }
}
```

---

## Nested Field Handling

### Context
- **Nested fields** = fields inside `IObjectField` or `IObjectListField`
- **Nested context** = when rendering fields inside an object, they have a local object scope
- **Problem**: Field conditions and defaults need both local scope (for siblings) and root scope (for cross-field dependencies)

### How Nested Fields Are Rendered

1. **ObjectInput** receives the entire nested object as `value`
2. For each nested field, it calls **FieldCreator** with:
   - `value = object[field.id]` (the nested field***REMOVED***s value within object)
   - `conditionResult` = could be undefined or pre-computed (BUG: only when multiple=true)
3. FieldCreator checks conditions using the ROOT `formValues` from context
4. When nested field value changes, ObjectInput wraps it: `onChange({ ...object, [id]: newValue })`

### Architecture Problem #1: Condition Context MisMatch

**Current Code** (Object.tsx:51):
```typescript
const conditionResult = field.multiple
  ? checkCondition(childField, initialValue)  // ✗ Wrong! initialValue is the nested object
  : undefined

// Result: conditions are evaluated against the NESTED OBJECT,
// not the ROOT FORM VALUES
```

**Expected Behavior**:
```typescript
// Conditions should ALWAYS be evaluated against ROOT form values
// from context (which contains all parent/sibling field values)
// This allows cross-field conditions to work in nested contexts
```

### Architecture Problem #2: Default Value Application

**Current Code** (FormCreator.tsx:98):
```typescript
const seedFormValuesWithDefaults = (form: IForm): IFormValues => {
  getFieldsFromFormSection(form).forEach(field => {
    if (field.defaultValue !== undefined && getFieldValue(field, formValues) === undefined) {
      updateFormValuesWithFieldValueInPlace(field, field.defaultValue, formValues)
    }
  })
}

// This applies defaults for TOP-LEVEL fields only
// Nested object fields don***REMOVED***t have their children***REMOVED***s defaults applied
```

### How Nested Fields Should Work

```
ObjectInput (rendering nested object)
  └─ field.multiple === false (normal object)
     └─ For each child field:
        1. Check condition using ROOT formValues (from context)
        2. Use FieldCreator with condition result
        3. FieldCreator can then decide visibility/disable state
        4. When value updates, bubble up through onChange chain
        
ObjectInput (rendering nested object with multiple=true)
  └─ field.multiple === true (array of objects)
     └─ For each array element:
        1. Create a temporary object scope with element values
        2. Check conditions using that local scope
        3. Render fields with local scope
        4. On change, reconstruct array element and bubble up
```

### MultipleFieldCreator Flow

**Location**: [src/Form/Components/FieldCreator.tsx](src/Form/Components/FieldCreator.tsx#L155)

```typescript
export const MultipleFieldCreator = ({
  field,           // field.multiple === true (array field)
  onChange,
  disabled,
  value
}): ReactElement => {
  const initialVal = value ?? (Array.isArray(...) ? [...] : [initialVal])
  const initialValues = Array.isArray(initialVal) ? initialVal : [initialVal]
  
  return (
    <div>
      {initialValues?.map((va, index) => (
        <OneOfMultiple
          field={createOneOfMultipleField(field, index)}  // Add index to field
          value={va}
          index={index}
          onChange={(newValues) => {
            // onChange receives entire NEW array
            setFormValues(cleanAndUpdateFormValuesWithFieldValue({...}))
          }}
          values={initialValues}
        />
      ))}
    </div>
  )
}
```

---

## Multiple Fields Handling

### What "Multiple" Means
- `field.multiple === true` means the field represents an **array** of values
- Used for: repeated fields, arrays of objects, variable-length lists

### Current Implementation

**FieldCreator Decision** (line 238):
```typescript
if (field.multiple === true) {
  return <MultipleFieldCreator ... />
} else {
  return <InputComponent ... />
}
```

**MultipleFieldCreator Creates Array UI** (line 155):
```typescript
const initialValues = Array.isArray(initialVal) ? initialVal : [initialVal]

return (
  <div className=***REMOVED***divide-y-2***REMOVED***>
    {initialValues?.map((va, index) => (
      <OneOfMultiple 
        field={createOneOfMultipleField(field, index)}
        value={va}
        ...
      />
    ))}
  </div>
)
```

### createOneOfMultipleField Utility

**Location**: [src/utils/manipulators.ts](src/utils/manipulators.ts#L204)

Adds array index to the field***REMOVED***s path:
- Input: `field` with `path: [***REMOVED***Form***REMOVED***, ***REMOVED***items***REMOVED***]` and `index: 2`
- Output: field updated to represent array element at index 2

### Bug #1: Conditions Not Checked When multiple=false

**Location**: [src/Form/Components/Inputs/Object.tsx](src/Form/Components/Inputs/Object.tsx#L51)

```typescript
const conditionResult = field.multiple
  ? checkCondition(childField, initialValue)  // Only when multiple=true
  : undefined
```

**Problem**: Even when `field.multiple === false` (normal object), nested fields inside should still have their conditions checked. Currently they don***REMOVED***t.

**Impact**: Nested object fields with conditional nested fields don***REMOVED***t work unless parent has `multiple: true`.

---

## Override System

### Types

**IFormOverride** - Override entire form sections
```typescript
interface IFormOverride {
  id?: string
  label?: string
  description?: string
  pages?: IPageOverride[]
  wizard_steps?: IWizardStepOverride[]
  tabs?: IFormLayoutTabOverride[]
  fields?: IFormFieldOverride[]
  settings?: IFormSettings
}
```

**IFormFieldOverride** - Override specific fields
```typescript
type IFormFieldOverride = 
  Partial<IFormField> & { prop: string }  // For non-object fields
  | IObjectFormFieldOverride               // For object fields with nested overrides
```

### Override Application Flow

**Location**: [src/utils/schemaToFormHelpers.ts](src/utils/schemaToFormHelpers.ts#L490)

```typescript
export const overridesAndSchemaToFormObject = ({
  formOverrides,           // Array of form overrides
  formFieldOverrides,      // Array of field override arrays
  schema
}) => {
  // 1. Convert schema to basic form
  const schemaForm = schemaToFormObject(schema)
  
  // 2. Group all field overrides by ***REMOVED***prop***REMOVED*** (path)
  const formFieldOverridesByProp = formFieldOverrides?.map(overrides =>
    Object.fromEntries(
      overrides.map(override => [override.prop, override])
    )
  ) ?? []
  
  // 3. Apply form-level overrides (pages, wizard steps, tabs)
  // 4. Apply field-level overrides to all fields
  
  return mergeFormFields({
    fieldOverrides: formOverrides?.fields ?? [],
    schemaForm,
    formFieldsOverrideMap: formFieldOverridesByProp
  })
}
```

### Merge Order (Apply in this order):

1. **Schema** (lowest priority) - base definition
2. **formFieldOverrides** - indexed by prop
3. **formOverrides** - form-level field overrides
4. **final merge** (highest priority) - last one wins

**Key Function**: `mergeFormField()` (line 421)

```typescript
const mergedField = mergeObjects<IFormFieldOverride | IFormField>([
  field,                // From schema
  formFieldOverrides,   // From array-indexed overrides
  fieldOverride         // From form override
])
// Later objects override earlier ones using Object.assign spread
```

### Nested Object Override Handling

For nested fields in object types, recursively applies overrides:

```typescript
if (mergedField.type === ***REMOVED***object***REMOVED***) {
  // Collect overrides for nested fields from 3 sources
  const fieldFieldsMap = ...        // From schema field
  const overrideFieldsMap = ...     // From field override
  const formOverrideFieldsMap = ... // From form override
  
  mergedField.fields = allKeys.map(key => mergeFormField({
    field: fieldFieldsMap[key],
    fieldOverride: mergeObjects([
      overrideFieldsMap[key],
      formOverrideFieldsMap[key],
      formFieldsOverrideMap...
    ]),
    formFieldsOverrideMap,
    schemaFieldMap,
    schemaForm
  }))
}
```

---

## State Management

### Form Values Storage

**IFormValues Structure**:
```typescript
interface IFormValues {
  [key: string]: IValueType | IValueType[] | undefined | IFormValues
}
```

Where `IValueType` is: string | number | boolean | date | GeoJSON | JSON | composite object

### State Atoms (Jotai)

1. **baseFormValuesAtom** - Base state holding form values
2. **formValuesAtom** - Computed atom that syncs to URL params
3. **layoutAtom** - Responsive layout state
4. **formAtom** - Form configuration (injected via context)

**Location**: [src/state/formValuesAtom.ts](src/state/formValuesAtom.ts)

```typescript
const formValuesAtom = atom(
  (get) => get(baseFormValuesAtom),  // Getter
  (get, set, newFormValues: IFormValues) => {
    updateUrlParam(***REMOVED***values***REMOVED***, jsonToBase64(newFormValues))  // URL sync
    set(baseFormValuesAtom, newFormValues)
  }
)
```

### Form Context

**Location**: [src/Form/Creator/FormContextProvider.tsx](src/Form/Creator/FormContextProvider.tsx)

```typescript
export interface IFormContextValue {
  form: IForm                    // Form configuration
  formValues: IFormValues        // Current form values
  setFormValues: (v: IFormValues) => void
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
  urlNavigable?: boolean
  schema?: JSONSchema6
}
```

All field components receive context via `useFormContext()` hook.

### Form Value Update Flow

```
Input component onChange
  → FieldCreator.defaultOnChange()
    → cleanAndUpdateFormValuesWithFieldValue()
      1. updateFormValuesWithFieldValue() - set new value
      2. cleanFormValuesLevel() - remove excluded field values
      3. updateFormValuesWithFieldValue() - re-apply if same path
    → setFormValues() - update context & atom
      → URL synced via atom setter
      → All FieldCreator components re-render (via context subscription)
```

---

## Root Causes of Known Bugs

### Bug #1: Multiple Flag Not Respecting Conditions

**Location**: [src/Form/Components/Inputs/Object.tsx:51](src/Form/Components/Inputs/Object.tsx#L51)

**Root Cause**:
```typescript
// CURRENT CODE - BUG
const conditionResult = field.multiple
  ? checkCondition(childField, initialValue)
  : undefined
```

Conditions are ONLY checked when `field.multiple === true`. When `field.multiple === false`, nested fields don***REMOVED***t check conditions.

**Impact**:
- Nested fields in normal (non-multiple) objects don***REMOVED***t respect their condition logic
- Only array fields (multiple=true) apply conditions to nested fields

**Fix Strategy**:
Remove the `field.multiple` check; always evaluate conditions for nested fields:
```typescript
const conditionResult = checkCondition(childField, formValues)  // Use ROOT context
```

---

### Bug #2: Nested Fields Conditions Use Wrong Context

**Location**: [src/Form/Components/Inputs/Object.tsx:51](src/Form/Components/Inputs/Object.tsx#L51)

**Root Cause**:
```typescript
checkCondition(childField, initialValue)  // initialValue = nested object
```

Conditions are evaluated against the **nested object value**, not the **root form values**.

**Impact**:
- Cross-field conditions don***REMOVED***t work in nested contexts
- A nested field can***REMOVED***t depend on a sibling field or parent-level field
- Only absolute paths work, relative paths fail

**Fix Strategy**:
Get the ROOT formValues from context and pass that:
```typescript
const { formValues } = useFormContext()
const conditionResult = checkCondition(childField, formValues)  // Use ROOT context
```

---

### Bug #3: Nested Fields Don***REMOVED***t Apply Default Values

**Location**: [src/Form/Creator/FormCreator.tsx:98](src/Form/Creator/FormCreator.tsx#L98)

**Root Cause**:
```typescript
const seedFormValuesWithDefaults = (form: IForm): IFormValues => {
  getFieldsFromFormSection(form).forEach(field => {
    if (field.defaultValue !== undefined && ...) {
      updateFormValuesWithFieldValueInPlace(field, field.defaultValue, formValues)
    }
  })
}

// getFieldsFromFormSection() recursively gets all fields including nested ones
// BUT updateFormValuesWithFieldValueInPlace() uses getPathFromField()
// which already knows the nested path, so this SHOULD work...
```

Actually, looking closer, the code structure should handle nested defaults. But there might be an issue with:
1. **When** defaults are applied (only at initialization, not when conditions change)
2. **For multiple=true objects**, how are array defaults initialized?

**Likely Root Cause**:
In `createOneOfMultipleField()`, when creating a new array element, it doesn***REMOVED***t initialize defaults for that element***REMOVED***s nested fields.

**Impact**:
- Array elements (multiple=true objects) don***REMOVED***t get nested defaults
- New array items are created empty instead of with field defaults

---

### Bug #4: Form Value State-Based Overrides Performance

**Location**: [src/utils/schemaToFormHelpers.ts](src/utils/schemaToFormHelpers.ts#L490)

**Root Cause**:
Overrides are merged at **schema-to-form conversion time** (static), not at **runtime** based on form state.

```typescript
// Overrides are applied ONCE during initialization
overridesAndSchemaToFormObject({ schema, formOverrides, formFieldOverrides })

// Then the form is used as-is; overrides can***REMOVED***t depend on formValues
```

**Impact**:
- Can***REMOVED***t dynamically override field properties based on form values
- Can***REMOVED***t change labels, options, defaults etc. based on user input
- Would require re-running schema conversion on every value change (expensive)

**Fix Strategy**:
Separate override application into two phases:
1. **Static phase** - apply structure-level overrides (prop names, nesting)
2. **Dynamic phase** - apply value-dependent overrides (labels, options) at render time

---

## Summary Table: Bug Causes

| Bug | File | Line | Issue | Impact |
|-----|------|------|-------|--------|
| Multiple conditions | Object.tsx | 51 | Condition check only when field.multiple=true | Nested obj fields ignore conditions |
| Nested conditions context | Object.tsx | 51 | checkCondition(childField, initialValue) | Cross-field conditions fail |
| Nested defaults | FormCreator.tsx | 98 | No special handling for multiple=true objects | Array elements not initialized |
| Override performance | schemaToFormHelpers.ts | 490 | Static merge at init time | Can***REMOVED***t dynamic override based on state |

---

## Quick Reference: Field Path Navigation

### Path Metadata Added by copyAndAddPathToFields()

Each field gets a `path` array showing its location:
```typescript
field = {
  id: ***REMOVED***address***REMOVED***,
  type: ***REMOVED***object***REMOVED***,
  fields: [
    {
      id: ***REMOVED***street***REMOVED***,
      type: ***REMOVED***text***REMOVED***,
      path: [field_address]  // ← Added by copyAndAddPathToFields
    }
  ],
  path: [form]  // ← Root level
}
```

### JSON Path Generation

Used for getting/setting values in form:
```typescript
makeJsonPath(field):
  form.fields[0] → "address"
  form.fields[0].fields[0] → "address.street"
  form.fields[0].fields[0] (with index=2) → "address[2].street"
```

### Condition Evaluation with Relative Paths

```
field: address.street
paths in condition:
  "...." (4 dots) → go up to root
  "paymentMethod" → absolute path from root
  "..type" → relative: parent (address) then "type"
```

**Location Reference**: [src/utils/getters.ts](src/utils/getters.ts#L75)

---

## Phase 1 Refactoring: Form Logic Separation

### Overview

Phase 1 introduced a **separation of concerns** between business logic and presentation:

- **Business Logic Layer** (`formEngine.ts`) - Pure functions, no React dependencies
- **Presentation Layer** (Components like `Object.tsx`, `FieldCreator.tsx`) - React components that use logic layer results

This separation enables:
- ✅ Testable business logic without React mocks
- ✅ Clear, predictable behavior for conditions and defaults
- ✅ Easier debugging and maintenance
- ✅ Simpler code paths (fewer conditional branches)

### Key Changes

**New File**: [src/utils/formEngine.ts](src/utils/formEngine.ts)

```typescript
// Core functions in formEngine:

// 1. Evaluate complete field logic state
export function evaluateFieldLogicState(
  field: IFormField,
  context: FieldEvaluationContext  // Always includes ROOT formValues
): FieldLogicState {
  // Always use ROOT context - fixes nested condition bugs
  const conditionResult = checkCondition(field, context.rootFormValues)
  return {
    isVisible: evaluateFieldVisibility(conditionResult),
    isDisabled: evaluateFieldDisabled(conditionResult),
    defaultValue: evaluateDefaultValue(field, conditionResult),
    conditionResult
  }
}

// 2. Evaluate all nested fields at once
export function evaluateNestedFieldStates(
  parentField: IFormField,
  childFields: IFormField[],
  context: FieldEvaluationContext
): Record<string, FieldLogicState> {
  // Consistent evaluation for all children using same context
}
```

**Modified File**: [src/Form/Components/Inputs/Object.tsx](src/Form/Components/Inputs/Object.tsx)

**BEFORE** (buggy):
```typescript
const conditionResult = field.multiple
  ? checkCondition(childField, initialValue)    // Bug 1: Only when multiple=true
  : undefined                                      // Bug 2: Uses nested object context
```

**AFTER** (fixed):
```typescript
const fieldLogicState = evaluateFieldLogicState(childField, {
  rootFormValues: formValues  // Context always includes ROOT values
})
// Now: always checked, always uses correct context
```

### Bug Fixes via Separation

The separation naturally fixed Phase 1 bugs:

| Bug | Root Cause | Fix | How Separation Helped |
|-----|-----------|-----|----------------------|
| Conditions not checked for non-multiple fields | `field.multiple` check only evaluated when true | Removed the check - always evaluate | Pure logic layer never had the bug |
| Wrong context for nested conditions | Passed `initialValue` (nested object) | Pass `rootFormValues` always | FieldEvaluationContext makes this explicit |
| Inconsistent condition logic | Mixed in component with rendering | Extracted to formEngine | Clear data flow: logic → presentation |

### Test Coverage

**New Test File**: [src/utils/formEngine.test.ts](src/utils/formEngine.test.ts)

22 tests covering:
- Visibility logic (exclude/include with pass/fail conditions)
- Disabled state logic (disable/enable with pass/fail conditions)
- Default value priority (condition-driven > field-defined > undefined)
- Nested field evaluation with ROOT context
- Cross-field conditions (nested → root, sibling → sibling)
- Deep nesting (3+ levels)
- Relative path resolution in nested contexts

All tests pass without React mocking - pure data in/out.

---

## Refactoring Strategy & Plan

### Goals

The refactor aims to make the form system simpler and more maintainable while fixing critical bugs:

1. **Fix Condition Evaluation for Nested Fields** — Nested fields must respect conditions consistently, regardless of parent `multiple` flag
2. **Fix Default Value Application** — Defaults work for all field types including arrays and nested structures
3. **Fix Cross-Field Conditions** — Fields can depend on any sibling or parent field regardless of nesting level
4. **Simplify Override System** — Reduce complexity in override merging and make value-based runtime overrides feasible
5. **Maintain Backward Compatibility** — `IForm` and `IFormOverride` structures remain unchanged; only internal implementation changes

### Non-Goals

- Changing user-facing config structures (IForm, IFormField, IFormOverride)
- Breaking existing form definitions
- Changing the component API or props

### Backwards Compatibility Constraints

**What MUST NOT Change:**
- `IForm` type definition and structure
- `IFormField` union type and all field type interfaces  
- `IFormOverride` and field override structures
- Form values JSON structure (user data)

**What CAN Change** (for simplification):
- Component props and APIs (FormCreator, FieldCreator, input components, etc.)
- Internal utility implementations
- Component internal state management
- Condition checking algorithm
- Override merging logic
- Default value application timing/mechanism
- Hook signatures and utility function signatures

**Rationale**: Users write JSON configs using IForm/IFormOverride structures. The React component APIs are implementation details that can evolve if it makes the code simpler.

---

## Implementation Phases

### Phase 1: Fix Condition Evaluation (Critical - Blocks other work)

**Goal**: Ensure all nested field conditions are evaluated correctly against root context.

**Files to Change**:
- [src/Form/Components/Inputs/Object.tsx](src/Form/Components/Inputs/Object.tsx) — Remove condition check conditional logic
- [src/utils/validators.ts](src/utils/validators.ts) — Ensure robust path resolution with nested contexts

**Key Changes**:
1. In `ObjectInput`, always evaluate conditions for nested fields using root `formValues`:
   ```typescript
   const { formValues } = useFormContext()
   const conditionResult = checkCondition(childField, formValues)  // No field.multiple check
   ```

2. Verify `getValueFromRelativePath()` correctly resolves relative paths with nested field contexts

3. Add unit tests for:
   - Relative path resolution in nested contexts (e.g., ".." for parent)
   - Multiple-level nesting (object > object > field)
   - Cross-field conditions in nested objects

**Acceptance Criteria**:
- Nested fields apply conditions consistently regardless of parent `multiple` flag
- Relative path conditions work in nested contexts
- Existing form definitions with conditions still work

**Risk**: Low — isolated change to condition evaluation logic

---

### Phase 2: Fix Default Value Application (Critical - Blocks field initialization)

**Goal**: Default values propagate to all field types, including nested and array fields.

**Files to Change**:
- [src/Form/Creator/FormCreator.tsx](src/Form/Creator/FormCreator.tsx) — Modify `seedFormValuesWithDefaults()`
- [src/utils/manipulators.ts](src/utils/manipulators.ts) — Enhance default application for nested structures
- [src/Form/Components/FieldCreator.tsx](src/Form/Components/FieldCreator.tsx) — Handle defaults when conditions applyDefaultValue

**Key Changes**:
1. Enhance `seedFormValuesWithDefaults()` to handle nested defaults:
   ```typescript
   // For each field, including nested ones
   // If field.multiple === true, apply defaults to each array element
   // If field.type === ***REMOVED***object***REMOVED***, recursively apply nested field defaults
   ```

2. When `ICheckConditionResult.newDefaultValue` is set by a condition, apply it to the field

3. Handle array initialization:
   - `multiple=true` fields with defaultValue should initialize array with items
   - Each array item should have nested field defaults applied

**Acceptance Criteria**:
- Nested object fields get their children***REMOVED***s defaults on initialization
- Array fields initialize with correct defaults per element
- Condition-driven defaults (newDefaultValue) apply correctly
- Existing forms with defaults still work

**Risk**: Medium — affects form value initialization; need good test coverage

---

### Phase 3: Simplify Override Merging (Medium Priority - Code quality)

**Goal**: Make override system clearer and reduce nested merge complexity.

**Files to Change**:
- [src/utils/mergers.ts](src/utils/mergers.ts) — Simplify merge functions
- [src/utils/schemaToFormHelpers.ts](src/utils/schemaToFormHelpers.ts) — Reduce override nesting

**Key Changes**:
1. Flatten override merge order — instead of 3 levels of merging, use consistent pipeline:
   ```
   Schema Field → Field Override → Form Override → Default Behavior
   ```

2. Consolidate `mergeField()` and related functions into single clear pipeline

3. Document merge precedence clearly in code comments

**Acceptance Criteria**:
- Fewer merge functions overall (consolidate where possible)
- Merge order is documented and predictable
- Schema → override conversion is easier to trace
- Existing override definitions still produce same results

**Risk**: Low/Medium — high refactor risk unless thorough testing; but isolated to override logic

---

### Phase 4: Extract Runtime Override Layer (Low Priority - Advanced feature)

**Goal**: Enable value-based overrides that respond to form state changes without re-running schema conversion.

**Files to Change**:
- [src/Form/Creator/FormContextProvider.tsx](src/Form/Creator/FormContextProvider.tsx) — Add runtime override hook
- [src/Form/Components/FieldCreator.tsx](src/Form/Components/FieldCreator.tsx) — Apply runtime overrides before rendering
- New file: `src/utils/runtimeOverrides.ts` — Runtime override evaluation

**Key Concept**:
Separate override types into two phases:

1. **Static Overrides** (apply once at init time):
   - Structure changes (field ordering, nesting, type conversion)
   - Static property changes (fixed label, description)
   - Schema-based overrides

2. **Runtime Overrides** (apply on each render):
   - Value-dependent labels
   - Conditional options lists
   - Dynamic constraints
   - State-dependent field properties

**Example Use Case**:
```typescript
// User selects "US" in country field
// Runtime override changes state field***REMOVED***s label to "State"
// Instead of re-running schema conversion (expensive)
// Runtime override hook just updates label in render
```

**Acceptance Criteria**:
- New override hook allows form-state-dependent overrides
- Overrides can be applied without re-running schema conversion
- Performance is better than previous re-merge approach
- Backward compatible with existing override patterns

**Risk**: Medium — new functionality; needs careful integration

---

## Testing & Validation Strategy

### Unit Tests (Per Phase)

**Phase 1 - Condition Tests**:
```
validators.ts:
  ✓ Check condition with relative path in nested context
  ✓ Check condition with absolute path in nested context
  ✓ Multiple level nesting (grandparent reference from grandchild)
  ✓ Condition result applies correctly to nested field
```

**Phase 2 - Default Value Tests**:
```
manipulators.ts / FormCreator.ts:
  ✓ seedFormValuesWithDefaults for nested object fields
  ✓ seedFormValuesWithDefaults for array fields (multiple=true)
  ✓ Condition-driven newDefaultValue applies
  ✓ Nested field defaults don***REMOVED***t override explicit form values
```

**Phase 3 - Override Merge Tests**:
```
mergers.ts:
  ✓ Schema + override merge order is correct
  ✓ Nested field overrides merge correctly
  ✓ Merge precedence matches documented order
  ✓ No data loss during merge
```

### Integration Tests (End-to-End)

```
test scenarios:
  1. Nested object with conditional nested field
  2. Array of objects with nested defaults
  3. Relative path condition in deeply nested structure
  4. Override merging with nested field changes
  5. Form value updates respect all conditions and defaults
```

### Regression Tests

- Run against all existing test suites
- Render all forms in demo/test files without errors
- Validate existing PTT, Platforms, WebCOOS forms work
- Check URL state persistence still works

### Performance Validation

- Measure condition evaluation time before/after Phase 1
- Measure default application time before/after Phase 2
- Validate no unnecessary re-renders introduced
- Profile override merging before/after Phase 3

---

## Implementation Order

1. **Start with Phase 1** (Condition evaluation) — fixes most critical bug and unblocks testing
2. **Then Phase 2** (Defaults) — works on top of Phase 1 fixes
3. **Then Phase 3** (Simplify overrides) — code quality; less urgent
4. **Consider Phase 4** (Runtime overrides) — optional advanced feature; only if time/priority allows

**Rationale**: Critical bugs first, then code quality improvements, then new features.

---

## Success Metrics

After refactoring complete:

- [ ] All nested field conditions work consistently (multiple vs non-multiple)
- [ ] Default values apply recursively to all nesting levels
- [ ] Cross-field conditions work regardless of nesting depth
- [ ] No performance regression (same or faster condition evaluation)
- [ ] All existing tests pass
- [ ] All existing form definitions render correctly
- [ ] Code is simpler/more maintainable (fewer merge functions, clearer logic flows)

