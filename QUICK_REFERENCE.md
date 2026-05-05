# Quick Reference: Component Interaction Map

## Component Dependency Graph

```
FormCreator (entry point)
├─ copyAndAddPathToFields()
├─ seedFormValuesWithDefaults()
├─ FormContextProvider (provides form + values + setter)
└─ FormSection
    ├─ WizardLayout
    ├─ PageLayout  
    ├─ TabLayout
    └─ FormFields
        └─ FieldCreator (per field) ← KEY DISPATCHER
            ├─ consumes: FormContext (form, formValues, setFormValues)
            ├─ checkCondition()
            ├─ branch: if field.multiple
            │   └─ MultipleFieldCreator
            │       └─ OneOfMultiple (per array element)
            │           └─ FieldCreator (nested)
            │               └─ InputComponent
            └─ branch: else
                └─ InputComponent (direct render)
                    ├─ ObjectInput (if type=***REMOVED***object***REMOVED***)
                    │   └─ FieldCreator (recursive, per nested field)
                    ├─ OneOfInput (if type=***REMOVED***oneOf***REMOVED***)
                    └─ ... (StringInput, NumberInput, etc.)
```

## Data Flow Through System

### Initialization
```
User passes: form: IForm, initialValues?: IFormValues
                            ↓
FormCreator
  ├─ activeForm = copyAndAddPathToFields(form)
  │   └─ Adds path[] and level to each field
  ├─ seedFormValues = seedFormValuesWithDefaults(activeForm)
  │   └─ Gets all fields, applies defaultValue to formValues
  ├─ formValues = seedFormValues + initialValues merged
  └─ Create context: { form: activeForm, formValues, setFormValues }
```

### User Input → Value Update
```
User types in field
  ↓
InputComponent.onChange(newValue)
  ↓
FieldCreator.defaultOnChange(newValue)
  ↓
cleanAndUpdateFormValuesWithFieldValue({ field, form, value, formValues })
  ├─ updateFormValuesWithFieldValue() - set new value at field path
  ├─ cleanFormValuesLevel() - remove excluded field values
  └─ updateFormValuesWithFieldValue() - re-apply if same path
  ↓
setFormValues(updatedValues)  [updates React state + Jotai atom]
  ↓
useFormContext() subscribers re-render
  ↓
All FieldCreator components receive new formValues
  ├─ Re-evaluate conditions
  ├─ Re-check visibility/disabled state
  └─ Re-render if condition changed
```

### Condition Evaluation Path
```
FieldCreator renders
  ↓
checkCondition(field, formValues)
  ├─ if field.conditionsSet !== undefined:
  │   └─ Filter conditions by checkFieldCondition()
  │   └─ Apply logic: ***REMOVED***and***REMOVED*** (all pass) or ***REMOVED***or***REMOVED*** (any pass)
  └─ if field.conditions !== undefined:
      └─ checkFieldCondition()
          ├─ Get dependsOn field path
          ├─ getValueFromRelativePath(field, dependsOn, formValues)
          │   └─ Handle ".." relative paths or absolute paths
          ├─ runCheck(fieldValue, operator, compareValue)
          │   └─ compare(val, operator, compareTo)
          │       └─ Handle ***REMOVED***=***REMOVED***, ***REMOVED***>***REMOVED***, ***REMOVED***<***REMOVED***, ***REMOVED***>=***REMOVED***, ***REMOVED***<=***REMOVED***, ***REMOVED***!=***REMOVED*** operators
          └─ Return { pass, result, newDefaultValue }
  ↓
Apply result:
  ├─ result=***REMOVED***exclude***REMOVED*** + pass=true → return null (hide)
  ├─ result=***REMOVED***include***REMOVED*** + pass=false → return null (hide)
  ├─ result=***REMOVED***disable***REMOVED*** + pass=true → disabled=true
  └─ result=***REMOVED***enable***REMOVED*** + pass=false → disabled=true
```

## State Mutation Points

### Places That Modify formValues

1. **FieldCreator.defaultOnChange()** - On any field value change
   - Path: src/Form/Components/FieldCreator.tsx:211
   - Calls: cleanAndUpdateFormValuesWithFieldValue()

2. **MultipleFieldCreator.defaultOnChange()** - On array element change
   - Path: src/Form/Components/FieldCreator.tsx:161
   - Calls: cleanAndUpdateFormValuesWithFieldValue()

3. **ObjectInput onChange handler** - On nested object field change
   - Path: src/Form/Components/Inputs/Object.tsx:62
   - Updates parent object and calls onChange

4. **FormCreator initialization** - On component mount
   - Path: src/Form/Creator/FormCreator.tsx:118
   - Sets initial formValues with defaults

### Places That Read formValues

1. **checkCondition()** - Via validators.ts for condition evaluation
2. **FieldCreator render** - Via useFormContext()
3. **getFieldValue()** - Via utilities when reading field values
4. **cleanFormValuesLevel()** - Via manipulators during cleanup


