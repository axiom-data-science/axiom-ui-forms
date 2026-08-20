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
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import Ajv, { type ValidateFunction } from ***REMOVED***ajv***REMOVED***
import addFormats from ***REMOVED***ajv-formats***REMOVED***
// mergeObjects is defined in mergers.ts; imported for internal use and
// re-exported for backwards compatibility with existing consumers
import { mergeObjects } from ***REMOVED***@/utils/mergers***REMOVED***

import { type JSONSchema6Type, type JSONSchema6Definition, type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***

import metaSchemaDraftV7 from ***REMOVED***ajv/lib/refs/json-schema-draft-07.json***REMOVED***
import metaSchemaDraftV6 from ***REMOVED***ajv/lib/refs/json-schema-draft-06.json***REMOVED***
import metaSchemaV5 from ***REMOVED***ajv/lib/refs/json-schema-2020-12/schema.json***REMOVED***
import metaSchemaV4 from ***REMOVED***ajv/lib/refs/json-schema-2019-09/schema.json***REMOVED***

import { resolveRefs } from ***REMOVED***@/utils/resolveRefs***REMOVED***
import { omit } from ***REMOVED***lodash-es***REMOVED***
import { type ISelectOptionProps } from ***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***
import { getFieldsFromFormSection, getPathFromField, makeJsonPath } from ***REMOVED***@/utils/getters***REMOVED***
import { cloneObject, copyAndAddPathToFields } from ***REMOVED***@/utils/manipulators***REMOVED***

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
  /* registerSchema(schemaOb as SchemaObject, ***REMOVED***https://axds.co/test***REMOVED***)
  const bundledSchema = await bundle(***REMOVED***https://axds.co/test***REMOVED***)
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
  return crypto !== undefined && typeof crypto.randomUUID === ***REMOVED***function***REMOVED***
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
    .replace(/_|-/g, ***REMOVED*** ***REMOVED***)
    .split(***REMOVED*** ***REMOVED***)
    .map((s, i) => {
      return i === 0 ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : s
    })
    .join(***REMOVED*** ***REMOVED***)
}

type SchemaWithProperties = JSONSchema6 & { properties: Record<string, JSONSchema6Definition> }
type TraversableSchema = JSONSchema6 | JSONSchema6Definition | undefined

const hasSchemaProperties = (schema: TraversableSchema): schema is SchemaWithProperties => {
  return (
    typeof schema === ***REMOVED***object***REMOVED*** &&
    schema !== null &&
    !Array.isArray(schema) &&
    ***REMOVED***properties***REMOVED*** in schema &&
    typeof (schema as { properties?: unknown }).properties === ***REMOVED***object***REMOVED*** &&
    (schema as { properties?: unknown }).properties !== null
  )
}

const isObjectLikeSchema = (schema: TraversableSchema): boolean => {
  return (
    schema !== undefined &&
    hasSchemaProperties(schema) &&
    (schema.type === undefined || schema.type === ***REMOVED***object***REMOVED***)
  )
}

const getAdditionalPropertiesSchema = (schema: TraversableSchema): JSONSchema6 | undefined => {
  if (schema === undefined || typeof schema === ***REMOVED***boolean***REMOVED***) {
    return undefined
  }
  if (
    schema.additionalProperties !== undefined &&
    typeof schema.additionalProperties !== ***REMOVED***boolean***REMOVED***
  ) {
    return schema.additionalProperties
  }
  return undefined
}

const getFieldType = (schema: JSONSchema6): IFormFieldType => {
  const schemaType = schema.type
  if (schemaType === ***REMOVED***string***REMOVED*** || schemaType === ***REMOVED***number***REMOVED*** || schemaType === ***REMOVED***integer***REMOVED***) {
    if (schema.enum !== undefined || schema.oneOf !== undefined) {
      return ***REMOVED***select***REMOVED***
    } else if (schema.anyOf !== undefined) {
      return ***REMOVED***checkbox***REMOVED***
    } else if (
      schemaType === ***REMOVED***string***REMOVED*** &&
      schema.maxLength !== undefined &&
      schema.maxLength > 150
    ) {
      return ***REMOVED***text***REMOVED***
    } else if (schemaType === ***REMOVED***number***REMOVED*** || schemaType === ***REMOVED***integer***REMOVED***) {
      return ***REMOVED***number***REMOVED***
    } else if (schema.format === ***REMOVED***date-time***REMOVED***) {
      return ***REMOVED***datetime***REMOVED***
    } else if (schema.format === ***REMOVED***date***REMOVED***) {
      return ***REMOVED***date***REMOVED***
    } else if (schema.format === ***REMOVED***time***REMOVED***) {
      return ***REMOVED***time***REMOVED***
    }
    return ***REMOVED***text***REMOVED***
  } else if (schemaType === ***REMOVED***boolean***REMOVED***) {
    return ***REMOVED***boolean***REMOVED***
  } else if (
    schemaType === ***REMOVED***object***REMOVED*** ||
    isObjectLikeSchema(schema) ||
    (schemaType === undefined &&
      (schema.oneOf !== undefined || schema.anyOf !== undefined || schema.allOf !== undefined))
  ) {
    return ***REMOVED***object***REMOVED***
  }
  if (!schemaType && (schema.anyOf !== undefined || schema.enum !== undefined)) {
    return ***REMOVED***object***REMOVED***
  }

  return ***REMOVED***text***REMOVED***
}

export const getValueFromSchema = (
  schema: JSONSchema6Type | JSONSchema6Definition | undefined
): string | number | boolean | undefined => {
  if (schema === undefined || schema === null) {
    return undefined
  }
  if (typeof schema === ***REMOVED***string***REMOVED*** || typeof schema === ***REMOVED***number***REMOVED*** || typeof schema === ***REMOVED***boolean***REMOVED***) {
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
    if (typeof schema.$id === ***REMOVED***string***REMOVED*** || typeof schema.$id === ***REMOVED***number***REMOVED***) {
      return makeLabel([String(schema.$id)])
    }
    return getValueFromSchema(schema.$id)
  }
  if (Array.isArray(schema) && schema.length === 2) {
    return typeof schema[0] === ***REMOVED***object***REMOVED*** && schema[0] !== null
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
  if (typeof schema === ***REMOVED***boolean***REMOVED***) {
    return schema ? ***REMOVED***true***REMOVED*** : ***REMOVED***false***REMOVED***
  }
  if (typeof schema === ***REMOVED***string***REMOVED*** || typeof schema === ***REMOVED***number***REMOVED*** || typeof schema === ***REMOVED***boolean***REMOVED***) {
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
    return typeof schema[1] === ***REMOVED***object***REMOVED*** && schema[1] !== null
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

const applyConditionToDescendants = (
  field: IFormField,
  condition: { dependsOn: string; value: string }
): IFormField => {
  const applyToField = (current: IFormField): IFormField => {
    const next = { ...current }

    if (next.conditionsSet !== undefined) {
      next.conditionsSet = {
        ...next.conditionsSet,
        logic: ***REMOVED***and***REMOVED***,
        conditions: [...next.conditionsSet.conditions, condition],
      }
    } else if (next.conditions !== undefined) {
      next.conditionsSet = {
        logic: ***REMOVED***and***REMOVED***,
        conditions: [next.conditions, condition],
      }
      next.conditions = undefined
    } else {
      next.conditions = condition
    }

    if ((next as any).fields !== undefined && Array.isArray((next as any).fields)) {
      ;(next as any).fields = (next as any).fields.map((child: IFormField) => applyToField(child))
    }
    if ((next as any).tabs !== undefined && Array.isArray((next as any).tabs)) {
      ;(next as any).tabs = (next as any).tabs.map((tab: any) => ({
        ...tab,
        fields: tab.fields?.map((child: IFormField) => applyToField(child)),
      }))
    }
    if ((next as any).pages !== undefined && Array.isArray((next as any).pages)) {
      ;(next as any).pages = (next as any).pages.map((page: any) => ({
        ...page,
        fields: page.fields?.map((child: IFormField) => applyToField(child)),
      }))
    }
    if ((next as any).wizard_steps !== undefined && Array.isArray((next as any).wizard_steps)) {
      ;(next as any).wizard_steps = (next as any).wizard_steps.map((step: any) => ({
        ...step,
        fields: step.fields?.map((child: IFormField) => applyToField(child)),
      }))
    }

    return next
  }

  const nextField = { ...field }
  if ((nextField as any).fields !== undefined && Array.isArray((nextField as any).fields)) {
    ;(nextField as any).fields = (nextField as any).fields.map((child: IFormField) =>
      applyToField(child)
    )
  }
  if ((nextField as any).tabs !== undefined && Array.isArray((nextField as any).tabs)) {
    ;(nextField as any).tabs = (nextField as any).tabs.map((tab: any) => ({
      ...tab,
      fields: tab.fields?.map((child: IFormField) => applyToField(child)),
    }))
  }
  if ((nextField as any).pages !== undefined && Array.isArray((nextField as any).pages)) {
    ;(nextField as any).pages = (nextField as any).pages.map((page: any) => ({
      ...page,
      fields: page.fields?.map((child: IFormField) => applyToField(child)),
    }))
  }
  if (
    (nextField as any).wizard_steps !== undefined &&
    Array.isArray((nextField as any).wizard_steps)
  ) {
    ;(nextField as any).wizard_steps = (nextField as any).wizard_steps.map((step: any) => ({
      ...step,
      fields: step.fields?.map((child: IFormField) => applyToField(child)),
    }))
  }

  return nextField
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
      type: ***REMOVED***text***REMOVED***,
      multiple,
    }
  }
  if (typeof schemaField === ***REMOVED***boolean***REMOVED***) {
    return {
      id: makeFormFieldId([schema.$id, property]),
      label: property,
      type: ***REMOVED***boolean***REMOVED***,
      multiple,
    }
  }
  if (schemaField.type === ***REMOVED***array***REMOVED*** && schemaField.items !== undefined) {
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
    schemaField.anyOf.filter((d) => typeof d !== ***REMOVED***boolean***REMOVED*** && d.type === ***REMOVED***null***REMOVED***).length === 1
  ) {
    const notNull = schemaField.anyOf.filter((d) => typeof d !== ***REMOVED***boolean***REMOVED*** && d.type !== ***REMOVED***null***REMOVED***)[0]
    return schemaToFormField({
      schema: schemaField,
      property,
      schemaField: {
        ...omit(schemaField, ***REMOVED***anyOf***REMOVED***),
        ...(typeof notNull !== ***REMOVED***boolean***REMOVED*** ? notNull : {}),
      },
      multiple,
      path: path.slice(),
    })
  }
  const type = getFieldType(schemaField)
  const id = makeFormFieldId([
    schemaField.$id,
    property,
    schemaField.title?.toLowerCase().replace(***REMOVED*** ***REMOVED***, ***REMOVED***-***REMOVED***),
  ])
  const label = makeLabel([schemaField.title, property])
  const schemaRequired = schema.required ?? []
  const exampleString =
    schemaField.examples && Array.isArray(schemaField.examples) && schemaField.examples.length > 0
      ? `Examples:\n\n - ${schemaField.examples.map((e) => String(e)).join(***REMOVED***\n - ***REMOVED***)}`
      : undefined
  const hasDescription =
    schemaField.description !== undefined &&
    schemaField.description !== null &&
    String(schemaField.description).trim().length > 0
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
    type === ***REMOVED***text***REMOVED*** ||
    type === ***REMOVED***number***REMOVED*** ||
    type === ***REMOVED***long_text***REMOVED*** ||
    type === ***REMOVED***boolean***REMOVED*** ||
    type === ***REMOVED***datetime***REMOVED*** ||
    type === ***REMOVED***date***REMOVED*** ||
    type === ***REMOVED***time***REMOVED***
  ) {
    if (
      type === ***REMOVED***number***REMOVED*** &&
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

  if (type === ***REMOVED***select***REMOVED*** || type === ***REMOVED***checkbox***REMOVED*** || type === ***REMOVED***radio***REMOVED***) {
    const schemaOptions = schemaField.oneOf ?? schemaField.anyOf ?? schemaField.enum ?? []
    const options: ISelectOptionProps[] = schemaOptions
      .map((e) => {
        const value = getValueFromSchema(e)
        const label = getLabelFromSchema(e)
        const description: string | undefined =
          typeof e === ***REMOVED***object***REMOVED*** && e !== null && !Array.isArray(e)
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
      type: options.find((d) => d.description !== undefined) ? ***REMOVED***radio***REMOVED*** : type,
      options,
      multiple,
    }
  }
  if (type === ***REMOVED***object***REMOVED***) {
    // const anyOfAsProps = schemaField.anyOf !== undefined && schemaField.anyOf.filter(d => typeof d !== ***REMOVED***boolean***REMOVED*** && d.type !== ***REMOVED***null***REMOVED***).length > 0
    const additionalPropertiesSchema = getAdditionalPropertiesSchema(schemaField)
    const properties = schemaField.properties ?? additionalPropertiesSchema?.properties ?? {}
    const propertyOwnerSchema =
      schemaField.properties !== undefined ? schemaField : additionalPropertiesSchema
    const fields: IFormField[] = []
    for (const key in properties) {
      if (properties[key] !== undefined && typeof properties[key] !== ***REMOVED***boolean***REMOVED***) {
        fields.push(
          schemaToFormField({
            schema: propertyOwnerSchema ?? schemaField,
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
        if (typeof f !== ***REMOVED***boolean***REMOVED***) {
          let value = f.$id ?? f.title
          if ((schemaField as any).discriminator?.propertyName !== undefined) {
            const v = getValueFromSchema(
              f?.properties?.[(schemaField as any).discriminator?.propertyName]
            )
            if (v !== null && v !== undefined && typeof v !== ***REMOVED***boolean***REMOVED***) {
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
          if (oneOfield.type === ***REMOVED***object***REMOVED***) {
            // oneOf object variants should act as conditional branch groups, not nested payload objects.
            // objectWrapper + skip_path keeps branch fields in the parent scope.
            Object.assign(oneOfield as unknown as Record<string, unknown>, {
              type: ***REMOVED***objectWrapper***REMOVED***,
              skip_path: true,
            })
          }
          const branchCondition = {
            dependsOn: `${path.join(***REMOVED***.***REMOVED***)}.${selectorField}`,
            value,
          }
          oneOfield.conditions = branchCondition
          oneOfFields.push(applyConditionToDescendants(oneOfield, branchCondition))
        }
      })
      fields.push({
        id: selectorField,
        type: ***REMOVED***select***REMOVED***,
        label: schemaField.title,
        options,
        defaultValue: options.length > 0 ? (options[0].value as IValueType) : undefined,
        excludeFromPayload: true,
        settings: {
          allowNull: false,
        },
      })
      oneOfFields.forEach((f) => {
        fields.push(f)
      })
    }

    const anyOfTabs: IFormLayoutTab[] = []
    ;(schemaField.anyOf ?? []).forEach((anyOf, index) => {
      const anyOfId = schemaField.$id
      if (typeof anyOf !== ***REMOVED***boolean***REMOVED*** && anyOf.type !== ***REMOVED***null***REMOVED***) {
        const field = schemaToFormField({
          schema: schemaField,
          property: anyOfId ?? makeRandom(),
          schemaField: {
            title: anyOf.title ?? ***REMOVED******REMOVED***,
            ...anyOf,
          },
          path: path.slice(),
        })

        // Default anyOf object behavior: one tab per branch.
        if (field.type === ***REMOVED***object***REMOVED*** && field.fields !== undefined) {
          anyOfTabs.push({
            id: makeFormFieldId([anyOf.$id, anyOf.title, `${property}_anyof_${index + 1}`]),
            label:
              makeLabel([anyOf.title, anyOf.$id, `${property} option ${String(index + 1)}`]) ??
              `Option ${String(index + 1)}`,
            fields: field.fields,
          })
          return
        }

        if (anyOfId === undefined && field.type === ***REMOVED***object***REMOVED***) {
          field.skip_path = true
        }
        fields.push(field)
      }
    })
    ;(schemaField.allOf ?? []).forEach((allOf) => {
      const allOfId = schemaField.$id
      if (typeof allOf !== ***REMOVED***boolean***REMOVED*** && allOf.type !== ***REMOVED***null***REMOVED***) {
        const field = schemaToFormField({
          schema: schemaField,
          property: allOfId ?? makeRandom(),
          schemaField: {
            title: allOf.title ?? ***REMOVED******REMOVED***,
            ...allOf,
          },
          path: path.slice(),
        })
        if (allOfId === undefined && field.type === ***REMOVED***object***REMOVED***) {
          field.skip_path = true
        }
        fields.push(field)
      }
    })

    return {
      ...baseFieldProps,
      type,
      fields,
      tabs: anyOfTabs.length > 0 ? anyOfTabs : undefined,
      multiple,
    }
  }

  return {
    ...baseFieldProps,
    type: ***REMOVED***text***REMOVED***,
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
 * For ***REMOVED***object***REMOVED*** fields, child fields are resolved by union of keys across all three
 * sources, then each child is recursively merged with the same precedence rules.
 */
const mergeFormField = ({
  field,
  fieldOverride,
  formFieldsOverrideMap,
  schemaFieldMap,
  schemaForm,
  containerPathPrefix,
}: {
  field?: IFormField
  fieldOverride?: IFormFieldOverride
  formFieldsOverrideMap: Array<Record<string, IFormFieldOverride>>
  schemaFieldMap: Record<string, IFormField>
  schemaForm: IForm
  containerPathPrefix?: string
}): IFormField => {
  const normalizePath = (value?: string): string | undefined => value?.replace(/\[\]/g, ***REMOVED******REMOVED***)

  const resolveScopedOverridePath = (overridePath?: string): string | undefined => {
    if (overridePath === undefined) {
      return undefined
    }

    const normalized = normalizePath(overridePath)
    if (
      schemaFieldMap[overridePath] !== undefined ||
      (normalized !== undefined && schemaFieldMap[normalized] !== undefined)
    ) {
      return overridePath
    }

    if (containerPathPrefix !== undefined) {
      const dotCandidate = `${containerPathPrefix}.${overridePath}`
      const bracketCandidate = `${containerPathPrefix}[].${overridePath}`
      const dotNormalized = normalizePath(dotCandidate)
      const bracketNormalized = normalizePath(bracketCandidate)

      if (
        schemaFieldMap[dotCandidate] !== undefined ||
        schemaFieldMap[bracketCandidate] !== undefined ||
        (dotNormalized !== undefined && schemaFieldMap[dotNormalized] !== undefined) ||
        (bracketNormalized !== undefined && schemaFieldMap[bracketNormalized] !== undefined)
      ) {
        return dotCandidate
      }
    }

    return overridePath
  }

  const rawOverridePath = resolveScopedOverridePath(fieldOverride?.prop)
  const normalizedOverridePath = normalizePath(rawOverridePath)
  const fieldPath = field ? makeJsonPath(field) : undefined
  const path = normalizedOverridePath ?? fieldPath
  const childPathPrefix = path ?? containerPathPrefix
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
      fieldOverride ?? {},
    ]),
  }

  // Auto-set excludeFromPayload for artificially added fields
  // If the schema has no properties, all fields are intentional — include them
  // If the override-only field has an EXPLICIT destPath, it***REMOVED***s writing to schema, so include it
  // If no explicit destPath and schema exists, it***REMOVED***s UI-only, so exclude it
  if (isFromOverrideOnly && !hasExplicitExcludeOverride) {
    mergedField.excludeFromPayload = schemaHasProperties ? !hasExplicitDestPath : false
  }
  const labelProp =
    mergedField.id ??
    (path !== undefined ? path.split(***REMOVED***.***REMOVED***).pop() : (fieldOverride?.prop ?? field?.id))
  const id = mergedField.id ?? fieldOverride?.prop ?? makeFormFieldId([path?.split(***REMOVED***.***REMOVED***)[0]])
  if (
    mergedField.type === ***REMOVED***object***REMOVED*** ||
    mergedField.type === ***REMOVED***objectWrapper***REMOVED*** ||
    mergedField.type === ***REMOVED***objectList***REMOVED***
  ) {
    // attached to the schema field. defaults not overrides
    const fieldFields =
      field?.type === ***REMOVED***object***REMOVED*** || field?.type === ***REMOVED***objectWrapper***REMOVED*** || field?.type === ***REMOVED***objectList***REMOVED***
        ? (field.fields ?? [])
        : []
    const fieldFieldsMap = Object.fromEntries(
      fieldFields
        .map((f) => {
          const key = normalizePath(getPathFromField(f)) ?? f.id
          return key !== undefined ? ([key, f] as [string, IFormField]) : undefined
        })
        .filter((entry): entry is [string, IFormField] => entry !== undefined)
    )
    /* if (fieldPages !== undefined) {
      mergedField.pages = fieldPages
    }
    if (fieldWizardSteps !== undefined) {
      mergedField.wizard_steps = fieldWizardSteps
    } */

    // attached to the field override. overrides
    const overrideFields = (fieldOverride as IObjectFormFieldOverride)?.fields ?? []
    // Read tabs from the override regardless of whether `type` is explicitly set on the
    // override — we are already inside the mergedField.type container branch, so the
    // merged type is confirmed to be an object-like container.
    const overrideFieldTabs = (fieldOverride as IObjectFormFieldOverride)?.tabs
    const overrideFieldPages = (fieldOverride as IObjectFormFieldOverride)?.pages
    const overrideFieldWizardSteps = (fieldOverride as IObjectFormFieldOverride)?.wizard_steps
    const buildOverrideMap = (fieldsToMap: unknown[]): Record<string, IFormFieldOverride> => {
      const entries = fieldsToMap
        .map((candidate) => {
          const fieldLike = candidate as { prop?: string; id?: string }
          const key =
            (fieldLike.prop !== undefined ? normalizePath(fieldLike.prop) : undefined) ??
            fieldLike.id
          return key !== undefined
            ? ([key, candidate as IFormFieldOverride] as [string, IFormFieldOverride])
            : undefined
        })
        .filter((entry): entry is [string, IFormFieldOverride] => entry !== undefined)
      return Object.fromEntries(entries)
    }

    const overrideFieldsMap = buildOverrideMap(overrideFields)

    // attached to the form override. overrides
    const formOverrideFields =
      (formFieldOverrides as IObjectFormFieldOverride | undefined)?.fields ?? []
    // Same as overrideFieldTabs above — read tabs from formFieldOverrides regardless of
    // whether `type` is explicitly set.
    const formOverrideFieldTabs = (formFieldOverrides as any)?.tabs
    const formOverrideFieldPages = (formFieldOverrides as any)?.pages
    const formOverrideFieldWizardSteps = (formFieldOverrides as any)?.wizard_steps
    const formOverrideFieldsMap = buildOverrideMap(formOverrideFields)

    // If overrides define only structural children (id/type without prop), treat those
    // as the explicit child layout and avoid auto-injecting schema siblings at this level.
    // This prevents duplicates such as wrapper + raw schema fields rendered together.
    const hasStructuralOnlyChildOverride = overrideFields.some((candidate) => {
      const fieldLike = candidate as { prop?: string; id?: string; type?: string }
      return (
        fieldLike.prop === undefined &&
        fieldLike.id !== undefined &&
        (fieldLike.type === ***REMOVED***object***REMOVED*** ||
          fieldLike.type === ***REMOVED***objectWrapper***REMOVED*** ||
          fieldLike.type === ***REMOVED***objectList***REMOVED*** ||
          fieldLike.type === ***REMOVED***section***REMOVED*** ||
          fieldLike.type === ***REMOVED***page***REMOVED***)
      )
    })

    const getOverrideByKey = (
      map: Record<string, IFormFieldOverride>,
      key: string,
      arrayBracketKey?: string,
      arrayDotKey?: string
    ): IFormFieldOverride | undefined => {
      const normalizedKey = normalizePath(key)
      return (
        map[key] ??
        (arrayBracketKey !== undefined ? map[arrayBracketKey] : undefined) ??
        (arrayDotKey !== undefined ? map[arrayDotKey] : undefined) ??
        (normalizedKey !== undefined ? map[normalizedKey] : undefined)
      )
    }

    const allKeys = Array.from(
      new Set(
        Object.keys(
          hasStructuralOnlyChildOverride
            ? {
                ...overrideFieldsMap,
                ...formOverrideFieldsMap,
              }
            : {
                ...fieldFieldsMap,
                ...overrideFieldsMap,
                ...formOverrideFieldsMap,
              }
        ).map((k) => normalizePath(k) ?? k)
      )
    )

    mergedField.fields = allKeys.map((key) => {
      // const fieldOverride = overrideFieldsMap[key] ?? { prop: key }
      // For array item fields (multiple: true), also check bracket and dot notation keys
      // "key" here is the full path (e.g. "testObject.field1"), so we strip the parent prefix
      // to get the leaf name and build the bracket-notation key correctly
      const isArrayItems = (mergedField as any).multiple === true
      const leafKey =
        isArrayItems && childPathPrefix
          ? key.replace(new RegExp(`^${childPathPrefix}\\.`), ***REMOVED******REMOVED***)
          : key
      const fullKey =
        childPathPrefix !== undefined && !key.startsWith(`${childPathPrefix}.`)
          ? `${childPathPrefix}.${leafKey}`
          : key
      const fullBracketKey =
        childPathPrefix !== undefined && !key.startsWith(`${childPathPrefix}[].`)
          ? `${childPathPrefix}[].${leafKey}`
          : key
      const arrayBracketKey =
        isArrayItems && childPathPrefix ? `${childPathPrefix}[].${leafKey}` : undefined
      const arrayDotKey =
        isArrayItems && childPathPrefix ? `${childPathPrefix}.${leafKey}` : undefined
      const fieldOverride = mergeObjects<IFormFieldOverride>(
        [
          getOverrideByKey(overrideFieldsMap, key, arrayBracketKey, arrayDotKey) ??
            getOverrideByKey(overrideFieldsMap, fullKey, arrayBracketKey, arrayDotKey) ??
            getOverrideByKey(overrideFieldsMap, fullBracketKey, arrayBracketKey, arrayDotKey),
          getOverrideByKey(formOverrideFieldsMap, key, arrayBracketKey, arrayDotKey) ??
            getOverrideByKey(formOverrideFieldsMap, fullKey, arrayBracketKey, arrayDotKey) ??
            getOverrideByKey(formOverrideFieldsMap, fullBracketKey, arrayBracketKey, arrayDotKey),
          mergeObjects<IFormFieldOverride>(
            formFieldsOverrideMap
              .map(
                (overrides) =>
                  overrides[key] ??
                  overrides[fullKey] ??
                  overrides[fullBracketKey] ??
                  (arrayBracketKey !== undefined ? overrides[arrayBracketKey] : undefined) ??
                  (arrayDotKey !== undefined ? overrides[arrayDotKey] : undefined)
              )
              .filter((d): d is IFormFieldOverride => d !== undefined)
          ),
        ].filter((d): d is IFormFieldOverride => d !== undefined)
      )

      const schemaFieldByContainerPath =
        childPathPrefix !== undefined
          ? (schemaFieldMap[`${childPathPrefix}.${leafKey}`] ??
            schemaFieldMap[`${childPathPrefix}[].${leafKey}`])
          : undefined

      const schemaFieldByFallbackMatch =
        schemaFieldByContainerPath === undefined && childPathPrefix !== undefined
          ? (() => {
              const normalizedPathPrefix = `${childPathPrefix}.`
              const suffix = `.${leafKey}`
              return Object.entries(schemaFieldMap).find(([schemaPath]) => {
                const normalized = normalizePath(schemaPath) ?? schemaPath
                return normalized.startsWith(normalizedPathPrefix) && normalized.endsWith(suffix)
              })?.[1]
            })()
          : undefined

      return mergeFormField({
        field:
          fieldFieldsMap[key] ??
          schemaFieldMap[key] ??
          schemaFieldByContainerPath ??
          schemaFieldByFallbackMatch,
        fieldOverride,
        formFieldsOverrideMap,
        schemaFieldMap,
        schemaForm,
        containerPathPrefix:
          mergedField.type === ***REMOVED***objectWrapper***REMOVED*** || (mergedField as any).skip_path === true
            ? childPathPrefix
            : path,
      })
    })

    const mergedTabs = formOverrideFieldTabs ?? overrideFieldTabs
    const mergedPages = formOverrideFieldPages ?? overrideFieldPages
    const mergedWizardSteps = formOverrideFieldWizardSteps ?? overrideFieldWizardSteps
    const schemaFieldTabs =
      field?.type === ***REMOVED***object***REMOVED*** || field?.type === ***REMOVED***objectWrapper***REMOVED*** || field?.type === ***REMOVED***objectList***REMOVED***
        ? (field as any).tabs
        : undefined
    const schemaFieldPages =
      field?.type === ***REMOVED***object***REMOVED*** || field?.type === ***REMOVED***objectWrapper***REMOVED*** || field?.type === ***REMOVED***objectList***REMOVED***
        ? (field as any).pages
        : undefined
    const schemaFieldWizardSteps =
      field?.type === ***REMOVED***object***REMOVED*** || field?.type === ***REMOVED***objectWrapper***REMOVED*** || field?.type === ***REMOVED***objectList***REMOVED***
        ? (field as any).wizard_steps
        : undefined

    mergedField.tabs =
      mergedTabs !== undefined
        ? (mergeFormSections({
            sectionOverrides: mergedTabs as IFormSectionOverride[],
            schemaForm,
            formFieldsOverrideMap,
            containerPathPrefix: childPathPrefix,
          }) as IFormLayoutTab[])
        : schemaFieldTabs
    mergedField.pages =
      mergedPages !== undefined
        ? (mergeFormSections({
            sectionOverrides: mergedPages as IFormSectionOverride[],
            schemaForm,
            formFieldsOverrideMap,
            containerPathPrefix: childPathPrefix,
          }) as IPage[])
        : schemaFieldPages
    mergedField.wizard_steps =
      mergedWizardSteps !== undefined
        ? (mergeFormSections({
            sectionOverrides: mergedWizardSteps as IFormSectionOverride[],
            schemaForm,
            formFieldsOverrideMap,
            containerPathPrefix: childPathPrefix,
          }) as IWizardStep[])
        : schemaFieldWizardSteps
  }

  // Enforce skip_path: true for objectWrapper fields
  // objectWrapper is a UI-only container that should never nest data
  if ((mergedField.type ?? ***REMOVED***text***REMOVED***) === ***REMOVED***objectWrapper***REMOVED***) {
    ;(mergedField as Record<string, unknown>).skip_path = true
  }

  return {
    ...mergedField,
    type: mergedField.type ?? ***REMOVED***text***REMOVED***,
    id,
    label: mergedField.label ?? makeLabel([labelProp]) ?? ***REMOVED***Default***REMOVED***,
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
    if (field.type === ***REMOVED***objectWrapper***REMOVED***) {
      ;(field as unknown as Record<string, unknown>).skip_path = true
    }
    // Recursively process nested fields
    if (***REMOVED***fields***REMOVED*** in field && Array.isArray((field as any).fields)) {
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
  containerPathPrefix,
}: {
  fieldOverrides?: IFormFieldOverride[]
  schemaForm: IForm
  formFieldsOverrideMap: Array<Record<string, IFormFieldOverride>>
  containerPathPrefix?: string
}): IFormField[] => {
  const schemaFieldMap = buildFieldMapFromForm(schemaForm)

  return (fieldOverrides ?? []).map((fieldOverride) => {
    const normalizedProp = fieldOverride.prop?.replace(/\[\]/g, ***REMOVED******REMOVED***)
    const schemaField = fieldOverride.prop
      ? (schemaFieldMap[fieldOverride.prop] ??
        (normalizedProp ? schemaFieldMap[normalizedProp] : undefined))
      : undefined
    return mergeFormField({
      field: schemaField,
      fieldOverride,
      formFieldsOverrideMap,
      schemaFieldMap,
      schemaForm,
      containerPathPrefix,
    })
  })
}

