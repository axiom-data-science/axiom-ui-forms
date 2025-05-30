import { type IFormOverride, type IForm, type IFormField, type IFormFieldType, type IFormValues, type IFormFieldOverride, type IFormSectionOverride, type IPage, type IFormSection, type IWizardStep, type IValueType, type INumberField } from '@/Form/Creator/FormCreatorTypes'
import Ajv, { type ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'

import { type JSONSchema6Type, type JSONSchema6Definition, type JSONSchema6 } from 'json-schema'

import metaSchemaDraftV7 from 'ajv/lib/refs/json-schema-draft-07.json'
import metaSchemaDraftV6 from 'ajv/lib/refs/json-schema-draft-06.json'
import metaSchemaV5 from 'ajv/lib/refs/json-schema-2020-12/schema.json'
import metaSchemaV4 from 'ajv/lib/refs/json-schema-2019-09/schema.json'

import { resolveRefs } from '@/utils/resolveRefs'
import { omit } from 'lodash'
import { type ISelectOptionProps } from '@axdspub/axiom-ui-utilities'
import { getFieldsFromFormSection, getPathFromField, makeJsonPath } from '@/utils/getters'
import { copyAndAddPathToFields } from '@/utils/manipulators'

const getValidator = (schema: number): ValidateFunction => {
  const ajv = new Ajv({
    strict: false
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

export const validateSchema = (schemaOb: unknown, version: number = 6): { schema?: JSONSchema6, error?: string, unrefed?: JSONSchema6 } => {
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

  const resolved = resolveRefs(structuredClone(schemaOb) as JSONSchema6)
  return { schema: resolved, unrefed: schemaOb as JSONSchema6 }
}

export const validateAgainstSchema = (schema: JSONSchema6, formValues: IFormValues): string[] | undefined => {
  const validSchema = validateSchema(schema)
  if (validSchema.error !== undefined) {
    return [validSchema.error]
  }
  const ajv = new Ajv({ strict: false, allErrors: true })
  addFormats(ajv)
  const validator = ajv.compile(schema)
  const valid = validator(formValues)
  if (validator.errors !== null && validator.errors !== undefined && !valid) {
    return validator.errors.map(e => {
      return `${e.instancePath} ${e.message}`
    })
  }
  return undefined
}

const makeRandom = (): string => {
  return crypto !== undefined ? crypto.randomUUID() : Math.random().toString(36).substring(2)
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
    }).join(' ')
}

const getFieldType = (schema: JSONSchema6): IFormFieldType => {
  const schemaType = schema.type
  if (schemaType === 'string' || schemaType === 'number' || schemaType === 'integer') {
    if (schema.enum !== undefined || schema.oneOf !== undefined) {
      return 'select'
    } else if (schema.anyOf !== undefined) {
      return 'checkbox'
    } else if (schemaType === 'string' && (schema.maxLength !== undefined && schema.maxLength <= 100)) {
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
    return 'long_text'
  } else if (schemaType === 'boolean') {
    return 'boolean'
  } else if (schemaType === 'object' || (schemaType === undefined && (schema.oneOf !== undefined || schema.anyOf !== undefined || schema.allOf !== undefined))) {
    return 'object'
  }
  if (!schemaType && (schema.anyOf !== undefined || schema.enum !== undefined)) {
    return 'object'
  }

  return 'text'
}

export const getValueFromSchema = (schema: JSONSchema6Type | JSONSchema6Definition | undefined): string | number | boolean | undefined => {
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
  return undefined
}

export const getLabelFromSchema = (schema: JSONSchema6Type | JSONSchema6Definition | undefined): string | undefined => {
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
  path = []
}: ISchemaToFormFieldProps): IFormField => {
  path.push(property)
  if (schemaField === undefined) {
    return {
      id: makeFormFieldId([schema.$id, property]),
      label: property,
      type: 'text',
      multiple
    }
  }
  if (typeof schemaField === 'boolean') {
    return {
      id: makeFormFieldId([schema.$id, property]),
      label: property,
      type: 'boolean',
      multiple
    }
  }
  if (schemaField.type === 'array' && schemaField.items !== undefined) {
    return schemaToFormField({
      schema: schemaField,
      property,
      schemaField: schemaField.items as JSONSchema6,
      multiple: true,
      path: path.slice()
    })
  }
  if (schemaField.anyOf !== undefined && schemaField.anyOf.length === 2 && schemaField.anyOf.filter(d => typeof d !== 'boolean' && d.type === 'null').length === 1) {
    const notNull = schemaField.anyOf.filter(d => typeof d !== 'boolean' && d.type !== 'null')[0]
    return schemaToFormField({
      schema: schemaField,
      property,
      schemaField: { ...omit(schemaField, 'anyOf'), ...(typeof notNull !== 'boolean' ? notNull : {}) },
      multiple,
      path: path.slice()
    })
  }
  const type = getFieldType(schemaField)
  const id = makeFormFieldId([
    schemaField.$id,
    property,
    schemaField.title?.toLowerCase().replace(' ', '-')
  ])
  const label = makeLabel([
    schemaField.title,
    property
  ])
  const schemaRequired = schema.required ?? []
  const ob: Pick<IFormField, 'id' | 'label' | 'description' | 'multiple' | 'required' | 'defaultValue'> = {
    id,
    label,
    description: schemaField.description,
    multiple,
    defaultValue: schemaField.default !== undefined ? schemaField.default as IValueType : undefined,
    required: schemaRequired.includes(property) ?? false
  }
  if (type === 'text' || type === 'number' || type === 'long_text' || type === 'boolean' || type === 'datetime' || type === 'date' || type === 'time') {
    if (type === 'number' && (schemaField.minimum !== undefined || schemaField.maximum !== undefined)) {
      const numberOb = ob as INumberField
      numberOb.constraints = numberOb.constraints ?? {}
      if (schemaField.minimum !== undefined) {
        numberOb.constraints.min = schemaField.minimum
      }
      if (schemaField.maximum !== undefined) {
        numberOb.constraints.max = schemaField.maximum
      }
      return {
        ...numberOb,
        type
      }
    }
    return {
      ...ob,
      type
    }
  }

  if (type === 'select' || type === 'checkbox') {
    const schemaOptions = schemaField.enum ?? schemaField.oneOf ?? schemaField.anyOf ?? []
    const options = schemaOptions.map(e => {
      const value = getValueFromSchema(e)
      const label = getLabelFromSchema(e)
      return value !== undefined
        ? {
            value: String(value),
            label: label ?? String(value)
          }
        : null
    }).filter(d => d !== null)
    return {
      ...ob,
      type,
      options
    }
  }
  if (type === 'object') {
    // const anyOfAsProps = schemaField.anyOf !== undefined && schemaField.anyOf.filter(d => typeof d !== 'boolean' && d.type !== 'null').length > 0
    const properties = schemaField.properties ?? {}
    const fields: IFormField[] = []
    for (const key in properties) {
      if (properties[key] !== undefined && typeof properties[key] !== 'boolean') {
        fields.push(schemaToFormField({
          schema: schemaField,
          property: key,
          schemaField: properties[key],
          path: path.slice()
        }))
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
            const v = getValueFromSchema(f?.properties?.[(schemaField as any).discriminator?.propertyName])
            if (v !== null && v !== undefined && typeof v !== 'boolean') {
              value = String(v)
            }
          }
          if (value === undefined || value === null) {
            value = `${property}_${i}`
          }
          options.push({
            label: f.title ?? f.$id ?? `${property} option ${String(i + 1)}`,
            value
          })
          const oneOfield = schemaToFormField({
            schema: schemaField,
            property: value,
            schemaField: f,
            path: path.slice()
          })
          oneOfield.conditions = {
            dependsOn: `${path.join('.')}.${selectorField}`,
            value
          }
          oneOfFields.push(oneOfield)
        }
      })
      fields.push({
        id: selectorField,
        type: 'select',
        label: schemaField.title,
        options
      })
      oneOfFields.forEach(f => {
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
          schemaField: typeof anyOf === 'boolean'
            ? anyOf
            : {
                title: anyOf.title ?? '',
                ...anyOf
              },
          path: path.slice()
        })
        if (anyOfId === undefined && field.type === 'object') {
          field.skip_path = true
        }
        fields.push(field)
      }
    })

    return {
      ...ob,
      type,
      fields,
      multiple
    }
  }

  return {
    id,
    type: 'text',
    multiple
  }
}

