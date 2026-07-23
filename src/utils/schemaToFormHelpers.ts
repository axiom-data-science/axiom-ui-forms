import {
  type IFormOverride,
  type IForm,
  type IFormField,
  type IFormFieldType,
  type IFormValues,
  type IFormFieldOverride,
  type IFormSectionOverride,
  type IPage,
  type IFormSection,
  type IWizardStep,
  type IValueType,
  type IFormLayoutTab,
  type IObjectFormFieldOverride,
} from '@/Form/Creator/FormCreatorTypes'
import Ajv, { type ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
// mergeObjects is defined in mergers.ts; imported for internal use and
// re-exported for backwards compatibility with existing consumers
import { mergeObjects } from '@/utils/mergers'

import { type JSONSchema6Type, type JSONSchema6Definition, type JSONSchema6 } from 'json-schema'

import metaSchemaDraftV7 from 'ajv/lib/refs/json-schema-draft-07.json'
import metaSchemaDraftV6 from 'ajv/lib/refs/json-schema-draft-06.json'
import metaSchemaV5 from 'ajv/lib/refs/json-schema-2020-12/schema.json'
import metaSchemaV4 from 'ajv/lib/refs/json-schema-2019-09/schema.json'

import { resolveRefs } from '@/utils/resolveRefs'
import { omit } from 'lodash-es'
import { type ISelectOptionProps } from '@axdspub/axiom-ui-utilities'
import { getFieldsFromFormSection, getPathFromField, makeJsonPath } from '@/utils/getters'
import { cloneObject, copyAndAddPathToFields } from '@/utils/manipulators'

export { mergeObjects }

const getValidator = (schema: number): ValidateFunction => {
  const ajv = new Ajv({
    strict: false,
  })
  addFormats(ajv)
  switch (schema) {
    case 4:
      return ajv.compile(metaSchemaV4)
    case 5:
      return ajv.compile(metaSchemaV5)
    case 6:
      return ajv.compile(metaSchemaDraftV6)
    case 7:
      return ajv.compile(metaSchemaDraftV7)
    default:
      return ajv.compile(metaSchemaV5)
  }
}

export const validateSchema = (
  schemaOb: unknown,
  version: number = 6
): { schema?: JSONSchema6; error?: string; unrefed?: JSONSchema6 } => {
  const ajv = new Ajv({ strict: false })
  addFormats(ajv)
  const validator = getValidator(version)
  const valid = validator(schemaOb)
  if (!valid) {
    return { error: ajv.errorsText(validator.errors) }
  }
  // const v = ajv.compile<JSONSchema6>(schemaOb as JSONSchema6)
  /* registerSchema(schemaOb as SchemaObject, 'https://axds.co/test')
  const bundledSchema = await bundle('https://axds.co/test')
  return { schema: bundledSchema as JSONSchema6 } */

  const resolved = resolveRefs(cloneObject(schemaOb) as JSONSchema6)
  return { schema: resolved, unrefed: schemaOb as JSONSchema6 }
}

export const validateAgainstSchema = (
  schema: JSONSchema6,
  formValues: IFormValues
): string[] | undefined => {
  const validSchema = validateSchema(schema)
  if (validSchema.error !== undefined) {
    return [validSchema.error]
  }
  const ajv = new Ajv({ strict: false, allErrors: true })
  addFormats(ajv)
  const validator = ajv.compile(schema)
  const valid = validator(formValues)
  if (validator.errors !== null && validator.errors !== undefined && !valid) {
    return validator.errors.map((e) => {
      return `${e.instancePath} ${e.message}`
    })
  }
  return undefined
}

const makeRandom = (): string => {
  return crypto !== undefined && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2)
}

const makeFormFieldId = (options: Array<string | number | undefined | null>): string => {
  const validOptions = options.filter((o) => o !== undefined && o !== null)
  if (validOptions.length === 0) {
    return makeRandom()
  }
  return String(validOptions[0])
}

const makeLabel = (options: Array<string | number | undefined | null>): string | undefined => {
  const validOptions = options.filter((o) => o !== undefined && o !== null)
  if (validOptions.length === 0) {
    return undefined
  }
  return String(validOptions[0])
    .replace(/_|-/g, ' ')
    .split(' ')
    .map((s, i) => {
      return i === 0 ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : s
    })
    .join(' ')
}

