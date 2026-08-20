Please help create an interface for managing form configs. There are two different use cases:

A schema is provided and the user would like to create a custom form layout (`IFormOverride`). A user should be able to:

- place fields in pages (`IPageOverride`), wizard steps (`IWizardStep`), tabs (`IFormLayoutTab`), and object (`IObject`) - generally with `skip_path` assigned as `true` so as not to write new fields to the form output
- update the field type from the default assigned by schemaToForm
- add type-specific constraints (extend `IFieldConstraints`)
- add type-specific settings (extend `IFormFieldSettingsBase`)
- add conditions:

```
conditions?: IFieldCondition
conditionsSet?: IFieldConditionsSet
```

- update other properties that are overridable give `IFormFieldOverride` interface

For example, given this schema:

```
{
    "properties":{
        "label":{"type": "string"},
        "first_name": {"type": "string"},
        "last_name": {"type": "string"},
        "color": {"type":"string", "enum": ["red", "green", "blue"]},
        "choice": {"type": "string"},
        "description": {"type": "string"},
        "is_it_true": {"type": "boolean"},
        "count": {"type": "number"},
        "list": {"type": "array", "items":{
            "properties":{
                "label": {"type":"string"},
                "value": {"type": "string"}
            }
        }}
    }
}
```

A user might want to produce a form override config like:

```
{
  "label": "Test form",
  "id": "testForm",
  "pages": [
    {
        "id": "overview",
        "fields": [
            {"prop": "label"},
            {"prop": "description", "type": "long_text"}
        ]
    },
    {
        "id": "page1",
        "label": "First page",
        "fields": [
            {
                "id": "wrapper-object-1",
                "type": "objectWrapper",
                "label": "Name",
                "layout": "grid2",
                "fields": [
                    {"prop": "first_name"},
                    {"prop": "last_name"}
                ]
            }
        ]
    },
    {
        "id": "page2",
        "fields":[
            {"prop": "color", "type": "radio"},
            {"prop": "is_it_true"},
            {
                "prop": "choice",
                "type": "select",
                "options": [
                    {
                        "label": "First",
                        "value": "first"
                    },
                    {
                        "label": "Second",
                        "value": "second"
                    }
                ],
                "conditions": {
                    "field": "is_it_true",
                    "operator":"eq",
                    "value": true,
                    "result": "enable"
                }
            },
            {
                "prop": "count",
                "constraints": {
                    "min": 0,
                    "max": 10
                }
            },
            {
                "prop":"list",
                "type": "object",
                "multiple": true,
                "layout": "grid2",
                "fields":[
                    {"prop": "list[].label"},
                    {"prop": "list[].value"}
                ]
            }
        ]
    }

  ]
}

```

Guidelines:

- Start simple, and consider re-use of components and logic
- Ideally, creation of pages and new groups of fields is a drag/drop interface
- This UI should be usable within this project, but also exported and used elsewhere. Given this, consider that there might be cases where a consumer might want to apply certain settings to the form creation interface that limit which field types are elements are available

Rules:

- New packages can be added
- Please limit work to a single directory (`/src/Management`) - work will be continuing on this library in other branches, and I would like merging to be as simple as possible
- Use existing form elements provided by `@axdspub/axiom-ui-utilities`

---

## Session Prompt History (Implementation Trail)

Below is a concise timeline of follow-up prompts used to iteratively shape the current `/src/Management` implementation.

1. "please have a look at CREATE-MANAGEMENT-UI.md and let me know if you think this is doable"
2. "yes please do that. let***REMOVED***s start without drag and drop with the intention of adding it"
3. "go for it!"
4. "ok - this is a good start"
5. "please move schema input into an overlay that can easily be opened/closed. see FormEditorWithOverlay.tsx for an example (click on pencil, open up tabbed drawer on right)"
6. "preview should be in a tab. use Tab component from @axdspub/axiom-ui-utilities"
7. "I can see how to add fields to pages/wizard steps, but I don***REMOVED***t see how to make object groupings. These potentially have many layers of nesting."
8. "yes please" (added hierarchy view)
9. "please make the hierarchy a fixed column on the left when the screen width is lg or bigger"
10. "please update the schema input to use the JSON input component (attached JSON.tsx)"
11. "ok - please take a crack at making drag/drop ui"
12. "yes please" (index-aware drop targets)
13. "ready" (end-of-list drop targets)
14. "please make the following updates:"
15. "for this item: each field control should only show minimal information, and be colored according to whether it is mapped to a schema element or not"
16. "the item should be editable by clicking on it and opening a modal. all drag/drop operations should be achievable without opening any modal (thus importance of showing nested fields)"
17. "please continue updating CREATE-MANAGEMENT-UI.md as new updates are made"
18. "allow a user to create a new field before or after any existing field"
19. "allow a user to add a section list (pages, wizard steps, tabs) to any existing section"
20. "represent sections similar to fields, but colored differently, and show fields within"
21. "allow fields to be dragged between sections"
22. "allow sections to be re-ordered via drag/drop"
23. "yes - please do that" (section edit modals and minimal section cards)
24. "next, please: compact node width, move before/after buttons beside nodes, keep child-section add on section cards"
25. "yes - please do that" (dock controls tighter / icon-like)
26. "look into drag/drop not working, add child field path on sections, and add delete for sections/fields"
27. "would it help to add a specific area of each section/field dedicated to drag detection?"
28. "perhaps click-to-edit is intercepting drag; use dedicated edit buttons"
29. "drag still not working; make handle-based drag more robust"
30. "drag still not working"
31. "go back to block elements for fields and sections"
32. "drop zones appear/disappear but items still do not move"
33. "sections can drag, fields cannot"
34. "field drag still not working"
35. "field drag regression: zones gone after recent fix"
36. "field drag only partially works; reorder not applying"
37. "now none of the fields are draggable"
38. "create a simple drag/drop view to validate baseline behavior"
39. "sandbox works; port that drag model to main field tree"
40. "main tree still not showing field drop zones on drag start"
41. "field drag works only on first item again"
42. "field handle-only drag still not working"
43. "back to only first field working"
44. "still only first field working"
45. "still only first field"
46. "still only first field after state split"
47. "now no fields are draggable"
48. "still not working; first no longer works"
49. "groups drag reliably; fields still fail"
50. "group is not working"
51. "organize ManagementUI into Management/Components while isolating field list"
52. "add temporary drag instrumentation to field list and drop handlers"
53. "please used attached CREATE-MANAGEMENT-TODO.md to do the next steps"