export function mergeObjects<T extends Record<string, any>> (objects: T[]): T {
  const initialValue: T = {} as unknown as T
  return objects.reduce<T>((acc, obj) => ({ ...acc, ...obj }), initialValue)
}

const mergeFormField = ({
  field,
  fieldOverride,
  formFieldsOverrideMap,
  schemaFieldMap
}: {
  field: IFormField
  fieldOverride?: IFormFieldOverride
  formFieldsOverrideMap: Array<Record<string, IFormFieldOverride>>
  schemaFieldMap: Record<string, IFormField>
}): IFormField => {
  const path = fieldOverride?.prop ?? makeJsonPath(field)
  const formFieldOverrides = mergeObjects<IFormFieldOverride>(formFieldsOverrideMap.map(overrides => overrides[path ?? '']).filter(d => d !== undefined))
  const mergedField = {
    ...mergeObjects<IFormFieldOverride | IFormField>([
      {
        ...field,
        destPath: path
      },
      formFieldOverrides,
      (fieldOverride ?? {}) as IFormFieldOverride
    ])
  }
  const labelProp = mergedField.id ?? (
    path !== undefined
      ? path.split('.').pop()
      : fieldOverride?.prop ?? field.id
  )
  const id = mergedField.id ?? makeFormFieldId([mergedField.id])
  if (mergedField.type === 'object') {
    // attached to the schema field. defaults not overrides
    const fieldFields = field?.type === 'object' ? field.fields : []
    const fieldFieldsMap = Object.fromEntries(fieldFields.map(f => [getPathFromField(f), f]))

    // attached to the field override. overrides
    const overrideFields = fieldOverride?.type === 'object' ? (fieldOverride.fields ?? []) : []
    const overrideFieldsMap = Object.fromEntries(
      overrideFields
        .filter((f): f is IFormFieldOverride => 'prop' in f)
        .map(f => [f.prop, f])
    )

    // attached to the form override. overrides
    const formOverrideFields = formFieldOverrides.type === 'object' ? formFieldOverrides.fields ?? [] : []
    const formOverrideFieldsMap = Object.fromEntries(
      formOverrideFields
        .filter((f): f is IFormFieldOverride => 'prop' in f)
        .map(f => [f.prop, f])
    )

    const allKeys = Object.keys({
      ...fieldFieldsMap,
      ...overrideFieldsMap,
      ...formOverrideFieldsMap
    })

    mergedField.fields = allKeys.map(key => {
      // const fieldOverride = overrideFieldsMap[key] ?? { prop: key }
      const fieldOverride = mergeObjects<IFormFieldOverride>([
        overrideFieldsMap[key],
        formOverrideFieldsMap[key],
        mergeObjects<IFormFieldOverride>(formFieldsOverrideMap.map(overrides => overrides[key]).filter(d => d !== undefined))
      ])
      return mergeFormField({
        field: fieldFieldsMap[key] ?? schemaFieldMap[key],
        fieldOverride,
        formFieldsOverrideMap,
        schemaFieldMap
      })
    })
  }
  return {
    type: mergedField.type ?? 'text',
    id,
    label: mergedField.label ?? makeLabel([labelProp]) ?? 'Default',
    ...mergedField
  } as unknown as IFormField
}

