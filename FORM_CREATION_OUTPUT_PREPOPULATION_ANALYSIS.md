# Form Construction, Output Assembly, and Prepopulation Analysis

This document compares two runtime paths in the form system:

1. Schema path: using SchemaFormCreator with schema + optional form overrides + field overrides.
2. Direct form path: using FormCreator with an already-built IForm object.

It focuses on:

- how form structure is built,
- how output values are assembled over time,
- how prepopulation/default values are applied,
- where the two paths differ,
- and where inconsistencies or bug-prone behavior may exist.

---

## Key Source Anchors

- src/Form/Creator/FormCreator.tsx
- src/utils/schemaToFormHelpers.ts
- src/utils/formEngine.ts
- src/Form/Components/FieldCreator.tsx
- src/utils/manipulators.ts
- src/utils/getters.ts
- src/Form/Creator/FormSection.tsx
- src/utils/formEngine/conditionLogic.ts
- src/utils/formEngine/hasNestedNavigation.ts

---

## Case A: Schema Provided (SchemaFormCreator)

## A1) How the form is constructed

Entry point:

- SchemaFormCreator creates a memoized form object.
- If no overrides are provided, it calls schemaToFormObject(schema).
- If either formOverrides or formFieldOverrides is provided, it calls overridesAndSchemaToFormObject(...).
- Optional id and label props then overwrite the generated values.

Relevant flow:

- src/Form/Creator/FormCreator.tsx:63, 79-81
- src/utils/schemaToFormHelpers.ts:763-945

Schema conversion (base form):

- schemaToFormObject resolves refs, iterates schema.properties, and recursively creates fields via schemaToFormField.
- Field type inference happens from JSON Schema metadata (type/enum/oneOf/anyOf/format/etc).
- defaultValue and required metadata are copied from schema when available.
- objectWrapper fields are normalized to skip_path=true.

Relevant flow:

- src/utils/schemaToFormHelpers.ts:927-945
- src/utils/schemaToFormHelpers.ts:642
- src/utils/schemaToFormHelpers.ts (schemaToFormField logic in earlier section)

Override merge path:

- overridesAndSchemaToFormObject first builds schemaForm.
- It builds a map of formFieldOverrides by prop path.
- Branch 1: no formOverrides but has formFieldOverrides.
- Branch 2: no overrides at all.
- Branch 3: formOverrides present, rebuilds structure from overrides (pages/wizard_steps/tabs/fields), merging each field with precedence:
  - schema field,
  - global formFieldOverrides,
  - local section field override.
- objectWrapper skip_path is enforced again after merge.

Relevant flow:

- src/utils/schemaToFormHelpers.ts:772-797
- src/utils/schemaToFormHelpers.ts:782-785
- src/utils/schemaToFormHelpers.ts:751-757
- src/utils/schemaToFormHelpers.ts:642

Additional override behavior:

- For override-only fields (not present in schema), excludeFromPayload may be auto-set.
- Explicit destPath can prevent auto-exclusion.

Relevant flow:

- src/utils/schemaToFormHelpers.ts:504-528

Form layout routing after construction:

- FormSection chooses one rendering mode by precedence:
  - wizard_steps,
  - else pages,
  - else tabs,
  - else plain fields.
- If both pages and fields exist, it injects a Default page containing fields.
- If wizard_steps exist along with other content, it injects a Default step.

Relevant flow:

- src/Form/Creator/FormSection.tsx:30-57

## A2) How output is assembled

State ownership:

- Once SchemaFormCreator passes form into FormCreator, output assembly is identical to direct FormCreator usage.
- The mutable data model is formValues in FormCreator state/context.

Relevant flow:

- src/Form/Creator/FormCreator.tsx:136-138
- src/Form/Creator/FormContextProvider.tsx

Write path when a field changes:

- FieldCreator / MultipleFieldCreator / ObjectListCreator call cleanAndUpdateFormValuesWithFieldValue.
- That function:
  1) applies new field value,
  2) cleans condition-excluded values,
  3) reapplies changed value (handles destPath collisions).
