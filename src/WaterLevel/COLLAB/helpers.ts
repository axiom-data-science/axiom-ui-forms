import {
  type IObjectFormFieldOverride,
  type IFormSectionOverride,
  type IFormFieldOverride,
} from '@/Form/Creator/FormCreatorTypes'
import { type IMetadataFormSection, type IMetadataField } from '@/WaterLevel/COLLAB/types'
import { type JSONSchema6, type JSONSchema6Definition } from 'json-schema'

const COLLAB_ROOT =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRcD83QFtU6UeW5KwMt0qDYWtLoDWzRbw1dKZI5ntOhevndBL1CyxtSvBXgg7vREdmVCvDgnw4fbSrq/pub?output=tsv'
const METADATA_SHEET = `${COLLAB_ROOT}&gid=0`
const FORM_SECTIONS_SHEET = `${COLLAB_ROOT}&gid=1566055209`
const FORM_GROUPINGS_SHEET = `${COLLAB_ROOT}&gid=68809768`

export const loadSheet = async <T>(url: string, emptyHeaderRows: number = 0): Promise<T[]> => {
  const j = await (await fetch(url)).text()
  return parseSheet<T>(j, emptyHeaderRows)
}

export const parseSheet = <T>(sheetData: string, emptyHeaderRows: number = 0): T[] => {
  const rows = sheetData.trim().split('\n').slice(emptyHeaderRows)
  const headers = rows[0].split('\t').map((h) => h.trim())
  const formattedRows: T[] = rows
    .slice(1)
    .filter((r) => r.split(/\t/)[0].trim() !== '')
    .map((r) => {
      const values = r.split('\t')
      const o: any = {}
      headers.forEach((header, index) => {
        const v = values[index]
        o[header] =
          v === 'TRUE' ? true : v === 'FALSE' ? false : v === 'null' ? null : v === '' ? null : v
      })
      return o as T
    })
  return formattedRows
}

export const getMetadataFields = async (): Promise<IMetadataField[]> => {
  return await loadSheet<IMetadataField>(METADATA_SHEET, 1)
}

export const getCollabSchema = async (): Promise<JSONSchema6> => {
  const fields = await getMetadataFields()
  return parseMetadataFieldsIntoSchema(fields.filter((f) => f.id && !f.remove_field))
}

export const getFormSections = async (): Promise<IFormSectionOverride[]> => {
  const sections = await loadSheet<IMetadataFormSection>(FORM_SECTIONS_SHEET)
  const fields = await getMetadataFields()
  const groupings = await getFormGroupings()
  return parseFormSections(
    fields.filter((f) => f.id && !f.remove_field),
    sections,
    groupings
  )
}

export interface IFormGrouping {
  id: string
  label?: string
  description?: string | null
  layout?: IFormSectionOverride['layout']
}

export const getFormGroupings = async (): Promise<IFormGrouping[]> => {
  const groupings = await loadSheet<IMetadataFormSection>(FORM_GROUPINGS_SHEET)
  return groupings.filter((g) => g.id && g.id.trim() !== '') as IFormGrouping[]
}