### Current Functional State Summary

1. Schema editing in overlay drawer tab using shared `JSONInput`.
2. Preview in dedicated overlay tab.
3. Nested group/field structure with drag/drop re-parenting and index-aware placement.
4. Left hierarchy column on `lg+` viewports.
5. Field cards shown as compact controls with mapped/unmapped visual status.
6. Field editing via click-open modal.
7. Form Override and Field Override areas now editable JSON inputs with apply/reset flow.
8. Fields can be inserted explicitly before or after an existing field.
9. Sections are rendered as colored cards with nested field/group content.
10. Sections can host child section lists (`pages`, `tabs`, `wizard_steps`) and nested child sections.
11. Fields can be dragged between sections via section drop targets.
12. Sections can be reordered with section-specific drag/drop bars.
13. Sections now support modal-based editing (ID, label, parent, child list type) while cards stay minimal for drag/drop.
14. Field and section nodes now size to content, before/after insertion buttons sit beside each node, and child section creation is performed from inside section cards.
15. Node actions were tightened to compact docked controls with tooltips to reduce horizontal sprawl.
16. Drag/drop hit targets were expanded to stretch reliably, sections gained a direct add-field action, and fields/sections now support delete actions.
17. Drag initiation was moved to dedicated handle areas on fields/groups/sections for more consistent repeat drag behavior.
18. Click-anywhere editing was removed from field/section cards; editing is now explicit via action buttons to reduce drag gesture conflicts.
19. Drag start now occurs on draggable cards but is gated to gestures that originate on dedicated drag handles, improving native DnD consistency.
20. Handle gating was hardened by arming drag on handle mousedown and validating the armed node on card dragstart.
21. Field and section nodes were reverted to block-style rows, and global drag-release cleanup was added to prevent stuck drop-target state.
22. Drop handlers now recover drag payload from dataTransfer and no longer depend solely on transient React drag state at drop time.
23. Field dragging was changed to allow drag start from the full field row (no handle gate) to restore reliable field moves.
24. Nested dragstart propagation was fixed so draggable ancestor cards do not cancel descendant field drags.
25. Section/group cards were switched to non-draggable containers with draggable handles, preventing ancestor drag ownership from suppressing nested field drags.
26. Drop/dragover handlers now stop propagation so insert-bar drops are not overridden by parent container drops; field handle drag start was also enabled directly.
27. Field rows were switched to non-draggable containers so field drag initiation is owned only by the field handle (matching section/group handle-only strategy).
28. Added an isolated `DragDropSandbox` view with two sections and plain fields to verify reorder and cross-section drag/drop independently of management-tree complexity.
29. Main field nodes now use the sandbox drag-source model (row is the only draggable source; inner handle is visual only) to avoid nested draggable conflicts.
30. Removed global `mouseup` drag-state reset so field drag start is not canceled before drop-zone rendering.
31. Field drag source was moved back to explicit draggable handles (with non-draggable field rows) after first-item-only row-drag behavior persisted.
32. Field drag was reverted again to sandbox-proven row-drag source with non-draggable inner handle.
33. Field row drag was hardened with `select-none`, and the visual drag-handle icon was set to `pointer-events-none` so pointer initiation always hits the draggable row.
34. Drag-start state updates were switched to `flushSync` for both fields and sections to ensure drop-zone state is committed before native drag lifecycle advances.
35. Field dragging was split into its own dedicated drag state channel (`fieldDragItem`) so field drop-zone visibility and field move operations are isolated from group drag state.
36. Field drag source was moved to a dedicated external grip element while field cards were made non-draggable, matching the simple section-handle interaction pattern.
37. Field grip drag was hardened with a larger dedicated draggable element and mousedown state priming (`flushSync`) before native dragstart.
38. Removed mousedown preventDefault field-grip priming and reverted fields to sandbox-style row drag source with visual non-interactive handle.
39. Removed the separate field drag-state channel and routed field drag through the same `dragItem` path used by groups.
40. Group drag grip was enlarged and simplified (dedicated draggable grip, no dragstart propagation block) to improve group drag initiation reliability.
41. Began structural refactor of `ManagementUI.tsx`: extracted `OverlayEditor`, `FieldNodeRow`, and `GroupNodeCard` into `src/Management/Components` to isolate field-list rendering for easier drag debugging.
42. Added temporary console instrumentation for field drag-start and drop handler paths, gated by `localStorage.management.dnd.debug === ***REMOVED***true***REMOVED***`.
43. Hardened field/group drag-over detection to recover the active drag item from `dataTransfer` when transient React drag state is missing, and kept insert drop-bars rendered for the full drag lifecycle to prevent non-first-field dead drags.
44. Stabilized field drag-start by keeping insert drop bars mounted at all times (visual state only toggles during drag), avoiding drag cancellation from drag-start DOM reflow.
45. Fixed same-parent field/group reordering math by adjusting target index after removing the dragged item, preventing one-position overshoot and unintended no-op drops.
46. Added a brief post-drop highlight on moved field/group cards and expanded drop-target hit areas with invisible larger capture zones so dropping is easier without visually thicker drop bars.
47. Increased post-drop emphasis with combined border + background highlight on moved cards and made drop lanes visibly thicker/taller (while keeping generous hitboxes) to improve landing reliability.
48. Added pulse/ring/shadow animation to the currently active drop lane during drag hover so the intended landing target is more obvious before drop.
49. Updated section layout: top-level sections now render in a left-to-right lane (new sections add on the right), each root section card is capped at 300px width with full-height behavior and internal vertical scrolling, and section action buttons (including before/after) were moved into a tighter inline dock near section labels.
50. Increased root section card width from 300px to 450px for more editing space while keeping horizontal lane behavior.
51. Added in-place label editing for sections and fields with quick shortcuts: focus a card/row and press `E` (or `Enter`) to rename inline, with `Enter` to save and `Escape` to cancel.
52. Added a compact in-row field type dropdown in the field list so users can change each field type in place (`auto` clears override and falls back to schema/base type).
53. Expanded the field edit modal with JSON editors for `conditions`, `conditionsSet`, and split `settings` controls (general vs type-specific), and persisted these values through Management model import/export to generated field overrides.
54. Added modal shortcut/template buttons for field `conditions`, `conditionsSet`, and settings editors (general + type-specific), including clear actions and type-driven settings presets to reduce manual JSON entry.
55. Added a `Use or template` shortcut for `conditionsSet`, plus modal UX behavior updates: clicking the backdrop now closes the active modal and opening one editor modal automatically closes the others.
56. Replaced open-ended JSON field-override editors in the field modal with structured input controls (condition forms, condition-set row editor, general settings controls, and type-specific settings controls) and moved this UI into a dedicated component under `src/Management/Components`.
57. Extended the structured General Settings editor with `boldLabel` (boolean), `smallLabel` (boolean), and `className` (string), and updated settings split logic so these keys persist as global settings rather than type-specific settings.
58. Added nested container behavior for field nodes typed `object`/`objectWrapper`: fields and groups can now be dropped into these field nodes, nested children render under the field, cycle-safe drag/drop validation prevents self/descendant parenting, and container fields disable inline rename shortcuts so edits are performed via the explicit edit icon/modal.
59. Corrected container nesting scope so drag/drop parenting into `object`/`objectWrapper` field nodes is restricted to **unmapped** field containers only (mapped schema fields no longer act as drop parents).
60. Added field-override passthrough support in the Management model/export so non-modeled override keys (for example `defaultValue`, `constraints`, `options`, `description`, etc.) are preserved when overrides are imported from form-override field entries and/or field-override arrays.
61. Added an **Unused Schema Properties** panel under the left Hierarchy column that lists schema field title + path and supports drag/drop into any valid field drop target (sections, groups, and eligible container fields).
62. Enhanced hierarchy drag affordances so section drop zones visibly highlight while dragging (including pulse/ring state), improving placement discoverability in the left sidebar.
63. Added a **Seed Presets** overlay tab that loads known schema/form-override/field-override sets into the Management builder, including PTT HAB/Oil/Larval (with shared `src/PTT/fieldOverrides.ts` merged) and representative `src/Form/TestForms` schema+form+field combinations.
64. Rebased this branch onto `main`; the rebase introduced additional field types and settings in the broader codebase that are not yet fully represented in the Management UI editors/import-export paths.

## Rebase Note

- Branch has been rebased on `main`.
- `main` now includes new fields/settings that should be accounted for in Management UI:
    - ensure field editor controls expose any newly supported settings/constraints.
    - ensure adapters/model import-export preserve and round-trip those new properties.
    - verify preview and generated override JSON remain aligned with latest `FormCreatorTypes` behavior.
