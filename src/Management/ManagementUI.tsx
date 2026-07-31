import React, { type DragEvent, type ReactElement, useEffect, useMemo, useState } from ***REMOVED***react***REMOVED***
import { flushSync } from ***REMOVED***react-dom***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***
import { Button, Tabs, Tooltip } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { DragHandleDots2Icon } from ***REMOVED***@radix-ui/react-icons***REMOVED***
import {
  X,
  FilePlus,
  Plus,
  ArrowUp,
  CornerUpLeft,
  CornerDownRight,
  CornerDownLeft,
  Pencil,
  CornerUpRight,
  ListEnd,
  ListStart,
} from ***REMOVED***lucide-react***REMOVED***
import { JSONInput } from ***REMOVED***@/Form/Components/Inputs***REMOVED***
import { SchemaFormCreator } from ***REMOVED***@/Form/Creator/FormCreator***REMOVED***
import {
  type IFormField,
  type IFormFieldOverride,
  type IFormOverride,
  type IFormValues,
  type IValueType,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { createManagementModelFromSchema, createOverridesFromModel } from ***REMOVED***@/Management/adapters***REMOVED***
import {
  type IManagementFieldNode,
  type IManagementGroupNode,
  type IManagementModel,
  type IManagementNavigationMode,
  type IManagementSection,
} from ***REMOVED***@/Management/types***REMOVED***
import OverlayEditor from ***REMOVED***@/Management/Components/OverlayEditor***REMOVED***
import FieldNodeRow from ***REMOVED***@/Management/Components/FieldNodeRow***REMOVED***
import {
  ConditionEditor,
  ConditionSetEditor,
  GeneralSettingsEditor,
  TypeSpecificSettingsEditor,
  ConstraintsEditor,
  SelectOptionsEditor,
} from ***REMOVED***@/Management/Components/FieldEditorsTabbed***REMOVED***
import GroupNodeCard from ***REMOVED***@/Management/Components/GroupNodeCard***REMOVED***
import habSchema from ***REMOVED***@/PTT/HAB/HABConfig.json***REMOVED***
import habFormOverride from ***REMOVED***@/PTT/HAB/habFormOverride***REMOVED***
import habFieldOverrides from ***REMOVED***@/PTT/HAB/habFieldOverrides***REMOVED***
import oilSchema from ***REMOVED***@/PTT/Oil/OpenOilModelConfig.json***REMOVED***
import oilFormOverride from ***REMOVED***@/PTT/Oil/oilFormOverride***REMOVED***
import oilFieldOverrides from ***REMOVED***@/PTT/Oil/oilFieldOverrides***REMOVED***
import larvalSchema from ***REMOVED***@/PTT/Larval/LarvalFishModelConfig.json***REMOVED***
import larvalFormOverride from ***REMOVED***@/PTT/Larval/larvalFormOverride***REMOVED***
import larvalFieldOverrides from ***REMOVED***@/PTT/Larval/larvalFieldOverrides***REMOVED***
import sharedPttFieldOverrides from ***REMOVED***@/PTT/fieldOverrides***REMOVED***
import testArrayWithTabsSchema from ***REMOVED***@/Form/TestForms/ArrayWithTabs/schema.json***REMOVED***
import testArrayWithTabsForm from ***REMOVED***@/Form/TestForms/ArrayWithTabs/form.json***REMOVED***
import testArrayWithTabsFields from ***REMOVED***@/Form/TestForms/ArrayWithTabs/fields.json***REMOVED***
import testArrayWithWrapperObjectsSchema from ***REMOVED***@/Form/TestForms/ArrayWithWrapperObjects/schema.json***REMOVED***
import testArrayWithWrapperObjectsForm from ***REMOVED***@/Form/TestForms/ArrayWithWrapperObjects/form.json***REMOVED***
import testArrayWithWrapperObjectsFields from ***REMOVED***@/Form/TestForms/ArrayWithWrapperObjects/fields.json***REMOVED***
import testDefaultValueSchema from ***REMOVED***@/Form/TestForms/DefaultValue/schema.json***REMOVED***
import testDefaultValueForm from ***REMOVED***@/Form/TestForms/DefaultValue/form.json***REMOVED***
import testDefaultValueFields from ***REMOVED***@/Form/TestForms/DefaultValue/fields.json***REMOVED***
import testErddapSchema from ***REMOVED***@/Form/TestForms/ERDDAP/schema.json***REMOVED***
import testErddapForm from ***REMOVED***@/Form/TestForms/ERDDAP/form.json***REMOVED***
import testErddapFields from ***REMOVED***@/Form/TestForms/ERDDAP/fields.json***REMOVED***
import testNestedDependentsSchema from ***REMOVED***@/Form/TestForms/NestedDependents/schema.json***REMOVED***
import testNestedDependentsForm from ***REMOVED***@/Form/TestForms/NestedDependents/form.json***REMOVED***
import testNestedDependentsFields from ***REMOVED***@/Form/TestForms/NestedDependents/field_overrides.json***REMOVED***
import testObjectWrapperWithSchemaSchema from ***REMOVED***@/Form/TestForms/ObjectWrapperWithSchema/schema.json***REMOVED***
import testObjectWrapperWithSchemaForm from ***REMOVED***@/Form/TestForms/ObjectWrapperWithSchema/form.json***REMOVED***
import testObjectWrapperWithSchemaFields from ***REMOVED***@/Form/TestForms/ObjectWrapperWithSchema/fields.json***REMOVED***
import testOverrideOfSchemaArraySchema from ***REMOVED***@/Form/TestForms/OverrideOfSchemaArray/schema.json***REMOVED***
import testOverrideOfSchemaArrayForm from ***REMOVED***@/Form/TestForms/OverrideOfSchemaArray/form.json***REMOVED***
import testOverrideOfSchemaArrayFields from ***REMOVED***@/Form/TestForms/OverrideOfSchemaArray/fields.json***REMOVED***

const sampleSchema: JSONSchema6 = {
  type: ***REMOVED***object***REMOVED***,
  properties: {
    label: { type: ***REMOVED***string***REMOVED*** },
    first_name: { type: ***REMOVED***string***REMOVED*** },
    last_name: { type: ***REMOVED***string***REMOVED*** },
    color: { type: ***REMOVED***string***REMOVED***, enum: [***REMOVED***red***REMOVED***, ***REMOVED***green***REMOVED***, ***REMOVED***blue***REMOVED***] },
    choice: { type: ***REMOVED***string***REMOVED*** },
    description: { type: ***REMOVED***string***REMOVED*** },
    is_it_true: { type: ***REMOVED***boolean***REMOVED*** },
    count: { type: ***REMOVED***number***REMOVED*** },
  },
}

const fieldTypeOptions: IFormField[***REMOVED***type***REMOVED***][] = [
  ***REMOVED***text***REMOVED***,
  ***REMOVED***long_text***REMOVED***,
  ***REMOVED***constant***REMOVED***,
  ***REMOVED***number***REMOVED***,
  ***REMOVED***boolean***REMOVED***,
  ***REMOVED***checkbox***REMOVED***,
  ***REMOVED***select***REMOVED***,
  ***REMOVED***stateSelector***REMOVED***,
  ***REMOVED***selectOrText***REMOVED***,
  ***REMOVED***radio***REMOVED***,
  ***REMOVED***date***REMOVED***,
  ***REMOVED***time***REMOVED***,
  ***REMOVED***datetime***REMOVED***,
  ***REMOVED***file_upload***REMOVED***,
  ***REMOVED***json***REMOVED***,
  ***REMOVED***geojson***REMOVED***,
  ***REMOVED***geometry***REMOVED***,
  ***REMOVED***objectList***REMOVED***,
  ***REMOVED***oneOf***REMOVED***,
  ***REMOVED***object***REMOVED***,
  ***REMOVED***objectWrapper***REMOVED***,
]

const makeParentRef = {
  section: (sectionId: string): string => `section:${sectionId}`,
  group: (groupId: string): string => `group:${groupId}`,
  field: (fieldId: string): string => `field:${fieldId}`,
}

type IManagementSeedPreset = {
  id: string
  label: string
  schema: JSONSchema6
  formOverride: unknown
  fieldOverrides: unknown
}

type IPaletteSchemaField = {
  prop: string
  label: string
  baseType: IFormField[***REMOVED***type***REMOVED***]
}

const OVERRIDE_MODELED_KEYS = new Set([
  ***REMOVED***prop***REMOVED***,
  ***REMOVED***type***REMOVED***,
  ***REMOVED***label***REMOVED***,
  ***REMOVED***conditions***REMOVED***,
  ***REMOVED***conditionsSet***REMOVED***,
  ***REMOVED***settings***REMOVED***,
  ***REMOVED***fields***REMOVED***,
  ***REMOVED***pages***REMOVED***,
  ***REMOVED***tabs***REMOVED***,
  ***REMOVED***wizard_steps***REMOVED***,
])

const cloneForEditor = <T,>(value: T): T => {
  return JSON.parse(JSON.stringify(value)) as T
}

const extractOverrideExtras = (overrideLike: Record<string, unknown>): Record<string, unknown> => {
  const extras: Record<string, unknown> = {}
  Object.entries(overrideLike).forEach(([key, value]) => {
    if (OVERRIDE_MODELED_KEYS.has(key)) return
    extras[key] = value
  })
  return extras
}

const mergeOverrideExtras = (
  current: Record<string, unknown> | undefined,
  next: Record<string, unknown>
): Record<string, unknown> | undefined => {
  if (Object.keys(next).length === 0) return current
  return {
    ...(current ?? {}),
    ...next,
  }
}

const getSeedFieldOverrides = (specific: unknown): unknown[] => {
  const shared = Array.isArray(sharedPttFieldOverrides) ? sharedPttFieldOverrides : []
  const modelSpecific = Array.isArray(specific) ? specific : []
  return [...shared, ...modelSpecific]
}

const managementSeedPresets: IManagementSeedPreset[] = [
  {
    id: ***REMOVED***ptt-hab***REMOVED***,
    label: ***REMOVED***PTT: HAB***REMOVED***,
    schema: habSchema as JSONSchema6,
    formOverride: habFormOverride,
    fieldOverrides: getSeedFieldOverrides(habFieldOverrides),
  },
  {
    id: ***REMOVED***ptt-oil***REMOVED***,
    label: ***REMOVED***PTT: Oil***REMOVED***,
    schema: oilSchema as JSONSchema6,
    formOverride: oilFormOverride,
    fieldOverrides: getSeedFieldOverrides(oilFieldOverrides),
  },
  {
    id: ***REMOVED***ptt-larval***REMOVED***,
    label: ***REMOVED***PTT: Larval***REMOVED***,
    schema: larvalSchema as JSONSchema6,
    formOverride: larvalFormOverride,
    fieldOverrides: getSeedFieldOverrides(larvalFieldOverrides),
  },
  {
    id: ***REMOVED***test-array-with-tabs***REMOVED***,
    label: ***REMOVED***TestForms: ArrayWithTabs***REMOVED***,
    schema: testArrayWithTabsSchema as JSONSchema6,
    formOverride: testArrayWithTabsForm,
    fieldOverrides: testArrayWithTabsFields,
  },
  {
    id: ***REMOVED***test-array-with-wrapper-objects***REMOVED***,
    label: ***REMOVED***TestForms: ArrayWithWrapperObjects***REMOVED***,
    schema: testArrayWithWrapperObjectsSchema as JSONSchema6,
    formOverride: testArrayWithWrapperObjectsForm,
    fieldOverrides: testArrayWithWrapperObjectsFields,
  },
  {
    id: ***REMOVED***test-default-value***REMOVED***,
    label: ***REMOVED***TestForms: DefaultValue***REMOVED***,
    schema: testDefaultValueSchema as JSONSchema6,
    formOverride: testDefaultValueForm,
    fieldOverrides: testDefaultValueFields,
  },
  {
    id: ***REMOVED***test-erddap***REMOVED***,
    label: ***REMOVED***TestForms: ERDDAP***REMOVED***,
    schema: testErddapSchema as JSONSchema6,
    formOverride: testErddapForm,
    fieldOverrides: testErddapFields,
  },
  {
    id: ***REMOVED***test-nested-dependents***REMOVED***,
    label: ***REMOVED***TestForms: NestedDependents***REMOVED***,
    schema: testNestedDependentsSchema as JSONSchema6,
    formOverride: testNestedDependentsForm,
    fieldOverrides: testNestedDependentsFields,
  },
  {
    id: ***REMOVED***test-object-wrapper-with-schema***REMOVED***,
    label: ***REMOVED***TestForms: ObjectWrapperWithSchema***REMOVED***,
    schema: testObjectWrapperWithSchemaSchema as JSONSchema6,
    formOverride: testObjectWrapperWithSchemaForm,
    fieldOverrides: testObjectWrapperWithSchemaFields,
  },
  {
    id: ***REMOVED***test-override-of-schema-array***REMOVED***,
    label: ***REMOVED***TestForms: OverrideOfSchemaArray***REMOVED***,
    schema: testOverrideOfSchemaArraySchema as JSONSchema6,
    formOverride: testOverrideOfSchemaArrayForm,
    fieldOverrides: testOverrideOfSchemaArrayFields,
  },
]

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === ***REMOVED***object***REMOVED*** && !Array.isArray(value)
}

const readString = (value: unknown): string | undefined => {
  return typeof value === ***REMOVED***string***REMOVED*** ? value : undefined
}

const readFieldArray = (value: unknown): Array<Record<string, unknown>> => {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is Record<string, unknown> => isRecord(v))
}

const readRecord = (value: unknown): Record<string, unknown> | undefined => {
  return isRecord(value) ? value : undefined
}

const generateShortGuid = (): string => {
  return Math.random().toString(36).substring(2, 6).toUpperCase()
}

const normalizeFieldType = (value: string | undefined): IFormField[***REMOVED***type***REMOVED***] | undefined => {
  if (value === undefined) return undefined
  if (value === ***REMOVED***fileUpload***REMOVED***) return ***REMOVED***file_upload***REMOVED***
  if (value === ***REMOVED***state_selector***REMOVED***) return ***REMOVED***stateSelector***REMOVED***
  return value as IFormField[***REMOVED***type***REMOVED***]
}

const GENERAL_FIELD_SETTING_KEYS = new Set([
  ***REMOVED***descriptionPresentation***REMOVED***,
  ***REMOVED***boldLabel***REMOVED***,
  ***REMOVED***smallLabel***REMOVED***,
  ***REMOVED***className***REMOVED***,
])

const splitFieldSettings = (
  settings: IFormField[***REMOVED***settings***REMOVED***] | undefined
): { general: Record<string, unknown>; typeSpecific: Record<string, unknown> } => {
  if (!isRecord(settings)) {
    return { general: {}, typeSpecific: {} }
  }

  const general: Record<string, unknown> = {}
  const typeSpecific: Record<string, unknown> = {}

  Object.entries(settings).forEach(([key, value]) => {
    if (GENERAL_FIELD_SETTING_KEYS.has(key)) {
      general[key] = value
      return
    }
    typeSpecific[key] = value
  })

  return { general, typeSpecific }
}

