# Bug Analysis - Detailed Examples

## Bug #1: Multiple Flag Not Respecting Conditions

### Problem Statement
Conditions specified on nested object fields are sometimes ignored when the parent object has `multiple: true`.

### Example Configuration

```json
{
  "type": "object",
  "id": "person",
  "multiple": false,
  "fields": [
    {
      "type": "text",
      "id": "name",
      "label": "Name"
    },
    {
      "type": "text",
      "id": "employerName",
      "label": "Employer",
      "conditions": {
        "dependsOn": "employmentStatus",
        "value": "employed",
        "result": "include"
      }
    }
  ]
}
```

### Expected Behavior
When user selects `employmentStatus !== "employed"`, the `employerName` field should be hidden.

### Actual Behavior
The `employerName` field is always visible (condition is ignored).

### Root Code (Bug)

**File**: [src/Form/Components/Inputs/Object.tsx:51](src/Form/Components/Inputs/Object.tsx#L51)

```typescript
const conditionResult = field.multiple   // ← BUG: Check only when multiple=true
  ? checkCondition(childField, initialValue)
  : undefined

return (
  <FieldCreator
    ...
    conditionResult={conditionResult}  // ← undefined when multiple=false
  />
)
```

### What Happens

1. User renders form with `person` object (multiple=false)
2. ObjectInput renders nested fields
3. For `employerName` field:
   - `field.multiple` = false
   - `conditionResult` = **undefined**
4. FieldCreator receives undefined conditionResult
5. In FieldCreator (line 237):
   ```typescript
   conditionResult = conditionResult ?? checkCondition(field, formValues)
   //                                 ↓
   // GOOD: Falls back to checking condition if not pre-computed
   ```

### Wait... Actually This Might Not Be a Bug?

After careful review, FieldCreator DOES fall back to checking condition when conditionResult is undefined. So Bug #1 might not be where we thought.

**Let me re-examine**: The issue might be that when conditions ARE evaluated, they***REMOVED***re evaluated in the WRONG CONTEXT. That***REMOVED***s **Bug #2**.

---

## Bug #2: Nested Fields Conditions Use Wrong Context (PRIMARY BUG)

### Problem Statement
Nested field conditions can***REMOVED***t reference parent/sibling fields properly because they***REMOVED***re evaluated against the nested object value instead of the root form values.

### Example Configuration

```json
{
  "type": "form",
  "fields": [
    {
      "type": "select",
      "id": "employmentStatus",
      "label": "Employment Status",
      "options": [
        {"value": "employed", "label": "Employed"},
        {"value": "student", "label": "Student"}
      ]
    },
    {
      "type": "object",
      "id": "employment",
      "label": "Employment Info",
      "fields": [
        {
          "type": "text",
          "id": "companyName",
          "label": "Company",
          "conditions": {
            "dependsOn": "..employmentStatus",  // ← Relative path
            "value": "employed",
            "result": "include"
          }
        }
      ]
    }
  ]
}
```

### Expected Behavior
- When `employmentStatus` = "employed" → `companyName` appears
- When `employmentStatus` = "student" → `companyName` hidden

### Actual Behavior
- `companyName` is always hidden (or always shown)
- The relative path `..employmentStatus` can***REMOVED***t be resolved correctly

### Root Cause Analysis

**File**: [src/Form/Components/Inputs/Object.tsx:48-57](src/Form/Components/Inputs/Object.tsx#L48)

```typescript
const ObjectInput = ({ field, onChange, value, disabled }: IFieldInputProps) => {
  const initialValue = (typeof value === ***REMOVED***object***REMOVED*** ? value ?? {} : {}) as ICompositeValueType
  
  // ...render layout...
  
  return (
    <div>
      {field.fields.map((childField) => {
        const key = (field.path ?? [field.id]).concat(childField.id).join(***REMOVED***.***REMOVED***)
        
        // BUG: Condition checked against initialValue (the nested object)
        // NOT against formValues (the root form state)
        const conditionResult = field.multiple
          ? checkCondition(childField, initialValue)  // ← WRONG CONTEXT
          : undefined
        
        return (
          <FieldCreator
            ...
            conditionResult={conditionResult}
          />
        )
      })}
    </div>
  )
}
```

### Execution Flow - What Actually Happens

```
1. Form has: employmentStatus = "employed"
2. Render form
   └─ FieldCreator for employmentStatus field
   └─ FieldCreator for "employment" object field
      └─ ObjectInput({ field: employment, value: { companyName: ***REMOVED******REMOVED*** } })
         └─ For each child (companyName):
            └─ conditionResult = field.multiple 
                 ? checkCondition(companyName, { companyName: ***REMOVED******REMOVED*** })
                 : undefined
            
            └─ FieldCreator(
                 field: companyName,
                 conditionResult: undefined,  // ← Falls back to own check
                 value: ***REMOVED******REMOVED***
               )
               └─ const conditionResult = checkCondition(companyName, formValues)
               
                  // In checkCondition():
                  // - condition.dependsOn = "..employmentStatus"
                  // - getValueFromRelativePath(companyName, "..employmentStatus", formValues)
                  //   ├─ field.path = [form, employment, companyName]
                  //   ├─ backPath = 2 (two dots)
                  //   ├─ targetField = employment (wrong! should go up 2 levels to form)
                  //   └─ ✗ FAILS to find "employmentStatus"
```

### Detailed Problem

The relative path resolution assumes field hierarchy like:
```
form
  ├─ employmentStatus
  └─ employment
      └─ companyName (path = [form, employment, companyName])
```

But when going "up 2 levels" (..) from companyName:
- Should reach: form level
- Actually reaches: employment level
- Missing: employmentStatus sibling

**Root cause**: The path includes the nested object field, so going up doesn***REMOVED***t go far enough.

### Why This Breaks Cross-Field Dependencies

When conditions evaluate against the nested object value (initialValue) instead of root form values:
```javascript
// BUG CODE
checkCondition(childField, initialValue)  // initialValue = { companyName: ***REMOVED******REMOVED*** }

// Trying to evaluate condition that depends on "employmentStatus"
// But formValues is { employmentStatus: "employed", employment: { ... } }
// The nested context doesn***REMOVED***t have access to employmentStatus
```

---

## Bug #3: Nested Fields Don***REMOVED***t Apply Default Values

### Problem Statement
When creating a new array element (for `multiple: true` objects), the nested fields don***REMOVED***t get their default values applied.

### Example Configuration

```json
{
  "type": "objectList",  // Array of objects
  "id": "addresses",
  "label": "Addresses",
  "fields": [
    {
      "type": "text",
      "id": "street",
      "label": "Street",
      "defaultValue": "1 Main St"
    },
    {
      "type": "text",
      "id": "city",
      "label": "City",
      "defaultValue": "New York"
    }
  ]
}
```

### Expected Behavior
When user clicks "Add Address" to create new array element:
```json
{
  "addresses": [
    {
      "street": "1 Main St",
      "city": "New York"
    }
  ]
}
```

### Actual Behavior
New array element is created empty:
```json
{
  "addresses": [
    {
      "street": "",
      "city": ""
    }
  ]
}
```

### Root Cause Analysis

**File**: [src/Form/Components/FieldCreator.tsx:155-170](src/Form/Components/FieldCreator.tsx#L155)

```typescript
export const MultipleFieldCreator = ({
  field,
  onChange,
  disabled = false,
  value
}: IFieldCreator): ReactElement => {
  const { formValues, setFormValues, inputOverrides, form } = useFormContext()
  
  const defaultOnChange = (v: IValueType[] | undefined): void => {
    const formValuesCopyClean = cleanAndUpdateFormValuesWithFieldValue({
      form,
      field,
      value: v,
      formValues
    })
    setFormValues(formValuesCopyClean)
  }

  const initialVal = value !== undefined ? value : getFieldValue(field, formValues)
  const initialValues = Array.isArray(initialVal) ? initialVal : [initialVal]

  // ... 

  return <div>
    {initialValues?.map((va, index) => {
      return <OneOfMultiple
        value={va}        // ← va could be undefined/null/{}
        index={index}
        onChange={defaultOnChange}
        values={initialValues}
        // ← NO initialization of nested defaults
      />
    })}
  </div>
}
```

### When New Element Is Added

In OneOfMultiple (line 97):
```typescript
<Button onClick={() => {
  addValue(null)  // ← Adds null/undefined to array
}}>Add</Button>
```

Then the array now has `[...existing..., null]` and when rendered:
```typescript
initialValues.map((va, index) => {
  return <OneOfMultiple value={va} ... />  // ← va is null
})
```

The nested fields receive `value={null}` instead of `{ street: ***REMOVED***1 Main St***REMOVED***, city: ***REMOVED***New York***REMOVED*** }`.

### Why Defaults Don***REMOVED***t Apply

In seedFormValuesWithDefaults (FormCreator.tsx:98):
```typescript
const seedFormValuesWithDefaults = (form: IForm): IFormValues => {
  getFieldsFromFormSection(form).forEach(field => {
    if (field.defaultValue !== undefined && getFieldValue(field, formValues) === undefined) {
      updateFormValuesWithFieldValueInPlace(field, field.defaultValue, formValues)
    }
  })
}
```

This runs ONCE at initialization. When new array elements are created during runtime, there***REMOVED***s no mechanism to apply defaults to the nested fields within the new element.

**Solution approach**:
When creating new array element, need to:
1. Initialize with an empty object `{}`
2. Recursively apply defaults to all nested fields of that element
3. Do this in MultipleFieldCreator***REMOVED***s `addValue()` handler

---

## Bug #4: Override Performance - State-Based Overrides

### Problem Statement
Form overrides are applied once during form initialization and can***REMOVED***t depend on runtime form state.

### Example: Dynamic Label Based on User Input

```typescript
// User wants: change label of "salary" field based on employment type
// e.g., if employmentType="contractor", label="Rate" instead of "Salary"

const form = { 
  fields: [{ id: ***REMOVED***salary***REMOVED***, label: ***REMOVED***Salary***REMOVED*** }]
}

const formOverrides = [
  {
    fields: [{
      prop: ***REMOVED***salary***REMOVED***,
      label: employmentType === ***REMOVED***contractor***REMOVED*** ? ***REMOVED***Rate***REMOVED*** : ***REMOVED***Salary***REMOVED***
      // ✗ This doesn***REMOVED***t work! employmentType is not available here
    }]
  }
]
```

### Current Architecture Limitation

```
FormCreator receives (form, overrides)
  ↓
overridesAndSchemaToFormObject(schema, overrides)  [STATIC]
  ↓
Returns merged form (immutable after this)
  ↓
FormContextProvider with static merged form
  ↓
Render happens (fields don***REMOVED***t change based on formValues)
```

### Why This Is a Problem

The merged form object is created ONCE and never updated. So:
- Can***REMOVED***t conditionally override field properties
- Can***REMOVED***t change options based on form state
- Can***REMOVED***t dynamically update labels/descriptions/validation rules
- Can***REMOVED***t make field dependencies dynamic

### Example of What***REMOVED***s Needed

```typescript
// Pseudo-code of what users want:
const DynamicFormOverride = (formValues) => ({
  fields: [
    {
      prop: ***REMOVED***salary***REMOVED***,
      label: formValues.employmentType === ***REMOVED***contractor***REMOVED*** ? ***REMOVED***Rate***REMOVED*** : ***REMOVED***Salary***REMOVED***
    }
  ]
})
```

### Performance Implications of Fix

If we applied overrides at runtime (every render):
1. Every time formValues change → recompute merged form
2. Expensive merge operations run on every value change
3. Could cause re-renders of entire form tree
4. Would need memoization/caching to avoid perf degradation

**Current Impact**: Medium - most users don***REMOVED***t need this feature, so not high priority.

---

## Visual Flowchart: Bug #2 (Wrong Context)

```
User Form Values:
{
  employmentStatus: "employed",
  employment: {
    companyName: ""
  }
}
    ↓
FormCreator renders
    ↓
FormContext provides formValues
    ↓
FieldCreator for "employment" object
    ├─ Uses formValues from context ✓ CORRECT
    ├─ Passes value={employment: {companyName: ""}}
    └─ Calls ObjectInput(value={companyName: ""})
        ├─ ObjectInput has access to: initialValue = {companyName: ""}
        ├─ ObjectInput does NOT have easy access to: ROOT formValues
        ├─ For each nested field (companyName):
        │   └─ Evaluates condition against initialValue (wrong!) ✗
        │       └─ Condition depends on "..employmentStatus"
        │       └─ Can***REMOVED***t find employmentStatus in {companyName: ""}
        │       └─ Condition fails ✗
        └─ FieldCreator receives conditionResult=undefined
            └─ Falls back to checkCondition(field, formValues)
            └─ NOW it works ✓ (by accident/luck in this case)
            
NOTE: Falls back ONLY works if conditionResult is left undefined,
      which now happens because of context bug in multifield conditions.
            
If field.multiple=true:
  └─ conditionResult = checkCondition(field, initialValue)
  └─ Explicit wrong context
  └─ FieldCreator uses passed conditionResult
  └─ Doesn***REMOVED***t get to fallback check
  → BUG VISIBLE
```

---

## Code Trace: How Bug Manifests With multiple=true Objects

### Scenario
1. Parent object has `multiple: true` (array of objects)
2. Each object has nested fields with conditions
3. User changes a value that affects nested field condition

### Trace Through ObjectInput

```typescript
// Object.tsx:48
const ObjectInput = ({ field, onChange, value, disabled }: IFieldInputProps) => {
  const initialValue = (typeof value === ***REMOVED***object***REMOVED*** ? value ?? {} : {}) as ICompositeValueType
  
  // ... 
  
  return (
    <div>
      {field.fields.map((childField) => {
        const key = ...
        
        // Line 51: THIS IS WHERE BUG MANIFESTS
        const conditionResult = field.multiple
          ? checkCondition(childField, initialValue)  // ← initialValue is WRONG context
          : undefined
        
        return (
          <FieldCreator
            disabled={disabled}
            conditionResult={conditionResult}  // ← Could be wrong data
            onChange={(e) => {
              const newValue = cloneObject(initialValue)
              newValue[childField.id] = e
              onChange(newValue)
            }}
            value={...}
            field={childField}
            key={key}
          />
        )
      })}
    </div>
  )
}
```

### What checkCondition Does With Wrong Context

```typescript
// validators.ts:65
export const checkCondition = (field, formValues): ICheckConditionResult => {
  // formValues === initialValue = {nested_field_values_only}
  // If condition depends on parent/sibling: FAILS
  
  if (field.conditionsSet !== undefined) {
    const passingConditions = field.conditionsSet.conditions.filter(c => {
      return checkFieldCondition(field, c, formValues)  // ← formValues is wrong
    })
  }
  
  // ...
}

const checkFieldCondition = (field, condition, formValues) => {
  const fieldValue = getValueFromRelativePath(field, condition.dependsOn, formValues)
  // ↑ Tries to find dependency in nested object value
  // ✗ Fails if dependency is outside the object
  
  return compare(fieldValue, condition.operator, condition.value)
}
```

---

## Summary: Bug Manifestation Matrix

| Bug | When visible | Symptoms | Data involved |
|-----|--------------|----------|---|
| #1* | field.multiple=false on nested object | Conditions always pass/fail (ignored) | nested object conditions |
| #2 | field.multiple=true on nested object | Cross-field conditions fail | root + nested values |
| #2 | Any nested field with relative conditions | Can***REMOVED***t resolve ".." paths | hierarchy of form values |
| #3 | User adds new array element | New element has empty nested fields | array element defaults |
| #4 | Dynamic override display labels | Label doesn***REMOVED***t update when form values change | runtime form state |

*Bug #1 is actually masked by the fallback in FieldCreator, so #2 is the primary issue.

