import { type IFormFieldOverride, type IFormField, type IForm, type IFormSection, type IFormSectionOverride, type IPage, type IWizardStep } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { getFieldsFromFormSection, getPathFromField } from ***REMOVED***@/utils/getters***REMOVED***
import { cloneObject, copyAndAddPathToFields } from ***REMOVED***@/utils/manipulators***REMOVED***

/**
 * Groups field overrides by their `prop` property.
 *
 * @param fieldOverrides - An array of field overrides to group.
 * @returns A record where keys are the `prop` values and values are arrays of field overrides associated with that `prop`.
 *
 * @example
 * const overrides = [
 *   { prop: ***REMOVED***field1***REMOVED***, label: ***REMOVED***Updated Field 1***REMOVED*** },
 *   { prop: ***REMOVED***field2***REMOVED***, label: ***REMOVED***Updated Field 2***REMOVED*** },
 *   { prop: ***REMOVED***field1***REMOVED***, type: ***REMOVED***number***REMOVED*** }
 * ];
 * const grouped = groupOverrideFieldsByProp(overrides);
 * console.log(grouped);
 * // Output:
 * // {
 * //   field1: [
 * //     { prop: ***REMOVED***field1***REMOVED***, label: ***REMOVED***Updated Field 1***REMOVED*** },
 * //     { prop: ***REMOVED***field1***REMOVED***, type: ***REMOVED***number***REMOVED*** }
 * //   ],
 * //   field2: [
 * //     { prop: ***REMOVED***field2***REMOVED***, label: ***REMOVED***Updated Field 2***REMOVED*** }
 * //   ]
 * // }
 */
export const groupOverrideFieldsByProp = (
  fieldOverrides: IFormFieldOverride[][]
): Record<string, IFormFieldOverride[]> => {
  const g: Record<string, IFormFieldOverride[]> = {}
  fieldOverrides.forEach(overrides => {
    overrides.forEach(override => {
      const prop = override.prop
      if (prop !== undefined) {
        if (g[prop] === undefined) {
          g[prop] = []
        }
        g[prop].push(override)
      }
    })
  })
  return g
}

/**
 * Builds a map of form fields keyed by their paths.
 *
 * @param form - The form object containing fields and nested structures.
 * @returns A record where keys are field paths and values are the corresponding form fields.
 *
 * @example
 * const form = {
 *   id: ***REMOVED***testForm***REMOVED***,
 *   fields: [
 *     { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Field 1***REMOVED*** },
 *     { id: ***REMOVED***field2***REMOVED***, type: ***REMOVED***number***REMOVED***, label: ***REMOVED***Field 2***REMOVED*** }
 *   ]
 * };
 * const fieldMap = buildFieldMapFromForm(form);
 * console.log(fieldMap);
 * // Output: { ***REMOVED***field1***REMOVED***: { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Field 1***REMOVED*** }, ***REMOVED***field2***REMOVED***: { id: ***REMOVED***field2***REMOVED***, type: ***REMOVED***number***REMOVED***, label: ***REMOVED***Field 2***REMOVED*** } }
 */
export const buildFieldMapFromForm = (form: IForm | IFormSection): Record<string, IFormField> => {
  const formCopy = copyAndAddPathToFields(form)
  const fields = getFieldsFromFormSection(formCopy as IFormSection)
  return Object.fromEntries(fields.map(field => [getPathFromField(field), field]))
}

export const mergeField = ({
  field,
  fieldOverrides,
  key
}: {
  field: IFormField
  key: string
  fieldOverrides?: Record<string, IFormFieldOverride[]>
}): IFormField => {
  const overrides = fieldOverrides?.[key] ?? []
  const mergedField: IFormField = {
    ...field,
    ...(overrides.length > 0 ? Object.assign({}, ...overrides) : {}),
    destPath: key
  }
  if (mergedField.type === ***REMOVED***object***REMOVED*** && mergedField.fields !== undefined) {
    mergedField.fields = mergedField.fields.map(f => {
      const key = getPathFromField(f)
      return key !== undefined
        ? mergeField({
          field: f,
          key,
          fieldOverrides
        })
        : null
    }).filter(f => f !== null)
  }
  // Handle array fields (multiple: true) - apply overrides to nested item properties
  if ((mergedField as any).multiple === true && (mergedField as any).fields !== undefined) {
    const itemFields = (mergedField as any).fields as IFormField[]
    (mergedField as any).fields = itemFields.map((f: IFormField) => {
      const childPath = getPathFromField(f)
      if (childPath === undefined) return null
      
      // Look for overrides matching:
      // 1. arrayPath[].childProp (e.g., "testObject[].field1")
      // 2. arrayPath.childProp (e.g., "testObject.field1")
      const arrayNotationKey = `${key}[].${childPath}`
      const dotNotationKey = `${key}.${childPath}`
      
      const arrayItemOverrides = fieldOverrides?.[arrayNotationKey] ?? fieldOverrides?.[dotNotationKey] ?? []
      
      if (arrayItemOverrides.length > 0) {
        // Apply array item overrides to the field
        return {
          ...f,
          ...(arrayItemOverrides.length > 0 ? Object.assign({}, ...arrayItemOverrides) : {}),
          destPath: childPath
        }
      }
      
      // Recursively handle nested objects within array items
      if (f.type === ***REMOVED***object***REMOVED*** && f.fields !== undefined) {
        return mergeField({
          field: f,
          key: childPath,
          fieldOverrides
        })
      }
      
      return f
    }).filter((f: IFormField | null) => f !== null)
  }
  return mergedField
}