const getFieldType = (schema: JSONSchema6): IFormFieldType => {
  const schemaType = schema.type
  if (schemaType === 'string' || schemaType === 'number' || schemaType === 'integer') {
    if (schema.enum !== undefined || schema.oneOf !== undefined) {
      return 'select'
    } else if (schema.anyOf !== undefined) {
      return 'checkbox'
    } else if (
      schemaType === 'string' &&
      schema.maxLength !== undefined &&
      schema.maxLength > 150
    ) {
      return 'text'
    } else if (schemaType === 'number' || schemaType === 'integer') {
      return 'number'
    } else if (schema.format === 'date-time') {
      return 'datetime'
    } else if (schema.format === 'date') {
      return 'date'
    } else if (schema.format === 'time') {
      return 'time'
    }
    return 'text'
  } else if (schemaType === 'boolean') {
    return 'boolean'
  } else if (
    schemaType === 'object' ||
    (schemaType === undefined &&
      (schema.oneOf !== undefined || schema.anyOf !== undefined || schema.allOf !== undefined))
  ) {
    return 'object'
  }
  if (!schemaType && (schema.anyOf !== undefined || schema.enum !== undefined)) {
    return 'object'
  }

  return 'text'
}

export const getValueFromSchema = (
  schema: JSONSchema6Type | JSONSchema6Definition | undefined
): string | number | boolean | undefined => {
  if (schema === undefined || schema === null) {
    return undefined
  }
  if (typeof schema === 'string' || typeof schema === 'number' || typeof schema === 'boolean') {
    return schema
  }
  if (Array.isArray(schema)) {
    if (schema.length > 0) {
      return getValueFromSchema(schema[0])
    }
    return undefined
  }
  if (schema.const !== undefined) {
    return String(schema.const)
  }
  if (schema.title !== undefined && schema.title !== null) {
    return getValueFromSchema(schema.title)
  }
  if (schema.$id !== undefined && schema.$id !== null) {
    if (typeof schema.$id === 'string' || typeof schema.$id === 'number') {
      return makeLabel([String(schema.$id)])
    }
    return getValueFromSchema(schema.$id)
  }
  if (Array.isArray(schema) && schema.length === 2) {
    return typeof schema[0] === 'object' && schema[0] !== null
      ? getValueFromSchema(schema[0])
      : schema[0]
  }
  return undefined
}

export const getLabelFromSchema = (
  schema: JSONSchema6Type | JSONSchema6Definition | undefined
): string | undefined => {
  if (schema === undefined || schema === null) {
    return undefined
  }
  if (typeof schema === 'boolean') {
    return schema ? 'true' : 'false'
  }
  if (typeof schema === 'string' || typeof schema === 'number' || typeof schema === 'boolean') {
    return String(schema)
  }
  if (Array.isArray(schema)) {
    if (schema.length > 0) {
      return getLabelFromSchema(schema[0])
    }
    return undefined
  }
  if (schema.title !== undefined && schema.title !== null) {
    return getLabelFromSchema(schema.title)
  }
  if (Array.isArray(schema) && schema.length === 2) {
    return typeof schema[1] === 'object' && schema[1] !== null
      ? getLabelFromSchema(schema[1])
      : schema[1]
  }
  return String(getValueFromSchema(schema))
}

interface ISchemaToFormFieldProps {
  schema: JSONSchema6
  property: string
  schemaField: JSONSchema6
  multiple?: boolean
  path?: string[]
}