const fieldToSchemaProperty = (f: IMetadataField, path?: string): JSONSchema6 => {
  const options = [
    f.option1,
    f.option2,
    f.option3,
    f.option4,
    f.option5,
    f.option6,
    f.option7,
    f.option8,
  ]
    .filter((o) => o !== null && o !== '')
    .map((o) => o?.split('; '))
    .flat(Infinity) as string[]
  // const optionsToUse = options.length > 0 ? options.filter(o => o !== 'Other') : []
  // const optionsIncludesOther = options.some(o => o && o.toLowerCase() === 'other') || (f.response_type === "Multichoice with 'other' option" && optionsToUse.length > 0)
  // const useAnyOf = optionsIncludesOther && options.length > 0
  // Ensure type is JSONSchema6TypeName
  let type: JSONSchema6['type']
  if (
    f.response_type === null ||
    /Text/i.test(f.response_type) ||
    /Link/i.test(f.response_type) ||
    /Email/i.test(f.response_type) ||
    /Phone/i.test(f.response_type) ||
    /Date/i.test(f.response_type)
  ) {
    type = 'string'
  } else if (/Number/i.test(f.response_type)) {
    type = 'number'
  } else if (/Boolean/i.test(f.response_type)) {
    type = 'boolean'
  } else {
    type = 'string'
  }

  const prop: JSONSchema6 = {
    type,
    format:
      f.response_type === 'DateTime'
        ? 'datetime'
        : f.response_type === 'Date'
          ? 'date'
          : f.response_type === 'Email'
            ? 'email'
            : f.response_type === 'Phone number'
              ? 'phone'
              : f.response_type === 'Link'
                ? 'uri'
                : undefined,
    title: f.label,
    description: f.description ?? undefined,
    enum: options.length > 0 && type === 'string' ? options : undefined,
    /* anyOf: useAnyOf
        ? [
            {
              type: 'string',
              enum: optionsToUse
            },
            {
              type: 'string'
            }
          ]
        : undefined */
  }
  return prop
}

const setSchemaPropertyByIdPath = (
  properties: Record<string, JSONSchema6Definition>,
  idPath: string,
  prop: JSONSchema6
): void => {
  const pathParts = idPath
    .split('.')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)

  if (pathParts.length === 0) {
    return
  }

  let currentProps = properties
  for (let i = 0; i < pathParts.length - 1; i += 1) {
    const part = pathParts[i]
    const existing = currentProps[part]

    if (existing === undefined || typeof existing === 'boolean') {
      currentProps[part] = {
        type: 'object',
        properties: {},
      }
    } else if (existing.type !== 'object' || existing.properties === undefined) {
      currentProps[part] = {
        ...existing,
        type: 'object',
        properties: existing.properties ?? {},
      }
    }

    currentProps = (currentProps[part] as JSONSchema6).properties as Record<
      string,
      JSONSchema6Definition
    >
  }

  const leaf = pathParts[pathParts.length - 1]
  currentProps[leaf] = prop
}

const contributorsSpecialCase = (): JSONSchema6 => {
  return {
    "type": "object",
    "additionalProperties": {
      "type": "object",
      "properties": {
        "role": {
          "type": "string",
          "title": "Contributor role",
          "enum": [
            {
              "const": "custodian",
              "title": "Custodian"
            },
            {
              "const": "community_poc",
              "title": "Community Point of Contact"
            },
            {
              "const": "owner",
              "title": "Owner"
            },
            {
              "const": "publisher",
              "title": "Data Publisher"
            },
            {
              "const": "distributor",
              "title": "Distributor"
            },
            {
              "const": "funder",
              "title": "Funder"
            },
            {
              "const": "funder2",
              "title": "Funder 2"
            },
            {
              "const": "funder3",
              "title": "Funder 3"
            }
          ],
        },
         "name": {
            "type": "string",
            "title": "Name",
          },
          "phone": {
            "type": "string",
            "format": "phone",
            "title": "Telephone (primary)",
          },
          "email": {
            "type": "string",
            "format": "email",
            "title": "Email",
          },
          "url": {
            "type": "string",
            "title": "URL",
          },
          "affiliation": {
            "type": "string",
            "title": "Organization"
          }
      }
    }
  }
}

const getContributorRootId = (id: string): 'contributor' | 'contributors' | undefined => {
  const rootId = id.trim().split('.')[0]
  if (rootId === 'contributor' || rootId === 'contributors') {
    return rootId
  }
  return undefined
}

const isContributorFieldId = (id: string): boolean => getContributorRootId(id) !== undefined

const setContributorsSpecialCase = (
  properties: Record<string, JSONSchema6Definition>,
  rootKey: 'contributor' | 'contributors'
): void => {
  if (properties[rootKey] === undefined) {
    properties[rootKey] = contributorsSpecialCase()
  }
}

