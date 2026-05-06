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
 *   { type: 'object', skip_path: true, fields: [...] }
 *
 * This worked but was confusing because:
 * - 'object' typically implies data nesting
 * - The purpose (UI organization only) wasn't explicit
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
 * - The wrapper container itself doesn't appear in formValues
 *
 * EXAMPLE 1: Tab Organization
 * ============================
 *
 * Scenario: You have several fields that logically belong together
 * but want to organize them into tabs for better UX.
 *
 * const tabWrapper: IObjectWrapperField = {
 *   id: 'personal_info_tabs',
 *   type: 'objectWrapper',
 *   skip_path: true,
 *   label: 'Personal Information',
 *   tabs: [
 *     {
 *       id: 'basic',
 *       label: 'Basic Info',
 *       fields: [
 *         { id: 'firstName', type: 'text', label: 'First Name' },
 *         { id: 'lastName', type: 'text', label: 'Last Name' }
 *       ]
 *     },
 *     {
 *       id: 'address',
 *       label: 'Address',
 *       fields: [
 *         { id: 'street', type: 'text', label: 'Street' },
 *         { id: 'city', type: 'text', label: 'City' }
 *       ]
 *     }
 *   ]
 * }
 *
 * Resulting formValues:
 * {
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   street: '123 Main St',
 *   city: 'Boston'
 * }
 *
 * Note: No 'personal_info_tabs' key in formValues
 *
 * EXAMPLE 2: Grid Layout
 * ======================
 *
 * Organize fields in a responsive grid without data nesting:
 *
 * const gridWrapper: IObjectWrapperField = {
 *   id: 'credentials',
 *   type: 'objectWrapper',
 *   skip_path: true,
 *   layout: 'grid2', // 1 col on mobile, 2 cols on desktop
 *   fields: [
 *     { id: 'username', type: 'text', label: 'Username' },
 *     { id: 'password', type: 'text', label: 'Password' }
 *   ]
 * }
 *
 * EXAMPLE 3: Multi-Step Wizard
 * =============================
 *
 * Create a wizard flow across multiple pages:
 *
 * const wizardWrapper: IObjectWrapperField = {
 *   id: 'signup_wizard',
 *   type: 'objectWrapper',
 *   skip_path: true,
 *   wizard_steps: [
 *     {
 *       id: 'step1',
 *       label: 'Personal Info',
 *       fields: [
 *         { id: 'firstName', type: 'text' },
 *         { id: 'email', type: 'text' }
 *       ]
 *     },
 *     {
 *       id: 'step2',
 *       label: 'Preferences',
 *       fields: [
 *         { id: 'newsletter', type: 'boolean' }
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
 *   id: 'my_form',
 *   fields: [
 *     // Add a wrapper around existing fields
 *     {
 *       type: 'objectWrapper',
 *       skip_path: true,
 *       tabs: [
 *         {
 *           id: 'tab1',
 *           label: 'General',
 *           fields: [
 *             { prop: 'firstName' },
 *             { prop: 'lastName' }
 *           ]
 *         },
 *         {
 *           id: 'tab2',
 *           label: 'Contact',
 *           fields: [
 *             { prop: 'email' },
 *             { prop: 'phone' }
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
 * 3. Layout options: 'horizontal' | 'vertical' | 'grid2' | 'grid3' | 'grid4'
 *    - Applies Tailwind grid/flex classes
 *    - Works alongside tabs/pages/wizard_steps
 *
 * COMPARISON WITH ALTERNATIVES
 * ==============================
 *
 * OLD WAY: Using object with skip_path
 * -------
 * {
 *   type: 'object',
 *   skip_path: true,  // ← Confusing, looks like data structure
 *   fields: [...]
 * }
 * ✗ Semantically unclear
 * ✗ Could accidentally have multiple: true (type doesn't help)
 *
 * NEW WAY: Using objectWrapper
 * --------
 * {
 *   type: 'objectWrapper',  // ← Clear: UI-only container
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
 *   type: 'objectWrapper',
 *   skip_path: true,
 *   tabs: [
 *     {
 *       id: 'personal',
 *       label: 'Personal',
 *       fields: [
 *         {
 *           type: 'objectWrapper',
 *           skip_path: true,
 *           layout: 'grid2',
 *           fields: [
 *             { id: 'firstName', type: 'text' },
 *             { id: 'lastName', type: 'text' }
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
 * - Wrapper container doesn't affect form values
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
 *   type: 'object',
 *   skip_path: true,
 *   id: 'wrapper',
 *   fields: [...]
 * }
 *
 * NEW:
 * {
 *   type: 'objectWrapper',
 *   skip_path: true,
 *   id: 'wrapper',
 *   fields: [...]
 * }
 *
 * The change is backward compatible at the rendering level,
 * but we recommend migrating for improved type safety and clarity.
 */

export const OBJECTWRAPPERFIELD_DOCUMENTATION = 'See above' as const
