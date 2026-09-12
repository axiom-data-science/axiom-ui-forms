import {
  type IObjectFormFieldOverride,
  type IFormSectionOverride,
  type IFormFieldOverride,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type IMetadataFormSection, type IMetadataField } from ***REMOVED***@/WaterLevel/COLLAB/types***REMOVED***
import { type JSONSchema6, type JSONSchema6Definition } from ***REMOVED***json-schema***REMOVED***

const COLLAB_ROOT =
  ***REMOVED***https://docs.google.com/spreadsheets/d/e/2PACX-1vRcD83QFtU6UeW5KwMt0qDYWtLoDWzRbw1dKZI5ntOhevndBL1CyxtSvBXgg7vREdmVCvDgnw4fbSrq/pub?output=tsv***REMOVED***
const METADATA_SHEET = `${COLLAB_ROOT}&gid=0`
const FORM_SECTIONS_SHEET = `${COLLAB_ROOT}&gid=1566055209`
const FORM_GROUPINGS_SHEET = `${COLLAB_ROOT}&gid=68809768`

export const loadSheet = async <T>(url: string, emptyHeaderRows: number = 0): Promise<T[]> => {
  const j = await (await fetch(url)).text()
  return parseSheet<T>(j, emptyHeaderRows)
}

export const parseSheet = <T>(sheetData: string, emptyHeaderRows: number = 0): T[] => {
  const rows = sheetData.trim().split(***REMOVED***\n***REMOVED***).slice(emptyHeaderRows)
  const headers = rows[0].split(***REMOVED***\t***REMOVED***).map((h) => h.trim())
  const formattedRows: T[] = rows
    .slice(1)
    .filter((r) => r.split(/\t/)[0].trim() !== ***REMOVED******REMOVED***)
    .map((r) => {
      const values = r.split(***REMOVED***\t***REMOVED***)
      const o: any = {}
      headers.forEach((header, index) => {
        const v = values[index]
        o[header] =
          v === ***REMOVED***TRUE***REMOVED*** ? true : v === ***REMOVED***FALSE***REMOVED*** ? false : v === ***REMOVED***null***REMOVED*** ? null : v === ***REMOVED******REMOVED*** ? null : v
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
  layout?: IFormSectionOverride[***REMOVED***layout***REMOVED***]
}

export const getFormGroupings = async (): Promise<IFormGrouping[]> => {
  const groupings = await loadSheet<IMetadataFormSection>(FORM_GROUPINGS_SHEET)
  return groupings.filter((g) => g.id && g.id.trim() !== ***REMOVED******REMOVED***) as IFormGrouping[]
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
    .filter((o) => o !== null && o !== ***REMOVED******REMOVED***)
    .map((o) => o?.split(***REMOVED***; ***REMOVED***))
    .flat(Infinity) as string[]
  // const optionsToUse = options.length > 0 ? options.filter(o => o !== ***REMOVED***Other***REMOVED***) : []
  // const optionsIncludesOther = options.some(o => o && o.toLowerCase() === ***REMOVED***other***REMOVED***) || (f.response_type === "Multichoice with ***REMOVED***other***REMOVED*** option" && optionsToUse.length > 0)
  // const useAnyOf = optionsIncludesOther && options.length > 0
  // Ensure type is JSONSchema6TypeName
  let type: JSONSchema6[***REMOVED***type***REMOVED***]
  if (
    f.response_type === null ||
    /Text/i.test(f.response_type) ||
    /Link/i.test(f.response_type) ||
    /Email/i.test(f.response_type) ||
    /Phone/i.test(f.response_type) ||
    /Date/i.test(f.response_type)
  ) {
    type = ***REMOVED***string***REMOVED***
  } else if (/Number/i.test(f.response_type)) {
    type = ***REMOVED***number***REMOVED***
  } else if (/Boolean/i.test(f.response_type)) {
    type = ***REMOVED***boolean***REMOVED***
  } else {
    type = ***REMOVED***string***REMOVED***
  }

  const prop: JSONSchema6 = {
    type,
    format:
      f.response_type === ***REMOVED***DateTime***REMOVED***
        ? ***REMOVED***datetime***REMOVED***
        : f.response_type === ***REMOVED***Date***REMOVED***
          ? ***REMOVED***date***REMOVED***
          : f.response_type === ***REMOVED***Email***REMOVED***
            ? ***REMOVED***email***REMOVED***
            : f.response_type === ***REMOVED***Phone number***REMOVED***
              ? ***REMOVED***phone***REMOVED***
              : f.response_type === ***REMOVED***Link***REMOVED***
                ? ***REMOVED***uri***REMOVED***
                : undefined,
    title: f.label,
    description: f.description ?? undefined,
    enum: options.length > 0 && type === ***REMOVED***string***REMOVED*** ? options : undefined,
    /* anyOf: useAnyOf
        ? [
            {
              type: ***REMOVED***string***REMOVED***,
              enum: optionsToUse
            },
            {
              type: ***REMOVED***string***REMOVED***
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
    .split(***REMOVED***.***REMOVED***)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)

  if (pathParts.length === 0) {
    return
  }

  let currentProps = properties
  for (let i = 0; i < pathParts.length - 1; i += 1) {
    const part = pathParts[i]
    const existing = currentProps[part]

    if (existing === undefined || typeof existing === ***REMOVED***boolean***REMOVED***) {
      currentProps[part] = {
        type: ***REMOVED***object***REMOVED***,
        properties: {},
      }
    } else if (existing.type !== ***REMOVED***object***REMOVED*** || existing.properties === undefined) {
      currentProps[part] = {
        ...existing,
        type: ***REMOVED***object***REMOVED***,
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
    type: ***REMOVED***object***REMOVED***,
    additionalProperties: {
      type: ***REMOVED***object***REMOVED***,
      properties: {
        role: {
          type: ***REMOVED***string***REMOVED***,
          title: ***REMOVED***Contributor role***REMOVED***,
          enum: [
            {
              const: ***REMOVED***owner***REMOVED***,
              title: ***REMOVED***Owner***REMOVED***,
              description: ***REMOVED***Party that owns the resource.\n - ***AOOS******REMOVED***,
            },
            {
              const: ***REMOVED***funder***REMOVED***,
              title: ***REMOVED***Funder***REMOVED***,
              description:
                ***REMOVED***Party providing monetary support for the resource.\n - ***AOOS***\n - ***USGS******REMOVED***,
            },
            {
              const: ***REMOVED***custodian***REMOVED***,
              title: ***REMOVED***Custodian***REMOVED***,
              description:
                ***REMOVED***Party that accepts accountability and responsibility for the data, and ensures appropriate care and maintenance of the resource.\n - ***JOA Surveys** (the organization that is servicing the station)****REMOVED***,
            },
            {
              const: ***REMOVED***community_poc***REMOVED***,
              title: ***REMOVED***Community Point of Contact***REMOVED***,
              description:
                ***REMOVED***Name of community contact, if applicable. This information is **not reported to ERDDAP**. It is only recorded for RA project tracking purposes.\n - ***Person ABC** (the POC who is aware of the station or provides access to the site)****REMOVED***,
            },
            {
              const: ***REMOVED***publisher***REMOVED***,
              title: ***REMOVED***Data Publisher***REMOVED***,
              description:
                ***REMOVED***Party who published the resource.\n - ***JOA Surveys** (The organization that shares the data via API or other access point)****REMOVED***,
            },
            {
              const: ***REMOVED***processor***REMOVED***,
              title: ***REMOVED***Data Processor***REMOVED***,
              description:
                ***REMOVED***Party that has processed the data in a manner such that the resource has been modified.\n - ***Tetra Tech******REMOVED***,
            },
            {
              const: ***REMOVED***distributor***REMOVED***,
              title: ***REMOVED***Distributor***REMOVED***,
              description:
                ***REMOVED***Party who distributes the resource. Example, Hohonu, Divirod, etc. These distributors provide a packaged instrument, not a single sensor.\n - ***Hohonu******REMOVED***,
            },
          ],
        },
        name: {
          type: ***REMOVED***string***REMOVED***,
          title: ***REMOVED***Name***REMOVED***,
        },
        phone: {
          type: ***REMOVED***string***REMOVED***,
          format: ***REMOVED***phone***REMOVED***,
          title: ***REMOVED***Telephone (primary)***REMOVED***,
        },
        email: {
          type: ***REMOVED***string***REMOVED***,
          format: ***REMOVED***email***REMOVED***,
          title: ***REMOVED***Email***REMOVED***,
        },
        url: {
          type: ***REMOVED***string***REMOVED***,
          title: ***REMOVED***URL***REMOVED***,
        },
        affiliation: {
          type: ***REMOVED***string***REMOVED***,
          title: ***REMOVED***Organization***REMOVED***,
        },
      },
    },
  }
}

const getContributorRootId = (id: string): ***REMOVED***contributor***REMOVED*** | ***REMOVED***contributors***REMOVED*** | undefined => {
  const rootId = id.trim().split(***REMOVED***.***REMOVED***)[0]
  if (rootId === ***REMOVED***contributor***REMOVED*** || rootId === ***REMOVED***contributors***REMOVED***) {
    return rootId
  }
  return undefined
}

const isContributorFieldId = (id: string): boolean => getContributorRootId(id) !== undefined

const setContributorsSpecialCase = (
  properties: Record<string, JSONSchema6Definition>,
  rootKey: ***REMOVED***contributor***REMOVED*** | ***REMOVED***contributors***REMOVED***
): void => {
  if (properties[rootKey] === undefined) {
    properties[rootKey] = contributorsSpecialCase()
  }
}

const isRequiredMetadataField = (field: IMetadataField): boolean => {
  const requirementStatus =
    typeof field.requirement_status === ***REMOVED***string***REMOVED***
      ? field.requirement_status.trim().toLowerCase()
      : ***REMOVED******REMOVED***
  return requirementStatus === ***REMOVED***required***REMOVED***
}

const markSchemaFieldRequired = (schema: JSONSchema6, field: IMetadataField): void => {
  const idPathParts = field.id
    .split(***REMOVED***.***REMOVED***)
    .map((part) => part.trim())
    .filter((part) => part.length > 0)

  if (idPathParts.length === 0) {
    return
  }

  let currentSchema: JSONSchema6 = schema
  const metadataPath = (field.path ?? ***REMOVED******REMOVED***).trim()

  if (metadataPath !== ***REMOVED******REMOVED***) {
    const pathParts = metadataPath.split(***REMOVED***/***REMOVED***).filter((part) => part.trim() !== ***REMOVED******REMOVED***)

    for (const rawPart of pathParts) {
      const isArrayPart = rawPart.endsWith(***REMOVED***[]***REMOVED***)
      const cleanPart = isArrayPart ? rawPart.slice(0, -2).trim() : rawPart.trim()
      const nextDefinition = currentSchema.properties?.[cleanPart]

      if (nextDefinition === undefined || typeof nextDefinition === ***REMOVED***boolean***REMOVED***) {
        return
      }

      const nextSchema = nextDefinition
      if (isArrayPart) {
        const arrayItems = nextSchema.items
        if (
          arrayItems === undefined ||
          Array.isArray(arrayItems) ||
          typeof arrayItems === ***REMOVED***boolean***REMOVED***
        ) {
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
      currentSchema.properties?.[part] ??
      (currentSchema as unknown as Record<string, JSONSchema6Definition>)[part]

    if (nextDefinition === undefined || typeof nextDefinition === ***REMOVED***boolean***REMOVED***) {
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
    type: ***REMOVED***object***REMOVED***,
    $schema: ***REMOVED***http://json-schema.org/draft-06/schema#***REMOVED***,
    title: ***REMOVED***COLLAB Water Level Metadata***REMOVED***,
  }
  schema.properties = schema.properties ?? {}

  const byPath: Record<string, IMetadataField[]> = {}
  fields.forEach((f) => {
    const path = (f.path ?? ***REMOVED******REMOVED***).trim()
    if (!byPath[path]) {
      byPath[path] = []
    }
    byPath[path].push(f)
  })

  Object.entries(byPath).forEach(([path, fields]) => {
    if (path === ***REMOVED******REMOVED***) {
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
      const pathParts = path
        .split(***REMOVED***/***REMOVED***)
        .map((part) => part.trim())
        .filter((part) => part.length > 0)

      let currentProps = schema.properties as Record<string, JSONSchema6Definition>

      pathParts.forEach((part) => {
        const isMultiple = /\[\]$/.test(part)
        const cleanPart = (isMultiple ? part.slice(0, -2) : part).trim()
        const existing = currentProps[cleanPart]

        if (isMultiple) {
          if (
            existing === undefined ||
            typeof existing === ***REMOVED***boolean***REMOVED*** ||
            existing.type !== ***REMOVED***array***REMOVED***
          ) {
            currentProps[cleanPart] = {
              type: ***REMOVED***array***REMOVED***,
              items: {
                type: ***REMOVED***object***REMOVED***,
                properties: {},
              },
            }
          }

          const arraySchema = currentProps[cleanPart] as JSONSchema6
          const existingItems = arraySchema.items
          if (
            existingItems === undefined ||
            Array.isArray(existingItems) ||
            typeof existingItems === ***REMOVED***boolean***REMOVED***
          ) {
            arraySchema.items = {
              type: ***REMOVED***object***REMOVED***,
              properties: {},
            }
          }
          const itemSchema = arraySchema.items as JSONSchema6
          itemSchema.type = itemSchema.type ?? ***REMOVED***object***REMOVED***
          itemSchema.properties = itemSchema.properties ?? {}
          currentProps = itemSchema.properties as Record<string, JSONSchema6Definition>
        } else {
          if (
            existing === undefined ||
            typeof existing === ***REMOVED***boolean***REMOVED*** ||
            existing.type !== ***REMOVED***object***REMOVED*** ||
            existing.properties === undefined
          ) {
            currentProps[cleanPart] = {
              type: ***REMOVED***object***REMOVED***,
              properties: {},
            }
          }

          const objectSchema = currentProps[cleanPart] as JSONSchema6
          objectSchema.type = ***REMOVED***object***REMOVED***
          objectSchema.properties = objectSchema.properties ?? {}
          currentProps = objectSchema.properties as Record<string, JSONSchema6Definition>
        }
      })

      const contributorFields = fields.filter((f) => isContributorFieldId(f.id))
      if (contributorFields.length > 0) {
        const contributorRoot = getContributorRootId(contributorFields[0].id) ?? ***REMOVED***contributor***REMOVED***
        setContributorsSpecialCase(currentProps, contributorRoot)
      }

      fields
        .filter((f) => !isContributorFieldId(f.id))
        .forEach((f) => {
          setSchemaPropertyByIdPath(currentProps, f.id, fieldToSchemaProperty(f, path))
        })
    }
  })

  // Apply required flags after schema structure is fully built.
  fields
    .filter((field) => isRequiredMetadataField(field))
    .forEach((field) => {
      markSchemaFieldRequired(schema, field)
    })

  /* fields.forEach(f => {
    schema.properties = schema.properties ?? {}
    const prop = fieldToSchemaProperty(f)
    if (f.path !== null && f.path !== ***REMOVED******REMOVED***) {
      const pathParts = f.path.split(***REMOVED***/***REMOVED***).filter(p => p)
      let p = schema.properties as Record<string, JSONSchema6>
      pathParts.forEach(part => {
        const isMultiple = part.match(/\[\]$/)
        const cleanPart = isMultiple ? part.slice(0, -2) : part
        if (!p[cleanPart]) {
          p[cleanPart] = isMultiple
            ? {
                type: ***REMOVED***array***REMOVED***,
                items: {}
              }
            : {
                type: ***REMOVED***object***REMOVED***,
                properties: {}
              }
        }
        p = isMultiple ? (p[cleanPart].items as Record<string, JSONSchema6>) : (p[cleanPart].properties as Record<string, JSONSchema6>)
      })
    } else {
      (schema.properties as Record<string, JSONSchema6>)[f.id] = prop
    }
  }) */
  console.log(***REMOVED***SCHEMA***REMOVED***, schema)
  return schema
}

const createFieldOverrideFromMetadataField = (field: IMetadataField): IFormFieldOverride => {
  const path = (field.path ?? ***REMOVED******REMOVED***).trim().replace(/^\//, ***REMOVED******REMOVED***).replace(/\//g, ***REMOVED***.***REMOVED***).replace(/\[\]/g, ***REMOVED******REMOVED***)
  const fO: IFormFieldOverride = {
    prop: path.length ? `${path}.${field.id}` : field.id,
  }
  if (field.response_type && field.response_type.toLowerCase().includes(***REMOVED***upload***REMOVED***)) {
    fO.type = ***REMOVED***file_upload***REMOVED***
  }
  const options = [
    field.option1,
    field.option2,
    field.option3,
    field.option4,
    field.option5,
    field.option6,
    field.option7,
    field.option8,
  ].filter((o) => o !== null && o !== ***REMOVED******REMOVED*** && o !== undefined) as string[]
  if (options.length && options.find((o) => o.toLowerCase() === ***REMOVED***other***REMOVED***)) {
    console.log(***REMOVED***setting selectorOrText for***REMOVED***, field.id, ***REMOVED***options***REMOVED***, options)
    fO.type = ***REMOVED***selectOrText***REMOVED***
  }
  if (field.example && field.example.trim() !== ***REMOVED******REMOVED***) {
    if (!field.example.match(/^Ex/i)) {
      console.log(***REMOVED***Adding Ex: for***REMOVED***, field.id)
    }
    fO.example = !field.example.match(/^Ex/i) ? `Ex: ${field.example}` : field.example
    console.log(***REMOVED***adding placeholder for***REMOVED***, field.id, ***REMOVED***placeholder***REMOVED***, field.example)
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
            sectionsByLabel[f.secondary_form_section ?? ***REMOVED***Other***REMOVED***]?.id ??
            f.secondary_form_section ??
            ***REMOVED***other***REMOVED***
          if (!fieldsBySecondarySection[secondarySectionId]) {
            fieldsBySecondarySection[secondarySectionId] = []
          }
          fieldsBySecondarySection[secondarySectionId].push(f)
          if (!fieldsByPath[f.path ?? ***REMOVED******REMOVED***]) {
            fieldsByPath[f.path ?? ***REMOVED******REMOVED***] = []
          }
          fieldsByPath[f.path ?? ***REMOVED******REMOVED***].push(f)
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
            .replace(/\[\]$/, ***REMOVED******REMOVED***)
            .replace(/^\//, ***REMOVED******REMOVED***)
            .replace(/\//g, ***REMOVED***.***REMOVED***)
          const objectFieldWithTabs: IObjectFormFieldOverride = {
            prop: path,
            type: ***REMOVED***object***REMOVED***,
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