- Then setFormValues(updated) stores the result.
- Optional onChange callback is called with the changed field value, not full formValues.

Relevant flow:

- src/Form/Components/FieldCreator.tsx:214-224, 331-341, 721-740
- src/utils/manipulators.ts:212-234
- src/utils/manipulators.ts:165-184

Pathing model:

- Read/write paths are derived from field.path and/or field.destPath.
- skip_path containers (objectWrapper or object with skip_path=true) do not contribute a nesting level.

Relevant flow:

- src/utils/getters.ts:32-37
- src/utils/getters.ts:199-209

Optional final payload extraction (outside FormCreator):

- getFormPayload can derive a filtered payload from formValues + form.
- It excludes fields marked excludeFromPayload.
- It applies special flattening/handling for objectWrapper and objectList.

Relevant flow:

- src/utils/getters.ts:245 onwards
- src/utils/getters.ts:257, 276-381

## A3) How prepopulation occurs

Initial population in FormCreator:

- FormCreator seeds defaults with seedFormValuesWithDefaults(activeForm).
- Then it overlays initialFormValues, so provided values win over defaults.

Relevant flow:

- src/Form/Creator/FormCreator.tsx:95-106
- src/Form/Creator/FormCreator.tsx:136-138

Default seeding behavior:

- seedNestedDefaults recursively walks direct fields and nested sections.
- It handles objects, arrays of objects, objectWrapper, and objectList differently.
- objectList does not seed child defaults at root; defaults are seeded for new list items when added.

Relevant flow:

- src/utils/formEngine.ts:212-293
- src/Form/Components/FieldCreator.tsx:203, 326

Condition-based default updates after initial render:

- evaluateConditionStateUpdate may apply newDefaultValue when conditions pass and current value is still considered default.
- If triggered, setFormValues applies an updated formValues object in a useEffect.

Relevant flow:

- src/Form/Components/FieldCreator.tsx:753-768
- src/utils/formEngine/conditionLogic.ts

---

## Case B: Direct Form Provided (FormCreator)

## B1) How the form is constructed

Entry point:

- FormCreator receives a completed IForm and normalizes it before rendering.

Normalization in activeForm:

1. ensureObjectWrappersHaveSkipPath(form)
2. copyAndAddPathToFields(...)
3. formHasNestedNavigation(...) check
4. settings assignment with url_navigable logic

Relevant flow:

- src/Form/Creator/FormCreator.tsx:127-133
- src/utils/schemaToFormHelpers.ts:642
- src/utils/manipulators.ts:58
- src/utils/formEngine/hasNestedNavigation.ts

Rendering route and UI structure are then identical to Case A once activeForm exists.

## B2) How output is assembled

Same runtime as Case A after construction:

- Fields update formValues through cleanAndUpdateFormValuesWithFieldValue.
- Values are stored by computed path/destPath.
- Condition cleanup can remove hidden field values.
- Changed field value is re-applied after cleanup.
- onChange receives the changed field value only.

Relevant flow:

- src/Form/Components/FieldCreator.tsx
- src/utils/manipulators.ts:212-234
- src/utils/getters.ts:32-37, 199-209

## B3) How prepopulation occurs

Default behavior without external formValueState:

- Initial state is computed once with defaults + initialFormValues merge.

Behavior with external formValueState provided:

- FormCreator uses caller-provided state tuple directly.
- In this mode, FormCreator does not execute its own initial default merge into that external state.
- Prepopulation must already exist in caller state.

Relevant flow:

- src/Form/Creator/FormCreator.tsx:136-138

Dynamic defaults and nested add-item defaults are the same as Case A.

---

## Key Differences Between the Two Cases

1. Construction source
- Schema path builds form definition from schema and override merge logic.
- Direct path trusts provided form definition and only normalizes/annotates it.