const schemaToFormField = ({
  schema,
  property,
  schemaField,
  multiple,
  path = [],
}: ISchemaToFormFieldProps): IFormField => {
  path.push(property)
  if (schemaField === undefined) {
    return {
      id: makeFormFieldId([schema.$id, property]),
      label: property,
      type: 'text',
      multiple,
    }
  }
  if (typeof schemaField === 'boolean') {
    return {
      id: makeFormFieldId([schema.$id, property]),
      label: property,
      type: 'boolean',
      multiple,
    }
  }
  if (schemaField.type === 'array' && schemaField.items !== undefined) {
    return schemaToFormField({
      schema: schemaField,
      property,
      schemaField: schemaField.items as JSONSchema6,
      multiple: true,
      path: path.slice(),
    })
  }
  if (
    schemaField.anyOf !== undefined &&
    schemaField.anyOf.length === 2 &&
    schemaField.anyOf.filter((d) => typeof d !== 'boolean' && d.type === 'null').length === 1
  ) {
    const notNull = schemaField.anyOf.filter((d) => typeof d !== 'boolean' && d.type !== 'null')[0]
    return schemaToFormField({
      schema: schemaField,
      property,
      schemaField: {
        ...omit(schemaField, 'anyOf'),
        ...(typeof notNull !== 'boolean' ? notNull : {}),
      },
      multiple,
      path: path.slice(),
    })
  }
  const type = getFieldType(schemaField)
  const id = makeFormFieldId([
    schemaField.$id,
    property,
    schemaField.title?.toLowerCase().replace(' ', '-'),
  ])
  const label = makeLabel([schemaField.title, property])
  const schemaRequired = schema.required ?? []
  const exampleString = schemaField.examples && Array.isArray(schemaField.examples) && schemaField.examples.length > 0
      ? `Examples:\n\n - ${schemaField.examples.map((e) => String(e)).join('\n - ')}`
      : undefined
  const hasDescription = schemaField.description !== undefined && schemaField.description !== null && String(schemaField.description).trim().length > 0
  const baseFieldProps = {
    id,
    label,
    description: hasDescription ? schemaField.description : exampleString,
    long_description: hasDescription ? exampleString : undefined,
    defaultValue:
      schemaField.default !== undefined ? (schemaField.default as IValueType) : undefined,
    required: schemaRequired.includes(property) ?? false,
  }
  if (
    type === 'text' ||
    type === 'number' ||
    type === 'long_text' ||
    type === 'boolean' ||
    type === 'datetime' ||
    type === 'date' ||
    type === 'time'
  ) {
    if (
      type === 'number' &&
      (schemaField.minimum !== undefined || schemaField.maximum !== undefined)
    ) {
      const constraints: Record<string, number> = {}
      if (schemaField.minimum !== undefined) {
        constraints.min = schemaField.minimum
      }
      if (schemaField.maximum !== undefined) {
        constraints.max = schemaField.maximum
      }
      return {
        ...baseFieldProps,
        type,
        constraints,
      }
    }
    return {
      ...baseFieldProps,
      type,
      multiple,
    }
  }

  if (type === 'select' || type === 'checkbox' || type === 'radio') {
    const schemaOptions = schemaField.oneOf ?? schemaField.anyOf ?? schemaField.enum ?? []
    const options: ISelectOptionProps[] = schemaOptions
      .map((e) => {
        const value = getValueFromSchema(e)
        const label = getLabelFromSchema(e)
        const description: string | undefined =
          typeof e === 'object' && e !== null && !Array.isArray(e)
            ? String(e.description)
            : undefined
        return value !== undefined
          ? {
              value: String(value),
              label: label ?? String(value),
              ...(description !== undefined ? { description } : {}),
            }
          : null
      })
      .filter((d) => d !== null)
    return {
      ...baseFieldProps,
      type: options.find((d) => d.description !== undefined) ? 'radio' : type,
      options,
      multiple,
    }
  }
  if (type === 'object') {
    // const anyOfAsProps = schemaField.anyOf !== undefined && schemaField.anyOf.filter(d => typeof d !== 'boolean' && d.type !== 'null').length > 0
    const properties = schemaField.properties ?? {}
    const fields: IFormField[] = []
    for (const key in properties) {
      if (properties[key] !== undefined && typeof properties[key] !== 'boolean') {
        fields.push(
          schemaToFormField({
            schema: schemaField,
            property: key,
            schemaField: properties[key],
            path: path.slice(),
          })
        )
      }
    }

    if (schemaField.oneOf !== undefined) {
      const oneOfFields: IFormField[] = []
      const options: ISelectOptionProps[] = []
      const selectorField = `select_${property}`
      schemaField.oneOf.forEach((f, i) => {
        if (typeof f !== 'boolean') {
          let value = f.$id ?? f.title
          if ((schemaField as any).discriminator?.propertyName !== undefined) {
            const v = getValueFromSchema(
              f?.properties?.[(schemaField as any).discriminator?.propertyName]
            )
            if (v !== null && v !== undefined && typeof v !== 'boolean') {
              value = String(v)
            }
          }
          if (value === undefined || value === null) {
            value = `${property}_${i}`
          }
          options.push({
            label: f.title ?? f.$id ?? `${property} option ${String(i + 1)}`,
            value,
          })
          const oneOfield = schemaToFormField({
            schema: schemaField,
            property: value,
            schemaField: f,
            path: path.slice(),
          })
          oneOfield.conditions = {
            dependsOn: `${path.join('.')}.${selectorField}`,
            value,
          }
          oneOfFields.push(oneOfield)
        }
      })
      fields.push({
        id: selectorField,
        type: 'select',
        label: schemaField.title,
        options,
      })
      oneOfFields.forEach((f) => {
        fields.push(f)
      })
    }

    const ofArr = (schemaField.anyOf ?? []).concat(schemaField.allOf ?? [])
    ofArr.forEach((anyOf) => {
      const anyOfId = schemaField.$id
      if (typeof anyOf !== 'boolean' && anyOf.type !== 'null') {
        const field = schemaToFormField({
          schema: schemaField,
          property: anyOfId ?? makeRandom(),
          schemaField:
            typeof anyOf === 'boolean'
              ? anyOf
              : {
                  title: anyOf.title ?? '',
                  ...anyOf,
                },
          path: path.slice(),
        })
        if (anyOfId === undefined && field.type === 'object') {
          field.skip_path = true
        }
        fields.push(field)
      }
    })

    return {
      ...baseFieldProps,
      type,
      fields,
      multiple,
    }
  }

  return {
    ...baseFieldProps,
    type: 'text',
    multiple,
  }
}