const mergeFormSections = ({
  sectionOverrides,
  schemaForm,
  formFieldsOverrideMap,
  containerPathPrefix,
}: {
  sectionOverrides?: IFormSectionOverride[]
  schemaForm: IForm
  formFieldsOverrideMap: Array<Record<string, IFormFieldOverride>>
  containerPathPrefix?: string
}): IFormSection[] => {
  const sections = (sectionOverrides ?? []).map((sectionToMerge, index) => {
    const sectionFields = mergeFormFields({
      fieldOverrides: sectionToMerge.fields,
      schemaForm,
      formFieldsOverrideMap,
      containerPathPrefix,
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
              containerPathPrefix,
            })
          : undefined,
      pages:
        sectionToMerge.pages !== undefined
          ? mergeFormSections({
              sectionOverrides: sectionToMerge.pages,
              schemaForm,
              formFieldsOverrideMap,
              containerPathPrefix,
            })
          : undefined,
      tabs:
        sectionToMerge.tabs !== undefined
          ? mergeFormSections({
              sectionOverrides: sectionToMerge.tabs,
              schemaForm,
              formFieldsOverrideMap,
              containerPathPrefix,
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
 *    tabs / fields) is rebuilt from the override definitions. Each section***REMOVED***s
 *    fields are merged via mergeFormField() using the 3-level precedence:
 *    schema field → formFieldOverrides → local section field override.
 *
 * @param formOverrides   - Top-level structural overrides (label, pages, wizard_steps…)
 * @param formFieldOverrides - Per-field property overrides, keyed by ***REMOVED***prop***REMOVED*** path
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
        overrides !== undefined && typeof overrides.map === ***REMOVED***function***REMOVED***
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
        (schemaField.type === ***REMOVED***object***REMOVED*** || schemaField.type === ***REMOVED***objectWrapper***REMOVED***) &&
        (schemaField as { multiple?: boolean }).multiple === true
      )
    })

    const tabRoots = Array.from(
      new Set(
        tabFieldProps
          .map((tabProp) => tabProp.replace(/\[\]/g, ***REMOVED******REMOVED***))
          .map((tabProp) => tabProp.split(***REMOVED***.***REMOVED***)[0])
          .filter((root) => root.length > 0)
      )
    )

    if (tabRoots.length !== 1) {
      return mergedFormOverrides
    }

    const targetRoot = tabRoots[0]
    const matchingCandidates = candidateFields.filter(
      (fieldOverride) => fieldOverride.prop?.replace(/\[\]/g, ***REMOVED******REMOVED***) === targetRoot
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
        const inheritedType: ***REMOVED***object***REMOVED*** | ***REMOVED***objectWrapper***REMOVED*** =
          fieldOverride.type === ***REMOVED***object***REMOVED*** || fieldOverride.type === ***REMOVED***objectWrapper***REMOVED***
            ? fieldOverride.type
            : schemaTarget?.type === ***REMOVED***objectWrapper***REMOVED***
              ? ***REMOVED***objectWrapper***REMOVED***
              : ***REMOVED***object***REMOVED***
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
      typeof resolvedSchema.properties[key] !== ***REMOVED***boolean***REMOVED***
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
      resolvedSchema.title?.toLowerCase().replace(***REMOVED*** ***REMOVED***, ***REMOVED***-***REMOVED***),
    ]),
    label: schema.title ?? ***REMOVED***Untitled***REMOVED***,
    fields: formFields,
  })
}

