import { type IFormOverride, type IForm, type IFormField, type IFormFieldType, type IFormValues, type IFormFieldOverride, type IFormSectionOverride, type IPage, type IFormSection, type IWizardStep, type IValueType, type INumberField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import Ajv, { type ValidateFunction } from ***REMOVED***ajv***REMOVED***
import addFormats from ***REMOVED***ajv-formats***REMOVED***

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
  /* registerSchema(schemaOb as SchemaObject, ***REMOVED***https://axds.co/test***REMOVED***)
  const bundledSchema = await bundle(***REMOVED***https://axds.co/test***REMOVED***)
  return { schema: bundledSchema as JSONSchema6 } */

  const resolved = resolveRefs(cloneObject(schemaOb) as JSONSchema6)
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
    .replace(/_|-/g, ***REMOVED*** ***REMOVED***)
    .split(***REMOVED*** ***REMOVED***)
    .map((s, i) => {
      return i === 0 ? `${s.charAt(0).toUpperCase()}${s.slice(1)}` : s
    }).join(***REMOVED*** ***REMOVED***)
}

const getFieldType = (schema: JSONSchema6): IFormFieldType => {
  const schemaType = schema.type
  if (schemaType === ***REMOVED***string***REMOVED*** || schemaType === ***REMOVED***number***REMOVED*** || schemaType === ***REMOVED***integer***REMOVED***) {
    if (schema.enum !== undefined || schema.oneOf !== undefined) {
      return ***REMOVED***select***REMOVED***
    } else if (schema.anyOf !== undefined) {
      return ***REMOVED***checkbox***REMOVED***
    } else if (schemaType === ***REMOVED***string***REMOVED*** && (schema.maxLength !== undefined && schema.maxLength > 150)) {
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
  } else if (schemaType === ***REMOVED***object***REMOVED*** || (schemaType === undefined && (schema.oneOf !== undefined || schema.anyOf !== undefined || schema.allOf !== undefined))) {
    return ***REMOVED***object***REMOVED***
  }
  if (!schemaType && (schema.anyOf !== undefined || schema.enum !== undefined)) {
    return ***REMOVED***object***REMOVED***
  }

  return ***REMOVED***text***REMOVED***
}

export const getValueFromSchema = (schema: JSONSchema6Type | JSONSchema6Definition | undefined): string | number | boolean | undefined => {
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
    return typeof schema[0] === ***REMOVED***object***REMOVED*** && schema[0] !== null ? getValueFromSchema(schema[0]) : schema[0]
  }
  return undefined
}