const mergeFieldSettings = (
  general: Record<string, unknown>,
  typeSpecific: Record<string, unknown>
): IFormField[***REMOVED***settings***REMOVED***] | undefined => {
  const merged = {
    ...general,
    ...typeSpecific,
  }

  return Object.keys(merged).length > 0 ? (merged as IFormField[***REMOVED***settings***REMOVED***]) : undefined
}

const isMappedFieldInSchema = (field: IManagementFieldNode, schemaProps: Set<string>): boolean => {
  if (field.prop.trim() === ***REMOVED******REMOVED***) return false
  return schemaProps.has(field.prop)
}

const normalizeSiblingOrder = (model: IManagementModel, parentRef: string): IManagementModel => {
  const siblingFields = model.fields
    .filter((field) => field.parentRef === parentRef)
    .sort((a, b) => a.order - b.order)

  const siblingGroups = model.groups
    .filter((group) => group.parentRef === parentRef)
    .sort((a, b) => a.order - b.order)

  const allEntries = [
    ...siblingFields.map((field) => ({ kind: ***REMOVED***field***REMOVED*** as const, id: field.id, order: field.order })),
    ...siblingGroups.map((group) => ({ kind: ***REMOVED***group***REMOVED*** as const, id: group.id, order: group.order })),
  ].sort((a, b) => a.order - b.order)

  const fieldOrderMap = new Map<string, number>()
  const groupOrderMap = new Map<string, number>()

  allEntries.forEach((entry, idx) => {
    if (entry.kind === ***REMOVED***field***REMOVED***) {
      fieldOrderMap.set(entry.id, idx)
    } else {
      groupOrderMap.set(entry.id, idx)
    }
  })

  return {
    ...model,
    fields: model.fields.map((field) => {
      if (field.parentRef !== parentRef) return field
      return { ...field, order: fieldOrderMap.get(field.id) ?? field.order }
    }),
    groups: model.groups.map((group) => {
      if (group.parentRef !== parentRef) return group
      return { ...group, order: groupOrderMap.get(group.id) ?? group.order }
    }),
  }
}

const getSiblingEntries = (
  model: IManagementModel,
  parentRef: string
): Array<{
  kind: ***REMOVED***field***REMOVED*** | ***REMOVED***group***REMOVED***
  id: string
  order: number
}> => {
  return [
    ...model.fields
      .filter((field) => field.parentRef === parentRef)
      .map((field) => ({ kind: ***REMOVED***field***REMOVED*** as const, id: field.id, order: field.order })),
    ...model.groups
      .filter((group) => group.parentRef === parentRef)
      .map((group) => ({ kind: ***REMOVED***group***REMOVED*** as const, id: group.id, order: group.order })),
  ].sort((a, b) => a.order - b.order)
}

const isFieldContainerType = (fieldType: IFormField[***REMOVED***type***REMOVED***] | undefined): boolean => {
  return fieldType === ***REMOVED***object***REMOVED*** || fieldType === ***REMOVED***objectWrapper***REMOVED***
}

const getEffectiveFieldType = (field: IManagementFieldNode): IFormField[***REMOVED***type***REMOVED***] => {
  return field.overrideType ?? field.baseType
}

const fieldCanContainChildren = (field: IManagementFieldNode): boolean => {
  return isFieldContainerType(getEffectiveFieldType(field))
}

const fieldCanReceiveChildren = (
  field: IManagementFieldNode,
  schemaProps: Set<string>
): boolean => {
  return fieldCanContainChildren(field) && !isMappedFieldInSchema(field, schemaProps)
}

const getParentRefForNodeRef = (model: IManagementModel, nodeRef: string): string | undefined => {
  if (nodeRef.startsWith(***REMOVED***group:***REMOVED***)) {
    const groupId = nodeRef.replace(***REMOVED***group:***REMOVED***, ***REMOVED******REMOVED***)
    return model.groups.find((group) => group.id === groupId)?.parentRef
  }

  if (nodeRef.startsWith(***REMOVED***field:***REMOVED***)) {
    const fieldId = nodeRef.replace(***REMOVED***field:***REMOVED***, ***REMOVED******REMOVED***)
    return model.fields.find((field) => field.id === fieldId)?.parentRef
  }

  return undefined
}

const parentRefCanReceiveChildren = (
  model: IManagementModel,
  parentRef: string,
  schemaProps: Set<string>
): boolean => {
  if (!parentRef.startsWith(***REMOVED***field:***REMOVED***)) return true

  const fieldId = parentRef.replace(***REMOVED***field:***REMOVED***, ***REMOVED******REMOVED***)
  const field = model.fields.find((item) => item.id === fieldId)
  if (field === undefined) return false
  return fieldCanReceiveChildren(field, schemaProps)
}

const canMoveNodeRefToParent = (
  model: IManagementModel,
  movingNodeRef: string,
  targetParentRef: string
): boolean => {
  if (movingNodeRef === targetParentRef) return false

  const visited = new Set<string>()
  let currentRef: string | undefined = targetParentRef

  while (
    currentRef !== undefined &&
    (currentRef.startsWith(***REMOVED***group:***REMOVED***) || currentRef.startsWith(***REMOVED***field:***REMOVED***))
  ) {
    if (visited.has(currentRef)) return false
    if (currentRef === movingNodeRef) return false
    visited.add(currentRef)

    currentRef = getParentRefForNodeRef(model, currentRef)
  }

  return true
}

const groupCanBeParent = (
  model: IManagementModel,
  group: IManagementGroupNode,
  candidateParentRef: string,
  schemaProps: Set<string>
): boolean => {
  if (!parentRefCanReceiveChildren(model, candidateParentRef, schemaProps)) return false
  return canMoveNodeRefToParent(model, makeParentRef.group(group.id), candidateParentRef)
}

type IDragItem = {
  kind: ***REMOVED***field***REMOVED*** | ***REMOVED***group***REMOVED***
  id: string
  sourceParentRef: string
}

type ISectionDragItem = {
  sectionId: string
  sourceParentSectionId?: string
}

type IDragInsertTarget = {
  parentRef: string
  index: number
}

type IInlineLabelEditTarget = {
  kind: ***REMOVED***field***REMOVED*** | ***REMOVED***section***REMOVED***
  id: string
}

const getSectionSiblings = (
  model: IManagementModel,
  parentSectionId?: string
): IManagementSection[] => {
  return model.sections
    .filter((section) => section.parentSectionId === parentSectionId)
    .slice()
    .sort((a, b) => a.order - b.order)
}

const normalizeSectionOrder = (
  model: IManagementModel,
  parentSectionId?: string
): IManagementModel => {
  const siblings = getSectionSiblings(model, parentSectionId)
  const orderMap = new Map(siblings.map((section, idx) => [section.id, idx]))
  return {
    ...model,
    sections: model.sections.map((section) => {
      if (section.parentSectionId !== parentSectionId) return section
      return {
        ...section,
        order: orderMap.get(section.id) ?? section.order,
      }
    }),
  }
}

const pruneEmptyChildSectionListTypes = (model: IManagementModel): IManagementModel => {
  const parentIdsWithChildren = new Set(
    model.sections
      .map((section) => section.parentSectionId)
      .filter((parentId): parentId is string => parentId !== undefined)
  )

  return {
    ...model,
    sections: model.sections.map((section) => {
      if (section.childListType === undefined) return section
      if (parentIdsWithChildren.has(section.id)) return section
      return {
        ...section,
        childListType: undefined,
      }
    }),
  }
}

const moveSectionToParentAtIndex = (
  model: IManagementModel,
  dragItem: ISectionDragItem,
  targetParentSectionId: string | undefined,
  targetIndex: number
): IManagementModel => {
  const targetSiblings = getSectionSiblings(model, targetParentSectionId)
  const movingSection = model.sections.find((section) => section.id === dragItem.sectionId)
  if (movingSection === undefined) return model

  const targetParent =
    targetParentSectionId !== undefined
      ? model.sections.find((section) => section.id === targetParentSectionId)
      : undefined

  let nextModel: IManagementModel = {
    ...model,
    sections: model.sections.map((section) => {
      if (section.id !== dragItem.sectionId) return section
      return {
        ...section,
        parentSectionId: targetParentSectionId,
        parentListType: targetParent?.childListType,
        order: targetSiblings.length,
      }
    }),
  }

  const movedSiblings = getSectionSiblings(nextModel, targetParentSectionId).map(
    (section) => section.id
  )
  const currentIndex = movedSiblings.findIndex((id) => id === dragItem.sectionId)
  if (currentIndex < 0) return nextModel

  const reordered = movedSiblings.slice()
  const [movingId] = reordered.splice(currentIndex, 1)
  const clampedIndex = Math.max(0, Math.min(targetIndex, reordered.length))
  reordered.splice(clampedIndex, 0, movingId)

  const orderMap = new Map(reordered.map((id, idx) => [id, idx]))
  nextModel = {
    ...nextModel,
    sections: nextModel.sections.map((section) => {
      if (section.parentSectionId !== targetParentSectionId) return section
      return {
        ...section,
        order: orderMap.get(section.id) ?? section.order,
      }
    }),
  }

  if (dragItem.sourceParentSectionId !== targetParentSectionId) {
    nextModel = normalizeSectionOrder(nextModel, dragItem.sourceParentSectionId)
  }

  return nextModel
}

const sectionCanMoveToParent = (
  model: IManagementModel,
  movingSectionId: string,
  targetParentSectionId: string | undefined
): boolean => {
  if (targetParentSectionId === undefined) return true
  if (movingSectionId === targetParentSectionId) return false

  let current = model.sections.find((section) => section.id === targetParentSectionId)
  const visited = new Set<string>()

  while (current !== undefined) {
    if (visited.has(current.id)) return false
    if (current.id === movingSectionId) return false
    visited.add(current.id)

    if (current.parentSectionId === undefined) return true
    current = model.sections.find((section) => section.id === current?.parentSectionId)
  }

  return true
}

const isDropAllowed = (
  model: IManagementModel,
  dragItem: IDragItem | undefined,
  targetParentRef: string,
  schemaProps: Set<string>
): boolean => {
  if (dragItem === undefined) return false
  if (!parentRefCanReceiveChildren(model, targetParentRef, schemaProps)) return false

  if (dragItem.kind === ***REMOVED***field***REMOVED***) {
    return canMoveNodeRefToParent(model, makeParentRef.field(dragItem.id), targetParentRef)
  }

  const group = model.groups.find((g) => g.id === dragItem.id)
  if (group === undefined) return false

  return groupCanBeParent(model, group, targetParentRef, schemaProps)
}

const isPaletteDropAllowed = (
  model: IManagementModel,
  paletteField: IPaletteSchemaField | undefined,
  targetParentRef: string,
  schemaProps: Set<string>
): boolean => {
  if (paletteField === undefined) return false
  if (paletteField.prop.trim() === ***REMOVED******REMOVED***) return false
  if (schemaProps.has(paletteField.prop) === false) return false
  return parentRefCanReceiveChildren(model, targetParentRef, schemaProps)
}

const getNextFieldId = (model: IManagementModel): string => {
  let max = 0
  model.fields.forEach((field) => {
    const parsed = Number(field.id.replace(***REMOVED***field-***REMOVED***, ***REMOVED******REMOVED***))
    if (Number.isFinite(parsed)) {
      max = Math.max(max, parsed)
    }
  })
  return `field-${max + 1}`
}

const addPaletteFieldToParentAtIndex = (
  model: IManagementModel,
  paletteField: IPaletteSchemaField,
  targetParentRef: string,
  targetIndex: number,
  schemaProps: Set<string>
): { model: IManagementModel; fieldId: string } => {
  const existingField = model.fields.find((field) => field.prop === paletteField.prop)

  if (existingField !== undefined) {
    const moved = moveEntryToParentAtIndex(
      model,
      {
        kind: ***REMOVED***field***REMOVED***,
        id: existingField.id,
        sourceParentRef: existingField.parentRef,
      },
      targetParentRef,
      targetIndex,
      schemaProps
    )
    return {
      model: moved,
      fieldId: existingField.id,
    }
  }

  const fieldId = getNextFieldId(model)
  const withNewField: IManagementModel = {
    ...model,
    fields: [
      ...model.fields,
      {
        id: fieldId,
        prop: paletteField.prop,
        label: paletteField.label,
        baseType: paletteField.baseType,
        parentRef: targetParentRef,
        order: getSiblingEntries(model, targetParentRef).length,
      },
    ],
  }

  const inserted = moveEntryToParentAtIndex(
    withNewField,
    {
      kind: ***REMOVED***field***REMOVED***,
      id: fieldId,
      sourceParentRef: targetParentRef,
    },
    targetParentRef,
    targetIndex,
    schemaProps
  )

  return {
    model: inserted,
    fieldId,
  }
}

const moveEntryToParent = (
  model: IManagementModel,
  dragItem: IDragItem,
  targetParentRef: string,
  schemaProps: Set<string>
): IManagementModel => {
  if (!isDropAllowed(model, dragItem, targetParentRef, schemaProps)) return model
  if (dragItem.sourceParentRef === targetParentRef) return model

  const targetSiblingCount = getSiblingEntries(model, targetParentRef).length

  if (dragItem.kind === ***REMOVED***field***REMOVED***) {
    const nextFields = model.fields.map((field) => {
      if (field.id !== dragItem.id) return field
      return {
        ...field,
        parentRef: targetParentRef,
        order: targetSiblingCount,
      }
    })

    const withMove = { ...model, fields: nextFields }
    const normalizedOld = normalizeSiblingOrder(withMove, dragItem.sourceParentRef)
    return normalizeSiblingOrder(normalizedOld, targetParentRef)
  }

  const nextGroups = model.groups.map((group) => {
    if (group.id !== dragItem.id) return group
    return {
      ...group,
      parentRef: targetParentRef,
      order: targetSiblingCount,
    }
  })

  const withMove = { ...model, groups: nextGroups }
  const normalizedOld = normalizeSiblingOrder(withMove, dragItem.sourceParentRef)
  return normalizeSiblingOrder(normalizedOld, targetParentRef)
}

const setSiblingOrder = (
  model: IManagementModel,
  parentRef: string,
  orderedEntries: Array<{ kind: ***REMOVED***field***REMOVED*** | ***REMOVED***group***REMOVED***; id: string }>
): IManagementModel => {
  const orderMap = new Map<string, number>()
  orderedEntries.forEach((entry, idx) => {
    orderMap.set(`${entry.kind}:${entry.id}`, idx)
  })

  return {
    ...model,
    fields: model.fields.map((field) => {
      if (field.parentRef !== parentRef) return field
      return {
        ...field,
        order: orderMap.get(`field:${field.id}`) ?? field.order,
      }
    }),
    groups: model.groups.map((group) => {
      if (group.parentRef !== parentRef) return group
      return {
        ...group,
        order: orderMap.get(`group:${group.id}`) ?? group.order,
      }
    }),
  }
}