## Utility Function Index

### `getters.ts` - Extract values/paths

| Function | Input | Output | Purpose |
|----------|-------|--------|---------|
| `makeJsonPath(field, index?)` | IFormField | string \| undefined | JSON path for field |
| `getFieldValue(field, formValues, index?)` | IFormField, IFormValues | IValueType \| IValueType[] | Get value at field path |
| `getValueFromPath(path, formValues)` | string, IFormValues | IValueType | Get value at JSON path |
| `getValueFromRelativePath(field, path, formValues)` | IFormField, string, IFormValues | IValueType | Resolve "." relative paths |
| `getPathFromField(field)` | IFormField | string \| undefined | destinationPath or computed path |
| `getFieldsFromFormSection(section)` | IFormSection | IFormField[] | All fields recursively |

### `manipulators.ts` - Transform forms/values

| Function | Input | Output | Purpose |
|----------|-------|--------|---------|
| `copyAndAddPathToFields(form)` | IForm | IForm | Add path[] and level to fields |
| `copyAndRemovePathFromFields(form)` | IForm | IForm | Remove path[] and level |
| `addFieldPath(field, parentPath?)` | IFormField | IFormField | Add path to single field |
| `updateFormValuesWithFieldValue(field, value, formValues)` | ... | IFormValues | Set field value in object |
| `cleanAndUpdateFormValuesWithFieldValue(...)` | field, form, value, formValues | IFormValues | Update + clean excluded |
| `cleanFormValuesLevel(formValues, fields, path?)` | ... | IFormValues | Remove excluded field values |
| `createOneOfMultipleField(field, index)` | IFormField, number | IFormField | Add array index to field |
| `assignDefaultValuesToFormValues(form, formValues)` | IForm, IFormValues | IFormValues | Apply all defaults |

### `validators.ts` - Check conditions

| Function | Input | Output | Purpose |
|----------|-------|--------|---------|
| `checkCondition(field, formValues)` | IFormField, IFormValues | ICheckConditionResult | Evaluate condition(s) |
| `checkFieldCondition(field, condition, formValues)` | IFormField, IFieldCondition, IFormValues | ICheckConditionResult | Evaluate single condition |
| `runCheck(fieldValue, operator, compareTo)` | IValueType, operator, value | boolean | Compare values |
| `compare(val, operator, compareTo)` | IValueType, operator, value | boolean | Operator logic |
| `calculateSectionStatus(sections, formValues)` | IFormSection[], IFormValues | IFormSectionStatus | Form completion stats |

### `mergers.ts` - Apply overrides

| Function | Input | Output | Purpose |
|----------|-------|--------|---------|
| `groupOverrideFieldsByProp(overrides)` | IFormFieldOverride[][] | Record<string, IFormFieldOverride[]> | Group by field path |
| `buildFieldMapFromForm(form)` | IForm | Record<string, IFormField> | Map field path → field |
| `mergeField({field, key, overrides})` | ... | IFormField | Merge field with overrides |
| `mergeFields({form, overrides})` | IForm, overrides | IFormField[] | Merge all fields |
| `mergeFormSections(...)` | sections, overrides | IFormSection[] | Merge form structure |

### `schemaToFormHelpers.ts` - Schema conversion

| Function | Input | Output | Purpose |
|----------|-------|--------|---------|
| `schemaToFormObject(schema)` | JSONSchema6 | IForm | Convert schema to form |
| `overridesAndSchemaToFormObject({schema, overrides})` | schema, overrides | IForm | Convert + apply overrides |
| `schemaToFormField({schema, property, schemaField})` | ... | IFormField | Convert schema → field |
| `mergeFormField({field, fieldOverride, ...})` | ... | IFormField | Merge field with override |

---

## Context Flow

### FormContextValue

```typescript
interface IFormContextValue {
  form: IForm                    // Form structure with paths added
  formValues: IFormValues        // Current form values
  setFormValues: (v: IFormValues) => void  // Update function
  inputOverrides?: Record<string, React.FC<IFieldInputProps>>
  urlNavigable?: boolean
  schema?: JSONSchema6
}
```

### How to Access in Component

```typescript
import { useFormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***

const MyComponent = ({ field }: IFieldInputProps) => {
  const { form, formValues, setFormValues } = useFormContext()
  
  // Read current value
  const currentValue = getFieldValue(field, formValues)
  
  // Update form
  const newValues = updateFormValuesWithFieldValue(field, newValue, formValues)
  setFormValues(newValues)
}
```

---

## Key Algorithms

### Path-Based Value Resolution

```
Field has path: [root, section, subObj, field]
             →  ***REMOVED***section.subObj.field***REMOVED***

Get value:
  lodash.get(formValues, ***REMOVED***section.subObj.field***REMOVED***)

Set value:
  lodash.set(formValues, ***REMOVED***section.subObj.field***REMOVED***, value)
```

### Multiple Field Array Index Tracking