const isRequiredMetadataField = (field: IMetadataField): boolean => {
  const requirementStatus =
    typeof field.requirement_status === 'string' ? field.requirement_status.trim().toLowerCase() : ''
  return requirementStatus === 'required'
}

const markSchemaFieldRequired = (schema: JSONSchema6, field: IMetadataField): void => {
  const idPathParts = field.id
    .split('.')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)

  if (idPathParts.length === 0) {
    return
  }

  let currentSchema: JSONSchema6 = schema
  const metadataPath = (field.path ?? '').trim()

  if (metadataPath !== '') {
    const pathParts = metadataPath.split('/').filter((part) => part.trim() !== '')

    for (const rawPart of pathParts) {
      const isArrayPart = rawPart.endsWith('[]')
      const cleanPart = isArrayPart ? rawPart.slice(0, -2).trim() : rawPart.trim()
      const nextDefinition = currentSchema.properties?.[cleanPart]

      if (nextDefinition === undefined || typeof nextDefinition === 'boolean') {
        return
      }

      const nextSchema = nextDefinition
      if (isArrayPart) {
        const arrayItems = nextSchema.items
        if (arrayItems === undefined || Array.isArray(arrayItems) || typeof arrayItems === 'boolean') {
          return
        }
        currentSchema = arrayItems
      } else {
        currentSchema = nextSchema
      }
    }
  }

  for (let i = 0; i < idPathParts.length - 1; i += 1) {
    const part = idPathParts[i]
    const nextDefinition =
      currentSchema.properties?.[part] ?? (currentSchema as unknown as Record<string, JSONSchema6Definition>)[part]

    if (nextDefinition === undefined || typeof nextDefinition === 'boolean') {
      return
    }

    currentSchema = nextDefinition
  }

  const leafKey = idPathParts[idPathParts.length - 1]
  const hasLeaf =
    currentSchema.properties?.[leafKey] !== undefined ||
    (currentSchema as unknown as Record<string, JSONSchema6Definition>)[leafKey] !== undefined

  if (!hasLeaf) {
    return
  }

  const requiredSet = new Set(currentSchema.required ?? [])
  requiredSet.add(leafKey)
  currentSchema.required = Array.from(requiredSet)
}

