import { type IFormSectionOverride } from '@/Form/Creator/FormCreatorTypes'
import { type IMetadataFormSection, type IMetadataField } from '@/WaterLevel/COLLAB/types'
import { type JSONSchema6 } from 'json-schema'

const COLLAB_ROOT = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRcD83QFtU6UeW5KwMt0qDYWtLoDWzRbw1dKZI5ntOhevndBL1CyxtSvBXgg7vREdmVCvDgnw4fbSrq/pub?output=tsv'
const METADATA_SHEET = `${COLLAB_ROOT}&gid=0`
const FORM_SECTIONS_SHEET = `${COLLAB_ROOT}&gid=1566055209`

export const loadSheet = async <T>(url: string, emptyHeaderRows: number = 0): Promise<T[]> => {
  const j = await (await fetch(url)).text()
  return parseSheet<T>(j, emptyHeaderRows)
}

export const parseSheet = <T>(sheetData: string, emptyHeaderRows: number = 0): T[] => {
  const rows = sheetData.trim().split('\n').slice(emptyHeaderRows)
  const headers = rows[0].split('\t').map(h => h.trim())
  const formattedRows: T[] = rows.slice(1).map(r => {
    const values = r.split('\t')
    const o: any = {}
    headers.forEach((header, index) => {
      const v = values[index]
      o[header] = v === 'TRUE'
        ? true
        : v === 'FALSE'
          ? false
          : v === 'null'
            ? null
            : v === ''
              ? null
              : v
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
  return parseMetadataFieldsIntoSchema(fields)
}

export const getFormSections = async (): Promise<IFormSectionOverride[]> => {
  const sections = await loadSheet<IMetadataFormSection>(FORM_SECTIONS_SHEET)
  const fields = await getMetadataFields()
  return parseFormSections(fields, sections)
}

export const parseMetadataFieldsIntoSchema = (fields: IMetadataField[]): JSONSchema6 => {
  const schema: JSONSchema6 = {
    type: 'object',
    $schema: 'http://json-schema.org/draft-06/schema#',
    title: 'COLLAB Water Level Metadata'
  }
  fields.forEach(f => {
    const options = [f.option1, f.option2, f.option3, f.option4, f.option5, f.option6, f.option7, f.option8].filter(o => o !== null)
    const optionsToUse = options.length > 0 ? options.filter(o => o !== 'Other') : []
    const optionsIncludesOther = options.some(o => o && o.toLowerCase() === 'other') || (f.response_type === "Multichoice with 'other' option" && optionsToUse.length > 0)
    const useAnyOf = optionsIncludesOther && options.length > 0
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
      format: f.response_type === 'DateTime'
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
      enum: options.length > 0 ? options : undefined
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
    schema.properties = schema.properties ?? {};
    (schema.properties as Record<string, JSONSchema6>)[f.id] = prop
  })
  return schema
}

export const parseFormSections = (fields: IMetadataField[], sections: IMetadataFormSection[]): IFormSectionOverride[] => {
  const fieldsBySection: Record<string, IMetadataField[]> = {}
  const sectionsByLabel = Object.fromEntries(sections.map(s => [s.label, s]))
  const sectionsById = Object.fromEntries(sections.map(s => [s.id, s]))
  fields.forEach(f => {
    const sectionId = sectionsByLabel[f.form_section]?.id ?? f.form_section
    if (!fieldsBySection[sectionId]) {
      fieldsBySection[sectionId] = []
    }
    fieldsBySection[sectionId].push(f)
  })

  return sections.sort((a, b) => a.order - b.order).map(s => {
    const section: IFormSectionOverride = {
      id: s.id,
      label: s.label,
      description: s.description ?? undefined
    }
    const fields = fieldsBySection[s.id] ?? []
    const hasSections = fields.some(f => f.secondary_form_section)
    if (hasSections) {
      const fieldsBySecondarySection: Record<string, IMetadataField[]> = {}
      fields.forEach(f => {
        const secondarySectionId = sectionsByLabel[f.secondary_form_section ?? 'Other']?.id ?? f.secondary_form_section ?? 'other'
        if (!fieldsBySecondarySection[secondarySectionId]) {
          fieldsBySecondarySection[secondarySectionId] = []
        }
        fieldsBySecondarySection[secondarySectionId].push(f)
      })
      section.wizard_steps = Object.keys(fieldsBySecondarySection)
        .sort((a, b) => {
          const orderA = sectionsById[a]?.order ?? Number.MAX_SAFE_INTEGER
          const orderB = sectionsById[b]?.order ?? Number.MAX_SAFE_INTEGER
          return orderA - orderB
        })
        .map(secondarySectionId => {
          const secondarySectionLabel = sectionsById[secondarySectionId]?.label ?? secondarySectionId
          const secondarySectionFields = fieldsBySecondarySection[secondarySectionId]
          return {
            id: secondarySectionId,
            label: secondarySectionLabel,
            fields: secondarySectionFields.map(f => ({
              prop: f.id
            }))
          } satisfies IFormSectionOverride
        })
    } else {
      section.fields = fields.map(f => ({
        prop: f.id
      }))
    }
    return section
  })
}