2. Override semantics
- Schema path can auto-merge global and local override layers and may auto-mark override-only fields with excludeFromPayload.
- Direct path has no override merge stage unless caller pre-applies it before passing form.

3. Potential structure transformations
- Schema path includes specialized remapping logic (for top-level tabs referencing array item fields) that does not run in direct path.

4. Runtime output assembly
- Once FormCreator is reached, both cases use the same value assembly and update pipeline.

5. Prepopulation source
- In both cases, prepopulation behavior is governed by FormCreator.
- But if formValueState is externally controlled, internal defaults + initialFormValues initializer is bypassed in both cases.

---

## Inconsistencies / Bug-Prone Areas Observed

1. URL navigation override precedence may conflict with intent

- In FormCreator, url_navigable is computed as false when nested navigation exists, but spread order allows af.settings.url_navigable to overwrite this value.
- This can allow URL navigation to remain enabled even when nested navigation is detected.

Relevant flow:

- src/Form/Creator/FormCreator.tsx:132

2. Controlled state bypasses default/prepopulation initializer

- When formValueState is provided, state initialization with seedFormValuesWithDefaults + initialFormValues does not run for that controlled state.
- This can look inconsistent versus uncontrolled usage where defaults and initial values are applied automatically.

Relevant flow:

- src/Form/Creator/FormCreator.tsx:136-138

3. initialFormValues is one-time only

- initialFormValues is used only in useState initializer path.
- Changes to initialFormValues after mount are not re-applied.

Relevant flow:

- src/Form/Creator/FormCreator.tsx:136-138

4. onChange emits field-level value, not full formValues

- Consumers may expect full assembled output on each change, but callback receives only the changed value payload for that field/update path.
- Actual full output is in formValues state/context (or via external formValueState).

Relevant flow:

- src/Form/Components/FieldCreator.tsx:222-224, 339-341, 738-740
- src/Form/Creator/FormCreatorTypes.ts (IValueChangeFn)

5. Schema-only field override branch may flatten nested field structure

- In overridesAndSchemaToFormObject, branch formOverrides undefined + hasFormFieldOverrides maps Object.values(schemaFieldMap) into form.fields.
- schemaFieldMap is built from a flattened field map; this can include nested fields as standalone entries and may distort original container hierarchy.
- This is likely the highest-risk structural inconsistency in schema+fieldOverrides-only flows.

Relevant flow:

- src/utils/schemaToFormHelpers.ts:782-785
- src/utils/schemaToFormHelpers.ts:956 (field map source)

6. Wrapper normalization happens in multiple stages

- ensureObjectWrappersHaveSkipPath is applied in schema helpers and again in FormCreator normalization.
- This is likely harmless but indicates duplicated normalization responsibility.

Relevant flow:

- src/utils/schemaToFormHelpers.ts:642, 924, 945
- src/Form/Creator/FormCreator.tsx:128

---

## Practical Debugging Notes

If you are isolating bugs in these areas, highest-value checkpoints are:

1. Confirm which path is used:
- SchemaFormCreator merge path vs direct FormCreator input.

2. Log activeForm after FormCreator normalization:
- Especially activeForm.settings.url_navigable and field path annotations.

3. Distinguish raw state vs payload:
- raw assembled state is formValues.
- filtered output is getFormPayload(formValues, form) when used.

4. For prepopulation issues:
- Check whether formValueState is externally controlled.
- Check whether expected values are in initialFormValues only (one-time) vs reactive state updates.

5. For override-only schema issues:
- Inspect whether nested fields appear duplicated/flattened in final form.fields.

---

## Short Summary

- Both cases converge to the same runtime state/update engine once inside FormCreator.
- The major differences are in form-definition construction (schema conversion + overrides vs prebuilt form input).
- Most likely inconsistency hotspots are:
  - url_navigable precedence,
  - controlled state bypassing default seeding,
  - one-time handling of initialFormValues,
  - and potential flattening in schema+fieldOverrides-only branch.