export const parseMetadataFieldsIntoSchema = (fields: IMetadataField[]): JSONSchema6 => {
  const schema: JSONSchema6 = {
    type: 'object',
    $schema: 'http://json-schema.org/draft-06/schema#',
    title: 'COLLAB Water Level Metadata',
  }
  schema.properties = schema.properties ?? {}

  const byPath: Record<string, IMetadataField[]> = {}
  fields.forEach((f) => {
    const path = (f.path ?? '').trim()
    if (!byPath[path]) {
      byPath[path] = []
    }
    byPath[path].push(f)
  })

  Object.entries(byPath).forEach(([path, fields]) => {
    if (path === '') {
      fields.forEach((f) => {
        const contributorRoot = getContributorRootId(f.id)
        if (contributorRoot !== undefined) {
          setContributorsSpecialCase(
            schema.properties as Record<string, JSONSchema6Definition>,
            contributorRoot
          )
          return
        }
        const prop = fieldToSchemaProperty(f)
        schema.properties = schema.properties ?? {}
        setSchemaPropertyByIdPath(schema.properties, f.id, prop)
      })
    } else {
      const pathParts = path.split('/').filter((p) => p)
      let p = schema.properties as Record<string, JSONSchema6>
      pathParts.forEach((part, index) => {
        const isMultiple = part.match(/\[\]$/)
        const lastIndex = index >= pathParts.length - 1
        const cleanPart = (isMultiple ? part.slice(0, -2) : part).trim()

        if (isMultiple && p[cleanPart] === undefined) {
          p[cleanPart] = {
            type: 'array',
            items: {},
          }
        } else if (!isMultiple && p[cleanPart] === undefined) {
          p[cleanPart] = {
            type: 'object',
            properties: {},
          }
        }

        if (lastIndex) {
          /* fields.forEach(f => {
            const prop = fieldToSchemaProperty(f)
            propsOb[f.id] = prop
          }) */
          const propsOb =
            p[cleanPart].type === 'array'
              ? (p[cleanPart].items as Record<string, JSONSchema6>)
              : (p[cleanPart].properties as Record<string, JSONSchema6>)

          const propsObRecord = propsOb as Record<string, JSONSchema6Definition>
          const contributorFields = fields.filter((f) => isContributorFieldId(f.id))
          if (contributorFields.length > 0) {
            const contributorRoot = getContributorRootId(contributorFields[0].id) ?? 'contributor'
            setContributorsSpecialCase(propsObRecord, contributorRoot)
          }

          const nonContributorFields = fields.filter((f) => !isContributorFieldId(f.id))
          if (nonContributorFields.length === 0) {
            return
          }

          const shouldBeSingleProperty = nonContributorFields.length === 1
          if (shouldBeSingleProperty) {
            const onlyField = nonContributorFields[0]
            const propsObRecord = propsOb as Record<string, JSONSchema6Definition>
            setSchemaPropertyByIdPath(propsObRecord, onlyField.id, fieldToSchemaProperty(onlyField))
          } else {
            nonContributorFields.forEach((f) => {
              const prop = fieldToSchemaProperty(f, path)
              const propsObRecord = propsOb as Record<string, any>
              propsObRecord.properties = propsObRecord.properties ?? {}
              propsObRecord.type = 'object'
              setSchemaPropertyByIdPath(
                propsObRecord.properties as Record<string, JSONSchema6Definition>,
                f.id,
                prop
              )
            })
          }
        } else {
          p = (p[cleanPart].properties ?? p[cleanPart].items) as Record<string, JSONSchema6>
        }
      })
    }
  })

  // Apply required flags after schema structure is fully built.
  fields.filter((field) => isRequiredMetadataField(field)).forEach((field) => {
    markSchemaFieldRequired(schema, field)
  })

  /* fields.forEach(f => {
    schema.properties = schema.properties ?? {}
    const prop = fieldToSchemaProperty(f)
    if (f.path !== null && f.path !== '') {
      const pathParts = f.path.split('/').filter(p => p)
      let p = schema.properties as Record<string, JSONSchema6>
      pathParts.forEach(part => {
        const isMultiple = part.match(/\[\]$/)
        const cleanPart = isMultiple ? part.slice(0, -2) : part
        if (!p[cleanPart]) {
          p[cleanPart] = isMultiple
            ? {
                type: 'array',
                items: {}
              }
            : {
                type: 'object',
                properties: {}
              }
        }
        p = isMultiple ? (p[cleanPart].items as Record<string, JSONSchema6>) : (p[cleanPart].properties as Record<string, JSONSchema6>)
      })
    } else {
      (schema.properties as Record<string, JSONSchema6>)[f.id] = prop
    }
  }) */
  console.log('SCHEMA', schema)
  return schema
}

