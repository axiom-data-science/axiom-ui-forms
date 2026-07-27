import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import {
  type IFormField,
  type IFormFieldOverride,
  type IFormOverride,
  type IObjectFormFieldOverride,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { schemaToFormObject } from ***REMOVED***@/utils/schemaToFormHelpers***REMOVED***
import {
  type IManagementExport,
  type IManagementFieldNode,
  type IManagementGroupNode,
  type IManagementModel,
  type IManagementSection,
} from ***REMOVED***@/Management/types***REMOVED***

const DEFAULT_SECTION_ID = ***REMOVED***section-1***REMOVED***

const sectionRef = (sectionId: string): string => `section:${sectionId}`
const groupRef = (groupId: string): string => `group:${groupId}`

const isContainerField = (field: IFormField): boolean => {
  return (
    field.type === ***REMOVED***object***REMOVED*** ||
    field.type === ***REMOVED***objectList***REMOVED*** ||
    field.type === ***REMOVED***objectWrapper***REMOVED*** ||
    field.type === ***REMOVED***oneOf***REMOVED*** ||
    field.type === ***REMOVED***section***REMOVED*** ||
    field.type === ***REMOVED***page***REMOVED***
  )
}

const hasNestedFields = (field: IFormField): field is IFormField & { fields: IFormField[] } => {
  return ***REMOVED***fields***REMOVED*** in field && Array.isArray(field.fields)
}

const usesSkipPath = (field: IFormField): boolean => {
  return ***REMOVED***skip_path***REMOVED*** in field && field.skip_path === true
}

const isMultipleField = (field: IFormField): boolean => {
  return ***REMOVED***multiple***REMOVED*** in field && field.multiple === true
}

const joinPath = (prefix: string, part: string): string => {
  if (prefix === ***REMOVED******REMOVED***) return part
  return `${prefix}.${part}`
}

const buildFieldPath = (prefix: string, field: IFormField): string => {
  const id = field.id
  if (usesSkipPath(field)) {
    return ***REMOVED******REMOVED***
  }

  const pathPart = isMultipleField(field) ? `${id}[]` : id
  return joinPath(prefix, pathPart)
}

const buildNextPrefix = (prefix: string, field: IFormField): string => {
  const selfPath = buildFieldPath(prefix, field)
  if (usesSkipPath(field)) {
    return prefix
  }
  return selfPath
}

const flattenFields = (
  fields: IFormField[],
  prefix = ***REMOVED******REMOVED***
): Array<{ prop: string; field: IFormField }> => {
  const result: Array<{ prop: string; field: IFormField }> = []

  fields.forEach((field) => {
    const prop = buildFieldPath(prefix, field)

    if (prop !== ***REMOVED******REMOVED***) {
      result.push({ prop, field })
    }

    if (isContainerField(field) && hasNestedFields(field)) {
      const nextPrefix = buildNextPrefix(prefix, field)
      result.push(...flattenFields(field.fields, nextPrefix))
    }
  })

  return result
}

export const createManagementModelFromSchema = (schema: JSONSchema6): IManagementModel => {
  const generatedForm = schemaToFormObject(schema)
  const flattened = flattenFields(generatedForm.fields ?? [])

  const defaultSection: IManagementSection = {
    id: DEFAULT_SECTION_ID,
    label: ***REMOVED***Section 1***REMOVED***,
    order: 0,
    parentSectionId: undefined,
    parentListType: undefined,
    childListType: undefined,
  }

  const fields: IManagementFieldNode[] = flattened.map((item, index) => ({
    id: `field-${index + 1}`,
    prop: item.prop,
    label: item.field.label ?? item.field.id,
    baseType: item.field.type,
    parentRef: sectionRef(DEFAULT_SECTION_ID),
    order: index,
  }))

  return {
    formId: generatedForm.id,
    label: generatedForm.label ?? generatedForm.id,
    description: generatedForm.description,
    navigation: ***REMOVED***fields***REMOVED***,
    sections: [defaultSection],
    groups: [],
    fields,
  }
}

type ISiblingEntry =
  | {
      kind: ***REMOVED***field***REMOVED***
      order: number
      field: IManagementFieldNode
    }
  | {
      kind: ***REMOVED***group***REMOVED***
      order: number
      group: IManagementGroupNode
    }

const getSiblingEntries = (model: IManagementModel, parentRef: string): ISiblingEntry[] => {
  const fieldEntries: ISiblingEntry[] = model.fields
    .filter((field) => field.parentRef === parentRef)
    .map((field) => ({
      kind: ***REMOVED***field***REMOVED***,
      order: field.order,
      field,
    }))

  const groupEntries: ISiblingEntry[] = model.groups
    .filter((group) => group.parentRef === parentRef)
    .map((group) => ({
      kind: ***REMOVED***group***REMOVED***,
      order: group.order,
      group,
    }))

  return [...fieldEntries, ...groupEntries].sort((a, b) => a.order - b.order)
}

const buildChildren = (model: IManagementModel, parentRef: string): IFormFieldOverride[] => {
  return getSiblingEntries(model, parentRef).map((entry) => {
    if (entry.kind === ***REMOVED***field***REMOVED***) {
      return { prop: entry.field.prop }
    }

    const group: IObjectFormFieldOverride = {
      id: entry.group.id,
      type: ***REMOVED***object***REMOVED***,
      label: entry.group.label,
      skip_path: true,
      layout: entry.group.layout,
      fields: buildChildren(model, groupRef(entry.group.id)),
    }

    return group
  })
}

const buildSectionPayload = (
  model: IManagementModel
): Array<{
  id: string
  label?: string
  order?: number
  fields: IFormFieldOverride[]
  pages?: Array<{
    id: string
    label?: string
    order?: number
    fields: IFormFieldOverride[]
  }>
  tabs?: Array<{
    id: string
    label?: string
    order?: number
    fields: IFormFieldOverride[]
  }>
  wizard_steps?: Array<{
    id: string
    label?: string
    order?: number
    fields: IFormFieldOverride[]
  }>
}> => {
  interface ISectionExportNode {
    id: string
    label?: string
    order?: number
    fields: IFormFieldOverride[]
    pages?: ISectionExportNode[]
    tabs?: ISectionExportNode[]
    wizard_steps?: ISectionExportNode[]
  }

  const buildSectionNode = (section: IManagementSection): ISectionExportNode => {
    const node: ISectionExportNode = {
      id: section.id,
      label: section.label,
      order: section.order,
      fields: buildChildren(model, sectionRef(section.id)),
    }

    const children = model.sections
      .filter((s) => s.parentSectionId === section.id)
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((s) => buildSectionNode(s))

    if (children.length > 0 && section.childListType !== undefined) {
      if (section.childListType === ***REMOVED***pages***REMOVED***) {
        node.pages = children
      }
      if (section.childListType === ***REMOVED***tabs***REMOVED***) {
        node.tabs = children
      }
      if (section.childListType === ***REMOVED***wizard_steps***REMOVED***) {
        node.wizard_steps = children
      }
    }

    return node
  }

  return model.sections
    .filter((section) => section.parentSectionId === undefined)
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((section) => buildSectionNode(section))
}

export const createOverridesFromModel = (model: IManagementModel): IManagementExport => {
  const formOverride: IFormOverride = {
    id: model.formId,
    label: model.label,
    description: model.description,
  }

  const sectionPayload = buildSectionPayload(model)

  if (model.navigation === ***REMOVED***fields***REMOVED***) {
    formOverride.fields = model.sections
      .slice()
      .sort((a, b) => a.order - b.order)
      .flatMap((section) => buildChildren(model, sectionRef(section.id)))
  }

  if (model.navigation === ***REMOVED***pages***REMOVED***) {
    formOverride.pages = sectionPayload
  }

  if (model.navigation === ***REMOVED***tabs***REMOVED***) {
    formOverride.tabs = sectionPayload
  }

  if (model.navigation === ***REMOVED***wizard_steps***REMOVED***) {
    formOverride.wizard_steps = sectionPayload
  }

  const fieldOverrides: IFormFieldOverride[] = model.fields
    .filter(
      (field) =>
        field.overrideType !== undefined ||
        field.overrideLabel !== undefined ||
        field.overrideConditions !== undefined ||
        field.overrideConditionsSet !== undefined ||
        field.overrideSettings !== undefined ||
        field.overrideConstraints !== undefined ||
        field.destPath !== undefined ||
        (field.overrideExtras !== undefined && Object.keys(field.overrideExtras).length > 0)
    )
    .map((field) => {
      const result: IFormFieldOverride = {
        prop: field.prop,
      }

      if (field.overrideExtras !== undefined) {
        Object.assign(result, field.overrideExtras)
      }

      if (field.overrideType !== undefined) {
        result.type = field.overrideType
      }

      if (field.overrideLabel !== undefined && field.overrideLabel.trim() !== ***REMOVED******REMOVED***) {
        result.label = field.overrideLabel
      }

      if (field.overrideConditions !== undefined) {
        result.conditions = field.overrideConditions
      }

      if (field.overrideConditionsSet !== undefined) {
        result.conditionsSet = field.overrideConditionsSet
      }

      if (field.overrideSettings !== undefined) {
        result.settings = field.overrideSettings
      }

      if (
        field.overrideConstraints !== undefined &&
        Object.keys(field.overrideConstraints).length > 0
      ) {
        result.constraints = field.overrideConstraints
      }

      if (field.destPath !== undefined && field.destPath.trim() !== ***REMOVED******REMOVED***) {
        result.destPath = field.destPath
      }

      return result
    })

  return {
    formOverride,
    fieldOverrides,
  }
}