export const getLabelFromSchema = (schema: JSONSchema6Type | JSONSchema6Definition | undefined): string | undefined => {
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
    return typeof schema[1] === ***REMOVED***object***REMOVED*** && schema[1] !== null ? getLabelFromSchema(schema[1]) : schema[1]
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
      type: ***REMOVED***text***REMOVED***,
      multiple
    }
  }
  if (typeof schemaField === ***REMOVED***boolean***REMOVED***) {
    return {
      id: makeFormFieldId([schema.$id, property]),
      label: property,
      type: ***REMOVED***boolean***REMOVED***,
      multiple
    }
  }
  if (schemaField.type === ***REMOVED***array***REMOVED*** && schemaField.items !== undefined) {
    return schemaToFormField({
      schema: schemaField,
      property,
      schemaField: schemaField.items as JSONSchema6,
      multiple: true,
      path: path.slice()
    })
  }
  if (schemaField.anyOf !== undefined && schemaField.anyOf.length === 2 && schemaField.anyOf.filter(d => typeof d !== ***REMOVED***boolean***REMOVED*** && d.type === ***REMOVED***null***REMOVED***).length === 1) {
    const notNull = schemaField.anyOf.filter(d => typeof d !== ***REMOVED***boolean***REMOVED*** && d.type !== ***REMOVED***null***REMOVED***)[0]
    return schemaToFormField({
      schema: schemaField,
      property,
      schemaField: { ...omit(schemaField, ***REMOVED***anyOf***REMOVED***), ...(typeof notNull !== ***REMOVED***boolean***REMOVED*** ? notNull : {}) },
      multiple,
      path: path.slice()
    })
  }
  const type = getFieldType(schemaField)
  const id = makeFormFieldId([
    schemaField.$id,
    property,
    schemaField.title?.toLowerCase().replace(***REMOVED*** ***REMOVED***, ***REMOVED***-***REMOVED***)
  ])
  const label = makeLabel([
    schemaField.title,
    property
  ])
  const schemaRequired = schema.required ?? []
  const ob: Pick<IFormField, ***REMOVED***id***REMOVED*** | ***REMOVED***label***REMOVED*** | ***REMOVED***description***REMOVED*** | ***REMOVED***multiple***REMOVED*** | ***REMOVED***required***REMOVED*** | ***REMOVED***defaultValue***REMOVED***> = {
    id,
    label,
    description: schemaField.description,
    multiple,
    defaultValue: schemaField.default !== undefined ? schemaField.default as IValueType : undefined,
    required: schemaRequired.includes(property) ?? false
  }
  if (type === ***REMOVED***text***REMOVED*** || type === ***REMOVED***number***REMOVED*** || type === ***REMOVED***long_text***REMOVED*** || type === ***REMOVED***boolean***REMOVED*** || type === ***REMOVED***datetime***REMOVED*** || type === ***REMOVED***date***REMOVED*** || type === ***REMOVED***time***REMOVED***) {
    if (type === ***REMOVED***number***REMOVED*** && (schemaField.minimum !== undefined || schemaField.maximum !== undefined)) {
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

  if (type === ***REMOVED***select***REMOVED*** || type === ***REMOVED***checkbox***REMOVED***) {
    const schemaOptions = schemaField.oneOf ?? schemaField.anyOf ?? schemaField.enum ?? []
    const options = schemaOptions.map(e => {
      const value = getValueFromSchema(e)
      const label = getLabelFromSchema(e)
      const description = typeof e === ***REMOVED***object***REMOVED*** && e !== null && !Array.isArray(e) ? e.description : undefined
      return value !== undefined
        ? {
            value: String(value),
            label: label ?? String(value),
            description
          }
        : null
    }).filter(d => d !== null)
    return {
      ...ob,
      type,
      options
    }
  }
  if (type === ***REMOVED***object***REMOVED***) {
    // const anyOfAsProps = schemaField.anyOf !== undefined && schemaField.anyOf.filter(d => typeof d !== ***REMOVED***boolean***REMOVED*** && d.type !== ***REMOVED***null***REMOVED***).length > 0
    const properties = schemaField.properties ?? {}
    const fields: IFormField[] = []
    for (const key in properties) {
      if (properties[key] !== undefined && typeof properties[key] !== ***REMOVED***boolean***REMOVED***) {
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
        if (typeof f !== ***REMOVED***boolean***REMOVED***) {
          let value = f.$id ?? f.title
          if ((schemaField as any).discriminator?.propertyName !== undefined) {
            const v = getValueFromSchema(f?.properties?.[(schemaField as any).discriminator?.propertyName])
            if (v !== null && v !== undefined && typeof v !== ***REMOVED***boolean***REMOVED***) {
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
            dependsOn: `${path.join(***REMOVED***.***REMOVED***)}.${selectorField}`,
            value
          }
          oneOfFields.push(oneOfield)
        }
      })
      fields.push({
        id: selectorField,
        type: ***REMOVED***select***REMOVED***,
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
      if (typeof anyOf !== ***REMOVED***boolean***REMOVED*** && anyOf.type !== ***REMOVED***null***REMOVED***) {
        const field = schemaToFormField({
          schema: schemaField,
          property: anyOfId ?? makeRandom(),
          schemaField: typeof anyOf === ***REMOVED***boolean***REMOVED***
            ? anyOf
            : {
                title: anyOf.title ?? ***REMOVED******REMOVED***,
                ...anyOf
              },
          path: path.slice()
        })
        if (anyOfId === undefined && field.type === ***REMOVED***object***REMOVED***) {
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
    type: ***REMOVED***text***REMOVED***,
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
  const formFieldOverrides = mergeObjects<IFormFieldOverride>(formFieldsOverrideMap.map(overrides => overrides[path ?? ***REMOVED******REMOVED***]).filter(d => d !== undefined))
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
      ? path.split(***REMOVED***.***REMOVED***).pop()
      : fieldOverride?.prop ?? field.id
  )
  const id = mergedField.id ?? makeFormFieldId([mergedField.id])
  if (mergedField.type === ***REMOVED***object***REMOVED***) {
    // attached to the schema field. defaults not overrides
    const fieldFields = field?.type === ***REMOVED***object***REMOVED*** ? field.fields : []
    const fieldFieldsMap = Object.fromEntries(fieldFields.map(f => [getPathFromField(f), f]))

    // attached to the field override. overrides
    const overrideFields = fieldOverride?.type === ***REMOVED***object***REMOVED*** ? (fieldOverride.fields ?? []) : []
    const overrideFieldsMap = Object.fromEntries(
      overrideFields
        .filter((f): f is IFormFieldOverride => ***REMOVED***prop***REMOVED*** in f)
        .map(f => [f.prop, f])
    )

    // attached to the form override. overrides
    const formOverrideFields = formFieldOverrides.type === ***REMOVED***object***REMOVED*** ? formFieldOverrides.fields ?? [] : []
    const formOverrideFieldsMap = Object.fromEntries(
      formOverrideFields
        .filter((f): f is IFormFieldOverride => ***REMOVED***prop***REMOVED*** in f)
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
    type: mergedField.type ?? ***REMOVED***text***REMOVED***,
    id,
    label: mergedField.label ?? makeLabel([labelProp]) ?? ***REMOVED***Default***REMOVED***,
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
  const formFieldOverridesByProp = formFieldOverrides?.map(overrides => Object.fromEntries(
    overrides !== undefined && typeof overrides.map === ***REMOVED***function***REMOVED***
      ? overrides.map(override => [override.prop, override])
      : []
  )) ?? []
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
    if (resolvedSchema.properties[key] !== undefined && typeof resolvedSchema.properties[key] !== ***REMOVED***boolean***REMOVED***) {
      formFields.push(schemaToFormField({
        schema: resolvedSchema,
        property: key,
        schemaField: resolvedSchema.properties[key],
        path: []
      }))
    }
  }
  return {
    id: makeFormFieldId([resolvedSchema.$id, resolvedSchema.title?.toLowerCase().replace(***REMOVED*** ***REMOVED***, ***REMOVED***-***REMOVED***)]),
    label: schema.title ?? ***REMOVED***Untitled***REMOVED***,
    fields: formFields
  }
}

export const buildFieldMapFromForm = (form: IForm): Record<string, IFormField> => {
  const formCopy = copyAndAddPathToFields(form)
  const fields = getFieldsFromFormSection(formCopy)
  return Object.fromEntries(fields.map(field => [getPathFromField(field), field]))
}

export const getSchemaPaths = (schema: any, prefix = ***REMOVED******REMOVED***): string[] => {
  let paths: string[] = []

  if (schema.type === ***REMOVED***object***REMOVED*** && schema.properties) {
    for (const key of Object.keys(schema.properties)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key
      paths.push(newPrefix)
      paths = paths.concat(getSchemaPaths(schema.properties[key], newPrefix))
    }
  } else if (schema.type === ***REMOVED***array***REMOVED*** && schema.items) {
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

export const getSchemaPathDescriptors = (schema: any, prefix = ***REMOVED******REMOVED***): Array<{ path: string, type: string, required: boolean }> => {
  let pathDescriptors: Array<{ path: string, type: string, required: boolean }> = []

  if (schema.type === ***REMOVED***object***REMOVED*** && schema.properties) {
    for (const key of Object.keys(schema.properties)) {
      const newPrefix = prefix ? `${prefix}.${key}` : key
      pathDescriptors.push({
        path: newPrefix,
        type: schema.properties[key].type ?? ***REMOVED***object***REMOVED***,
        required: schema.required ? schema.required.includes(key) : false
      })
      pathDescriptors = pathDescriptors.concat(getSchemaPathDescriptors(schema.properties[key], newPrefix))
    }
  } else if (schema.type === ***REMOVED***array***REMOVED*** && schema.items) {
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