/**
 * Merges an individual form field with its applicable overrides.
 *
 * Merge precedence (lowest → highest priority):
 * 1. Schema field  — base field generated from JSON schema
 * 2. formFieldsOverrideMap — global IFormFieldOverride[][] passed to overridesAndSchemaToFormObject
 * 3. fieldOverride  — local override from the current form/page/wizard section definition
 *
 * For 'object' fields, child fields are resolved by union of keys across all three
 * sources, then each child is recursively merged with the same precedence rules.
 */
const mergeFormField = ({
  field,
  fieldOverride,
  formFieldsOverrideMap,
  schemaFieldMap,
  schemaForm,
}: {
  field?: IFormField
  fieldOverride?: IFormFieldOverride
  formFieldsOverrideMap: Array<Record<string, IFormFieldOverride>>
  schemaFieldMap: Record<string, IFormField>
  schemaForm: IForm
}): IFormField => {
  const rawOverridePath = fieldOverride?.prop
  const normalizedOverridePath = rawOverridePath?.replace(/\[\]/g, '')
  const fieldPath = field ? makeJsonPath(field) : undefined
  const path = normalizedOverridePath ?? fieldPath
  const formFieldOverrides = mergeObjects<IFormFieldOverride>(
    formFieldsOverrideMap
      .map((overrides) =>
        mergeObjects<IFormFieldOverride>(
          [
            path !== undefined ? overrides[path] : undefined,
            rawOverridePath !== undefined ? overrides[rawOverridePath] : undefined,
            fieldPath !== undefined ? overrides[fieldPath] : undefined,
          ].filter((d): d is IFormFieldOverride => d !== undefined)
        )
      )
      .filter((d) => d !== undefined)
  )

  // Auto-exclude artificially added fields (not in schema) from payload
  // unless explicitly set to includeInPayload (excludeFromPayload: false)
  // Exception 1: if destPath is EXPLICITLY set in override to a schema location, include it
  // Exception 2: if the schema has no properties at all, nothing is "override-only" — include all
  const isFromOverrideOnly = field === undefined && fieldOverride !== undefined
  const schemaHasProperties = Object.keys(schemaFieldMap).length > 0
  const hasExplicitExcludeOverride =
    fieldOverride?.excludeFromPayload !== undefined ||
    formFieldOverrides.excludeFromPayload !== undefined
  const hasExplicitDestPath =
    fieldOverride?.destPath !== undefined || formFieldOverrides?.destPath !== undefined

  const mergedField = {
    ...mergeObjects<IFormFieldOverride | IFormField>([
      field ? { ...field, destPath: path } : ({ destPath: path } as any),
      formFieldOverrides,
      (fieldOverride ?? {}) as IFormFieldOverride,
    ]),
  }

  // Auto-set excludeFromPayload for artificially added fields
  // If the schema has no properties, all fields are intentional — include them
  // If the override-only field has an EXPLICIT destPath, it's writing to schema, so include it
  // If no explicit destPath and schema exists, it's UI-only, so exclude it
  if (isFromOverrideOnly && !hasExplicitExcludeOverride) {
    mergedField.excludeFromPayload = schemaHasProperties ? !hasExplicitDestPath : false
  }
  const labelProp =
    mergedField.id ??
    (path !== undefined ? path.split('.').pop() : (fieldOverride?.prop ?? field?.id))
  const id = mergedField.id ?? fieldOverride?.prop ?? makeFormFieldId([path?.split('.')[0]])
  if (mergedField.type === 'object' || mergedField.type === 'objectWrapper') {
    // attached to the schema field. defaults not overrides
    const fieldFields =
      field?.type === 'object' || field?.type === 'objectWrapper' ? (field.fields ?? []) : []
    const fieldFieldsMap = Object.fromEntries(fieldFields.map((f) => [getPathFromField(f), f]))
    /* if (fieldPages !== undefined) {
      mergedField.pages = fieldPages
    }
    if (fieldWizardSteps !== undefined) {
      mergedField.wizard_steps = fieldWizardSteps
    } */

    // attached to the field override. overrides
    const overrideFields =
      fieldOverride?.type === 'object' || fieldOverride?.type === 'objectWrapper'
        ? (fieldOverride.fields ?? [])
        : []
    // Read tabs from the override regardless of whether `type` is explicitly set on the
    // override — we are already inside the mergedField.type === 'object' branch, so the
    // merged type is confirmed to be an object. An override that specifies tabs but omits
    // `type` is perfectly valid (type comes from the schema field).
    const overrideFieldTabs = (fieldOverride as IObjectFormFieldOverride)?.tabs
    // const overrideFieldPages = fieldOverride?.type === 'object' ? fieldOverride.pages : undefined
    const overrideFieldsMap = Object.fromEntries(
      overrideFields.filter((f): f is IFormFieldOverride => 'prop' in f).map((f) => [f.prop, f])
    )

    // attached to the form override. overrides
    const formOverrideFields =
      formFieldOverrides.type === 'object' || formFieldOverrides.type === 'objectWrapper'
        ? (formFieldOverrides.fields ?? [])
        : []
    // Same as overrideFieldTabs above — read tabs from formFieldOverrides regardless of
    // whether `type` is explicitly set.
    const formOverrideFieldTabs = (formFieldOverrides as any)?.tabs
    const formOverrideFieldsMap = Object.fromEntries(
      formOverrideFields.filter((f): f is IFormFieldOverride => 'prop' in f).map((f) => [f.prop, f])
    )

    const allKeys = Object.keys({
      ...fieldFieldsMap,
      ...overrideFieldsMap,
      ...formOverrideFieldsMap,
    })

    mergedField.fields = allKeys.map((key) => {
      // const fieldOverride = overrideFieldsMap[key] ?? { prop: key }
      // For array item fields (multiple: true), also check bracket and dot notation keys
      // "key" here is the full path (e.g. "testObject.field1"), so we strip the parent prefix
      // to get the leaf name and build the bracket-notation key correctly
      const isArrayItems = (mergedField as any).multiple === true
      const leafKey = isArrayItems && path ? key.replace(new RegExp(`^${path}\\.`), '') : key
      const arrayBracketKey = isArrayItems && path ? `${path}[].${leafKey}` : undefined
      const arrayDotKey = isArrayItems && path ? `${path}.${leafKey}` : undefined
      const fieldOverride = mergeObjects<IFormFieldOverride>([
        overrideFieldsMap[key],
        formOverrideFieldsMap[key],
        mergeObjects<IFormFieldOverride>(
          formFieldsOverrideMap
            .map(
              (overrides) =>
                overrides[key] ??
                (arrayBracketKey !== undefined ? overrides[arrayBracketKey] : undefined) ??
                (arrayDotKey !== undefined ? overrides[arrayDotKey] : undefined)
            )
            .filter((d) => d !== undefined)
        ),
      ])
      return mergeFormField({
        field: fieldFieldsMap[key] ?? schemaFieldMap[key],
        fieldOverride,
        formFieldsOverrideMap,
        schemaFieldMap,
        schemaForm,
      })
    })

    const mergedTabs = formOverrideFieldTabs ?? overrideFieldTabs
    mergedField.tabs =
      mergedTabs !== undefined
        ? (mergeFormSections({
            sectionOverrides: mergedTabs as IFormSectionOverride[],
            schemaForm,
            formFieldsOverrideMap,
          }) as IFormLayoutTab[])
        : undefined
  }

  // Enforce skip_path: true for objectWrapper fields
  // objectWrapper is a UI-only container that should never nest data
  if ((mergedField.type ?? 'text') === 'objectWrapper') {
    (mergedField as Record<string, unknown>).skip_path = true
  }

  return {
    ...mergedField,
    type: mergedField.type ?? 'text',
    id,
    label: mergedField.label ?? makeLabel([labelProp]) ?? 'Default',
  } as unknown as IFormField
}