/**
   * Merges form fields with overrides and optionally includes all fields.
   *
   * @param params - The parameters for merging fields.
   * @param params.form - The form object containing fields and nested structures.
   * @param params.fieldOverrides - A record of field overrides keyed by field paths.
   * @param params.includeAllFields - Whether to include fields that are in form but not in overrides in returned set.
   * @returns An array of merged form fields.
   *
   * @example
   * const form = {
   *   id: ***REMOVED***testForm***REMOVED***,
   *   fields: [
   *     { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Field 1***REMOVED*** },
   *     { id: ***REMOVED***field2***REMOVED***, type: ***REMOVED***number***REMOVED***, label: ***REMOVED***Field 2***REMOVED*** }
   *   ]
   * };
   * const overrides = {
   *   ***REMOVED***field1***REMOVED***: [{ label: ***REMOVED***Updated Field 1***REMOVED*** }]
   * };
   * const mergedFields = mergeFields({ form, fieldOverrides: overrides, includeAllFields: true });
   * console.log(mergedFields);
   * // Output: [
   * //   { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED***, label: ***REMOVED***Updated Field 1***REMOVED*** },
   * //   { id: ***REMOVED***field2***REMOVED***, type: ***REMOVED***number***REMOVED***, label: ***REMOVED***Field 2***REMOVED*** }
   * // ]
   */
export const mergeFields = ({
  form,
  fieldOverrides
}: {
  form: IFormSection | IForm
  fieldOverrides?: Record<string, IFormFieldOverride[]>
}): IFormField[] => {
  const formCopy = copyAndAddPathToFields(form)
  return formCopy.fields?.map(field => {
    const fieldPath = getPathFromField(field)
    return fieldPath !== undefined
      ? mergeField({
        field,
        key: fieldPath,
        fieldOverrides
      })
      : null
  }).filter(d => d !== null) ?? []
}

export function mergeObjects<T extends Record<string, any>> (objects: T[]): T {
  const initialValue: T = {} as unknown as T
  return objects.reduce<T>((acc, obj) => ({ ...acc, ...obj }), initialValue)
}

