import React, { type DragEvent, type ReactElement, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { type JSONSchema6 } from 'json-schema'
import { Button, Tabs, Tooltip } from '@axdspub/axiom-ui-utilities'
import { DragHandleDots2Icon } from '@radix-ui/react-icons'
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
} from 'lucide-react'
import { JSONInput } from '@/Form/Components/Inputs'
import { SchemaFormCreator } from '@/Form/Creator/FormCreator'
import {
  type IFormField,
  type IFormFieldOverride,
  type IFormOverride,
  type IFormValues,
  type IValueType,
} from '@/Form/Creator/FormCreatorTypes'
import { createManagementModelFromSchema, createOverridesFromModel } from '@/Management/adapters'
import {
  type IManagementFieldNode,
  type IManagementGroupNode,
  type IManagementModel,
  type IManagementNavigationMode,
  type IManagementSection,
} from '@/Management/types'
import OverlayEditor from '@/Management/Components/OverlayEditor'
import FieldNodeRow from '@/Management/Components/FieldNodeRow'
import FieldOverrideEditors from '@/Management/Components/FieldOverrideEditors'
import GroupNodeCard from '@/Management/Components/GroupNodeCard'
import habSchema from '@/PTT/HAB/HABConfig.json'
import habFormOverride from '@/PTT/HAB/habFormOverride'
import habFieldOverrides from '@/PTT/HAB/habFieldOverrides'
import oilSchema from '@/PTT/Oil/OpenOilModelConfig.json'
import oilFormOverride from '@/PTT/Oil/oilFormOverride'
import oilFieldOverrides from '@/PTT/Oil/oilFieldOverrides'
import larvalSchema from '@/PTT/Larval/LarvalFishModelConfig.json'
import larvalFormOverride from '@/PTT/Larval/larvalFormOverride'
import larvalFieldOverrides from '@/PTT/Larval/larvalFieldOverrides'
import sharedPttFieldOverrides from '@/PTT/fieldOverrides'
import testArrayWithTabsSchema from '@/Form/TestForms/ArrayWithTabs/schema.json'
import testArrayWithTabsForm from '@/Form/TestForms/ArrayWithTabs/form.json'
import testArrayWithTabsFields from '@/Form/TestForms/ArrayWithTabs/fields.json'
import testArrayWithWrapperObjectsSchema from '@/Form/TestForms/ArrayWithWrapperObjects/schema.json'
import testArrayWithWrapperObjectsForm from '@/Form/TestForms/ArrayWithWrapperObjects/form.json'
import testArrayWithWrapperObjectsFields from '@/Form/TestForms/ArrayWithWrapperObjects/fields.json'
import testDefaultValueSchema from '@/Form/TestForms/DefaultValue/schema.json'
import testDefaultValueForm from '@/Form/TestForms/DefaultValue/form.json'
import testDefaultValueFields from '@/Form/TestForms/DefaultValue/fields.json'
import testErddapSchema from '@/Form/TestForms/ERDDAP/schema.json'
import testErddapForm from '@/Form/TestForms/ERDDAP/form.json'
import testErddapFields from '@/Form/TestForms/ERDDAP/fields.json'
import testNestedDependentsSchema from '@/Form/TestForms/NestedDependents/schema.json'
import testNestedDependentsForm from '@/Form/TestForms/NestedDependents/form.json'
import testNestedDependentsFields from '@/Form/TestForms/NestedDependents/field_overrides.json'
import testObjectWrapperWithSchemaSchema from '@/Form/TestForms/ObjectWrapperWithSchema/schema.json'
import testObjectWrapperWithSchemaForm from '@/Form/TestForms/ObjectWrapperWithSchema/form.json'
import testObjectWrapperWithSchemaFields from '@/Form/TestForms/ObjectWrapperWithSchema/fields.json'
import testOverrideOfSchemaArraySchema from '@/Form/TestForms/OverrideOfSchemaArray/schema.json'
import testOverrideOfSchemaArrayForm from '@/Form/TestForms/OverrideOfSchemaArray/form.json'
import testOverrideOfSchemaArrayFields from '@/Form/TestForms/OverrideOfSchemaArray/fields.json'

