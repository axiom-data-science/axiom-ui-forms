/**
 * Utility to detect if a form or field has nested pages or wizard_steps at any depth.
 * This includes nested pages/wizard_steps within object, objectList, or objectWrapper fields.
 */

import type { IFormField, IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

/**
 * Recursively check if a field or any of its nested fields contain pages or wizard_steps.
 * Used to determine if URL navigation should be disabled (URL nav is incompatible with nested navigation).
 *
 * @param field - The field to check
 * @returns boolean - True if field or any child contains navigation structures
 */
const fieldHasNavigation = (field: IFormField | any): boolean => {
  // Check if this field itself has pages or wizard_steps
  if ((field.pages?.length ?? 0) > 0 || (field.wizard_steps?.length ?? 0) > 0) {
    return true
  }

  // Check for nested fields in various container types
  const checkNestedFields = (fields: IFormField[] | undefined): boolean => {
    if (!Array.isArray(fields)) return false
    return fields.some(f => fieldHasNavigation(f))
  }

  // Direct fields property (object, objectWrapper, etc)
  if (checkNestedFields(field.fields)) {
    return true
  }

  // Tabs array
  if (Array.isArray(field.tabs)) {
    if (field.tabs.some((tab: any) => checkNestedFields(tab.fields))) {
      return true
    }
  }

  // Pages array
  if (Array.isArray(field.pages)) {
    if (field.pages.some((page: any) => checkNestedFields(page.fields))) {
      return true
    }
  }

  // Wizard steps array
  if (Array.isArray(field.wizard_steps)) {
    if (field.wizard_steps.some((step: any) => checkNestedFields(step.fields))) {
      return true
    }
  }

  return false
}

/**
 * Check if a form has nested pages or wizard_steps at any level.
 * Checks both top-level and embedded within object/objectList fields.
 *
 * @param form - The form to check
 * @returns boolean - True if form has any navigation structures (top-level or nested)
 */
export const formHasNestedNavigation = (form: IForm | any): boolean => {
  // Check top-level pages or wizard_steps
  if ((form.pages?.length ?? 0) > 0 || (form.wizard_steps?.length ?? 0) > 0) {
    return true
  }

  // Check fields recursively for nested navigation
  const checkNestedFields = (fields: IFormField[] | undefined): boolean => {
    if (!Array.isArray(fields)) return false
    return fields.some(f => fieldHasNavigation(f))
  }

  return checkNestedFields(form.fields)
}