const mergeFormFields = ({
  fieldOverrides,
  schemaForm,
  formFieldsOverrideMap
}: {
  fieldOverrides?: IFormFieldOverride[]
  schemaForm: IForm
  formFieldsOverrideMap: Array<Record<string, IFormFieldOverride>>
}): IFormField[] => {
  const schemaFieldMap = buildFieldMapFromForm(schemaForm)

  return (fieldOverrides ?? []).map(fieldOverride => {
    const schemaField = schemaFieldMap[fieldOverride.prop]
    return mergeFormField({
      field: schemaField,
      fieldOverride,
      formFieldsOverrideMap,
      schemaFieldMap
    })
  })
}

const mergeFormSections = ({
  sectionOverrides,
  schemaForm,
  formFieldsOverrideMap

}: {
  sectionOverrides?: IFormSectionOverride[]
  schemaForm: IForm
  formFieldsOverrideMap: Array<Record<string, IFormFieldOverride>>

}): IFormSection[] => {
  const sections = (sectionOverrides ?? []).map((sectionToMerge, index) => {
    const sectionFields = mergeFormFields({
      fieldOverrides: sectionToMerge.fields,
      schemaForm,
      formFieldsOverrideMap
    })
    const sectionId = sectionToMerge.id ?? makeFormFieldId([sectionToMerge.id, index])
    return {
      id: sectionId ?? makeFormFieldId([sectionId, index]),
      label: sectionToMerge.label ?? makeLabel([sectionId]),
      ...sectionToMerge,
      fields: sectionToMerge.fields !== undefined
        ? sectionFields
        : undefined,
      wizard_steps: sectionToMerge.wizard_steps !== undefined
        ? mergeFormSections({
          sectionOverrides: sectionToMerge.wizard_steps,
          schemaForm,
          formFieldsOverrideMap
        })
        : undefined,
      pages: sectionToMerge.pages !== undefined
        ? mergeFormSections({
          sectionOverrides: sectionToMerge.pages,
          schemaForm,
          formFieldsOverrideMap
        })
        : undefined
    }
  })
  return sections as IFormSection[]
}