const sampleSchema: JSONSchema6 = {
  type: 'object',
  properties: {
    label: { type: 'string' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    color: { type: 'string', enum: ['red', 'green', 'blue'] },
    choice: { type: 'string' },
    description: { type: 'string' },
    is_it_true: { type: 'boolean' },
    count: { type: 'number' },
  },
}

const fieldTypeOptions: IFormField['type'][] = [
  'text',
  'long_text',
  'number',
  'boolean',
  'select',
  'radio',
  'date',
  'time',
  'datetime',
  'json',
  'object',
  'objectWrapper',
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
  baseType: IFormField['type']
}

const OVERRIDE_MODELED_KEYS = new Set([
  'prop',
  'type',
  'label',
  'conditions',
  'conditionsSet',
  'settings',
  'fields',
  'pages',
  'tabs',
  'wizard_steps',
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
    id: 'ptt-hab',
    label: 'PTT: HAB',
    schema: habSchema as JSONSchema6,
    formOverride: habFormOverride,
    fieldOverrides: getSeedFieldOverrides(habFieldOverrides),
  },
  {
    id: 'ptt-oil',
    label: 'PTT: Oil',
    schema: oilSchema as JSONSchema6,
    formOverride: oilFormOverride,
    fieldOverrides: getSeedFieldOverrides(oilFieldOverrides),
  },
  {
    id: 'ptt-larval',
    label: 'PTT: Larval',
    schema: larvalSchema as JSONSchema6,
    formOverride: larvalFormOverride,
    fieldOverrides: getSeedFieldOverrides(larvalFieldOverrides),
  },
  {
    id: 'test-array-with-tabs',
    label: 'TestForms: ArrayWithTabs',
    schema: testArrayWithTabsSchema as JSONSchema6,
    formOverride: testArrayWithTabsForm,
    fieldOverrides: testArrayWithTabsFields,
  },
  {
    id: 'test-array-with-wrapper-objects',
    label: 'TestForms: ArrayWithWrapperObjects',
    schema: testArrayWithWrapperObjectsSchema as JSONSchema6,
    formOverride: testArrayWithWrapperObjectsForm,
    fieldOverrides: testArrayWithWrapperObjectsFields,
  },
  {
    id: 'test-default-value',
    label: 'TestForms: DefaultValue',
    schema: testDefaultValueSchema as JSONSchema6,
    formOverride: testDefaultValueForm,
    fieldOverrides: testDefaultValueFields,
  },
  {
    id: 'test-erddap',
    label: 'TestForms: ERDDAP',
    schema: testErddapSchema as JSONSchema6,
    formOverride: testErddapForm,
    fieldOverrides: testErddapFields,
  },
  {
    id: 'test-nested-dependents',
    label: 'TestForms: NestedDependents',
    schema: testNestedDependentsSchema as JSONSchema6,
    formOverride: testNestedDependentsForm,
    fieldOverrides: testNestedDependentsFields,
  },
  {
    id: 'test-object-wrapper-with-schema',
    label: 'TestForms: ObjectWrapperWithSchema',
    schema: testObjectWrapperWithSchemaSchema as JSONSchema6,
    formOverride: testObjectWrapperWithSchemaForm,
    fieldOverrides: testObjectWrapperWithSchemaFields,
  },
  {
    id: 'test-override-of-schema-array',
    label: 'TestForms: OverrideOfSchemaArray',
    schema: testOverrideOfSchemaArraySchema as JSONSchema6,
    formOverride: testOverrideOfSchemaArrayForm,
    fieldOverrides: testOverrideOfSchemaArrayFields,
  },
]

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

const readString = (value: unknown): string | undefined => {
  return typeof value === 'string' ? value : undefined
}

const readFieldArray = (value: unknown): Array<Record<string, unknown>> => {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is Record<string, unknown> => isRecord(v))
}

const readRecord = (value: unknown): Record<string, unknown> | undefined => {
  return isRecord(value) ? value : undefined
}

const GENERAL_FIELD_SETTING_KEYS = new Set([
  'descriptionPresentation',
  'boldLabel',
  'smallLabel',
  'className',
])

const splitFieldSettings = (
  settings: IFormField['settings'] | undefined
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
): IFormField['settings'] | undefined => {
  const merged = {
    ...general,
    ...typeSpecific,
  }

  return Object.keys(merged).length > 0 ? (merged as IFormField['settings']) : undefined
}

