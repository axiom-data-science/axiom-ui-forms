import { type IFormSectionOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { type IMetadataFormSection, type IMetadataField } from ***REMOVED***@/WaterLevel/COLLAB/types***REMOVED***
import { type JSONSchema6 } from ***REMOVED***json-schema***REMOVED***

const COLLAB_ROOT = ***REMOVED***https://docs.google.com/spreadsheets/d/e/2PACX-1vRcD83QFtU6UeW5KwMt0qDYWtLoDWzRbw1dKZI5ntOhevndBL1CyxtSvBXgg7vREdmVCvDgnw4fbSrq/pub?output=tsv***REMOVED***
const METADATA_SHEET = `${COLLAB_ROOT}&gid=0`
const FORM_SECTIONS_SHEET = `${COLLAB_ROOT}&gid=1566055209`

export const loadSheet = async <T>(url: string, emptyHeaderRows: number = 0): Promise<T[]> => {
  const j = await (await fetch(url)).text()
  return parseSheet<T>(j, emptyHeaderRows)
}

export const parseSheet = <T>(sheetData: string, emptyHeaderRows: number = 0): T[] => {
  const rows = sheetData.trim().split(***REMOVED***\n***REMOVED***).slice(emptyHeaderRows)
  const headers = rows[0].split(***REMOVED***\t***REMOVED***).map(h => h.trim())
  const formattedRows: T[] = rows.slice(1).map(r => {
    const values = r.split(***REMOVED***\t***REMOVED***)
    const o: any = {}
    headers.forEach((header, index) => {
      const v = values[index]
      o[header] = v === ***REMOVED***TRUE***REMOVED***
        ? true
        : v === ***REMOVED***FALSE***REMOVED***
          ? false
          : v === ***REMOVED***null***REMOVED***
            ? null
            : v === ***REMOVED******REMOVED***
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
    type: ***REMOVED***object***REMOVED***,
    $schema: ***REMOVED***http://json-schema.org/draft-06/schema#***REMOVED***,
    title: ***REMOVED***COLLAB Water Level Metadata***REMOVED***
  }
  fields.forEach(f => {
    const options = [f.option1, f.option2, f.option3, f.option4, f.option5, f.option6, f.option7, f.option8].filter(o => o !== null)
    const optionsToUse = options.length > 0 ? options.filter(o => o !== ***REMOVED***Other***REMOVED***) : []
    const optionsIncludesOther = options.some(o => o && o.toLowerCase() === ***REMOVED***other***REMOVED***) || (f.response_type === "Multichoice with ***REMOVED***other***REMOVED*** option" && optionsToUse.length > 0)
    const useAnyOf = optionsIncludesOther && options.length > 0
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
      format: f.response_type === ***REMOVED***DateTime***REMOVED***
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
      enum: options.length > 0 ? options : undefined
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
        const secondarySectionId = sectionsByLabel[f.secondary_form_section ?? ***REMOVED***Other***REMOVED***]?.id ?? f.secondary_form_section ?? ***REMOVED***other***REMOVED***
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