export const buildFieldMapFromForm = (form: IForm): Record<string, IFormField> => {
  const formCopy = copyAndAddPathToFields(form)
  const fields = getFieldsFromFormSection(formCopy as IFormSection)
  return Object.fromEntries(fields.map((field) => [getPathFromField(field), field]))
}

const getSchemaTypeLabel = (schema: JSONSchema6): string => {
  if (typeof schema.type === ***REMOVED***string***REMOVED***) {
    return schema.type
  }
  if (Array.isArray(schema.type)) {
    return schema.type[0] ?? ***REMOVED***object***REMOVED***
  }
  return ***REMOVED***object***REMOVED***
}

export const getSchemaPaths = (schema: TraversableSchema, prefix = ***REMOVED******REMOVED***): string[] => {
  if (schema === undefined || typeof schema === ***REMOVED***boolean***REMOVED***) {
    return []
  }

  let paths: string[] = []

  const additionalProperties = getAdditionalPropertiesSchema(schema)
  const hasDirectProperties = hasSchemaProperties(schema)
  const hasAdditionalObjectProperties = hasSchemaProperties(additionalProperties)

  if (
    (schema?.type === ***REMOVED***object***REMOVED*** || schema?.type === undefined) &&
    (hasDirectProperties || hasAdditionalObjectProperties)
  ) {
    if (hasDirectProperties) {
      for (const key of Object.keys(schema.properties)) {
        const propSchema = schema.properties[key]
        if (propSchema === undefined || typeof propSchema === ***REMOVED***boolean***REMOVED***) {
          continue
        }
        const newPrefix = prefix ? `${prefix}.${key}` : key
        paths.push(newPrefix)
        paths = paths.concat(getSchemaPaths(propSchema, newPrefix))
      }
    }

    if (hasAdditionalObjectProperties) {
      for (const key of Object.keys(additionalProperties.properties)) {
        const newPrefix = prefix ? `${prefix}.${key}` : key
        paths.push(newPrefix)
        const additionalProp = additionalProperties.properties[key]
        if (additionalProp !== undefined && typeof additionalProp !== ***REMOVED***boolean***REMOVED***) {
          paths = paths.concat(getSchemaPaths(additionalProp, newPrefix))
        }
      }
    }
  } else if (schema.type === ***REMOVED***array***REMOVED*** && schema.items) {
    const arrayPrefix = `${prefix}[]`
    paths.push(arrayPrefix)
    if (Array.isArray(schema.items)) {
      for (const itemSchema of schema.items) {
        if (itemSchema !== undefined && typeof itemSchema !== ***REMOVED***boolean***REMOVED***) {
          paths = paths.concat(getSchemaPaths(itemSchema, arrayPrefix))
        }
      }
    } else if (typeof schema.items !== ***REMOVED***boolean***REMOVED***) {
      paths = paths.concat(getSchemaPaths(schema.items, arrayPrefix))
    }
  } else if (schema.oneOf ?? schema.anyOf ?? schema.allOf) {
    const composedSchemas = schema.oneOf ?? schema.anyOf ?? schema.allOf
    for (const subSchema of composedSchemas ?? []) {
      if (hasSchemaProperties(subSchema)) {
        paths = paths.concat(getSchemaPaths(subSchema, prefix))
      }
    }
  }

  return paths
}

