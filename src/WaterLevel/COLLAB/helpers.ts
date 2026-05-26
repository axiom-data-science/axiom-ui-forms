import {
  type IObjectFormFieldOverride,
  type IFormSectionOverride,
} from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type IMetadataFormSection, type IMetadataField } from ***REMOVED***@/WaterLevel/COLLAB/types***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***

const COLLAB_ROOT =
  ***REMOVED***https://docs.google.com/spreadsheets/d/e/2PACX-1vRcD83QFtU6UeW5KwMt0qDYWtLoDWzRbw1dKZI5ntOhevndBL1CyxtSvBXgg7vREdmVCvDgnw4fbSrq/pub?output=tsv***REMOVED***
const METADATA_SHEET = `${COLLAB_ROOT}&gid=0`
const FORM_SECTIONS_SHEET = `${COLLAB_ROOT}&gid=1566055209`

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
  return parseFormSections(
    fields.filter((f) => f.id && !f.remove_field),
    sections
  )
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
  ].filter((o) => o !== null)
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

export const parseMetadataFieldsIntoSchema = (fields: IMetadataField[]): JSONSchema6 => {
  const schema: JSONSchema6 = {
    type: ***REMOVED***object***REMOVED***,
    $schema: ***REMOVED***http://json-schema.org/draft-06/schema#***REMOVED***,
    title: ***REMOVED***COLLAB Water Level Metadata***REMOVED***,
  }

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
        const prop = fieldToSchemaProperty(f)
        schema.properties = schema.properties ?? {}
        schema.properties[f.id] = prop
      })
    } else {
      const pathParts = path.split(***REMOVED***/***REMOVED***).filter((p) => p)
      let p = schema.properties as Record<string, JSONSchema6>
      pathParts.forEach((part, index) => {
        const isMultiple = part.match(/\[\]$/)
        const lastIndex = index >= pathParts.length - 1
        const isObject = fields.length > 1
        const cleanPart = (isMultiple ? part.slice(0, -2) : part).trim()

        if (isMultiple && p[cleanPart] === undefined) {
          p[cleanPart] = {
            type: ***REMOVED***array***REMOVED***,
            items: {},
          }
        } else if (!isMultiple && p[cleanPart] === undefined) {
          p[cleanPart] = {
            type: ***REMOVED***object***REMOVED***,
            properties: {},
          }
        }

        if (lastIndex) {
          /* fields.forEach(f => {
            const prop = fieldToSchemaProperty(f)
            propsOb[f.id] = prop
          }) */
          const propsOb =
            p[cleanPart].type === ***REMOVED***array***REMOVED***
              ? (p[cleanPart].items as Record<string, JSONSchema6>)
              : (p[cleanPart].properties as Record<string, JSONSchema6>)
          if (!isObject && isMultiple) {
            propsOb[fields[0].id] = fieldToSchemaProperty(fields[0])
          } else {
            fields.forEach((f) => {
              const prop = fieldToSchemaProperty(f, path)
              const propsObRecord = propsOb as Record<string, any>
              propsObRecord.properties = propsObRecord.properties ?? {}
              propsObRecord.type = ***REMOVED***object***REMOVED***
              propsObRecord.properties[f.id] = prop
            })
          }
        } else {
          p = (p[cleanPart].properties ?? p[cleanPart].items) as Record<string, JSONSchema6>
        }
      })
    }
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

export const parseFormSections = (
  fields: IMetadataField[],
  sections: IMetadataFormSection[]
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
              fields: secondarySectionFields.map((f) => ({
                prop: f.id,
              })),
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
            multiple: true,
            tabs,
          }
          section.fields = [objectFieldWithTabs]
        } else {
          section.tabs = tabs
        }
      } else {
        section.fields = fields.map((f) => ({
          prop: f.id,
        }))
      }
      return section
    })
    .filter((s) => s.fields?.length ?? s.wizard_steps?.length ?? s.pages?.length ?? s.tabs?.length) // Filter out sections with no fields
}