/**
 * Recursively ensures all objectWrapper fields have skip_path: true.
 * objectWrapper fields are UI-only containers and should never nest data in the form payload.
 * This function is called after form construction to catch any objectWrapper fields
 * that might exist outside of the schema override context.
 */
export const ensureObjectWrappersHaveSkipPath = (form: IForm): IForm => {
  const ensureFieldSkipPath = (field: IFormField): IFormField => {
    if (field.type === 'objectWrapper') {
      (field as unknown as Record<string, unknown>).skip_path = true
    }
    // Recursively process nested fields
    if ('fields' in field && Array.isArray((field as any).fields)) {
      ;(field as any).fields = (field as any).fields.map(ensureFieldSkipPath)
    }
    return field
  }

  const ensureSectionSkipPath = (section: IFormSection): IFormSection => {
    return {
      ...section,
      fields: section.fields?.map(ensureFieldSkipPath),
      pages: section.pages?.map(ensureSectionSkipPath),
      wizard_steps: section.wizard_steps?.map(ensureSectionSkipPath),
      tabs: section.tabs?.map(ensureSectionSkipPath),
    }
  }

  return {
    ...form,
    fields: form.fields?.map(ensureFieldSkipPath),
    pages: form.pages?.map(ensureSectionSkipPath),
    wizard_steps: form.wizard_steps?.map(ensureSectionSkipPath),
    tabs: form.tabs?.map(ensureSectionSkipPath),
  }
}

