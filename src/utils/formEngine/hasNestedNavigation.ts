import type { IFormField, IForm } from '@/Form/Creator/FormCreatorTypes'

interface INavigationSection {
  fields?: IFormField[]
  pages?: unknown[]
  wizard_steps?: unknown[]
  tabs?: unknown[]
}

const hasNavigation = (section: INavigationSection): boolean =>
  (section.pages?.length ?? 0) > 0 ||
  (section.wizard_steps?.length ?? 0) > 0 ||
  (section.tabs?.length ?? 0) > 0

const fieldHasNestedNavigation = (field: IFormField | any): boolean => {
  if (hasNavigation(field)) return true
  return Array.isArray(field.fields) && field.fields.some(fieldHasNestedNavigation)
}

const sectionHasNestedNavigation = (section: INavigationSection): boolean =>
  hasNavigation(section) ||
  (section.fields?.some(fieldHasNestedNavigation) ?? false)

export const formHasNestedNavigation = (form: IForm | any): boolean => {
  const topLevelSections = [
    ...(form.pages ?? []),
    ...(form.wizard_steps ?? []),
    ...(form.tabs ?? []),
  ] as INavigationSection[]

  if (topLevelSections.some(sectionHasNestedNavigation)) return true

  // FormSection nests pages under a generated default wizard step when both are present.
  if ((form.pages?.length ?? 0) > 0 && (form.wizard_steps?.length ?? 0) > 0) {
    return true
  }

  return form.fields?.some(fieldHasNestedNavigation) ?? false
}