const isMappedFieldInSchema = (field: IManagementFieldNode, schemaProps: Set<string>): boolean => {
  if (field.prop.trim() === '') return false
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
    ...siblingFields.map((field) => ({ kind: 'field' as const, id: field.id, order: field.order })),
    ...siblingGroups.map((group) => ({ kind: 'group' as const, id: group.id, order: group.order })),
  ].sort((a, b) => a.order - b.order)

  const fieldOrderMap = new Map<string, number>()
  const groupOrderMap = new Map<string, number>()

  allEntries.forEach((entry, idx) => {
    if (entry.kind === 'field') {
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
  kind: 'field' | 'group'
  id: string
  order: number
}> => {
  return [
    ...model.fields
      .filter((field) => field.parentRef === parentRef)
      .map((field) => ({ kind: 'field' as const, id: field.id, order: field.order })),
    ...model.groups
      .filter((group) => group.parentRef === parentRef)
      .map((group) => ({ kind: 'group' as const, id: group.id, order: group.order })),
  ].sort((a, b) => a.order - b.order)
}

const isFieldContainerType = (fieldType: IFormField['type'] | undefined): boolean => {
  return fieldType === 'object' || fieldType === 'objectWrapper'
}

const getEffectiveFieldType = (field: IManagementFieldNode): IFormField['type'] => {
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
  if (nodeRef.startsWith('group:')) {
    const groupId = nodeRef.replace('group:', '')
    return model.groups.find((group) => group.id === groupId)?.parentRef
  }

  if (nodeRef.startsWith('field:')) {
    const fieldId = nodeRef.replace('field:', '')
    return model.fields.find((field) => field.id === fieldId)?.parentRef
  }

  return undefined
}

const parentRefCanReceiveChildren = (
  model: IManagementModel,
  parentRef: string,
  schemaProps: Set<string>
): boolean => {
  if (!parentRef.startsWith('field:')) return true

  const fieldId = parentRef.replace('field:', '')
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
    (currentRef.startsWith('group:') || currentRef.startsWith('field:'))
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
  kind: 'field' | 'group'
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
  kind: 'field' | 'section'
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

  if (dragItem.kind === 'field') {
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
  if (paletteField.prop.trim() === '') return false
  if (schemaProps.has(paletteField.prop) === false) return false
  return parentRefCanReceiveChildren(model, targetParentRef, schemaProps)
}

const getNextFieldId = (model: IManagementModel): string => {
  let max = 0
  model.fields.forEach((field) => {
    const parsed = Number(field.id.replace('field-', ''))
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
        kind: 'field',
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
      kind: 'field',
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

  if (dragItem.kind === 'field') {
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
  orderedEntries: Array<{ kind: 'field' | 'group'; id: string }>
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
  kind: 'field' | 'group',
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

  const firstSectionId = base.sections[0]?.id ?? 'section-1'

  let navigation: IManagementNavigationMode = 'fields'
  type ISectionDef = {
    id: string
    label: string
    order: number
    parentSectionId?: string
    parentListType?: Exclude<IManagementNavigationMode, 'fields'>
    childListType?: Exclude<IManagementNavigationMode, 'fields'>
    fields: Array<Record<string, unknown>>
  }

  const sectionDefs: ISectionDef[] = []

  const parseSectionList = (
    input: unknown,
    listType: Exclude<IManagementNavigationMode, 'fields'>,
    parentSectionId?: string
  ): void => {
    if (!Array.isArray(input)) return

    input.forEach((raw, index) => {
      if (!isRecord(raw)) return

      const id =
        readString(raw.id) ??
        `${listType}-${parentSectionId !== undefined ? `${parentSectionId}-` : ''}${index + 1}`

      const label = readString(raw.label) ?? `${listType} ${index + 1}`

      const hasPages = Array.isArray(raw.pages)
      const hasTabs = Array.isArray(raw.tabs)
      const hasWizard = Array.isArray(raw.wizard_steps)
      const childListType = hasPages
        ? 'pages'
        : hasTabs
          ? 'tabs'
          : hasWizard
            ? 'wizard_steps'
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

      if (hasPages) parseSectionList(raw.pages, 'pages', id)
      if (hasTabs) parseSectionList(raw.tabs, 'tabs', id)
      if (hasWizard) parseSectionList(raw.wizard_steps, 'wizard_steps', id)
    })
  }

  if (Array.isArray(formOverride.pages)) {
    navigation = 'pages'
    parseSectionList(formOverride.pages, 'pages')
  } else if (Array.isArray(formOverride.tabs)) {
    navigation = 'tabs'
    parseSectionList(formOverride.tabs, 'tabs')
  } else if (Array.isArray(formOverride.wizard_steps)) {
    navigation = 'wizard_steps'
    parseSectionList(formOverride.wizard_steps, 'wizard_steps')
  } else {
    navigation = 'fields'
    sectionDefs.push({
      id: firstSectionId,
      label: 'Section 1',
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
      label: 'Section 1',
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
    const existing = fields.find((field) => field.prop === prop && prop !== '')

    const baseField = byProp.get(prop)
    const fallbackType = readString(overrideLike?.type) as IFormField['type'] | undefined

    if (existing !== undefined) {
      existing.parentRef = parentRef
      existing.order = order
      if (fallbackType !== undefined) existing.overrideType = fallbackType
      const overrideLabel = readString(overrideLike?.label)
      if (overrideLabel !== undefined) existing.overrideLabel = overrideLabel
      const overrideConditions = readRecord(overrideLike?.conditions)
      if (overrideConditions !== undefined) {
        existing.overrideConditions = overrideConditions as IFormField['conditions']
      }
      const overrideConditionsSet = readRecord(overrideLike?.conditionsSet)
      if (overrideConditionsSet !== undefined) {
        existing.overrideConditionsSet =
          overrideConditionsSet as unknown as IFormField['conditionsSet']
      }
      const overrideSettings = readRecord(overrideLike?.settings)
      if (overrideSettings !== undefined) {
        existing.overrideSettings = overrideSettings as IFormField['settings']
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
      baseType: (baseField?.baseType ?? fallbackType ?? 'text') as IFormField['type'],
      parentRef,
      order,
      overrideType: fallbackType,
      overrideLabel: readString(overrideLike?.label),
      overrideConditions: readRecord(overrideLike?.conditions) as
        | IFormField['conditions']
        | undefined,
      overrideConditionsSet: readRecord(overrideLike?.conditionsSet) as
        | IFormField['conditionsSet']
        | undefined,
      overrideSettings: readRecord(overrideLike?.settings) as IFormField['settings'] | undefined,
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
          layout: (readString(item.layout) as IManagementGroupNode['layout']) ?? 'vertical',
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
          baseType: 'text',
          parentRef: firstRef,
          order: getSiblingEntries({ ...base, sections, groups, fields }, firstRef).length,
        }
        fields.push(field)
      }

      const overrideType = readString(overrideLike.type)
      if (overrideType !== undefined) {
        field.overrideType = overrideType as IFormField['type']
      }

      const overrideLabel = readString(overrideLike.label)
      if (overrideLabel !== undefined) {
        field.overrideLabel = overrideLabel
      }

      const overrideConditions = readRecord(overrideLike.conditions)
      if (overrideConditions !== undefined) {
        field.overrideConditions = overrideConditions as IFormField['conditions']
      }

      const overrideConditionsSet = readRecord(overrideLike.conditionsSet)
      if (overrideConditionsSet !== undefined) {
        field.overrideConditionsSet =
          overrideConditionsSet as unknown as IFormField['conditionsSet']
      }

      const overrideSettings = readRecord(overrideLike.settings)
      if (overrideSettings !== undefined) {
        field.overrideSettings = overrideSettings as IFormField['settings']
      }

      field.overrideExtras = mergeOverrideExtras(
        field.overrideExtras,
        extractOverrideExtras(overrideLike)
      )

      const nested = readFieldArray(overrideLike.fields)
      if (nested.length > 0 && fieldCanContainChildren(field)) {
        parseItems(nested, makeParentRef.field(field.id))
      }

      if (!baseProps.has(field.prop) && field.label.trim() === '') {
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
  const [selectedSeedId, setSelectedSeedId] = useState<string>(managementSeedPresets[0]?.id ?? '')

  const [selectedFieldId, setSelectedFieldId] = useState<string | undefined>(undefined)
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(undefined)
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(undefined)
  const [collapsedNodeRefs, setCollapsedNodeRefs] = useState<Set<string>>(() => new Set())
  const [inlineLabelEditTarget, setInlineLabelEditTarget] = useState<
    IInlineLabelEditTarget | undefined
  >(undefined)
  const [inlineLabelDraft, setInlineLabelDraft] = useState<string>('')

  // Temporary DnD instrumentation; set localStorage key `management.dnd.debug` to `true` to enable.
  const dndDebug = window.localStorage.getItem('management.dnd.debug') === 'true'
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

    window.addEventListener('dragstart', markEntryDragActive, true)
    window.addEventListener('dragend', resetDragUi)
    window.addEventListener('drop', resetDragUi)

    return () => {
      window.removeEventListener('dragstart', markEntryDragActive, true)
      window.removeEventListener('dragend', resetDragUi)
      window.removeEventListener('drop', resetDragUi)
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
      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const startInlineLabelEdit = (target: IInlineLabelEditTarget, currentLabel: string): void => {
    setInlineLabelEditTarget(target)
    setInlineLabelDraft(currentLabel)
    setFocusedEditorId(`editor-${target.kind}-${target.id}`)
  }

  const cancelInlineLabelEdit = (): void => {
    setInlineLabelEditTarget(undefined)
    setInlineLabelDraft('')
  }

  const commitInlineLabelEdit = (): void => {
    if (model === null || inlineLabelEditTarget === undefined) return

    const nextLabel = inlineLabelDraft.trim()
    if (nextLabel === '') {
      cancelInlineLabelEdit()
      return
    }

    if (inlineLabelEditTarget.kind === 'field') {
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
    if (field.overrideLabel !== undefined && field.overrideLabel.trim() !== '')
      return field.overrideLabel
    if (field.label.trim() !== '') return field.label
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
      model.fields.map((field) => field.prop).filter((prop) => prop.trim() !== '')
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
    listType: Exclude<IManagementNavigationMode, 'fields'>
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
    const parentRef = makeParentRef.section(model.sections[0]?.id ?? 'section-1')
    const order = getSiblingEntries(model, parentRef).length

    setModel({
      ...model,
      groups: [
        ...model.groups,
        {
          id,
          label: `Group ${next}`,
          layout: 'vertical',
          parentRef,
          order,
        },
      ],
    })
  }

  const addCustomField = (): void => {
    if (model === null) return
    const next = model.fields.length + 1
    const parentRef = makeParentRef.section(model.sections[0]?.id ?? 'section-1')
    const order = getSiblingEntries(model, parentRef).length

    setModel({
      ...model,
      fields: [
        ...model.fields,
        {
          id: `field-${next}`,
          prop: '',
          label: `Custom Field ${next}`,
          baseType: 'text',
          parentRef,
          order,
        },
      ],
    })
  }

  const addFieldToParent = (parentRef: string): void => {
    if (model === null) return
    const next = model.fields.length + 1

    setModel({
      ...model,
      fields: [
        ...model.fields,
        {
          id: `field-${next}`,
          prop: '',
          label: `Custom Field ${next}`,
          baseType: 'text',
          parentRef,
          order: getSiblingEntries(model, parentRef).length,
        },
      ],
    })
  }

  const addFieldRelative = (targetFieldId: string, position: 'before' | 'after'): void => {
    if (model === null) return

    const target = model.fields.find((field) => field.id === targetFieldId)
    if (target === undefined) return

    const next = model.fields.length + 1
    const insertIndex =
      position === 'before'
        ? getEntryIndexInParent(model, 'field', target.id, target.parentRef)
        : getEntryIndexInParent(model, 'field', target.id, target.parentRef) + 1

    const draftModel: IManagementModel = {
      ...model,
      fields: [
        ...model.fields,
        {
          id: `field-${next}`,
          prop: '',
          label: `Custom Field ${next}`,
          baseType: 'text',
          parentRef: target.parentRef,
          order: getSiblingEntries(model, target.parentRef).length,
        },
      ],
    }

    const dragItem: IDragItem = {
      kind: 'field',
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

  const addSectionRelative = (targetSectionId: string, position: 'before' | 'after'): void => {
    if (model === null) return

    const target = model.sections.find((section) => section.id === targetSectionId)
    if (target === undefined) return

    const siblings = getSectionSiblings(model, target.parentSectionId)
    const targetIndex = siblings.findIndex((section) => section.id === target.id)
    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1
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
          group.parentRef.startsWith('field:') &&
          fieldIdsToDelete.has(group.parentRef.replace('field:', ''))
        const isChildOfDeletedGroup =
          group.parentRef.startsWith('group:') &&
          groupIdsToDelete.has(group.parentRef.replace('group:', ''))

        if ((isChildOfDeletedField || isChildOfDeletedGroup) && !groupIdsToDelete.has(group.id)) {
          groupIdsToDelete.add(group.id)
          changed = true
        }
      })

      model.fields.forEach((field) => {
        const isChildOfDeletedField =
          field.parentRef.startsWith('field:') &&
          fieldIdsToDelete.has(field.parentRef.replace('field:', ''))
        const isChildOfDeletedGroup =
          field.parentRef.startsWith('group:') &&
          groupIdsToDelete.has(field.parentRef.replace('group:', ''))

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
          group.parentRef.startsWith('group:') &&
          groupIdsToDelete.has(group.parentRef.replace('group:', ''))

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
    setSchemaInput(sampleSchema)
    setModel(createManagementModelFromSchema(sampleSchema))
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
      logDnd('startDrag', {
        kind: item.kind,
        id: item.id,
        sourceParentRef: item.sourceParentRef,
      })
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', `${item.kind}:${item.id}`)
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

      event.dataTransfer.effectAllowed = 'copyMove'
      event.dataTransfer.setData(
        'text/plain',
        `schema-field:${encodeURIComponent(JSON.stringify(item))}`
      )
    }

  const getDragItemFromRaw = (raw: string): IDragItem | undefined => {
    if (model === null) return undefined

    const parsed = raw.includes(':') ? raw.split(':') : []
    const parsedKind = parsed[0]
    const parsedId = parsed[1]

    if (parsedKind === 'field') {
      const field = model.fields.find((item) => item.id === parsedId)
      return field === undefined
        ? undefined
        : { kind: 'field', id: field.id, sourceParentRef: field.parentRef }
    }

    if (parsedKind === 'group') {
      const group = model.groups.find((item) => item.id === parsedId)
      return group === undefined
        ? undefined
        : { kind: 'group', id: group.id, sourceParentRef: group.parentRef }
    }

    return undefined
  }

  const getPaletteFieldFromRaw = (raw: string): IPaletteSchemaField | undefined => {
    if (!raw.startsWith('schema-field:')) return undefined

    const encoded = raw.replace('schema-field:', '')
    try {
      const parsed = JSON.parse(decodeURIComponent(encoded)) as unknown
      if (!isRecord(parsed)) return undefined
      const prop = readString(parsed.prop)
      const label = readString(parsed.label)
      const baseType = readString(parsed.baseType) as IFormField['type'] | undefined
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

    const raw = event.dataTransfer.getData('text/plain')
    const fallbackItem = getDragItemFromRaw(raw)
    const fallbackPaletteField = getPaletteFieldFromRaw(raw)

    const activeDragItem = dragItem ?? fallbackItem
    const activePaletteField = paletteDragField ?? fallbackPaletteField
    logDnd('dropToParent', {
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
    const raw = event.dataTransfer.getData('text/plain')
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
    event.dataTransfer.dropEffect = 'move'
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
    const raw = event.dataTransfer.getData('text/plain')
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
    event.dataTransfer.dropEffect = 'move'
    logDnd('dragOverInsert', {
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

    const raw = event.dataTransfer.getData('text/plain')
    const fallbackItem = getDragItemFromRaw(raw)
    const fallbackPaletteField = getPaletteFieldFromRaw(raw)

    const activeDragItem = dragItem ?? fallbackItem
    const activePaletteField = paletteDragField ?? fallbackPaletteField
    logDnd('dropInsert', {
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
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', `section:${sectionId}`)
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
    event.dataTransfer.dropEffect = 'move'
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

    const raw = event.dataTransfer.getData('text/plain')
    const parsed = raw.includes(':') ? raw.split(':') : []
    const parsedKind = parsed[0]
    const parsedId = parsed[1]

    const fallbackItem: ISectionDragItem | undefined =
      parsedKind === 'section'
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
          className={`pointer-events-none absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 rounded transition-all ${active ? 'bg-emerald-500 animate-pulse ring-2 ring-emerald-300/70 shadow-sm shadow-emerald-300/60' : showDropState ? 'bg-slate-300' : 'bg-slate-200/70'}`}
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
          if (entry.kind === 'field') {
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
                    inlineLabelEditTarget?.kind === 'field' && inlineLabelEditTarget.id === field.id
                  }
                  inlineLabelDraft={inlineLabelDraft}
                  onInlineLabelDraftChange={setInlineLabelDraft}
                  onInlineEditStart={() => {
                    startInlineLabelEdit(
                      { kind: 'field', id: field.id },
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
                              overrideType: nextType as IFormField['type'] | undefined,
                            }
                          : candidate
                      ),
                    })
                  }}
                  onFocus={() => {
                    setFocusedEditorId(`editor-field-${field.id}`)
                  }}
                  onDragStart={(event) => {
                    logDnd('fieldDragStart', {
                      fieldId: field.id,
                      parentRef,
                      index: idx,
                      prop: field.prop,
                    })
                    startDrag({
                      kind: 'field',
                      id: field.id,
                      sourceParentRef: field.parentRef,
                    })(event)
                  }}
                  onDragEnd={clearDragState}
                  onAddBefore={() => {
                    addFieldRelative(field.id, 'before')
                  }}
                  onAddAfter={() => {
                    addFieldRelative(field.id, 'after')
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
                        className={`mb-1 px-2 py-1 text-[11px] border rounded ${canDropInField ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-400'}`}
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
                    kind: 'group',
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
            ? 'flex flex-row items-stretch gap-3 w-full h-full overflow-x-auto overflow-y-hidden pb-2'
            : 'flex flex-col gap-2 w-full'
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
            inlineLabelEditTarget?.kind === 'section' && inlineLabelEditTarget.id === section.id

          return (
            <div
              key={section.id}
              className={
                isRootLevel
                  ? 'flex items-stretch gap-2 h-full shrink-0'
                  : 'flex flex-col gap-1 w-full'
              }
            >
              <div
                className={
                  isRootLevel
                    ? 'relative w-6 self-stretch shrink-0'
                    : 'relative h-10 -my-4 self-stretch'
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
                      ? `pointer-events-none absolute top-0 bottom-0 left-1/2 w-2 -translate-x-1/2 rounded transition-all ${sectionDropActive ? 'bg-sky-500 animate-pulse ring-2 ring-sky-300/70 shadow-sm shadow-sky-300/60' : 'bg-slate-300'}`
                      : `pointer-events-none absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 rounded transition-all ${sectionDropActive ? 'bg-sky-500 animate-pulse ring-2 ring-sky-300/70 shadow-sm shadow-sky-300/60' : 'bg-slate-300'}`
                  }
                />
              </div>

              <div className="flex items-start gap-2 w-full h-full">
                <div
                  id={`editor-section-${section.id}`}
                  data-drag-node-kind="section"
                  className={`flex flex-col border rounded p-2 bg-sky-50 border-sky-200 ${focusedEditorId === `editor-section-${section.id}` ? 'ring-2 ring-amber-300' : ''} ${canDropInSection ? 'ring-2 ring-emerald-300 bg-emerald-50/40' : ''} ${isRootLevel ? 'w-112.5 max-w-112.5 h-full' : 'w-full'} min-w-0`}
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
                      event.key.toLowerCase() === 'e' || event.key === 'Enter'
                    if (!isSectionInlineEditing && isRenameShortcut) {
                      event.preventDefault()
                      event.stopPropagation()
                      startInlineLabelEdit({ kind: 'section', id: section.id }, section.label)
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
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              commitInlineLabelEdit()
                            }
                            if (event.key === 'Escape') {
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
                            startInlineLabelEdit({ kind: 'section', id: section.id }, section.label)
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
                            addSectionToParent(section.id, section.childListType ?? 'pages')
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
                            addSectionRelative(section.id, 'before')
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
                            addSectionRelative(section.id, 'after')
                          }}
                        >
                          <ListStart className="w-3 h-3 rotate-180" />
                        </Button>
                      </Tooltip>
                    </div>
                  </div>

                  <div
                    className={`mt-2 ${isRootLevel ? 'flex-1 min-h-0 overflow-y-auto pr-1' : ''}`}
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
                      ? 'relative w-6 self-stretch shrink-0'
                      : 'relative h-10 -my-4 self-stretch'
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
                        ? `pointer-events-none absolute top-0 bottom-0 left-1/2 w-2 -translate-x-1/2 rounded transition-all ${sectionDragTarget?.parentSectionId === parentSectionId && sectionDragTarget?.index === sections.length ? 'bg-sky-500 animate-pulse ring-2 ring-sky-300/70 shadow-sm shadow-sky-300/60' : 'bg-slate-300'}`
                        : `pointer-events-none absolute left-0 right-0 top-1/2 h-3 -translate-y-1/2 rounded transition-all ${sectionDragTarget?.parentSectionId === parentSectionId && sectionDragTarget?.index === sections.length ? 'bg-sky-500 animate-pulse ring-2 ring-sky-300/70 shadow-sm shadow-sky-300/60' : 'bg-slate-300'}`
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
          className={`bg-slate-50 border rounded p-2 max-h-80 lg:max-h-[calc(100vh-260px)] overflow-auto ${isEntryDragActive ? 'ring-2 ring-emerald-200 border-emerald-300' : ''}`}
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
                    className={`text-xs font-semibold text-slate-900 text-left w-full ${focusedEditorId === `editor-section-${section.id}` ? 'bg-amber-100' : 'hover:bg-slate-100'}`}
                    onClick={() => {
                      focusEditor(`editor-section-${section.id}`)
                    }}
                  >
                    Section: {section.label} ({section.id})
                  </button>
                  <div
                    className={`ml-2 mb-1 px-2 py-1 text-[11px] border rounded transition-all ${canDropHere && isEntryDragActive ? 'border-emerald-500 bg-emerald-100 text-emerald-900 ring-2 ring-emerald-300 animate-pulse' : canDropHere ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-400'}`}
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
                    value={model.description ?? ''}
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
            className="bg-white rounded shadow-xl w-170 max-w-[95vw] p-4 flex flex-col gap-3"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <div className="flex items-center justify-between">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-sm">
                Prop
                <input
                  className="border rounded px-2 py-1"
                  value={selectedField.prop}
                  onChange={(e) => {
                    const next = model.fields.map((field) =>
                      field.id === selectedField.id ? { ...field, prop: e.target.value } : field
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
                    const normalizedOld = normalizeSiblingOrder(withParent, selectedField.parentRef)
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
                  value={selectedField.overrideType ?? ''}
                  onChange={(e) => {
                    const next = model.fields.map((field) =>
                      field.id === selectedField.id
                        ? {
                            ...field,
                            overrideType:
                              e.target.value === ''
                                ? undefined
                                : (e.target.value as IFormField['type']),
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
                  value={selectedField.overrideLabel ?? ''}
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
            </div>

            <FieldOverrideEditors
              fieldProp={selectedField.prop}
              effectiveType={selectedFieldEffectiveType}
              conditions={selectedField.overrideConditions}
              conditionsSet={selectedField.overrideConditionsSet}
              generalSettings={selectedFieldSettingsSplit.general}
              typeSpecificSettings={selectedFieldSettingsSplit.typeSpecific}
              onConditionsChange={(next) => {
                updateSelectedField((field) => ({
                  ...field,
                  overrideConditions: next,
                }))
              }}
              onConditionsSetChange={(next) => {
                updateSelectedField((field) => ({
                  ...field,
                  overrideConditionsSet: next,
                }))
              }}
              onGeneralSettingsChange={(nextGeneral) => {
                updateSelectedField((field) => {
                  const split = splitFieldSettings(field.overrideSettings)
                  return {
                    ...field,
                    overrideSettings: mergeFieldSettings(nextGeneral, split.typeSpecific),
                  }
                })
              }}
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
                  value={selectedGroup.layout ?? 'vertical'}
                  onChange={(e) => {
                    const next = model.groups.map((group) =>
                      group.id === selectedGroup.id
                        ? { ...group, layout: e.target.value as IManagementGroupNode['layout'] }
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
                  value={selectedSection.parentSectionId ?? ''}
                  onChange={(e) => {
                    const nextParentSectionId = e.target.value === '' ? undefined : e.target.value
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
                  value={selectedSection.childListType ?? ''}
                  onChange={(e) => {
                    const value = e.target.value
                    const nextChildType =
                      value === ''
                        ? undefined
                        : (value as Exclude<IManagementNavigationMode, 'fields'>)

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
        <Tabs
          className="flex flex-col h-full p-8 grow"
          defaultContentClassName="h-full overflow-auto p-4"
          tabs={[
            {
              id: 'management-seeds',
              label: 'Seed Presets',
              content: (
                <div className="flex flex-col gap-3 h-full">
                  <p className="text-sm text-slate-600">
                    Load schema + form override + field overrides from existing project
                    configurations.
                  </p>
                  <label className="flex flex-col gap-1 text-sm max-w-xl">
                    Preset
                    <select
                      className="border rounded px-2 py-1"
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
                  <div className="flex gap-2">
                    <Button size="sm" onClick={applySeedPreset}>
                      Load Preset Into Builder
                    </Button>
                    <Button size="sm" variant="outline" onClick={clearConfigs}>
                      Clear All Configs
                    </Button>
                  </div>
                  <div className="text-xs text-slate-600">
                    PTT presets include shared overrides from PTT/fieldOverrides plus model-specific
                    overrides.
                  </div>
                </div>
              ),
            },
            {
              id: 'management-schema',
              label: 'Schema Input',
              content: (
                <div className="flex flex-col gap-3 h-full">
                  <p className="text-sm text-slate-600">
                    Update schema JSON, then rebuild the management model.
                  </p>
                  <div className="border rounded-md overflow-hidden grow min-h-90">
                    <JSONInput
                      field={{ id: 'management-schema-input', label: '', type: 'json' }}
                      value={schemaInput as unknown as IValueType}
                      onChange={(value) => {
                        if (value !== null && typeof value === 'object') {
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
              id: 'management-preview',
              label: 'Preview',
              content: (
                <div className="flex flex-col gap-3 h-full">
                  <p className="text-sm text-slate-600">
                    Live form preview from current schema + selected JSON inputs.
                  </p>
                  {previewFormOverride !== undefined ? (
                    <SchemaFormCreator
                      id={model?.formId ?? 'management-preview'}
                      label={model?.label ?? 'Management Preview'}
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
              id: 'management-json',
              label: 'Form/Field JSON',
              content: (
                <div className="flex flex-col gap-3">
                  <div className="border rounded p-2">
                    <h3 className="font-semibold mb-2">Form Override</h3>
                    <div className="min-h-90 border rounded overflow-hidden">
                      <JSONInput
                        field={{ id: 'management-form-override', label: '', type: 'json' }}
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
                        field={{ id: 'management-field-overrides', label: '', type: 'json' }}
                        value={fieldOverridesValue as IValueType}
                        onChange={(value) => {
                          setFieldOverridesDraft(value as unknown)
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={applyJsonInputsToBuilder}>
                      Apply JSON To Builder
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setFormOverrideDraft(undefined)
                        setFieldOverridesDraft(undefined)
                      }}
                    >
                      Reset To Generated
                    </Button>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </OverlayEditor>
    </>
  )
}

export default ManagementUI