const mergeFormFields = ({
  fieldOverrides,
  schemaForm,
  formFieldsOverrideMap,
}: {
  fieldOverrides?: IFormFieldOverride[]
  schemaForm: IForm
  formFieldsOverrideMap: Array<Record<string, IFormFieldOverride>>
}): IFormField[] => {
  const schemaFieldMap = buildFieldMapFromForm(schemaForm)

  return (fieldOverrides ?? []).map((fieldOverride) => {
    const normalizedProp = fieldOverride.prop.replace(/\[\]/g, '')
    const schemaField = schemaFieldMap[fieldOverride.prop] ?? schemaFieldMap[normalizedProp]
    return mergeFormField({
      field: schemaField,
      fieldOverride,
      formFieldsOverrideMap,
      schemaFieldMap,
      schemaForm,
    })
  })
}

const mergeFormSections = ({
  sectionOverrides,
  schemaForm,
  formFieldsOverrideMap,
}: {
  sectionOverrides?: IFormSectionOverride[]
  schemaForm: IForm
  formFieldsOverrideMap: Array<Record<string, IFormFieldOverride>>
}): IFormSection[] => {
  const sections = (sectionOverrides ?? []).map((sectionToMerge, index) => {
    const sectionFields = mergeFormFields({
      fieldOverrides: sectionToMerge.fields,
      schemaForm,
      formFieldsOverrideMap,
    })
    const sectionId = sectionToMerge.id ?? makeFormFieldId([sectionToMerge.id, index])
    return {
      id: sectionId ?? makeFormFieldId([sectionId, index]),
      label: sectionToMerge.label ?? makeLabel([sectionId]),
      ...sectionToMerge,
      fields: sectionToMerge.fields !== undefined ? sectionFields : undefined,
      wizard_steps:
        sectionToMerge.wizard_steps !== undefined
          ? mergeFormSections({
              sectionOverrides: sectionToMerge.wizard_steps,
              schemaForm,
              formFieldsOverrideMap,
            })
          : undefined,
      pages:
        sectionToMerge.pages !== undefined
          ? mergeFormSections({
              sectionOverrides: sectionToMerge.pages,
              schemaForm,
              formFieldsOverrideMap,
            })
          : undefined,
      tabs:
        sectionToMerge.tabs !== undefined
          ? mergeFormSections({
              sectionOverrides: sectionToMerge.tabs,
              schemaForm,
              formFieldsOverrideMap,
            })
          : undefined,
    }
  })
  return sections as IFormSection[]
}

/**
 * Convert a JSON Schema + optional overrides into a renderable IForm.
 *
 * Override pipeline:
 * 1. Schema is converted to a base IForm via schemaToFormObject()
 * 2. If only formFieldOverrides are provided (no formOverrides), every field in
 *    the schema is merged with matching formFieldOverrides entries.
 * 3. If formOverrides are provided, the form structure (pages / wizard_steps /
 *    tabs / fields) is rebuilt from the override definitions. Each section's
 *    fields are merged via mergeFormField() using the 3-level precedence:
 *    schema field → formFieldOverrides → local section field override.
 *
 * @param formOverrides   - Top-level structural overrides (label, pages, wizard_steps…)
 * @param formFieldOverrides - Per-field property overrides, keyed by 'prop' path
 * @param schema          - JSON Schema to convert
 */