const moveEntryToParentAtIndex = (
  model: IManagementModel,
  dragItem: IDragItem,
  targetParentRef: string,
  targetIndex: number,
  schemaProps: Set<string>
): IManagementModel => {
  if (!isDropAllowed(model, dragItem, targetParentRef, schemaProps)) return model

  const moved = moveEntryToParent(model, dragItem, targetParentRef, schemaProps)
  const siblings = getSiblingEntries(moved, targetParentRef).map((entry) => ({
    kind: entry.kind,
    id: entry.id,
  }))

  const draggedKey = `${dragItem.kind}:${dragItem.id}`
  const currentIndex = siblings.findIndex((entry) => `${entry.kind}:${entry.id}` === draggedKey)
  if (currentIndex < 0) return moved

  const reordered = siblings.slice()
  const [dragged] = reordered.splice(currentIndex, 1)

  // When moving within the same parent, removing the dragged item shifts later indices left by one.
  const adjustedTargetIndex =
    dragItem.sourceParentRef === targetParentRef && currentIndex < targetIndex
      ? targetIndex - 1
      : targetIndex

  const clampedIndex = Math.max(0, Math.min(adjustedTargetIndex, reordered.length))
  reordered.splice(clampedIndex, 0, dragged)

  const withTargetOrder = setSiblingOrder(moved, targetParentRef, reordered)

  if (dragItem.sourceParentRef !== targetParentRef) {
    return normalizeSiblingOrder(withTargetOrder, dragItem.sourceParentRef)
  }

  return withTargetOrder
}

const getEntryIndexInParent = (
  model: IManagementModel,
  kind: ***REMOVED***field***REMOVED*** | ***REMOVED***group***REMOVED***,
  id: string,
  parentRef: string
): number => {
  return getSiblingEntries(model, parentRef).findIndex(
    (entry) => entry.kind === kind && entry.id === id
  )
}

const createModelFromOverrides = (
  schema: JSONSchema6,
  formOverrideLike: unknown,
  fieldOverridesLike: unknown
): IManagementModel => {
  const base = createManagementModelFromSchema(schema)
  const formOverride = isRecord(formOverrideLike) ? formOverrideLike : {}
  const baseProps = new Set(base.fields.map((f) => f.prop))

  const firstSectionId = base.sections[0]?.id ?? ***REMOVED***section-1***REMOVED***

  let navigation: IManagementNavigationMode = ***REMOVED***fields***REMOVED***
  type ISectionDef = {
    id: string
    label: string
    order: number
    parentSectionId?: string
    parentListType?: Exclude<IManagementNavigationMode, ***REMOVED***fields***REMOVED***>
    childListType?: Exclude<IManagementNavigationMode, ***REMOVED***fields***REMOVED***>
    fields: Array<Record<string, unknown>>
  }

  const sectionDefs: ISectionDef[] = []

  const parseSectionList = (
    input: unknown,
    listType: Exclude<IManagementNavigationMode, ***REMOVED***fields***REMOVED***>,
    parentSectionId?: string
  ): void => {
    if (!Array.isArray(input)) return

    input.forEach((raw, index) => {
      if (!isRecord(raw)) return

      const id =
        readString(raw.id) ??
        `${listType}-${parentSectionId !== undefined ? `${parentSectionId}-` : ***REMOVED******REMOVED***}${index + 1}`

      const label = readString(raw.label) ?? `${listType} ${index + 1}`

      const hasPages = Array.isArray(raw.pages)
      const hasTabs = Array.isArray(raw.tabs)
      const hasWizard = Array.isArray(raw.wizard_steps)
      const childListType = hasPages
        ? ***REMOVED***pages***REMOVED***
        : hasTabs
          ? ***REMOVED***tabs***REMOVED***
          : hasWizard
            ? ***REMOVED***wizard_steps***REMOVED***
            : undefined

      sectionDefs.push({
        id,
        label,
        order: index,
        parentSectionId,
        parentListType: parentSectionId !== undefined ? listType : undefined,
        childListType,
        fields: readFieldArray(raw.fields),
      })

      if (hasPages) parseSectionList(raw.pages, ***REMOVED***pages***REMOVED***, id)
      if (hasTabs) parseSectionList(raw.tabs, ***REMOVED***tabs***REMOVED***, id)
      if (hasWizard) parseSectionList(raw.wizard_steps, ***REMOVED***wizard_steps***REMOVED***, id)
    })
  }

  if (Array.isArray(formOverride.pages)) {
    navigation = ***REMOVED***pages***REMOVED***
    parseSectionList(formOverride.pages, ***REMOVED***pages***REMOVED***)
  } else if (Array.isArray(formOverride.tabs)) {
    navigation = ***REMOVED***tabs***REMOVED***
    parseSectionList(formOverride.tabs, ***REMOVED***tabs***REMOVED***)
  } else if (Array.isArray(formOverride.wizard_steps)) {
    navigation = ***REMOVED***wizard_steps***REMOVED***
    parseSectionList(formOverride.wizard_steps, ***REMOVED***wizard_steps***REMOVED***)
  } else {
    navigation = ***REMOVED***fields***REMOVED***
    sectionDefs.push({
      id: firstSectionId,
      label: ***REMOVED***Section 1***REMOVED***,
      order: 0,
      parentSectionId: undefined,
      parentListType: undefined,
      childListType: undefined,
      fields: readFieldArray(formOverride.fields),
    })
  }

  if (sectionDefs.length === 0) {
    sectionDefs.push({
      id: firstSectionId,
      label: ***REMOVED***Section 1***REMOVED***,
      order: 0,
      parentSectionId: undefined,
      parentListType: undefined,
      childListType: undefined,
      fields: [],
    })
  }

  const sections = sectionDefs.map((section) => ({
    id: section.id,
    label: section.label,
    order: section.order,
    parentSectionId: section.parentSectionId,
    parentListType: section.parentListType,
    childListType: section.childListType,
  }))

  const byProp = new Map(base.fields.map((field) => [field.prop, field]))
  const fields: IManagementFieldNode[] = []
  const groups: IManagementGroupNode[] = []

  let fieldCounter = 1
  let groupCounter = 1

  const createOrReuseField = (
    prop: string,
    parentRef: string,
    order: number,
    overrideLike?: Record<string, unknown>
  ): IManagementFieldNode => {
    const existing = fields.find((field) => field.prop === prop && prop !== ***REMOVED******REMOVED***)

    const baseField = byProp.get(prop)
    const fallbackType = normalizeFieldType(readString(overrideLike?.type))

    if (existing !== undefined) {
      existing.parentRef = parentRef
      existing.order = order
      if (fallbackType !== undefined) existing.overrideType = fallbackType
      const overrideLabel = readString(overrideLike?.label)
      if (overrideLabel !== undefined) existing.overrideLabel = overrideLabel
      const destPath = readString(overrideLike?.destPath)
      if (destPath !== undefined) existing.destPath = destPath
      const overrideConstraints = readRecord(overrideLike?.constraints)
      if (overrideConstraints !== undefined) {
        existing.overrideConstraints = overrideConstraints
      }
      const overrideConditions = readRecord(overrideLike?.conditions)
      if (overrideConditions !== undefined) {
        existing.overrideConditions = overrideConditions as IFormField[***REMOVED***conditions***REMOVED***]
      }
      const overrideConditionsSet = readRecord(overrideLike?.conditionsSet)
      if (overrideConditionsSet !== undefined) {
        existing.overrideConditionsSet =
          overrideConditionsSet as unknown as IFormField[***REMOVED***conditionsSet***REMOVED***]
      }
      const overrideSettings = readRecord(overrideLike?.settings)
      if (overrideSettings !== undefined) {
        existing.overrideSettings = overrideSettings as IFormField[***REMOVED***settings***REMOVED***]
      }
      if (overrideLike !== undefined) {
        existing.overrideExtras = mergeOverrideExtras(
          existing.overrideExtras,
          extractOverrideExtras(overrideLike)
        )
      }
      return existing
    }

    const nextField: IManagementFieldNode = {
      id: `field-${fieldCounter++}`,
      prop,
      label:
        readString(overrideLike?.label) ??
        baseField?.label ??
        (prop || `Custom Field ${fieldCounter}`),
      baseType: (baseField?.baseType ?? fallbackType ?? ***REMOVED***text***REMOVED***) as IFormField[***REMOVED***type***REMOVED***],
      parentRef,
      order,
      overrideType: fallbackType,
      overrideLabel: readString(overrideLike?.label),
      destPath: readString(overrideLike?.destPath),
      overrideConstraints: readRecord(overrideLike?.constraints) as
        | Record<string, unknown>
        | undefined,
      overrideConditions: readRecord(overrideLike?.conditions) as
        | IFormField[***REMOVED***conditions***REMOVED***]
        | undefined,
      overrideConditionsSet: readRecord(overrideLike?.conditionsSet) as
        | IFormField[***REMOVED***conditionsSet***REMOVED***]
        | undefined,
      overrideSettings: readRecord(overrideLike?.settings) as IFormField[***REMOVED***settings***REMOVED***] | undefined,
      overrideExtras:
        overrideLike !== undefined
          ? mergeOverrideExtras(undefined, extractOverrideExtras(overrideLike))
          : undefined,
    }

    fields.push(nextField)
    return nextField
  }

  const parseItems = (items: Array<Record<string, unknown>>, parentRef: string): void => {
    items.forEach((item, index) => {
      const prop = readString(item.prop)
      if (prop !== undefined) {
        const field = createOrReuseField(prop, parentRef, index, item)
        const nested = readFieldArray(item.fields)
        if (nested.length > 0 && fieldCanContainChildren(field)) {
          parseItems(nested, makeParentRef.field(field.id))
        }
        return
      }

      const nested = readFieldArray(item.fields)
      if (nested.length > 0) {
        const groupId = readString(item.id) ?? `group-${groupCounter++}`
        groups.push({
          id: groupId,
          label: readString(item.label) ?? groupId,
          layout: (readString(item.layout) as IManagementGroupNode[***REMOVED***layout***REMOVED***]) ?? ***REMOVED***vertical***REMOVED***,
          parentRef,
          order: index,
        })
        parseItems(nested, makeParentRef.group(groupId))
      }
    })
  }

  sectionDefs.forEach((section) => {
    parseItems(section.fields, makeParentRef.section(section.id))
  })

  const firstRef = makeParentRef.section(sections[0].id)
  base.fields.forEach((field) => {
    const exists = fields.some((f) => f.prop === field.prop)
    if (!exists) {
      fields.push({
        ...field,
        id: `field-${fieldCounter++}`,
        parentRef: firstRef,
        order: getSiblingEntries({ ...base, sections, groups, fields }, firstRef).length,
      })
    }
  })

  if (Array.isArray(fieldOverridesLike)) {
    fieldOverridesLike.forEach((overrideLike) => {
      if (!isRecord(overrideLike)) return
      const prop = readString(overrideLike.prop)
      if (prop === undefined) return

      let field = fields.find((f) => f.prop === prop)
      if (field === undefined) {
        field = {
          id: `field-${fieldCounter++}`,
          prop,
          label: prop,
          baseType: ***REMOVED***text***REMOVED***,
          parentRef: firstRef,
          order: getSiblingEntries({ ...base, sections, groups, fields }, firstRef).length,
        }
        fields.push(field)
      }

      const overrideType = normalizeFieldType(readString(overrideLike.type))
      if (overrideType !== undefined) {
        field.overrideType = overrideType
      }

      const overrideLabel = readString(overrideLike.label)
      if (overrideLabel !== undefined) {
        field.overrideLabel = overrideLabel
      }

      const destPath = readString(overrideLike.destPath)
      if (destPath !== undefined) {
        field.destPath = destPath
      }

      const overrideConditions = readRecord(overrideLike.conditions)
      if (overrideConditions !== undefined) {
        field.overrideConditions = overrideConditions as IFormField[***REMOVED***conditions***REMOVED***]
      }

      const overrideConditionsSet = readRecord(overrideLike.conditionsSet)
      if (overrideConditionsSet !== undefined) {
        field.overrideConditionsSet =
          overrideConditionsSet as unknown as IFormField[***REMOVED***conditionsSet***REMOVED***]
      }

      const overrideSettings = readRecord(overrideLike.settings)
      if (overrideSettings !== undefined) {
        field.overrideSettings = overrideSettings as IFormField[***REMOVED***settings***REMOVED***]
      }

      field.overrideExtras = mergeOverrideExtras(
        field.overrideExtras,
        extractOverrideExtras(overrideLike)
      )

      const nested = readFieldArray(overrideLike.fields)
      if (nested.length > 0 && fieldCanContainChildren(field)) {
        parseItems(nested, makeParentRef.field(field.id))
      }

      if (!baseProps.has(field.prop) && field.label.trim() === ***REMOVED******REMOVED***) {
        field.label = prop
      }
    })
  }

  let model: IManagementModel = {
    formId: readString(formOverride.id) ?? base.formId,
    label: readString(formOverride.label) ?? base.label,
    description: readString(formOverride.description) ?? base.description,
    navigation,
    sections,
    groups,
    fields,
  }

  const parentRefs = new Set<string>([
    ...model.sections.map((section) => makeParentRef.section(section.id)),
    ...model.groups.map((group) => makeParentRef.group(group.id)),
  ])

  parentRefs.forEach((parentRef) => {
    model = normalizeSiblingOrder(model, parentRef)
  })

  return model
}