export const mergeFormSections = ({
  formFieldsMap,
  formSection,
  formOverrides,
  fieldOverrides

}: {
  formFieldsMap?: Record<string, IFormField>
  formSection: IFormSection | IForm
  formOverrides: IFormSectionOverride[]
  fieldOverrides: Record<string, IFormFieldOverride[]>
}): IFormSection => {
  const form = cloneObject(formSection)
  const fieldsMap = formFieldsMap ?? buildFieldMapFromForm(formSection)
  const pagesMap: Record<string, IFormSectionOverride[]> = {}
  const wizardStepsMap: Record<string, IFormSectionOverride[]> = {}
  formOverrides.forEach(f => {
    if (f.pages !== undefined) {
      f.pages.forEach((page, index) => {
        const pageId = String(page.id ?? index)
        pagesMap[pageId] = pagesMap[pageId] ?? []
        pagesMap[pageId].push(page)
      })
    }
    if (f.wizard_steps !== undefined) {
      f.wizard_steps.forEach((wizardStep, index) => {
        const wizardStepId = String(wizardStep.id ?? index)
        wizardStepsMap[wizardStepId] = wizardStepsMap[wizardStepId] ?? []
        wizardStepsMap[wizardStepId].push(wizardStep)
      })
    }
  })
  form.pages = Object.keys(pagesMap).map(key => {
    const pageOverrides = pagesMap[key]
    const pageFieldOverrides = groupOverrideFieldsByProp(pageOverrides.map(p => p.fields ?? []))
    Object.keys(pageFieldOverrides).forEach(fieldKey => {
      if (fieldOverrides[fieldKey] !== undefined) {
        fieldOverrides[fieldKey].forEach(f => {
          pageFieldOverrides[fieldKey].unshift(f)
        })
      }
    })
    const pageFields = Object.keys(pageFieldOverrides).map(fieldKey => {
      return fieldsMap[fieldKey]
    }).filter(f => f !== undefined && f !== null)
    const mergedPageFields = mergeFields({
      form: { id: ***REMOVED******REMOVED***, fields: pageFields },
      fieldOverrides: pageFieldOverrides
    })
    const mergedPage = mergeObjects<IFormSectionOverride>(pageOverrides)
    const page: IPage = {
      id: key,
      label: mergedPage?.label ?? key,
      description: mergedPage?.description,
      fields: mergedPageFields
    }
    return page
  })
  form.wizard_steps = Object.keys(wizardStepsMap).map(key => {
    const sectionOverrides = wizardStepsMap[key]
    const sectionFieldOverrides = groupOverrideFieldsByProp(sectionOverrides.map(p => p.fields ?? []))
    Object.keys(sectionFieldOverrides).forEach(fieldKey => {
      if (fieldOverrides[fieldKey] !== undefined) {
        fieldOverrides[fieldKey].forEach(f => {
          sectionFieldOverrides[fieldKey].unshift(f)
        })
      }
    })
    const sectionFields = Object.keys(sectionFieldOverrides).map(fieldKey => {
      return fieldsMap[fieldKey]
    }).filter(f => f !== undefined && f !== null)
    const mergedStepFields = mergeFields({
      form: { id: ***REMOVED******REMOVED***, fields: sectionFields },
      fieldOverrides: sectionFieldOverrides
    })
    const mergedStep = mergeObjects<IFormSectionOverride & { order?: number } >(sectionOverrides)
    const section: IWizardStep = {
      id: key,
      label: mergedStep?.label ?? key,
      description: mergedStep?.description,
      order: mergedStep?.order ?? 0,
      fields: mergedStepFields
    }
    return section
  })
  const fieldsAlreadyUsed = buildFieldMapFromForm({
    ...form,
    fields: undefined
  })

  const remainingFields = Object.keys(fieldsMap).filter(key => {
    return fieldsAlreadyUsed[key] === undefined
  })

  form.fields = remainingFields.map(key => {
    const field = fieldsMap[key]
    const fieldPath = getPathFromField(field)
    const mergedField = fieldPath !== undefined
      ? mergeField({
        field,
        key: fieldPath,
        fieldOverrides
      })
      : null
    return mergedField
  }).filter(f => f !== undefined && f !== null)

  return form
}

export const applyOverridesToSchemaField = ({
  schemaField,
  candidateOverrides,
  destPath
}: {
  schemaField?: IFormField
  candidateOverrides?: IFormFieldOverride[]
  destPath: string
}): IFormField | undefined => {
  let field: IFormField | undefined
  const matchingCandidateOverrides = candidateOverrides === undefined
    ? undefined
    : candidateOverrides.filter(override => {
      return override.prop === destPath
    })
  const hasOverrides = matchingCandidateOverrides !== undefined && matchingCandidateOverrides.length > 0
  if (schemaField === undefined && !hasOverrides) {
    field = undefined
  } else if (schemaField !== undefined && !hasOverrides) {
    field = { ...schemaField }
  } else if (schemaField !== undefined && hasOverrides) {
    field = mergeObjects<IFormFieldOverride | IFormField>([schemaField, ...matchingCandidateOverrides]) as IFormField | undefined
  } else if (schemaField === undefined && hasOverrides) {
    const candidateField = mergeObjects<IFormFieldOverride | IFormField>([...matchingCandidateOverrides]) as IFormField | undefined
    if (candidateField?.type !== undefined && candidateField?.id !== undefined) {
      field = candidateField
    }
  }

  if (field?.type === ***REMOVED***object***REMOVED*** && field.fields !== undefined) {
    field.fields = applyOverridesToSchemaFields({
      schemaFields: field.fields,
      candidateOverrides
    })
  }

  return field === undefined
    ? undefined
    : {
        ...field,
        destPath
      }
}

export const applyOverridesToSchemaFields = ({
  schemaFields,
  candidateOverrides
}: {
  schemaFields: IFormField[]
  candidateOverrides?: IFormFieldOverride[]
}): IFormField[] => {
  return schemaFields.map(field => {
    const destPath = getPathFromField(field)
    return destPath !== undefined
      ? applyOverridesToSchemaField({
        schemaField: field,
        candidateOverrides,
        destPath
      })
      : null
  }).filter(f => f !== undefined && f !== null)
}


