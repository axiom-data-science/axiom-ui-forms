/**
 * ObjectWrapperField Documentation
 *
 * IObjectWrapperField is a new field type for creating UI-only container structures
 * that organize nested fields without adding a data nesting layer.
 */

/**
 * MOTIVATION
 * ==========
 *
 * Previously, consumers had to use:
 *   { type: ***REMOVED***object***REMOVED***, skip_path: true, fields: [...] }
 *
 * This worked but was confusing because:
 * - ***REMOVED***object***REMOVED*** typically implies data nesting
 * - The purpose (UI organization only) wasn***REMOVED***t explicit
 * - No clear semantics vs regular objects
 *
 * IObjectWrapperField solves this:
 * - Clear intent: "this is a layout wrapper, not a data structure"
 * - Type-safe: skip_path: true and multiple: false are enforced
 * - First-class in the type system, not a workaround
 *
 * WHAT IT DOES
 * ============
 *
 * When rendering:
 * - Children fields are rendered directly to the form
 * - No data nesting occurs (skip_path: true is enforced)
 * - Layout structure is applied (tabs, pages, wizard, grid layout)
 * - The wrapper container itself doesn***REMOVED***t appear in formValues
 *
 * EXAMPLE 1: Tab Organization
 * ============================
 *
 * Scenario: You have several fields that logically belong together
 * but want to organize them into tabs for better UX.
 *
 * const tabWrapper: IObjectWrapperField = {
 *   id: ***REMOVED***personal_info_tabs***REMOVED***,
 *   type: ***REMOVED***objectWrapper***REMOVED***,
 *   skip_path: true,
 *   label: ***REMOVED***Personal Information***REMOVED***,
 *   tabs: [
 *     {
 *       id: ***REMOVED***basic***REMOVED***,
 *       label: ***REMOVED***Basic Info***REMOVED***,
 *       fields: [
 *         { id: ***REMOVED***firstName***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***First Name***REMOVED*** },
 *         { id: ***REMOVED***lastName***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Last Name***REMOVED*** }
 *       ]
 *     },
 *     {
 *       id: ***REMOVED***address***REMOVED***,
 *       label: ***REMOVED***Address***REMOVED***,
 *       fields: [
 *         { id: ***REMOVED***street***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Street***REMOVED*** },
 *         { id: ***REMOVED***city***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***City***REMOVED*** }
 *       ]
 *     }
 *   ]
 * }
 *
 * Resulting formValues:
 * {
 *   firstName: ***REMOVED***John***REMOVED***,
 *   lastName: ***REMOVED***Doe***REMOVED***,
 *   street: ***REMOVED***123 Main St***REMOVED***,
 *   city: ***REMOVED***Boston***REMOVED***
 * }
 *
 * Note: No ***REMOVED***personal_info_tabs***REMOVED*** key in formValues
 *
 * EXAMPLE 2: Grid Layout
 * ======================
 *
 * Organize fields in a responsive grid without data nesting:
 *
 * const gridWrapper: IObjectWrapperField = {
 *   id: ***REMOVED***credentials***REMOVED***,
 *   type: ***REMOVED***objectWrapper***REMOVED***,
 *   skip_path: true,
 *   layout: ***REMOVED***grid2***REMOVED***, // 1 col on mobile, 2 cols on desktop
 *   fields: [
 *     { id: ***REMOVED***username***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Username***REMOVED*** },
 *     { id: ***REMOVED***password***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Password***REMOVED*** }
 *   ]
 * }
 *
 * EXAMPLE 3: Multi-Step Wizard
 * =============================
 *
 * Create a wizard flow across multiple pages:
 *
 * const wizardWrapper: IObjectWrapperField = {
 *   id: ***REMOVED***signup_wizard***REMOVED***,
 *   type: ***REMOVED***objectWrapper***REMOVED***,
 *   skip_path: true,
 *   wizard_steps: [
 *     {
 *       id: ***REMOVED***step1***REMOVED***,
 *       label: ***REMOVED***Personal Info***REMOVED***,
 *       fields: [
 *         { id: ***REMOVED***firstName***REMOVED***, type: ***REMOVED***text***REMOVED*** },
 *         { id: ***REMOVED***email***REMOVED***, type: ***REMOVED***text***REMOVED*** }
 *       ]
 *     },
 *     {
 *       id: ***REMOVED***step2***REMOVED***,
 *       label: ***REMOVED***Preferences***REMOVED***,
 *       fields: [
 *         { id: ***REMOVED***newsletter***REMOVED***, type: ***REMOVED***boolean***REMOVED*** }
 *       ]
 *     }
 *   ]
 * }
 *
 * HOW TO USE IN FORM OVERRIDES
 * =============================
 *
 * IObjectWrapperField is especially useful in form overrides to reorganize
 * existing form fields without restructuring the data:
 *
 * const override: IFormOverride = {
 *   id: ***REMOVED***my_form***REMOVED***,
 *   fields: [
 *     // Add a wrapper around existing fields
 *     {
 *       type: ***REMOVED***objectWrapper***REMOVED***,
 *       skip_path: true,
 *       tabs: [
 *         {
 *           id: ***REMOVED***tab1***REMOVED***,
 *           label: ***REMOVED***General***REMOVED***,
 *           fields: [
 *             { prop: ***REMOVED***firstName***REMOVED*** },
 *             { prop: ***REMOVED***lastName***REMOVED*** }
 *           ]
 *         },
 *         {
 *           id: ***REMOVED***tab2***REMOVED***,
 *           label: ***REMOVED***Contact***REMOVED***,
 *           fields: [
 *             { prop: ***REMOVED***email***REMOVED*** },
 *             { prop: ***REMOVED***phone***REMOVED*** }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 * TYPE SAFETY
 * ===========
 *
 * IObjectWrapperField enforces constraints at the type level:
 *
 * 1. skip_path: true is REQUIRED
 *    - No default value
 *    - Compiler will error if omitted
 *    - Ensures wrapper never nests data
 *
 * 2. multiple: false is ENFORCED
 *    - Type system prevents multiple: true
 *    - Wrappers are UI-only, not data arrays
 *    - Regular objects should be used for multiple data
 *
 * 3. Layout options: ***REMOVED***horizontal***REMOVED*** | ***REMOVED***vertical***REMOVED*** | ***REMOVED***grid2***REMOVED*** | ***REMOVED***grid3***REMOVED*** | ***REMOVED***grid4***REMOVED***
 *    - Applies Tailwind grid/flex classes
 *    - Works alongside tabs/pages/wizard_steps
 *
 * COMPARISON WITH ALTERNATIVES
 * ==============================
 *
 * OLD WAY: Using object with skip_path
 * -------
 * {
 *   type: ***REMOVED***object***REMOVED***,
 *   skip_path: true,  // ← Confusing, looks like data structure
 *   fields: [...]
 * }
 * ✗ Semantically unclear
 * ✗ Could accidentally have multiple: true (type doesn***REMOVED***t help)
 *
 * NEW WAY: Using objectWrapper
 * --------
 * {
 *   type: ***REMOVED***objectWrapper***REMOVED***,  // ← Clear: UI-only container
 *   skip_path: true,  // ← Required, so compiler helps you
 *   fields: [...]
 * }
 * ✓ Explicit intent
 * ✓ Type-safe constraints enforced
 * ✓ Better IDE documentation and hints
 *
 * NESTING WRAPPERS
 * ================
 *
 * You can nest wrappers for complex organization:
 *
 * const complexLayout: IObjectWrapperField = {
 *   type: ***REMOVED***objectWrapper***REMOVED***,
 *   skip_path: true,
 *   tabs: [
 *     {
 *       id: ***REMOVED***personal***REMOVED***,
 *       label: ***REMOVED***Personal***REMOVED***,
 *       fields: [
 *         {
 *           type: ***REMOVED***objectWrapper***REMOVED***,
 *           skip_path: true,
 *           layout: ***REMOVED***grid2***REMOVED***,
 *           fields: [
 *             { id: ***REMOVED***firstName***REMOVED***, type: ***REMOVED***text***REMOVED*** },
 *             { id: ***REMOVED***lastName***REMOVED***, type: ***REMOVED***text***REMOVED*** }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 * COMMON PATTERNS
 * ================
 *
 * Pattern 1: Tab-organized form
 * -----
 * Type: objectWrapper
 * Tabs: [personal, address, billing, preferences]
 * Result: Entire form organized by topic
 *
 * Pattern 2: Multi-column form
 * -----
 * Type: objectWrapper
 * Layout: grid2 or grid3
 * Result: Fields displayed in responsive columns
 *
 * Pattern 3: Wizard flow
 * -----
 * Type: objectWrapper
 * Wizard_steps: [step1, step2, step3]
 * Result: Step-by-step data entry process
 *
 * Pattern 4: Mixed organization
 * -----
 * Type: objectWrapper
 * Pages: [page1, page2]
 *   - Each page has tabs
 *   - Each tab has grid2 layout
 * Result: Complex multi-level organization
 *
 * PERFORMANCE CONSIDERATIONS
 * ===========================
 *
 * - No data nesting = no overhead
 * - Wrapper container doesn***REMOVED***t affect form values
 * - Rendering performance same as flat field list
 * - Layout is applied via CSS (Tailwind), not JS
 *
 * MIGRATION FROM OLD PATTERN
 * ===========================
 *
 * If you have existing forms using object with skip_path:
 *
 * OLD:
 * {
 *   type: ***REMOVED***object***REMOVED***,
 *   skip_path: true,
 *   id: ***REMOVED***wrapper***REMOVED***,
 *   fields: [...]
 * }
 *
 * NEW:
 * {
 *   type: ***REMOVED***objectWrapper***REMOVED***,
 *   skip_path: true,
 *   id: ***REMOVED***wrapper***REMOVED***,
 *   fields: [...]
 * }
 *
 * The change is backward compatible at the rendering level,
 * but we recommend migrating for improved type safety and clarity.
 */

export const OBJECTWRAPPERFIELD_DOCUMENTATION = ***REMOVED***See above***REMOVED*** as const