export const overridesAndSchemaToFormObject = ({
  formOverrides,
  formFieldOverrides,
  schema
}: {
  formOverrides?: IFormOverride[]
  formFieldOverrides?: IFormFieldOverride[][]
  schema: JSONSchema6
}): IForm => {
  const schemaForm = schemaToFormObject(schema)
  const formFieldOverridesByProp = formFieldOverrides?.map(overrides => Object.fromEntries(overrides.map(override => [override.prop, override]))) ?? []
  if (formOverrides === undefined && formFieldOverrides !== undefined) {
    const schemaFieldMap = buildFieldMapFromForm(schemaForm)
    const fields = Object.values(schemaFieldMap).map(field => {
      return mergeFormField({
        field,
        formFieldsOverrideMap: formFieldOverridesByProp,
        schemaFieldMap
      })
    })
    return {
      ...schemaForm,
      fields
    }
  }
  const mergedFormOverrides = mergeObjects<IFormOverride>(formOverrides ?? [])
  const form: IForm = {
    id: schemaForm.id,
    label: mergedFormOverrides?.label ?? schemaForm.label,
    settings: mergedFormOverrides?.settings
  }

  form.pages = mergedFormOverrides.pages !== undefined
    ? mergeFormSections({
      sectionOverrides: mergedFormOverrides.pages,
      schemaForm,
      formFieldsOverrideMap: formFieldOverridesByProp
    }) as IPage[]
    : undefined
  form.wizard_steps = mergedFormOverrides.wizard_steps !== undefined
    ? mergeFormSections({
      sectionOverrides: mergedFormOverrides.wizard_steps,
      schemaForm,
      formFieldsOverrideMap: formFieldOverridesByProp
    }) as IWizardStep[]
    : undefined

  form.fields = mergeFormFields({
    fieldOverrides: mergedFormOverrides.fields,
    schemaForm,
    formFieldsOverrideMap: formFieldOverridesByProp
  })

  return form
}

export const schemaToFormObject = (schema: JSONSchema6): IForm => {
  const resolvedSchema = resolveRefs(schema)
  const formFields: IFormField[] = []
  for (const key in resolvedSchema.properties) {
    if (resolvedSchema.properties[key] !== undefined && typeof resolvedSchema.properties[key] !== 'boolean') {
      formFields.push(schemaToFormField({
        schema: resolvedSchema,
        property: key,
        schemaField: resolvedSchema.properties[key],
        path: []
      }))
    }
  }
  return {
    id: makeFormFieldId([resolvedSchema.$id, resolvedSchema.title?.toLowerCase().replace(' ', '-')]),
    label: schema.title ?? 'Untitled',
    fields: formFields
  }
}

export const buildFieldMapFromForm = (form: IForm): Record<string, IFormField> => {
  const formCopy = copyAndAddPathToFields(form)
  const fields = getFieldsFromFormSection(formCopy)
  return Object.fromEntries(fields.map(field => [getPathFromField(field), field]))
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

export const getSchemaPathDescriptors = (schema: any, prefix = ''): Array<{ path: string, type: string, required: boolean }> => {
  let pathDescriptors: Array<{ path: string, type: string, required: boolean }> = []

  if (schema.type === 'object' && schema.properties) {
    for (const key of Object.keys(schema.properties)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key
      pathDescriptors.push({
        path: newPrefix,
        type: schema.properties[key].type ?? 'object',
        required: schema.required ? schema.required.includes(key) : false
      })
      pathDescriptors = pathDescriptors.concat(getSchemaPathDescriptors(schema.properties[key], newPrefix))
    }
  } else if (schema.type === 'array' && schema.items) {
    const arrayPrefix = `${prefix}[]`
    pathDescriptors.push({
      path: arrayPrefix,
      type: schema.type,
      required: schema.required ? schema.required.includes(prefix) : false
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