const ManagementUI = (): ReactElement => {
  const [schemaInput, setSchemaInput] = useState<JSONSchema6>(sampleSchema)
  const [model, setModel] = useState<IManagementModel | null>(() =>
    createManagementModelFromSchema(sampleSchema)
  )
  const [formValues, setFormValues] = useState<IFormValues>({})

  const [focusedEditorId, setFocusedEditorId] = useState<string | undefined>(undefined)
  const [dragItem, setDragItem] = useState<IDragItem | undefined>(undefined)
  const [paletteDragField, setPaletteDragField] = useState<IPaletteSchemaField | undefined>(
    undefined
  )
  const [dragInsertTarget, setDragInsertTarget] = useState<IDragInsertTarget | undefined>(undefined)
  const [isEntryDragActive, setIsEntryDragActive] = useState<boolean>(false)
  const [recentlyDroppedEntryKey, setRecentlyDroppedEntryKey] = useState<string | undefined>(
    undefined
  )
  const [sectionDragItem, setSectionDragItem] = useState<ISectionDragItem | undefined>(undefined)
  const [sectionDragTarget, setSectionDragTarget] = useState<
    { parentSectionId?: string; index: number } | undefined
  >(undefined)
  const [selectedSeedId, setSelectedSeedId] = useState<string>(managementSeedPresets[0]?.id ?? ***REMOVED******REMOVED***)

  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined)
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined)
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(undefined)
  const [collapsedNodeRefs, setCollapsedNodeRefs] = useState<Set<string>>(() => new Set())
  const [inlineLabelEditTarget, setInlineLabelEditTarget] = useState<
    IInlineLabelEditTarget | undefined
  >(undefined)
  const [inlineLabelDraft, setInlineLabelDraft] = useState<string>(***REMOVED******REMOVED***)

  // Temporary DnD instrumentation; set localStorage key `management.dnd.debug` to `true` to enable.
  const dndDebug = window.localStorage.getItem(***REMOVED***management.dnd.debug***REMOVED***) === ***REMOVED***true***REMOVED***
  const logDnd = (event: string, payload: Record<string, unknown>): void => {
    if (!dndDebug) return
    console.debug(`[management-dnd] ${event}`, payload)
  }

  useEffect(() => {
    const resetDragUi = (): void => {
      setDragItem(undefined)
      setPaletteDragField(undefined)
      setDragInsertTarget(undefined)
      setIsEntryDragActive(false)
      setSectionDragItem(undefined)
      setSectionDragTarget(undefined)
    }

    const markEntryDragActive = (): void => {
      setIsEntryDragActive(true)
    }

    window.addEventListener(***REMOVED***dragstart***REMOVED***, markEntryDragActive, true)
    window.addEventListener(***REMOVED***dragend***REMOVED***, resetDragUi)
    window.addEventListener(***REMOVED***drop***REMOVED***, resetDragUi)

    return () => {
      window.removeEventListener(***REMOVED***dragstart***REMOVED***, markEntryDragActive, true)
      window.removeEventListener(***REMOVED***dragend***REMOVED***, resetDragUi)
      window.removeEventListener(***REMOVED***drop***REMOVED***, resetDragUi)
    }
  }, [])

  useEffect(() => {
    if (recentlyDroppedEntryKey === undefined) return
    const timer = window.setTimeout(() => {
      setRecentlyDroppedEntryKey(undefined)
    }, 700)

    return () => {
      window.clearTimeout(timer)
    }
  }, [recentlyDroppedEntryKey])

  useEffect(() => {
    if (selectedFieldId === undefined) return
    setSelectedGroupId(undefined)
    setSelectedSectionId(undefined)
  }, [selectedFieldId])

  useEffect(() => {
    if (selectedGroupId === undefined) return
    setSelectedFieldId(undefined)
    setSelectedSectionId(undefined)
  }, [selectedGroupId])

  useEffect(() => {
    if (selectedSectionId === undefined) return
    setSelectedFieldId(undefined)
    setSelectedGroupId(undefined)
  }, [selectedSectionId])

  const [formOverrideDraft, setFormOverrideDraft] = useState<unknown>(undefined)
  const [fieldOverridesDraft, setFieldOverridesDraft] = useState<unknown>(undefined)

  const toggleNodeCollapsed = (nodeRef: string): void => {
    setCollapsedNodeRefs((prev) => {
      const next = new Set(prev)
      if (next.has(nodeRef)) {
        next.delete(nodeRef)
      } else {
        next.add(nodeRef)
      }
      return next
    })
  }

  const focusEditor = (editorId: string): void => {
    setFocusedEditorId(editorId)
    const target = document.getElementById(editorId)
    if (target !== null) {
      target.scrollIntoView({ behavior: ***REMOVED***smooth***REMOVED***, block: ***REMOVED***center***REMOVED*** })
    }
  }

  const startInlineLabelEdit = (target: IInlineLabelEditTarget, currentLabel: string): void => {
    setInlineLabelEditTarget(target)
    setInlineLabelDraft(currentLabel)
    setFocusedEditorId(`editor-${target.kind}-${target.id}`)
  }

  const cancelInlineLabelEdit = (): void => {
    setInlineLabelEditTarget(undefined)
    setInlineLabelDraft(***REMOVED******REMOVED***)
  }

  const commitInlineLabelEdit = (): void => {
    if (model === null || inlineLabelEditTarget === undefined) return

    const nextLabel = inlineLabelDraft.trim()
    if (nextLabel === ***REMOVED******REMOVED***) {
      cancelInlineLabelEdit()
      return
    }

    if (inlineLabelEditTarget.kind === ***REMOVED***field***REMOVED***) {
      setModel({
        ...model,
        fields: model.fields.map((field) =>
          field.id === inlineLabelEditTarget.id
            ? {
                ...field,
                label: nextLabel,
                overrideLabel: nextLabel,
              }
            : field
        ),
      })
    } else {
      setModel({
        ...model,
        sections: model.sections.map((section) =>
          section.id === inlineLabelEditTarget.id
            ? {
                ...section,
                label: nextLabel,
              }
            : section
        ),
      })
    }

    cancelInlineLabelEdit()
  }

  const getDisplayFieldLabel = (field: IManagementFieldNode): string => {
    if (field.overrideLabel !== undefined && field.overrideLabel.trim() !== ***REMOVED******REMOVED***)
      return field.overrideLabel
    if (field.label.trim() !== ***REMOVED******REMOVED***) return field.label
    return field.prop
  }

  const exportData = useMemo(() => {
    if (model === null) {
      return {
        formOverride: undefined,
        fieldOverrides: [],
      }
    }
    return createOverridesFromModel(model)
  }, [model])

  const schemaCatalog = useMemo(() => {
    return createManagementModelFromSchema(schemaInput).fields
  }, [schemaInput])

  const schemaProps = useMemo(() => {
    return new Set(schemaCatalog.map((field) => field.prop))
  }, [schemaCatalog])

  const unusedSchemaFields = useMemo(() => {
    if (model === null) return []
    const used = new Set(
      model.fields.map((field) => field.prop).filter((prop) => prop.trim() !== ***REMOVED******REMOVED***)
    )
    return schemaCatalog.filter((field) => !used.has(field.prop))
  }, [model, schemaCatalog])

  const formOverrideValue =
    formOverrideDraft !== undefined ? formOverrideDraft : (exportData.formOverride ?? {})

  const fieldOverridesValue =
    fieldOverridesDraft !== undefined ? fieldOverridesDraft : exportData.fieldOverrides

  const previewFormOverride = isRecord(formOverrideValue)
    ? (formOverrideValue as unknown as IFormOverride)
    : exportData.formOverride

  const previewFieldOverrides = Array.isArray(fieldOverridesValue)
    ? (fieldOverridesValue as unknown as IFormFieldOverride[])
    : exportData.fieldOverrides

  const parentOptions = useMemo(() => {
    if (model === null) return []
    return [
      ...model.sections.map((section) => ({
        value: makeParentRef.section(section.id),
        label: `Section: ${section.id}`,
      })),
      ...model.groups.map((group) => ({
        value: makeParentRef.group(group.id),
        label: `Group: ${group.id}`,
      })),
      ...model.fields
        .filter((field) => fieldCanReceiveChildren(field, schemaProps))
        .map((field) => ({
          value: makeParentRef.field(field.id),
          label: `Field: ${getDisplayFieldLabel(field)} (${field.id})`,
        })),
    ]
  }, [model, schemaProps])

  const addSection = (): void => {
    if (model === null) return
    const next = model.sections.length + 1
    const id = `section-${next}`

    setModel({
      ...model,
      sections: [
        ...model.sections,
        {
          id,
          label: `Section ${next}`,
          order: getSectionSiblings(model, undefined).length,
          parentSectionId: undefined,
          parentListType: undefined,
          childListType: undefined,
        },
      ],
    })
  }

  const addSectionToParent = (
    parentSectionId: string,
    listType: Exclude<IManagementNavigationMode, ***REMOVED***fields***REMOVED***>
  ): void => {
    if (model === null) return

    const next = model.sections.length + 1
    const id = `section-${next}`
    const siblingCount = getSectionSiblings(model, parentSectionId).length

    const nextSections = model.sections.map((section) =>
      section.id === parentSectionId
        ? {
            ...section,
            childListType: listType,
          }
        : section
    )

    setModel({
      ...model,
      sections: [
        ...nextSections,
        {
          id,
          label: `${listType} ${siblingCount + 1}`,
          order: siblingCount,
          parentSectionId,
          parentListType: listType,
          childListType: undefined,
        },
      ],
    })
  }

  const addGroup = (): void => {
    if (model === null) return
    const next = model.groups.length + 1
    const id = `group-${next}`
    const parentRef = makeParentRef.section(model.sections[0]?.id ?? ***REMOVED***section-1***REMOVED***)
    const order = getSiblingEntries(model, parentRef).length

    setModel({
      ...model,
      groups: [
        ...model.groups,
        {
          id,
          label: `Group ${next}`,
          layout: ***REMOVED***vertical***REMOVED***,
          parentRef,
          order,
        },
      ],
    })
  }

  const addCustomField = (): void => {
    if (model === null) return
    const next = model.fields.length + 1
    const parentRef = makeParentRef.section(model.sections[0]?.id ?? ***REMOVED***section-1***REMOVED***)
    const order = getSiblingEntries(model, parentRef).length

    setModel({
      ...model,
      fields: [
        ...model.fields,
        {
          id: `field-${next}`,
          prop: ***REMOVED******REMOVED***,
          label: `Custom Field ${next}`,
          baseType: ***REMOVED***text***REMOVED***,
          parentRef,
          order,
        },
      ],
    })
  }

  const addFieldToParent = (parentRef: string): void => {
    if (model === null) return
    const next = model.fields.length + 1
    const defaultProp = generateShortGuid()

    setModel({
      ...model,
      fields: [
        ...model.fields,
        {
          id: `field-${next}`,
          prop: defaultProp,
          label: `Custom Field ${next}`,
          baseType: ***REMOVED***text***REMOVED***,
          parentRef,
          order: getSiblingEntries(model, parentRef).length,
        },
      ],
    })
  }

  const addFieldRelative = (targetFieldId: string, position: ***REMOVED***before***REMOVED*** | ***REMOVED***after***REMOVED***): void => {
    if (model === null) return

    const target = model.fields.find((field) => field.id === targetFieldId)
    if (target === undefined) return

    const next = model.fields.length + 1
    const defaultProp = generateShortGuid()
    const insertIndex =
      position === ***REMOVED***before***REMOVED***
        ? getEntryIndexInParent(model, ***REMOVED***field***REMOVED***, target.id, target.parentRef)
        : getEntryIndexInParent(model, ***REMOVED***field***REMOVED***, target.id, target.parentRef) + 1

    const draftModel: IManagementModel = {
      ...model,
      fields: [
        ...model.fields,
        {
          id: `field-${next}`,
          prop: defaultProp,
          label: `Custom Field ${next}`,
          baseType: ***REMOVED***text***REMOVED***,
          parentRef: target.parentRef,
          order: getSiblingEntries(model, target.parentRef).length,
        },
      ],
    }

    const dragItem: IDragItem = {
      kind: ***REMOVED***field***REMOVED***,
      id: `field-${next}`,
      sourceParentRef: target.parentRef,
    }

    setModel(
      moveEntryToParentAtIndex(
        draftModel,
        dragItem,
        target.parentRef,
        Math.max(0, insertIndex),
        schemaProps
      )
    )
  }

  const addSectionRelative = (targetSectionId: string, position: ***REMOVED***before***REMOVED*** | ***REMOVED***after***REMOVED***): void => {
    if (model === null) return

    const target = model.sections.find((section) => section.id === targetSectionId)
    if (target === undefined) return

    const siblings = getSectionSiblings(model, target.parentSectionId)
    const targetIndex = siblings.findIndex((section) => section.id === target.id)
    const insertIndex = position === ***REMOVED***before***REMOVED*** ? targetIndex : targetIndex + 1
    const next = model.sections.length + 1
    const id = `section-${next}`

    const draftModel: IManagementModel = {
      ...model,
      sections: [
        ...model.sections,
        {
          id,
          label: `Section ${next}`,
          order: siblings.length,
          parentSectionId: target.parentSectionId,
          parentListType: target.parentListType,
          childListType: undefined,
        },
      ],
    }

    setModel(
      moveSectionToParentAtIndex(
        draftModel,
        {
          sectionId: id,
          sourceParentSectionId: target.parentSectionId,
        },
        target.parentSectionId,
        Math.max(0, insertIndex)
      )
    )
  }

  const deleteField = (fieldId: string): void => {
    if (model === null) return

    const target = model.fields.find((field) => field.id === fieldId)
    if (target === undefined) return

    const fieldIdsToDelete = new Set<string>([fieldId])
    const groupIdsToDelete = new Set<string>()
    let changed = true

    while (changed) {
      changed = false

      model.groups.forEach((group) => {
        const isChildOfDeletedField =
          group.parentRef.startsWith(***REMOVED***field:***REMOVED***) &&
          fieldIdsToDelete.has(group.parentRef.replace(***REMOVED***field:***REMOVED***, ***REMOVED******REMOVED***))
        const isChildOfDeletedGroup =
          group.parentRef.startsWith(***REMOVED***group:***REMOVED***) &&
          groupIdsToDelete.has(group.parentRef.replace(***REMOVED***group:***REMOVED***, ***REMOVED******REMOVED***))

        if ((isChildOfDeletedField || isChildOfDeletedGroup) && !groupIdsToDelete.has(group.id)) {
          groupIdsToDelete.add(group.id)
          changed = true
        }
      })

      model.fields.forEach((field) => {
        const isChildOfDeletedField =
          field.parentRef.startsWith(***REMOVED***field:***REMOVED***) &&
          fieldIdsToDelete.has(field.parentRef.replace(***REMOVED***field:***REMOVED***, ***REMOVED******REMOVED***))
        const isChildOfDeletedGroup =
          field.parentRef.startsWith(***REMOVED***group:***REMOVED***) &&
          groupIdsToDelete.has(field.parentRef.replace(***REMOVED***group:***REMOVED***, ***REMOVED******REMOVED***))

        if ((isChildOfDeletedField || isChildOfDeletedGroup) && !fieldIdsToDelete.has(field.id)) {
          fieldIdsToDelete.add(field.id)
          changed = true
        }
      })
    }

    const nextModel = normalizeSiblingOrder(
      {
        ...model,
        fields: model.fields.filter((field) => !fieldIdsToDelete.has(field.id)),
        groups: model.groups.filter((group) => !groupIdsToDelete.has(group.id)),
      },
      target.parentRef
    )

    if (selectedFieldId === fieldId) {
      setSelectedFieldId(undefined)
    }

    if (selectedFieldId !== undefined && fieldIdsToDelete.has(selectedFieldId)) {
      setSelectedFieldId(undefined)
    }

    if (selectedGroupId !== undefined && groupIdsToDelete.has(selectedGroupId)) {
      setSelectedGroupId(undefined)
    }

    setModel(nextModel)
  }

  const deleteGroup = (groupId: string): void => {
    if (model === null) return

    const target = model.groups.find((group) => group.id === groupId)
    if (target === undefined) return

    const groupIdsToDelete = new Set<string>([groupId])
    const fieldIdsToDelete = new Set<string>()
    let changed = true

    while (changed) {
      changed = false

      model.groups.forEach((group) => {
        const isChildOfDeletedGroup =
          group.parentRef.startsWith(***REMOVED***group:***REMOVED***) &&
          groupIdsToDelete.has(group.parentRef.replace(***REMOVED***group:***REMOVED***, ***REMOVED******REMOVED***))
        const isChildOfDeletedField =
          group.parentRef.startsWith(***REMOVED***field:***REMOVED***) &&
          fieldIdsToDelete.has(group.parentRef.replace(***REMOVED***field:***REMOVED***, ***REMOVED******REMOVED***))

        if ((isChildOfDeletedGroup || isChildOfDeletedField) && !groupIdsToDelete.has(group.id)) {
          groupIdsToDelete.add(group.id)
          changed = true
        }
      })

      model.fields.forEach((field) => {
        const isChildOfDeletedGroup =
          field.parentRef.startsWith(***REMOVED***group:***REMOVED***) &&
          groupIdsToDelete.has(field.parentRef.replace(***REMOVED***group:***REMOVED***, ***REMOVED******REMOVED***))
        const isChildOfDeletedField =
          field.parentRef.startsWith(***REMOVED***field:***REMOVED***) &&
          fieldIdsToDelete.has(field.parentRef.replace(***REMOVED***field:***REMOVED***, ***REMOVED******REMOVED***))

        if ((isChildOfDeletedGroup || isChildOfDeletedField) && !fieldIdsToDelete.has(field.id)) {
          fieldIdsToDelete.add(field.id)
          changed = true
        }
      })
    }

    let nextModel: IManagementModel = {
      ...model,
      groups: model.groups.filter((group) => !groupIdsToDelete.has(group.id)),
      fields: model.fields.filter((field) => !fieldIdsToDelete.has(field.id)),
    }

    const parentRefs = new Set<string>([
      ...nextModel.fields.map((field) => field.parentRef),
      ...nextModel.groups.map((group) => group.parentRef),
    ])
    parentRefs.forEach((parentRef) => {
      nextModel = normalizeSiblingOrder(nextModel, parentRef)
    })

    if (selectedGroupId !== undefined && groupIdsToDelete.has(selectedGroupId)) {
      setSelectedGroupId(undefined)
    }
    if (selectedFieldId !== undefined && fieldIdsToDelete.has(selectedFieldId)) {
      setSelectedFieldId(undefined)
    }

    nextModel = normalizeSiblingOrder(nextModel, target.parentRef)
    setModel(nextModel)
  }

  const deleteSection = (sectionId: string): void => {
    if (model === null) return

    const sectionIdsToDelete = new Set<string>([sectionId])
    let changed = true

    while (changed) {
      changed = false
      model.sections.forEach((section) => {
        if (
          section.parentSectionId !== undefined &&
          sectionIdsToDelete.has(section.parentSectionId) &&
          !sectionIdsToDelete.has(section.id)
        ) {
          sectionIdsToDelete.add(section.id)
          changed = true
        }
      })
    }

    const sectionRefsToDelete = new Set(
      Array.from(sectionIdsToDelete).map((id) => makeParentRef.section(id))
    )

    const groupIdsToDelete = new Set<string>()
    changed = true
    while (changed) {
      changed = false
      model.groups.forEach((group) => {
        const isChildOfDeletedSection = sectionRefsToDelete.has(group.parentRef)
        const isChildOfDeletedGroup =
          group.parentRef.startsWith(***REMOVED***group:***REMOVED***) &&
          groupIdsToDelete.has(group.parentRef.replace(***REMOVED***group:***REMOVED***, ***REMOVED******REMOVED***))

        if ((isChildOfDeletedSection || isChildOfDeletedGroup) && !groupIdsToDelete.has(group.id)) {
          groupIdsToDelete.add(group.id)
          changed = true
        }
      })
    }

    const groupRefsToDelete = new Set(
      Array.from(groupIdsToDelete).map((id) => makeParentRef.group(id))
    )

    let nextModel: IManagementModel = {
      ...model,
      sections: model.sections.filter((section) => !sectionIdsToDelete.has(section.id)),
      groups: model.groups.filter((group) => !groupIdsToDelete.has(group.id)),
      fields: model.fields.filter(
        (field) =>
          !sectionRefsToDelete.has(field.parentRef) && !groupRefsToDelete.has(field.parentRef)
      ),
    }

    const parentRefs = new Set<string>([
      ...nextModel.sections.map((section) => makeParentRef.section(section.id)),
      ...nextModel.groups.map((group) => makeParentRef.group(group.id)),
    ])

    parentRefs.forEach((parentRef) => {
      nextModel = normalizeSiblingOrder(nextModel, parentRef)
    })

    const rootParents = new Set(nextModel.sections.map((section) => section.parentSectionId))
    rootParents.forEach((parentId) => {
      nextModel = normalizeSectionOrder(nextModel, parentId)
    })

    nextModel = pruneEmptyChildSectionListTypes(nextModel)

    if (selectedSectionId !== undefined && sectionIdsToDelete.has(selectedSectionId)) {
      setSelectedSectionId(undefined)
    }
    if (selectedFieldId !== undefined) {
      const exists = nextModel.fields.some((field) => field.id === selectedFieldId)
      if (!exists) setSelectedFieldId(undefined)
    }
    if (selectedGroupId !== undefined) {
      const exists = nextModel.groups.some((group) => group.id === selectedGroupId)
      if (!exists) setSelectedGroupId(undefined)
    }

    setModel(nextModel)
  }

  const handleBuildFromSchema = (): void => {
    setModel(createManagementModelFromSchema(schemaInput))
    setCollapsedNodeRefs(new Set())
    setFormValues({})
    setFormOverrideDraft(undefined)
    setFieldOverridesDraft(undefined)
  }

  const applySeedPreset = (): void => {
    const preset = managementSeedPresets.find((candidate) => candidate.id === selectedSeedId)
    if (preset === undefined) return

    const nextSchema = cloneForEditor(preset.schema)
    const nextFormOverride = cloneForEditor(preset.formOverride)
    const nextFieldOverrides = cloneForEditor(preset.fieldOverrides)
    const nextModel = createModelFromOverrides(nextSchema, nextFormOverride, nextFieldOverrides)

    setSchemaInput(nextSchema)
    setModel(nextModel)
    setCollapsedNodeRefs(new Set())
    setFormValues({})
    setFormOverrideDraft(nextFormOverride)
    setFieldOverridesDraft(nextFieldOverrides)
  }

  const applyJsonInputsToBuilder = (): void => {
    const next = createModelFromOverrides(schemaInput, formOverrideValue, fieldOverridesValue)
    setModel(next)
    setCollapsedNodeRefs(new Set())
  }

  const clearConfigs = (): void => {
    const emptySchema: JSONSchema6 = { additionalProperties: true }
    setSchemaInput(emptySchema)
    setModel(createManagementModelFromSchema(emptySchema))
    setFormValues({})
    setFormOverrideDraft(undefined)
    setFieldOverridesDraft(undefined)
    setCollapsedNodeRefs(new Set())
  }

  const startDrag =
    (item: IDragItem) =>
    (event: DragEvent<HTMLElement>): void => {
      flushSync(() => {
        setDragItem(item)
        setIsEntryDragActive(true)
      })
      logDnd(***REMOVED***startDrag***REMOVED***, {
        kind: item.kind,
        id: item.id,
        sourceParentRef: item.sourceParentRef,
      })
      event.dataTransfer.effectAllowed = ***REMOVED***move***REMOVED***
      event.dataTransfer.setData(***REMOVED***text/plain***REMOVED***, `${item.kind}:${item.id}`)
    }

  const clearDragState = (): void => {
    setDragItem(undefined)
    setPaletteDragField(undefined)
    setDragInsertTarget(undefined)
  }

  const startPaletteDrag =
    (item: IPaletteSchemaField) =>
    (event: DragEvent<HTMLElement>): void => {
      flushSync(() => {
        setDragItem(undefined)
        setPaletteDragField(item)
        setIsEntryDragActive(true)
      })

      event.dataTransfer.effectAllowed = ***REMOVED***copyMove***REMOVED***
      event.dataTransfer.setData(
        ***REMOVED***text/plain***REMOVED***,
        `schema-field:${encodeURIComponent(JSON.stringify(item))}`
      )
    }

  const getDragItemFromRaw = (raw: string): IDragItem | undefined => {
    if (model === null) return undefined

    const parsed = raw.includes(***REMOVED***:***REMOVED***) ? raw.split(***REMOVED***:***REMOVED***) : []
    const parsedKind = parsed[0]
    const parsedId = parsed[1]

    if (parsedKind === ***REMOVED***field***REMOVED***) {
      const field = model.fields.find((item) => item.id === parsedId)
      return field === undefined
        ? undefined
        : { kind: ***REMOVED***field***REMOVED***, id: field.id, sourceParentRef: field.parentRef }
    }

    if (parsedKind === ***REMOVED***group***REMOVED***) {
      const group = model.groups.find((item) => item.id === parsedId)
      return group === undefined
        ? undefined
        : { kind: ***REMOVED***group***REMOVED***, id: group.id, sourceParentRef: group.parentRef }
    }

    return undefined
  }

  const getPaletteFieldFromRaw = (raw: string): IPaletteSchemaField | undefined => {
    if (!raw.startsWith(***REMOVED***schema-field:***REMOVED***)) return undefined

    const encoded = raw.replace(***REMOVED***schema-field:***REMOVED***, ***REMOVED******REMOVED***)
    try {
      const parsed = JSON.parse(decodeURIComponent(encoded)) as unknown
      if (!isRecord(parsed)) return undefined
      const prop = readString(parsed.prop)
      const label = readString(parsed.label)
      const baseType = readString(parsed.baseType) as IFormField[***REMOVED***type***REMOVED***] | undefined
      if (prop === undefined || label === undefined || baseType === undefined) return undefined
      return {
        prop,
        label,
        baseType,
      }
    } catch {
      return undefined
    }
  }

  const handleDropToParent = (targetParentRef: string, event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault()
    event.stopPropagation()
    if (model === null) return

    const raw = event.dataTransfer.getData(***REMOVED***text/plain***REMOVED***)
    const fallbackItem = getDragItemFromRaw(raw)
    const fallbackPaletteField = getPaletteFieldFromRaw(raw)

    const activeDragItem = dragItem ?? fallbackItem
    const activePaletteField = paletteDragField ?? fallbackPaletteField
    logDnd(***REMOVED***dropToParent***REMOVED***, {
      targetParentRef,
      raw,
      dragItem,
      fallbackItem,
      activeDragItem,
      paletteDragField,
      fallbackPaletteField,
      activePaletteField,
    })
    if (activeDragItem !== undefined) {
      setModel(moveEntryToParent(model, activeDragItem, targetParentRef, schemaProps))
      setRecentlyDroppedEntryKey(`${activeDragItem.kind}:${activeDragItem.id}`)
      clearDragState()
      return
    }

    if (!isPaletteDropAllowed(model, activePaletteField, targetParentRef, schemaProps)) return

    const added = addPaletteFieldToParentAtIndex(
      model,
      activePaletteField as IPaletteSchemaField,
      targetParentRef,
      getSiblingEntries(model, targetParentRef).length,
      schemaProps
    )
    setModel(added.model)
    setRecentlyDroppedEntryKey(`field:${added.fieldId}`)
    clearDragState()
  }

  const handleDragOverParent = (
    targetParentRef: string,
    event: DragEvent<HTMLDivElement>
  ): void => {
    if (model === null) return
    const raw = event.dataTransfer.getData(***REMOVED***text/plain***REMOVED***)
    const fallbackItem = getDragItemFromRaw(raw)
    const fallbackPaletteField = getPaletteFieldFromRaw(raw)
    const activeDragItem = dragItem ?? fallbackItem
    const activePaletteField = paletteDragField ?? fallbackPaletteField
    const entryDropAllowed = isDropAllowed(model, activeDragItem, targetParentRef, schemaProps)
    const paletteDropAllowed = isPaletteDropAllowed(
      model,
      activePaletteField,
      targetParentRef,
      schemaProps
    )
    if (!entryDropAllowed && !paletteDropAllowed) return

    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = ***REMOVED***move***REMOVED***
    if (dragItem === undefined && fallbackItem !== undefined) {
      setDragItem(fallbackItem)
    }
    if (paletteDragField === undefined && fallbackPaletteField !== undefined) {
      setPaletteDragField(fallbackPaletteField)
    }
  }

  const handleDragOverInsert = (
    parentRef: string,
    index: number,
    event: DragEvent<HTMLDivElement>
  ): void => {
    if (model === null) return
    const raw = event.dataTransfer.getData(***REMOVED***text/plain***REMOVED***)
    const fallbackItem = getDragItemFromRaw(raw)
    const fallbackPaletteField = getPaletteFieldFromRaw(raw)
    const activeDragItem = dragItem ?? fallbackItem
    const activePaletteField = paletteDragField ?? fallbackPaletteField
    const entryDropAllowed = isDropAllowed(model, activeDragItem, parentRef, schemaProps)
    const paletteDropAllowed = isPaletteDropAllowed(
      model,
      activePaletteField,
      parentRef,
      schemaProps
    )
    if (!entryDropAllowed && !paletteDropAllowed) return

    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = ***REMOVED***move***REMOVED***
    logDnd(***REMOVED***dragOverInsert***REMOVED***, {
      parentRef,
      index,
      activeDragItem,
    })
    if (dragItem === undefined && fallbackItem !== undefined) {
      setDragItem(fallbackItem)
    }
    if (paletteDragField === undefined && fallbackPaletteField !== undefined) {
      setPaletteDragField(fallbackPaletteField)
    }
    setDragInsertTarget({ parentRef, index })
  }

  const handleDropInsert = (
    parentRef: string,
    index: number,
    event: DragEvent<HTMLDivElement>
  ): void => {
    event.preventDefault()
    event.stopPropagation()
    if (model === null) return

    const raw = event.dataTransfer.getData(***REMOVED***text/plain***REMOVED***)
    const fallbackItem = getDragItemFromRaw(raw)
    const fallbackPaletteField = getPaletteFieldFromRaw(raw)

    const activeDragItem = dragItem ?? fallbackItem
    const activePaletteField = paletteDragField ?? fallbackPaletteField
    logDnd(***REMOVED***dropInsert***REMOVED***, {
      parentRef,
      index,
      raw,
      dragItem,
      fallbackItem,
      activeDragItem,
      paletteDragField,
      fallbackPaletteField,
      activePaletteField,
    })
    if (activeDragItem !== undefined) {
      setModel(moveEntryToParentAtIndex(model, activeDragItem, parentRef, index, schemaProps))
      setRecentlyDroppedEntryKey(`${activeDragItem.kind}:${activeDragItem.id}`)
      clearDragState()
      return
    }

    if (!isPaletteDropAllowed(model, activePaletteField, parentRef, schemaProps)) return

    const added = addPaletteFieldToParentAtIndex(
      model,
      activePaletteField as IPaletteSchemaField,
      parentRef,
      index,
      schemaProps
    )
    setModel(added.model)
    setRecentlyDroppedEntryKey(`field:${added.fieldId}`)
    clearDragState()
  }

  const clearSectionDragState = (): void => {
    setSectionDragItem(undefined)
    setSectionDragTarget(undefined)
  }

  const handleSectionDragStart =
    (sectionId: string, sourceParentSectionId?: string) =>
    (event: DragEvent<HTMLElement>): void => {
      flushSync(() => {
        setSectionDragItem({ sectionId, sourceParentSectionId })
      })
      event.dataTransfer.effectAllowed = ***REMOVED***move***REMOVED***
      event.dataTransfer.setData(***REMOVED***text/plain***REMOVED***, `section:${sectionId}`)
    }

  const handleSectionDragOverInsert = (
    parentSectionId: string | undefined,
    index: number,
    event: DragEvent<HTMLDivElement>
  ): void => {
    if (sectionDragItem === undefined || model === null) return
    if (!sectionCanMoveToParent(model, sectionDragItem.sectionId, parentSectionId)) return
    event.preventDefault()
    event.stopPropagation()
    event.dataTransfer.dropEffect = ***REMOVED***move***REMOVED***
    setSectionDragTarget({ parentSectionId, index })
  }

  const handleSectionDropInsert = (
    parentSectionId: string | undefined,
    index: number,
    event: DragEvent<HTMLDivElement>
  ): void => {
    event.preventDefault()
    event.stopPropagation()
    if (model === null) return

    const raw = event.dataTransfer.getData(***REMOVED***text/plain***REMOVED***)
    const parsed = raw.includes(***REMOVED***:***REMOVED***) ? raw.split(***REMOVED***:***REMOVED***) : []
    const parsedKind = parsed[0]
    const parsedId = parsed[1]

    const fallbackItem: ISectionDragItem | undefined =
      parsedKind === ***REMOVED***section***REMOVED***
        ? (() => {
            const section = model.sections.find((item) => item.id === parsedId)
            return section === undefined
              ? undefined
              : {
                  sectionId: section.id,
                  sourceParentSectionId: section.parentSectionId,
                }
          })()
        : undefined

    const activeSectionDragItem = sectionDragItem ?? fallbackItem
    if (activeSectionDragItem === undefined) return
    if (!sectionCanMoveToParent(model, activeSectionDragItem.sectionId, parentSectionId)) return
    setModel(moveSectionToParentAtIndex(model, activeSectionDragItem, parentSectionId, index))
    clearSectionDragState()
  }

  const isMappedField = (field: IManagementFieldNode): boolean =>
    isMappedFieldInSchema(field, schemaProps)

  const renderDropBar = (parentRef: string, index: number, key: string): ReactElement | null => {
    if (model === null) {
      return null
    }

    const activeDragItem = dragItem
    const activePaletteField = paletteDragField
    const canDropEntry =
      activeDragItem !== undefined && isDropAllowed(model, activeDragItem, parentRef, schemaProps)
    const canDropPalette = isPaletteDropAllowed(model, activePaletteField, parentRef, schemaProps)
    const canDrop = canDropEntry || canDropPalette
    const showDropState = isEntryDragActive && canDrop

    const active = dragInsertTarget?.parentRef === parentRef && dragInsertTarget.index === index

    return (
      <div
        key={key}
        className="relative h-10 -my-4 self-stretch"
        onDragOver={(event) => {
          handleDragOverInsert(parentRef, index, event)
        }}
        onDrop={(event) => {
          handleDropInsert(parentRef, index, event)
        }}
      >
        <div
          className={`pointer-events-none absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 rounded transition-all ${active ? ***REMOVED***bg-emerald-500 animate-pulse ring-2 ring-emerald-300/70 shadow-sm shadow-emerald-300/60***REMOVED*** : showDropState ? ***REMOVED***bg-slate-300***REMOVED*** : ***REMOVED***bg-slate-200/70***REMOVED***}`}
        />
      </div>
    )
  }

  const renderNodes = (parentRef: string, depth: number): ReactElement => {
    if (model === null) {
      return <div />
    }

    const siblings = getSiblingEntries(model, parentRef)

    return (
      <div className="flex flex-col gap-1 w-full">
        {siblings.map((entry, idx) => {
          if (entry.kind === ***REMOVED***field***REMOVED***) {
            const field = model.fields.find((f) => f.id === entry.id)
            if (field === undefined) return null

            const mapped = isMappedField(field)
            const fieldRef = makeParentRef.field(field.id)
            const canNestAsUnmappedContainer = fieldCanReceiveChildren(field, schemaProps)
            const canDropInField =
              isDropAllowed(model, dragItem, fieldRef, schemaProps) ||
              isPaletteDropAllowed(model, paletteDragField, fieldRef, schemaProps)
            const hasNestedEntries = getSiblingEntries(model, fieldRef).length > 0
            const fieldChildrenCollapsed = collapsedNodeRefs.has(fieldRef)
            const canToggleFieldChildren = hasNestedEntries

            return (
              <div key={field.id} className="flex flex-col gap-1 w-full">
                {renderDropBar(parentRef, idx, `drop-before-field-${field.id}`)}
                <FieldNodeRow
                  field={field}
                  displayLabel={getDisplayFieldLabel(field)}
                  fieldTypeOptions={fieldTypeOptions}
                  allowInlineEdit={!canNestAsUnmappedContainer}
                  mapped={mapped}
                  focused={focusedEditorId === `editor-field-${field.id}`}
                  droppedHighlight={recentlyDroppedEntryKey === `field:${field.id}`}
                  isInlineEditing={
                    inlineLabelEditTarget?.kind === ***REMOVED***field***REMOVED*** && inlineLabelEditTarget.id === field.id
                  }
                  inlineLabelDraft={inlineLabelDraft}
                  onInlineLabelDraftChange={setInlineLabelDraft}
                  onInlineEditStart={() => {
                    startInlineLabelEdit(
                      { kind: ***REMOVED***field***REMOVED***, id: field.id },
                      getDisplayFieldLabel(field)
                    )
                  }}
                  onInlineEditCommit={commitInlineLabelEdit}
                  onInlineEditCancel={cancelInlineLabelEdit}
                  onTypeChange={(nextType) => {
                    setModel({
                      ...model,
                      fields: model.fields.map((candidate) =>
                        candidate.id === field.id
                          ? {
                              ...candidate,
                              overrideType: nextType as IFormField[***REMOVED***type***REMOVED***] | undefined,
                            }
                          : candidate
                      ),
                    })
                  }}
                  onFocus={() => {
                    setFocusedEditorId(`editor-field-${field.id}`)
                  }}
                  onDragStart={(event) => {
                    logDnd(***REMOVED***fieldDragStart***REMOVED***, {
                      fieldId: field.id,
                      parentRef,
                      index: idx,
                      prop: field.prop,
                    })
                    startDrag({
                      kind: ***REMOVED***field***REMOVED***,
                      id: field.id,
                      sourceParentRef: field.parentRef,
                    })(event)
                  }}
                  onDragEnd={clearDragState}
                  onAddBefore={() => {
                    addFieldRelative(field.id, ***REMOVED***before***REMOVED***)
                  }}
                  onAddAfter={() => {
                    addFieldRelative(field.id, ***REMOVED***after***REMOVED***)
                  }}
                  onEdit={() => {
                    setSelectedFieldId(field.id)
                  }}
                  onDelete={() => {
                    deleteField(field.id)
                  }}
                  canToggleChildren={canToggleFieldChildren}
                  isChildrenCollapsed={fieldChildrenCollapsed}
                  onToggleChildren={() => {
                    toggleNodeCollapsed(fieldRef)
                  }}
                />

                {(canNestAsUnmappedContainer || hasNestedEntries) && !fieldChildrenCollapsed ? (
                  <div className="ml-3 mt-1 border-l border-slate-200 pl-2">
                    {canNestAsUnmappedContainer ? (
                      <div
                        className={`mb-1 px-2 py-1 text-[11px] border rounded ${canDropInField ? ***REMOVED***border-emerald-400 bg-emerald-50 text-emerald-800***REMOVED*** : ***REMOVED***border-slate-200 text-slate-400***REMOVED***}`}
                        onDragOver={(event) => {
                          handleDragOverParent(fieldRef, event)
                        }}
                        onDrop={(event) => {
                          handleDropToParent(fieldRef, event)
                        }}
                      >
                        Drop into field
                      </div>
                    ) : null}
                    {renderNodes(fieldRef, depth + 1)}
                  </div>
                ) : null}

                {idx === siblings.length - 1
                  ? renderDropBar(parentRef, siblings.length, `drop-end-field-${field.id}`)
                  : null}
              </div>
            )
          }

          const group = model.groups.find((g) => g.id === entry.id)
          if (group === undefined) return null

          const groupRef = makeParentRef.group(group.id)
          const groupChildrenCollapsed = collapsedNodeRefs.has(groupRef)
          const hasGroupChildren = getSiblingEntries(model, groupRef).length > 0

          return (
            <div key={group.id} className="flex flex-col gap-1 w-full">
              {renderDropBar(parentRef, idx, `drop-before-group-${group.id}`)}
              <GroupNodeCard
                group={group}
                focused={focusedEditorId === `editor-group-${group.id}`}
                droppedHighlight={recentlyDroppedEntryKey === `group:${group.id}`}
                canDropInGroup={
                  isDropAllowed(model, dragItem, groupRef, schemaProps) ||
                  isPaletteDropAllowed(model, paletteDragField, groupRef, schemaProps)
                }
                onGroupDragStart={(event) => {
                  startDrag({
                    kind: ***REMOVED***group***REMOVED***,
                    id: group.id,
                    sourceParentRef: group.parentRef,
                  })(event)
                }}
                onGroupDragEnd={clearDragState}
                onGroupDragOver={(event) => {
                  handleDragOverParent(groupRef, event)
                }}
                onGroupDrop={(event) => {
                  handleDropToParent(groupRef, event)
                }}
                onEdit={() => {
                  setSelectedGroupId(group.id)
                }}
                onDelete={() => {
                  deleteGroup(group.id)
                }}
                isCollapsed={groupChildrenCollapsed}
                onToggleCollapsed={
                  hasGroupChildren
                    ? () => {
                        toggleNodeCollapsed(groupRef)
                      }
                    : undefined
                }
                depth={depth}
              >
                {renderNodes(groupRef, depth + 1)}
              </GroupNodeCard>
              {idx === siblings.length - 1
                ? renderDropBar(parentRef, siblings.length, `drop-end-group-${group.id}`)
                : null}
            </div>
          )
        })}
        {siblings.length === 0 ? renderDropBar(parentRef, 0, `drop-empty-${parentRef}`) : null}
      </div>
    )
  }

  const renderSectionCards = (parentSectionId: string | undefined, depth = 0): ReactElement => {
    if (model === null) return <div />

    const isRootLevel = parentSectionId === undefined
    const sections = getSectionSiblings(model, parentSectionId)

    return (
      <div
        className={
          isRootLevel
            ? ***REMOVED***flex flex-row items-stretch gap-3 w-full h-full overflow-x-auto overflow-y-hidden pb-2***REMOVED***
            : ***REMOVED***flex flex-col gap-2 w-full***REMOVED***
        }
      >
        {sections.map((section, index) => {
          const sectionRef = makeParentRef.section(section.id)
          const canDropInSection =
            isDropAllowed(model, dragItem, sectionRef, schemaProps) ||
            isPaletteDropAllowed(model, paletteDragField, sectionRef, schemaProps)
          const sectionDropActive =
            sectionDragTarget?.parentSectionId === parentSectionId &&
            sectionDragTarget?.index === index
          const isSectionInlineEditing =
            inlineLabelEditTarget?.kind === ***REMOVED***section***REMOVED*** && inlineLabelEditTarget.id === section.id

          return (
            <div
              key={section.id}
              className={
                isRootLevel
                  ? ***REMOVED***flex items-stretch gap-2 h-full shrink-0***REMOVED***
                  : ***REMOVED***flex flex-col gap-1 w-full***REMOVED***
              }
            >
              <div
                className={
                  isRootLevel
                    ? ***REMOVED***relative w-6 self-stretch shrink-0***REMOVED***
                    : ***REMOVED***relative h-10 -my-4 self-stretch***REMOVED***
                }
                onDragOver={(event) => {
                  handleSectionDragOverInsert(parentSectionId, index, event)
                }}
                onDrop={(event) => {
                  handleSectionDropInsert(parentSectionId, index, event)
                }}
              >
                <div
                  className={
                    isRootLevel
                      ? `pointer-events-none absolute top-0 bottom-0 left-1/2 w-2 -translate-x-1/2 rounded transition-all ${sectionDropActive ? ***REMOVED***bg-sky-500 animate-pulse ring-2 ring-sky-300/70 shadow-sm shadow-sky-300/60***REMOVED*** : ***REMOVED***bg-slate-300***REMOVED***}`
                      : `pointer-events-none absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 rounded transition-all ${sectionDropActive ? ***REMOVED***bg-sky-500 animate-pulse ring-2 ring-sky-300/70 shadow-sm shadow-sky-300/60***REMOVED*** : ***REMOVED***bg-slate-300***REMOVED***}`
                  }
                />
              </div>

              <div className="flex items-start gap-2 w-full h-full">
                <div
                  id={`editor-section-${section.id}`}
                  data-drag-node-kind="section"
                  className={`flex flex-col border rounded p-2 bg-sky-50 border-sky-200 ${focusedEditorId === `editor-section-${section.id}` ? ***REMOVED***ring-2 ring-amber-300***REMOVED*** : ***REMOVED******REMOVED***} ${canDropInSection ? ***REMOVED***ring-2 ring-emerald-300 bg-emerald-50/40***REMOVED*** : ***REMOVED******REMOVED***} ${isRootLevel ? ***REMOVED***w-112.5 max-w-112.5 h-full***REMOVED*** : ***REMOVED***w-full***REMOVED***} min-w-0`}
                  draggable={false}
                  tabIndex={0}
                  onClick={() => {
                    setFocusedEditorId(`editor-section-${section.id}`)
                  }}
                  onFocus={() => {
                    setFocusedEditorId(`editor-section-${section.id}`)
                  }}
                  onKeyDown={(event) => {
                    if (event.target instanceof HTMLInputElement) return

                    const isRenameShortcut =
                      event.key.toLowerCase() === ***REMOVED***e***REMOVED*** || event.key === ***REMOVED***Enter***REMOVED***
                    if (!isSectionInlineEditing && isRenameShortcut) {
                      event.preventDefault()
                      event.stopPropagation()
                      startInlineLabelEdit({ kind: ***REMOVED***section***REMOVED***, id: section.id }, section.label)
                    }
                  }}
                  onDragOver={(event) => {
                    handleDragOverParent(sectionRef, event)
                  }}
                  onDrop={(event) => {
                    handleDropToParent(sectionRef, event)
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="text-sm min-w-0 flex-1">
                      <span
                        className="inline-flex items-center mr-1 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-700"
                        data-drag-handle="true"
                        draggable={true}
                        onDragStart={(event) => {
                          event.stopPropagation()
                          handleSectionDragStart(section.id, section.parentSectionId)(event)
                        }}
                        onDragEnd={() => {
                          clearSectionDragState()
                        }}
                      >
                        <DragHandleDots2Icon />
                      </span>
                      {isSectionInlineEditing ? (
                        <input
                          className="border rounded px-1.5 py-0.5 text-sm min-w-35 max-w-full"
                          value={inlineLabelDraft}
                          autoFocus={true}
                          onChange={(event) => {
                            setInlineLabelDraft(event.target.value)
                          }}
                          onClick={(event) => {
                            event.stopPropagation()
                          }}
                          onKeyDown={(event) => {
                            event.stopPropagation()
                            if (event.key === ***REMOVED***Enter***REMOVED***) {
                              event.preventDefault()
                              commitInlineLabelEdit()
                            }
                            if (event.key === ***REMOVED***Escape***REMOVED***) {
                              event.preventDefault()
                              cancelInlineLabelEdit()
                            }
                          }}
                          onBlur={commitInlineLabelEdit}
                        />
                      ) : (
                        <span
                          className="font-semibold break-all"
                          onDoubleClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            startInlineLabelEdit({ kind: ***REMOVED***section***REMOVED***, id: section.id }, section.label)
                          }}
                        >
                          {section.label}
                        </span>
                      )}
                      <span className="text-xs text-slate-600 ml-2">{section.id}</span>
                      <span className="text-[11px] ml-2 px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                        section
                      </span>
                      {section.childListType !== undefined ? (
                        <span className="text-[11px] ml-2 px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          {section.childListType}
                        </span>
                      ) : null}
                    </div>
                    <div className="inline-flex items-center gap-0.5 shrink-0 pt-0.5">
                      <Tooltip dark={true} content="Edit section" side="top" useSpan={true}>
                        <Button
                          size="xs"
                          className="px-1 min-w-0"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation()
                            setSelectedSectionId(section.id)
                          }}
                        >
                          <Pencil className="w-3 h-3" />
                        </Button>
                      </Tooltip>
                      <Tooltip dark={true} content="Add child section" side="top" useSpan={true}>
                        <Button
                          size="xs"
                          className="px-1 min-w-0"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation()
                            addSectionToParent(section.id, section.childListType ?? ***REMOVED***pages***REMOVED***)
                          }}
                        >
                          <FilePlus className="w-3 h-3" />
                        </Button>
                      </Tooltip>
                      <Tooltip dark={true} content="Add field to section" side="top" useSpan={true}>
                        <Button
                          size="xs"
                          className="px-1 min-w-0"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation()
                            addFieldToParent(sectionRef)
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </Tooltip>
                      <Tooltip dark={true} content="Delete section" side="top" useSpan={true}>
                        <Button
                          size="xs"
                          className="px-1 min-w-0"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation()
                            deleteSection(section.id)
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Tooltip>
                      <Tooltip dark={true} content="Add section before" side="top" useSpan={true}>
                        <Button
                          size="xs"
                          className="px-1 min-w-0"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation()
                            addSectionRelative(section.id, ***REMOVED***before***REMOVED***)
                          }}
                        >
                          <ListStart className="w-3 h-3" />
                        </Button>
                      </Tooltip>
                      <Tooltip dark={true} content="Add section after" side="top" useSpan={true}>
                        <Button
                          size="xs"
                          className="px-1 min-w-0"
                          variant="ghost"
                          onClick={(event) => {
                            event.stopPropagation()
                            addSectionRelative(section.id, ***REMOVED***after***REMOVED***)
                          }}
                        >
                          <ListStart className="w-3 h-3 rotate-180" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>

                  <div
                    className={`mt-2 ${isRootLevel ? ***REMOVED***flex-1 min-h-0 overflow-y-auto pr-1***REMOVED*** : ***REMOVED******REMOVED***}`}
                  >
                    <div className="ml-3 border-l border-slate-200 pl-2">
                      {renderNodes(sectionRef, depth + 1)}
                    </div>

                    {section.childListType !== undefined ? (
                      <div className="mt-3 ml-3 border-l border-sky-200 pl-2">
                        <div className="text-xs font-semibold text-sky-800 mb-1">
                          {section.childListType}
                        </div>
                        {renderSectionCards(section.id, depth + 1)}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {index === sections.length - 1 ? (
                <div
                  className={
                    isRootLevel
                      ? ***REMOVED***relative w-6 self-stretch shrink-0***REMOVED***
                      : ***REMOVED***relative h-10 -my-4 self-stretch***REMOVED***
                  }
                  onDragOver={(event) => {
                    handleSectionDragOverInsert(parentSectionId, sections.length, event)
                  }}
                  onDrop={(event) => {
                    handleSectionDropInsert(parentSectionId, sections.length, event)
                  }}
                >
                  <div
                    className={
                      isRootLevel
                        ? `pointer-events-none absolute top-0 bottom-0 left-1/2 w-2 -translate-x-1/2 rounded transition-all ${sectionDragTarget?.parentSectionId === parentSectionId && sectionDragTarget?.index === sections.length ? ***REMOVED***bg-sky-500 animate-pulse ring-2 ring-sky-300/70 shadow-sm shadow-sky-300/60***REMOVED*** : ***REMOVED***bg-slate-300***REMOVED***}`
                        : `pointer-events-none absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 rounded transition-all ${sectionDragTarget?.parentSectionId === parentSectionId && sectionDragTarget?.index === sections.length ? ***REMOVED***bg-sky-500 animate-pulse ring-2 ring-sky-300/70 shadow-sm shadow-sky-300/60***REMOVED*** : ***REMOVED***bg-slate-300***REMOVED***}`
                    }
                  />
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    )
  }

  const selectedField =
    model !== null && selectedFieldId !== undefined
      ? model.fields.find((field) => field.id === selectedFieldId)
      : undefined

  const selectedFieldSettingsSplit = splitFieldSettings(selectedField?.overrideSettings)
  const selectedFieldEffectiveType = selectedField?.overrideType ?? selectedField?.baseType

  const updateSelectedField = (
    updater: (field: IManagementFieldNode) => IManagementFieldNode
  ): void => {
    if (model === null || selectedFieldId === undefined) return

    setModel({
      ...model,
      fields: model.fields.map((field) => (field.id === selectedFieldId ? updater(field) : field)),
    })
  }

  const selectedGroup =
    model !== null && selectedGroupId !== undefined
      ? model.groups.find((group) => group.id === selectedGroupId)
      : undefined

  const selectedSection =
    model !== null && selectedSectionId !== undefined
      ? model.sections.find((section) => section.id === selectedSectionId)
      : undefined

  const hierarchyPanel =
    model === null ? null : (
      <div className="border rounded p-3 flex flex-col gap-3 bg-white">
        <div>
          <h3 className="font-semibold">Hierarchy</h3>
          <p className="text-xs text-slate-600">
            Click to focus. Drag on the right tree for reorder and nesting.
          </p>
        </div>
        <div
          className={`bg-slate-50 border rounded p-2 max-h-80 lg:max-h-[calc(100vh-260px)] overflow-auto ${isEntryDragActive ? ***REMOVED***ring-2 ring-emerald-200 border-emerald-300***REMOVED*** : ***REMOVED******REMOVED***}`}
        >
          {model.sections
            .filter((section) => section.parentSectionId === undefined)
            .map((section) => {
              const sectionRoot = makeParentRef.section(section.id)
              const canDropHere =
                isDropAllowed(model, dragItem, sectionRoot, schemaProps) ||
                isPaletteDropAllowed(model, paletteDragField, sectionRoot, schemaProps)
              const rows = getSiblingEntries(model, sectionRoot)

              return (
                <div key={section.id} className="mb-2 last:mb-0">
                  <button
                    className={`text-xs font-semibold text-slate-900 text-left w-full ${focusedEditorId === `editor-section-${section.id}` ? ***REMOVED***bg-amber-100***REMOVED*** : ***REMOVED***hover:bg-slate-100***REMOVED***}`}
                    onClick={() => {
                      focusEditor(`editor-section-${section.id}`)
                    }}
                  >
                    Section: {section.label} ({section.id})
                  </button>
                  <div
                    className={`ml-2 mb-1 px-2 py-1 text-[11px] border rounded transition-all ${canDropHere && isEntryDragActive ? ***REMOVED***border-emerald-500 bg-emerald-100 text-emerald-900 ring-2 ring-emerald-300 animate-pulse***REMOVED*** : canDropHere ? ***REMOVED***border-emerald-400 bg-emerald-50 text-emerald-800***REMOVED*** : ***REMOVED***border-slate-200 text-slate-400***REMOVED***}`}
                    onDragOver={(event) => {
                      handleDragOverParent(sectionRoot, event)
                    }}
                    onDrop={(event) => {
                      handleDropToParent(sectionRoot, event)
                    }}
                  >
                    Drop into section
                  </div>
                  <div className="pl-3 text-xs text-slate-600">{rows.length} item(s)</div>
                </div>
              )
            })}
        </div>

        <div className="border rounded p-2 bg-slate-50">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold">Unused Schema Properties</h4>
            <span className="text-[11px] text-slate-500">{unusedSchemaFields.length}</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Drag these into any valid field drop zone.
          </p>
          <div className="mt-2 max-h-56 overflow-auto flex flex-col gap-1">
            {unusedSchemaFields.length === 0 ? (
              <div className="text-[11px] text-slate-500">
                All schema properties are currently placed.
              </div>
            ) : (
              unusedSchemaFields.map((schemaField) => (
                <div
                  key={schemaField.prop}
                  className="border border-amber-300 bg-amber-50 rounded px-2 py-1 cursor-grab active:cursor-grabbing"
                  draggable={true}
                  onDragStart={startPaletteDrag({
                    prop: schemaField.prop,
                    label: schemaField.label,
                    baseType: schemaField.baseType,
                  })}
                  onDragEnd={clearDragState}
                >
                  <div className="text-xs font-medium text-amber-900 break-all">
                    {schemaField.label}
                  </div>
                  <div className="text-[11px] text-amber-800 break-all">{schemaField.prop}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )

  return (
    <>
      <div className="p-6 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 h-full">
        <aside className="hidden lg:block sticky top-4 self-start">{hierarchyPanel}</aside>

        <section className="flex flex-col gap-3 overflow-auto min-w-0">
          <h2 className="text-xl font-semibold">Structure</h2>
          <p className="text-sm text-slate-600">
            Drag and drop without opening modals. Click a field, group, or section card to edit
            details.
          </p>

          {model === null ? (
            <p className="text-sm text-slate-600">No model generated yet.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex flex-col gap-1 text-sm">
                  Form ID
                  <input
                    className="border rounded px-2 py-1"
                    value={model.formId}
                    onChange={(e) => {
                      setModel({ ...model, formId: e.target.value })
                    }}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Form Label
                  <input
                    className="border rounded px-2 py-1"
                    value={model.label}
                    onChange={(e) => {
                      setModel({ ...model, label: e.target.value })
                    }}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Description
                  <input
                    className="border rounded px-2 py-1"
                    value={model.description ?? ***REMOVED******REMOVED***}
                    onChange={(e) => {
                      setModel({ ...model, description: e.target.value })
                    }}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1 text-sm max-w-xs">
                Navigation Mode
                <select
                  className="border rounded px-2 py-1"
                  value={model.navigation}
                  onChange={(e) => {
                    setModel({
                      ...model,
                      navigation: e.target.value as IManagementNavigationMode,
                    })
                  }}
                >
                  <option value="fields">fields</option>
                  <option value="pages">pages</option>
                  <option value="tabs">tabs</option>
                  <option value="wizard_steps">wizard_steps</option>
                </select>
              </label>

              <div className="lg:hidden">{hierarchyPanel}</div>

              <div className="border rounded p-3 flex flex-col gap-2 h-[70vh] min-h-120 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Sections</h3>
                  <Button size="sm" onClick={addSection}>
                    Add Section
                  </Button>
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                  {renderSectionCards(undefined, 0)}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={addGroup}>
                  Add Group
                </Button>
                <Button size="sm" onClick={addCustomField}>
                  Add Unmapped Field
                </Button>
              </div>
            </>
          )}
        </section>
      </div>

      {selectedField !== undefined && model !== null ? (
        <div
          className="fixed inset-0 z-60 bg-black/30 flex items-center justify-center"
          onClick={() => {
            setSelectedFieldId(undefined)
          }}
        >
          <div
            className="bg-white rounded shadow-xl w-170 max-w-[95vw] h-[95vh] flex flex-col gap-3 p-4"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <div className="flex items-center justify-between flex-shrink-0">
              <h3 className="font-semibold">Edit Field</h3>
              <Button
                size="xs"
                onClick={() => {
                  setSelectedFieldId(undefined)
                }}
              >
                Close
              </Button>
            </div>

            <div className="flex-1 overflow-auto">
              <Tabs
                className="flex flex-col gap-2 h-full"
                defaultContentClassName="border rounded p-3 overflow-auto flex-1"
                tabs={[
                  {
                    id: ***REMOVED***field-basic***REMOVED***,
                    label: ***REMOVED***Basic***REMOVED***,
                    content: (
                      <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <label className="flex flex-col gap-1 text-sm">
                            Prop
                            <input
                              className="border rounded px-2 py-1"
                              value={selectedField.prop}
                              onChange={(e) => {
                                const next = model.fields.map((field) =>
                                  field.id === selectedField.id
                                    ? { ...field, prop: e.target.value }
                                    : field
                                )
                                setModel({ ...model, fields: next })
                              }}
                            />
                          </label>

                          <label className="flex flex-col gap-1 text-sm">
                            Parent
                            <select
                              className="border rounded px-2 py-1"
                              value={selectedField.parentRef}
                              onChange={(e) => {
                                const nextParentRef = e.target.value
                                const siblingCount = getSiblingEntries(model, nextParentRef).length
                                const next = model.fields.map((field) =>
                                  field.id === selectedField.id
                                    ? { ...field, parentRef: nextParentRef, order: siblingCount }
                                    : field
                                )
                                const withParent = { ...model, fields: next }
                                const normalizedOld = normalizeSiblingOrder(
                                  withParent,
                                  selectedField.parentRef
                                )
                                setModel(normalizeSiblingOrder(normalizedOld, nextParentRef))
                              }}
                            >
                              {parentOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="flex flex-col gap-1 text-sm">
                            Override Type
                            <select
                              className="border rounded px-2 py-1"
                              value={selectedField.overrideType ?? ***REMOVED******REMOVED***}
                              onChange={(e) => {
                                const next = model.fields.map((field) =>
                                  field.id === selectedField.id
                                    ? {
                                        ...field,
                                        overrideType:
                                          e.target.value === ***REMOVED******REMOVED***
                                            ? undefined
                                            : (e.target.value as IFormField[***REMOVED***type***REMOVED***]),
                                      }
                                    : field
                                )
                                setModel({ ...model, fields: next })
                              }}
                            >
                              <option value="">(none)</option>
                              {fieldTypeOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </label>

                          <label className="flex flex-col gap-1 text-sm">
                            Override Label
                            <input
                              className="border rounded px-2 py-1"
                              value={selectedField.overrideLabel ?? ***REMOVED******REMOVED***}
                              onChange={(e) => {
                                const next = model.fields.map((field) =>
                                  field.id === selectedField.id
                                    ? { ...field, overrideLabel: e.target.value }
                                    : field
                                )
                                setModel({ ...model, fields: next })
                              }}
                            />
                          </label>

                          <label className="flex flex-col gap-1 text-sm">
                            Dest Path
                            <input
                              className="border rounded px-2 py-1"
                              placeholder="Optional output path override"
                              value={selectedField.destPath ?? ***REMOVED******REMOVED***}
                              onChange={(e) => {
                                const next = model.fields.map((field) =>
                                  field.id === selectedField.id
                                    ? { ...field, destPath: e.target.value }
                                    : field
                                )
                                setModel({ ...model, fields: next })
                              }}
                            />
                          </label>
                        </div>

                        {selectedFieldEffectiveType === ***REMOVED***select***REMOVED*** ||
                        selectedFieldEffectiveType === ***REMOVED***radio***REMOVED*** ||
                        selectedFieldEffectiveType === ***REMOVED***checkbox***REMOVED*** ? (
                          <SelectOptionsEditor
                            options={selectedField.overrideExtras?.options}
                            onOptionsChange={(nextOptions) => {
                              updateSelectedField((field) => {
                                const nextExtras = { ...(field.overrideExtras ?? {}) }

                                if (nextOptions === undefined || nextOptions.length === 0) {
                                  delete nextExtras.options
                                } else {
                                  nextExtras.options = nextOptions
                                }

                                return {
                                  ...field,
                                  overrideExtras:
                                    Object.keys(nextExtras).length > 0 ? nextExtras : undefined,
                                }
                              })
                            }}
                          />
                        ) : null}
                      </div>
                    ),
                  },
                  {
                    id: ***REMOVED***field-conditions***REMOVED***,
                    label: ***REMOVED***Conditions***REMOVED***,
                    content: (
                      <ConditionEditor
                        fieldProp={selectedField.prop}
                        conditions={selectedField.overrideConditions}
                        onConditionsChange={(next) => {
                          updateSelectedField((field) => ({
                            ...field,
                            overrideConditions: next,
                          }))
                        }}
                      />
                    ),
                  },
                  {
                    id: ***REMOVED***field-conditions-set***REMOVED***,
                    label: ***REMOVED***Condition Set***REMOVED***,
                    content: (
                      <ConditionSetEditor
                        fieldProp={selectedField.prop}
                        conditionsSet={selectedField.overrideConditionsSet}
                        onConditionsSetChange={(next) => {
                          updateSelectedField((field) => ({
                            ...field,
                            overrideConditionsSet: next,
                          }))
                        }}
                      />
                    ),
                  },
                  {
                    id: ***REMOVED***field-general-settings***REMOVED***,
                    label: ***REMOVED***General Settings***REMOVED***,
                    content: (
                      <GeneralSettingsEditor
                        generalSettings={selectedFieldSettingsSplit.general}
                        onGeneralSettingsChange={(nextGeneral) => {
                          updateSelectedField((field) => {
                            const split = splitFieldSettings(field.overrideSettings)
                            return {
                              ...field,
                              overrideSettings: mergeFieldSettings(nextGeneral, split.typeSpecific),
                            }
                          })
                        }}
                      />
                    ),
                  },
                  {
                    id: ***REMOVED***field-type-settings***REMOVED***,
                    label: ***REMOVED***Type Settings***REMOVED***,
                    content: (
                      <TypeSpecificSettingsEditor
                        effectiveType={selectedFieldEffectiveType}
                        typeSpecificSettings={selectedFieldSettingsSplit.typeSpecific}
                        onTypeSpecificSettingsChange={(nextTypeSpecific) => {
                          updateSelectedField((field) => {
                            const split = splitFieldSettings(field.overrideSettings)
                            return {
                              ...field,
                              overrideSettings: mergeFieldSettings(split.general, nextTypeSpecific),
                            }
                          })
                        }}
                      />
                    ),
                  },
                  {
                    id: ***REMOVED***field-constraints***REMOVED***,
                    label: ***REMOVED***Constraints***REMOVED***,
                    content: (
                      <ConstraintsEditor
                        effectiveType={selectedFieldEffectiveType}
                        constraints={selectedField.overrideConstraints}
                        onConstraintsChange={(next) => {
                          updateSelectedField((field) => ({
                            ...field,
                            overrideConstraints: Object.keys(next).length > 0 ? next : undefined,
                          }))
                        }}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      ) : null}

      {selectedGroup !== undefined && model !== null ? (
        <div
          className="fixed inset-0 z-60 bg-black/30 flex items-center justify-center"
          onClick={() => {
            setSelectedGroupId(undefined)
          }}
        >
          <div
            className="bg-white rounded shadow-xl w-170 max-w-[95vw] p-4 flex flex-col gap-3"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Edit Group</h3>
              <Button
                size="xs"
                onClick={() => {
                  setSelectedGroupId(undefined)
                }}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm">
                Group ID
                <input
                  className="border rounded px-2 py-1"
                  value={selectedGroup.id}
                  onChange={(e) => {
                    const oldRef = makeParentRef.group(selectedGroup.id)
                    const newId = e.target.value
                    const newRef = makeParentRef.group(newId)

                    const nextGroups = model.groups.map((group) =>
                      group.id === selectedGroup.id ? { ...group, id: newId } : group
                    )

                    setModel({
                      ...model,
                      groups: nextGroups.map((group) => ({
                        ...group,
                        parentRef: group.parentRef === oldRef ? newRef : group.parentRef,
                      })),
                      fields: model.fields.map((field) => ({
                        ...field,
                        parentRef: field.parentRef === oldRef ? newRef : field.parentRef,
                      })),
                    })
                  }}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                Group Label
                <input
                  className="border rounded px-2 py-1"
                  value={selectedGroup.label}
                  onChange={(e) => {
                    const next = model.groups.map((group) =>
                      group.id === selectedGroup.id ? { ...group, label: e.target.value } : group
                    )
                    setModel({ ...model, groups: next })
                  }}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                Parent
                <select
                  className="border rounded px-2 py-1"
                  value={selectedGroup.parentRef}
                  onChange={(e) => {
                    const nextParentRef = e.target.value
                    const siblingCount = getSiblingEntries(model, nextParentRef).length
                    const next = model.groups.map((group) =>
                      group.id === selectedGroup.id
                        ? { ...group, parentRef: nextParentRef, order: siblingCount }
                        : group
                    )
                    const withParent = { ...model, groups: next }
                    const normalizedOld = normalizeSiblingOrder(withParent, selectedGroup.parentRef)
                    setModel(normalizeSiblingOrder(normalizedOld, nextParentRef))
                  }}
                >
                  {parentOptions
                    .filter((option) =>
                      groupCanBeParent(model, selectedGroup, option.value, schemaProps)
                    )
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm">
                Layout
                <select
                  className="border rounded px-2 py-1"
                  value={selectedGroup.layout ?? ***REMOVED***vertical***REMOVED***}
                  onChange={(e) => {
                    const next = model.groups.map((group) =>
                      group.id === selectedGroup.id
                        ? { ...group, layout: e.target.value as IManagementGroupNode[***REMOVED***layout***REMOVED***] }
                        : group
                    )
                    setModel({ ...model, groups: next })
                  }}
                >
                  <option value="vertical">vertical</option>
                  <option value="horizontal">horizontal</option>
                  <option value="grid2">grid2</option>
                  <option value="grid3">grid3</option>
                  <option value="grid4">grid4</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      ) : null}

      {selectedSection !== undefined && model !== null ? (
        <div
          className="fixed inset-0 z-60 bg-black/30 flex items-center justify-center"
          onClick={() => {
            setSelectedSectionId(undefined)
          }}
        >
          <div
            className="bg-white rounded shadow-xl w-170 max-w-[95vw] p-4 flex flex-col gap-3"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Edit Section</h3>
              <Button
                size="xs"
                onClick={() => {
                  setSelectedSectionId(undefined)
                }}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm">
                Section ID
                <input
                  className="border rounded px-2 py-1"
                  value={selectedSection.id}
                  onChange={(e) => {
                    const oldId = selectedSection.id
                    const newId = e.target.value
                    const oldRef = makeParentRef.section(oldId)
                    const newRef = makeParentRef.section(newId)

                    setModel({
                      ...model,
                      sections: model.sections.map((section) => {
                        if (section.id === oldId) return { ...section, id: newId }
                        if (section.parentSectionId === oldId)
                          return { ...section, parentSectionId: newId }
                        return section
                      }),
                      fields: model.fields.map((field) => ({
                        ...field,
                        parentRef: field.parentRef === oldRef ? newRef : field.parentRef,
                      })),
                      groups: model.groups.map((group) => ({
                        ...group,
                        parentRef: group.parentRef === oldRef ? newRef : group.parentRef,
                      })),
                    })
                  }}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                Label
                <input
                  className="border rounded px-2 py-1"
                  value={selectedSection.label}
                  onChange={(e) => {
                    setModel({
                      ...model,
                      sections: model.sections.map((section) =>
                        section.id === selectedSection.id
                          ? { ...section, label: e.target.value }
                          : section
                      ),
                    })
                  }}
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                Parent Section
                <select
                  className="border rounded px-2 py-1"
                  value={selectedSection.parentSectionId ?? ***REMOVED******REMOVED***}
                  onChange={(e) => {
                    const nextParentSectionId = e.target.value === ***REMOVED******REMOVED*** ? undefined : e.target.value
                    if (!sectionCanMoveToParent(model, selectedSection.id, nextParentSectionId))
                      return

                    setModel(
                      moveSectionToParentAtIndex(
                        model,
                        {
                          sectionId: selectedSection.id,
                          sourceParentSectionId: selectedSection.parentSectionId,
                        },
                        nextParentSectionId,
                        getSectionSiblings(model, nextParentSectionId).length
                      )
                    )
                  }}
                >
                  <option value="">(root)</option>
                  {model.sections
                    .filter((section) => section.id !== selectedSection.id)
                    .filter((section) =>
                      sectionCanMoveToParent(model, selectedSection.id, section.id)
                    )
                    .map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.label} ({section.id})
                      </option>
                    ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm">
                Child Section List Type
                <select
                  className="border rounded px-2 py-1"
                  value={selectedSection.childListType ?? ***REMOVED******REMOVED***}
                  onChange={(e) => {
                    const value = e.target.value
                    const nextChildType =
                      value === ***REMOVED******REMOVED***
                        ? undefined
                        : (value as Exclude<IManagementNavigationMode, ***REMOVED***fields***REMOVED***>)

                    setModel({
                      ...model,
                      sections: model.sections.map((section) =>
                        section.id === selectedSection.id
                          ? {
                              ...section,
                              childListType: nextChildType,
                            }
                          : section.parentSectionId === selectedSection.id
                            ? {
                                ...section,
                                parentListType: nextChildType,
                              }
                            : section
                      ),
                    })
                  }}
                >
                  <option value="">No child section list</option>
                  <option value="pages">pages</option>
                  <option value="tabs">tabs</option>
                  <option value="wizard_steps">wizard_steps</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      ) : null}

      <OverlayEditor>
        <div className="flex flex-col h-full gap-2">
          <div className="flex flex-wrap gap-2 px-8 pt-8 items-start">
            <div className="flex flex-col gap-1 text-xs max-w-32">
              <label className="block">
                Preset
                <select
                  className="border rounded px-1 py-0.5 text-xs w-full"
                  value={selectedSeedId}
                  onChange={(event) => {
                    setSelectedSeedId(event.target.value)
                  }}
                >
                  {managementSeedPresets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <Button size="xs" onClick={applySeedPreset}>
              Load Preset Into Builder
            </Button>
            <Button size="xs" variant="outline" onClick={clearConfigs}>
              Clear All Configs
            </Button>
            <Button size="xs" onClick={applyJsonInputsToBuilder}>
              Apply JSON To Builder
            </Button>
            <Button
              size="xs"
              onClick={() => {
                setFormOverrideDraft(undefined)
                setFieldOverridesDraft(undefined)
              }}
            >
              Reset To Generated
            </Button>
          </div>
          <Tabs
            className="flex flex-col h-full p-8 pt-0 grow"
            defaultContentClassName="h-full overflow-auto p-4"
            tabs={[
              {
                id: ***REMOVED***management-schema***REMOVED***,
                label: ***REMOVED***Schema Input***REMOVED***,
                content: (
                  <div className="flex flex-col gap-3 h-full">
                    <p className="text-sm text-slate-600">
                      Update schema JSON, then rebuild the management model.
                    </p>
                    <div className="border rounded-md overflow-hidden grow min-h-90">
                      <JSONInput
                        field={{ id: ***REMOVED***management-schema-input***REMOVED***, label: ***REMOVED******REMOVED***, type: ***REMOVED***json***REMOVED*** }}
                        value={schemaInput as unknown as IValueType}
                        onChange={(value) => {
                          if (value !== null && typeof value === ***REMOVED***object***REMOVED***) {
                            setSchemaInput(value as unknown as JSONSchema6)
                          }
                        }}
                      />
                    </div>
                    <Button size="sm" onClick={handleBuildFromSchema}>
                      Build Model From Schema
                    </Button>
                  </div>
                ),
              },
              {
                id: ***REMOVED***management-preview***REMOVED***,
                label: ***REMOVED***Preview***REMOVED***,
                content: (
                  <div className="flex flex-col gap-3 h-full">
                    <p className="text-sm text-slate-600">
                      Live form preview from current schema + selected JSON inputs.
                    </p>
                    {previewFormOverride !== undefined ? (
                      <SchemaFormCreator
                        id={model?.formId ?? ***REMOVED***management-preview***REMOVED***}
                        label={model?.label ?? ***REMOVED***Management Preview***REMOVED***}
                        schema={schemaInput}
                        formOverrides={[previewFormOverride]}
                        formFieldOverrides={[previewFieldOverrides]}
                        formValueState={[formValues, setFormValues]}
                        className="p-4"
                      />
                    ) : (
                      <p className="text-sm text-slate-600">
                        Build a model first to preview the form.
                      </p>
                    )}
                  </div>
                ),
              },
              {
                id: ***REMOVED***management-json***REMOVED***,
                label: ***REMOVED***Form/Field JSON***REMOVED***,
                content: (
                  <div className="flex flex-col gap-3">
                    <div className="border rounded p-2">
                      <h3 className="font-semibold mb-2">Form Override</h3>
                      <div className="min-h-90 border rounded overflow-hidden">
                        <JSONInput
                          field={{ id: ***REMOVED***management-form-override***REMOVED***, label: ***REMOVED******REMOVED***, type: ***REMOVED***json***REMOVED*** }}
                          value={formOverrideValue as IValueType}
                          onChange={(value) => {
                            setFormOverrideDraft(value as unknown)
                          }}
                        />
                      </div>
                    </div>

                    <div className="border rounded p-2">
                      <h3 className="font-semibold mb-2">Field Overrides</h3>
                      <div className="min-h-90 border rounded overflow-hidden">
                        <JSONInput
                          field={{ id: ***REMOVED***management-field-overrides***REMOVED***, label: ***REMOVED******REMOVED***, type: ***REMOVED***json***REMOVED*** }}
                          value={fieldOverridesValue as IValueType}
                          onChange={(value) => {
                            setFieldOverridesDraft(value as unknown)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                id: ***REMOVED***management-form-output***REMOVED***,
                label: ***REMOVED***Form Output***REMOVED***,
                content: (
                  <div className="flex flex-col gap-3 h-full">
                    <p className="text-sm text-slate-600">
                      JSON data collected from the preview form as values are entered.
                    </p>
                    <div className="border rounded p-2 bg-slate-50 flex-1 overflow-auto font-mono text-xs whitespace-pre-wrap">
                      {JSON.stringify(formValues, null, 2)}
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </OverlayEditor>
    </>
  )
}

export default ManagementUI