export const getSchemaPathDescriptors = (
  schema: TraversableSchema,
  prefix = ***REMOVED******REMOVED***
): Array<{ path: string; type: string; required: boolean }> => {
  if (schema === undefined || typeof schema === ***REMOVED***boolean***REMOVED***) {
    return []
  }

  let pathDescriptors: Array<{ path: string; type: string; required: boolean }> = []

  const additionalProperties = getAdditionalPropertiesSchema(schema)
  const hasDirectProperties = hasSchemaProperties(schema)
  const hasAdditionalObjectProperties = hasSchemaProperties(additionalProperties)

  if (
    (schema?.type === ***REMOVED***object***REMOVED*** || schema?.type === undefined) &&
    (hasDirectProperties || hasAdditionalObjectProperties)
  ) {
    if (hasDirectProperties) {
      for (const key of Object.keys(schema.properties)) {
        const propSchema = schema.properties[key]
        if (propSchema === undefined || typeof propSchema === ***REMOVED***boolean***REMOVED***) {
          continue
        }
        const newPrefix = prefix ? `${prefix}.${key}` : key
        pathDescriptors.push({
          path: newPrefix,
          type: getSchemaTypeLabel(propSchema),
          required: schema.required ? schema.required.includes(key) : false,
        })
        pathDescriptors = pathDescriptors.concat(getSchemaPathDescriptors(propSchema, newPrefix))
      }
    }

    if (hasAdditionalObjectProperties) {
      for (const key of Object.keys(additionalProperties.properties)) {
        const newPrefix = prefix ? `${prefix}.${key}` : key
        const additionalProp = additionalProperties.properties[key]
        if (additionalProp === undefined || typeof additionalProp === ***REMOVED***boolean***REMOVED***) {
          continue
        }
        pathDescriptors.push({
          path: newPrefix,
          type: getSchemaTypeLabel(additionalProp),
          required: additionalProperties.required
            ? additionalProperties.required.includes(key)
            : false,
        })
        pathDescriptors = pathDescriptors.concat(
          getSchemaPathDescriptors(additionalProp, newPrefix)
        )
      }
    }
  } else if (schema.type === ***REMOVED***array***REMOVED*** && schema.items) {
    const arrayPrefix = `${prefix}[]`
    pathDescriptors.push({
      path: arrayPrefix,
      type: schema.type,
      required: schema.required ? schema.required.includes(prefix) : false,
    })
    if (Array.isArray(schema.items)) {
      for (const itemSchema of schema.items) {
        if (itemSchema !== undefined && typeof itemSchema !== ***REMOVED***boolean***REMOVED***) {
          pathDescriptors = pathDescriptors.concat(
            getSchemaPathDescriptors(itemSchema, arrayPrefix)
          )
        }
      }
    } else if (typeof schema.items !== ***REMOVED***boolean***REMOVED***) {
      pathDescriptors = pathDescriptors.concat(getSchemaPathDescriptors(schema.items, arrayPrefix))
    }
  } else if (schema.oneOf ?? schema.anyOf ?? schema.allOf) {
    const composedSchemas = schema.oneOf ?? schema.anyOf ?? schema.allOf
    for (const subSchema of composedSchemas ?? []) {
      if (hasSchemaProperties(subSchema)) {
        pathDescriptors = pathDescriptors.concat(getSchemaPathDescriptors(subSchema, prefix))
      }
    }
  }

  return pathDescriptors
}