export const overridesAndSchemaToFormObject = ({
  formOverrides,
  formFieldOverrides,
  schema,
}: {
  formOverrides?: IFormOverride[]
  formFieldOverrides?: IFormFieldOverride[][]
  schema: JSONSchema6
}): IForm => {
  const schemaForm = schemaToFormObject(schema)
  const hasFormFieldOverrides = (formFieldOverrides?.filter((f) => f.length > 0)?.length ?? 0) > 0
  const formFieldOverridesByProp =
    formFieldOverrides?.map((overrides) =>
      Object.fromEntries(
        overrides !== undefined && typeof overrides.map === 'function'
          ? overrides.map((override) => [override.prop, override])
          : []
      )
    ) ?? []
  if (formOverrides === undefined && hasFormFieldOverrides) {
    const schemaFieldMap = buildFieldMapFromForm(schemaForm)
    const fields = Object.values(schemaFieldMap).map((field) => {
      return mergeFormField({
        field,
        formFieldsOverrideMap: formFieldOverridesByProp,
        schemaFieldMap,
        schemaForm,
      })
    })
    return ensureObjectWrappersHaveSkipPath({
      ...schemaForm,
      fields,
    })
  } else if (formOverrides === undefined && !hasFormFieldOverrides) {
    return ensureObjectWrappersHaveSkipPath(schemaForm)
  }
  const mergedFormOverrides = mergeObjects<IFormOverride>(formOverrides ?? [])
  const schemaFieldMap = buildFieldMapFromForm(schemaForm)

  // Support shorthand where top-level tabs reference array item fields via
  // `arrayProp[].child` while the array field is declared in top-level fields.
  // In this case, tabs should be attached to that array field, not the form root.
  const remapTopLevelTabsToArrayField = (): IFormOverride => {
    if (
      mergedFormOverrides.tabs === undefined ||
      mergedFormOverrides.tabs.length === 0 ||
      mergedFormOverrides.fields === undefined ||
      mergedFormOverrides.fields.length === 0
    ) {
      return mergedFormOverrides
    }

    const tabFieldProps = mergedFormOverrides.tabs
      .flatMap((tab) => tab.fields ?? [])
      .map((field) => field.prop)
      .filter((prop): prop is string => prop !== undefined)
      .map((prop) => prop.trim())

    if (tabFieldProps.length === 0) {
      return mergedFormOverrides
    }

    const candidateFields = mergedFormOverrides.fields.filter((fieldOverride) => {
      const prop = fieldOverride.prop
      if (prop === undefined) {
        return false
      }
      const schemaField = schemaFieldMap[prop]
      return (
        schemaField !== undefined &&
        (schemaField.type === 'object' || schemaField.type === 'objectWrapper') &&
        (schemaField as { multiple?: boolean }).multiple === true
      )
    })

    const tabRoots = Array.from(
      new Set(
        tabFieldProps
          .map((tabProp) => tabProp.replace(/\[\]/g, ''))
          .map((tabProp) => tabProp.split('.')[0])
          .filter((root) => root.length > 0)
      )
    )

    if (tabRoots.length !== 1) {
      return mergedFormOverrides
    }

    const targetRoot = tabRoots[0]
    const matchingCandidates = candidateFields.filter(
      (fieldOverride) => fieldOverride.prop?.replace(/\[\]/g, '') === targetRoot
    )

    if (matchingCandidates.length !== 1) {
      return mergedFormOverrides
    }

    const target = matchingCandidates[0]
    const schemaTarget = target.prop !== undefined ? schemaFieldMap[target.prop] : undefined

    return {
      ...mergedFormOverrides,
      tabs: undefined,
      fields: mergedFormOverrides.fields.map((fieldOverride) => {
        if (fieldOverride.prop !== target.prop) {
          return fieldOverride
        }
        const inheritedType: 'object' | 'objectWrapper' =
          fieldOverride.type === 'object' || fieldOverride.type === 'objectWrapper'
            ? fieldOverride.type
            : schemaTarget?.type === 'objectWrapper'
              ? 'objectWrapper'
              : 'object'
        return {
          ...fieldOverride,
          type: inheritedType,
          tabs: mergedFormOverrides.tabs,
        }
      }) as IFormFieldOverride[],
    }
  }

  const normalizedFormOverrides = remapTopLevelTabsToArrayField()
  const form: IForm = {
    id: schemaForm.id,
    label: normalizedFormOverrides?.label ?? schemaForm.label,
    settings: normalizedFormOverrides?.settings,
  }

  form.pages =
    normalizedFormOverrides.pages !== undefined
      ? (mergeFormSections({
          sectionOverrides: normalizedFormOverrides.pages,
          schemaForm,
          formFieldsOverrideMap: formFieldOverridesByProp,
        }) as IPage[])
      : undefined
  form.wizard_steps =
    normalizedFormOverrides.wizard_steps !== undefined
      ? (mergeFormSections({
          sectionOverrides: normalizedFormOverrides.wizard_steps,
          schemaForm,
          formFieldsOverrideMap: formFieldOverridesByProp,
        }) as IWizardStep[])
      : undefined

  form.tabs =
    normalizedFormOverrides.tabs !== undefined
      ? (mergeFormSections({
          sectionOverrides: normalizedFormOverrides.tabs,
          schemaForm,
          formFieldsOverrideMap: formFieldOverridesByProp,
        }) as IFormLayoutTab[])
      : undefined

  form.fields = mergeFormFields({
    fieldOverrides: normalizedFormOverrides.fields,
    schemaForm,
    formFieldsOverrideMap: formFieldOverridesByProp,
  })

  return ensureObjectWrappersHaveSkipPath(form)
}