```
Field: IFormField with multiple=true, type=***REMOVED***object***REMOVED***
Array value: [ {...}, {...}, {...} ]

When rendering element at index 2:
  createOneOfMultipleField(field, 2)
  ├─ Add index to field.path
  ├─ makeJsonPath now returns: ***REMOVED***items[2]***REMOVED***
  └─ Value operations use index

When value changes:
  new array = [..., newElement, ...]
  onChange(new array)
```

### Condition Evaluation with Chaining

```
If field has both conditions and conditionsSet:
  1. Evaluate conditionsSet first
  2. If conditionsSet.pass=true, evaluate conditions
  3. Otherwise skip conditions and use conditionsSet result

Result priority: conditions.result > conditionsSet.result > ***REMOVED***include***REMOVED***
```

### Relative Path Navigation

```
Field: payment.method at path: [form, shipping, payment, method]

Relative path: "...address"
counts dots:  "..."  = 3 levels up

Calculation:
  fieldPath length = 4
  backPath = 3
  offset = 1 (not skip_path)
  targetIndex = 4 - 3 - 1 = 0
  targetField = form (at index 0)
  
Result path: address (sibling of shipping)
```

---

## Common Patterns

### Adding a New Field Type

1. Create input component: `src/Form/Components/Inputs/NewType.tsx`
   ```typescript
   const NewTypeInput: React.FC<IFieldInputProps> = ({ field, value, onChange, disabled }) => {
     return <input 
       value={value} 
       onChange={(e) => onChange(e.target.value)}
       disabled={disabled}
     />
   }
   export default NewTypeInput
   ```

2. Add to inputMap: `src/Form/Components/Inputs/inputMap.ts`
   ```typescript
   const inputMap: Record<string, React.FC<IFieldInputProps>> = {
     // ...
     newtype: NewTypeInput
   }
   ```

3. Add type to union: `src/Form/Creator/FormCreatorTypes.ts`
   ```typescript
   export interface INewTypeField extends IFormFieldRoot {
     type: ***REMOVED***newtype***REMOVED***
     // ... other props
   }
   export type IFormField = ... | INewTypeField
   ```

### Reading Form Value in Component

```typescript
import { useFormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { getFieldValue } from ***REMOVED***@/utils/getters***REMOVED***

const MyComponent = ({ field }: IFieldInputProps) => {
  const { formValues } = useFormContext()
  const value = getFieldValue(field, formValues)
  return <div>{value}</div>
}
```

### Updating Form Value

```typescript
import { useFormContext } from ***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***
import { updateFormValuesWithFieldValue, cleanUnusedDependenciesFromFormValues } from ***REMOVED***@/utils/manipulators***REMOVED***

const MyComponent = ({ field }: IFieldInputProps) => {
  const { formValues, setFormValues, form } = useFormContext()
  
  const handleChange = (newValue) => {
    const updated = updateFormValuesWithFieldValue(field, newValue, formValues)
    const cleaned = cleanUnusedDependenciesFromFormValues(form, updated)
    setFormValues(cleaned)
  }
  
  return <input onChange={(e) => handleChange(e.target.value)} />
}
```

---

## Performance Considerations

### Re-render Triggers

1. **formValues change** → All FieldCreator components re-render (via context subscription)
2. **Form structure change** → Entire form re-renders (if new form prop passed)
3. **Jotai atom change** → Subscribers update

### Optimization Opportunities

1. **Memoize FieldCreator**: Use React.memo() to prevent re-renders when props haven***REMOVED***t changed
2. **Use local state**: For transient UI state (hover, focus), don***REMOVED***t put in formValues
3. **Lazy condition checking**: Cache condition results if field hasn***REMOVED***t changed
4. **Virtualized lists**: For very long arrays (multiple=true), use virtualization

### Bottlenecks

1. **cleanFormValuesLevel()** - Runs on every value change, walks entire form structure
2. **Condition checking** - Happens for every field on every value change
3. **Override merging** - Happens once but could be optimized with caching

---

## Testing Strategy Recommendations

### Types of Tests Needed

1. **Unit Tests**
   - checkCondition() with various condition configurations
   - getValueFromRelativePath() with relative/absolute paths
   - updateFormValuesWithFieldValue() with various paths
   - mergeField() with overlapping overrides

2. **Integration Tests**
   - Form with nested objects and conditions
   - Array fields (multiple=true) with nested conditions
   - Overrides applied correctly
   - Value changes cascade through conditions

3. **E2E Tests**
   - Full form flow: init → user input → conditions update → value changes
   - Nested object workflows
   - Array add/remove with defaults
   - Cross-field dependencies

### Key Scenarios to Test

- [ ] Simple field condition (exclude/include)
- [ ] Condition with disabled/enable result
- [ ] Nested field condition
- [ ] Cross-field dependency in nested context
- [ ] Multiple field with conditions
- [ ] Relative path resolution (.., ...)
- [ ] Override application
- [ ] Default value application
- [ ] Array element add with nested values
- [ ] Condition toggle visibility properly