const createFieldOverrideFromMetadataField = (field: IMetadataField): IFormFieldOverride => {
  const path = (field.path ?? '')
    .trim()
    .replace(/^\//, '')
    .replace(/\//g, '.')
    .replace(/\[\]/g, '')
  const fO: IFormFieldOverride = {
    prop: path.length ? `${path}.${field.id}` : field.id,
  }
  if (field.response_type && field.response_type.toLowerCase().includes('upload')) {
    fO.type = 'file_upload'
  }
  const options = [
    field.option1,
    field.option2,
    field.option3,
    field.option4,
    field.option5,
    field.option6,
    field.option7,
    field.option8
  ].filter(o => o !== null && o !== '' && o !== undefined) as string[]
  if(options.length && options.find(o => o.toLowerCase() === 'other')) {
    console.log('setting selectorOrText for', field.id, 'options', options)
    fO.type = 'selectOrText'
  }
  if(field.example && field.example.trim() !== '') {
    fO.example = field.example
    console.log('adding placeholder for', field.id, 'placeholder', field.example)
  }
  return fO
}

export const parseFormSections = (
  fields: IMetadataField[],
  sections: IMetadataFormSection[],
  groupings: IFormGrouping[]
): IFormSectionOverride[] => {
  const fieldsBySection: Record<string, IMetadataField[]> = {}
  const sectionsByLabel = Object.fromEntries(sections.map((s) => [s.label, s]))
  const sectionsById = Object.fromEntries(sections.map((s) => [s.id, s]))
  fields.forEach((f) => {
    const sectionId = sectionsByLabel[f.form_section]?.id ?? f.form_section
    if (!fieldsBySection[sectionId]) {
      fieldsBySection[sectionId] = []
    }
    fieldsBySection[sectionId].push(f)
  })
  const groupingsById = Object.fromEntries(groupings.map((g) => [g.id, g]))

  return sections
    .sort((a, b) => a.order - b.order)
    .map((s) => {
      const section: IFormSectionOverride = {
        id: s.id,
        label: s.label,
        description: s.description ?? undefined,
      }
      const fields = fieldsBySection[s.id] ?? []
      const hasTabs = fields.some((f) => f.secondary_form_section)
      if (hasTabs) {
        const fieldsBySecondarySection: Record<string, IMetadataField[]> = {}
        const fieldsByPath: Record<string, IMetadataField[]> = {}
        const fieldsByGrouping: Record<string, IMetadataField[]> = {}
        fields.forEach((f) => {
          const secondarySectionId =
            sectionsByLabel[f.secondary_form_section ?? 'Other']?.id ??
            f.secondary_form_section ??
            'other'
          if (!fieldsBySecondarySection[secondarySectionId]) {
            fieldsBySecondarySection[secondarySectionId] = []
          }
          fieldsBySecondarySection[secondarySectionId].push(f)
          if (!fieldsByPath[f.path ?? '']) {
            fieldsByPath[f.path ?? ''] = []
          }
          fieldsByPath[f.path ?? ''].push(f)
          if (f.field_grouping && groupingsById[f.field_grouping]) {
            fieldsByGrouping[f.field_grouping] = fieldsByGrouping[f.field_grouping] ?? []
            fieldsByGrouping[f.field_grouping].push(f)
          }
        })

        const tabs = Object.keys(fieldsBySecondarySection)
          .sort((a, b) => {
            const orderA = sectionsById[a]?.order ?? Number.MAX_SAFE_INTEGER
            const orderB = sectionsById[b]?.order ?? Number.MAX_SAFE_INTEGER
            return orderA - orderB
          })
          .map((secondarySectionId) => {
            const secondarySectionLabel =
              sectionsById[secondarySectionId]?.label ?? secondarySectionId
            const secondarySectionFields = fieldsBySecondarySection[secondarySectionId]
            return {
              id: secondarySectionId,
              label: secondarySectionLabel,
              fields: secondarySectionFields.map(createFieldOverrideFromMetadataField),
            } satisfies IFormSectionOverride
          })

        if (Object.keys(fieldsByPath).length === 1 && Object.keys(fieldsByPath)[0].match(/\[\]$/)) {
          const path = Object.keys(fieldsByPath)[0]
            .replace(/\[\]$/, '')
            .replace(/^\//, '')
            .replace(/\//g, '.')
          const objectFieldWithTabs: IObjectFormFieldOverride = {
            prop: path,
            type: 'object',
            // multiple: true,
            tabs,
          }
          section.fields = [objectFieldWithTabs]
        } else {
          section.tabs = tabs
        }
      } else {
        section.fields = fields.map(createFieldOverrideFromMetadataField)
      }
      return section
    })
    .filter((s) => s.fields?.length ?? s.wizard_steps?.length ?? s.pages?.length ?? s.tabs?.length) // Filter out sections with no fields
}