export const schemaToFormObject = (schema: JSONSchema6): IForm => {
  const resolvedSchema = resolveRefs(schema)
  const formFields: IFormField[] = []
  for (const key in resolvedSchema.properties) {
    if (
      resolvedSchema.properties[key] !== undefined &&
      typeof resolvedSchema.properties[key] !== 'boolean'
    ) {
      formFields.push(
        schemaToFormField({
          schema: resolvedSchema,
          property: key,
          schemaField: resolvedSchema.properties[key],
          path: [],
        })
      )
    }
  }
  return ensureObjectWrappersHaveSkipPath({
    id: makeFormFieldId([
      resolvedSchema.$id,
      resolvedSchema.title?.toLowerCase().replace(' ', '-'),
    ]),
    label: schema.title ?? 'Untitled',
    fields: formFields,
  })
}

export const buildFieldMapFromForm = (form: IForm): Record<string, IFormField> => {
  const formCopy = copyAndAddPathToFields(form)
  const fields = getFieldsFromFormSection(formCopy)
  return Object.fromEntries(fields.map((field) => [getPathFromField(field), field]))
}

export const getSchemaPaths = (schema: any, prefix = ''): string[] => {
  let paths: string[] = []

  if (schema.type === 'object' && schema.properties) {
    for (const key of Object.keys(schema.properties)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key
      paths.push(newPrefix)
      paths = paths.concat(getSchemaPaths(schema.properties[key], newPrefix))
    }
  } else if (schema.type === 'array' && schema.items) {
    const arrayPrefix = `${prefix}[]`
    paths.push(arrayPrefix)
    paths = paths.concat(getSchemaPaths(schema.items, arrayPrefix))
  } else if (schema.oneOf || schema.anyOf || schema.allOf) {
    for (const subSchema of schema.oneOf || schema.anyOf || schema.allOf) {
      if (subSchema.properties) {
        paths = paths.concat(getSchemaPaths(subSchema, prefix))
      }
    }
  }

  return paths
}

export const getSchemaPathDescriptors = (
  schema: any,
  prefix = ''
): Array<{ path: string; type: string; required: boolean }> => {
  let pathDescriptors: Array<{ path: string; type: string; required: boolean }> = []

  if (schema.type === 'object' && schema.properties) {
    for (const key of Object.keys(schema.properties)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key
      pathDescriptors.push({
        path: newPrefix,
        type: schema.properties[key].type ?? 'object',
        required: schema.required ? schema.required.includes(key) : false,
      })
      pathDescriptors = pathDescriptors.concat(
        getSchemaPathDescriptors(schema.properties[key], newPrefix)
      )
    }
  } else if (schema.type === 'array' && schema.items) {
    const arrayPrefix = `${prefix}[]`
    pathDescriptors.push({
      path: arrayPrefix,
      type: schema.type,
      required: schema.required ? schema.required.includes(prefix) : false,
    })
    pathDescriptors = pathDescriptors.concat(getSchemaPathDescriptors(schema.items, arrayPrefix))
  } else if (schema.oneOf || schema.anyOf || schema.allOf) {
    for (const subSchema of schema.oneOf || schema.anyOf || schema.allOf) {
      if (subSchema.properties) {
        pathDescriptors = pathDescriptors.concat(getSchemaPathDescriptors(subSchema, prefix))
      }
    }
  }

  return pathDescriptors
}
