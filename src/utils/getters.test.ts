import { describe, it, expect } from ***REMOVED***vitest***REMOVED***
import {
  makeJsonPath,
  getChildFields,
  getFields,
  getValueFromPath,
  getFieldValue,
  getPathFromField,
  getFieldsFromFormSection,
  getFormPayload
} from ***REMOVED***./getters***REMOVED***
import { type IFormSection, type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { overridesAndSchemaToFormObject } from ***REMOVED***./schemaToFormHelpers***REMOVED***
import type { JSONSchema6 } from ***REMOVED***json-schema***REMOVED***

describe(***REMOVED***getters.ts***REMOVED***, () => {
  describe(***REMOVED***makeJsonPath***REMOVED***, () => {
    it(***REMOVED***should return the correct JSON path for a field with destPath***REMOVED***, () => {
      const field: IFormField = { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED***, destPath: ***REMOVED***data***REMOVED***, multiple: true, index: 1 }
      const result = makeJsonPath(field)
      expect(result).toBe(***REMOVED***data[1]***REMOVED***)
    })

    it(***REMOVED***should return the field id if path and destPath are undefined***REMOVED***, () => {
      const field: IFormField = { id: ***REMOVED***field2***REMOVED***, type: ***REMOVED***text***REMOVED*** }
      const result = makeJsonPath(field)
      expect(result).toBe(***REMOVED***field2***REMOVED***)
    })

    it(***REMOVED***should construct the path correctly for a field with a path array***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***field3***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        path: [{ id: ***REMOVED***parent***REMOVED***, multiple: true, type: ***REMOVED***object***REMOVED***, fields: [] }, { id: ***REMOVED***child***REMOVED***, type: ***REMOVED***object***REMOVED***, fields: [] }, { id: ***REMOVED***field3***REMOVED***, type: ***REMOVED***text***REMOVED*** }]
      }
      const result = makeJsonPath(field)
      expect(result).toBe(***REMOVED***parent[0].child.field3***REMOVED***)
    })
    it(***REMOVED***should construct the path correctly for a field with a path array and index***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***fieldWithIndex***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        path: [{ id: ***REMOVED***parent***REMOVED***, multiple: true, type: ***REMOVED***text***REMOVED***, index: 2 }, { id: ***REMOVED***child***REMOVED***, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***fieldWithIndex***REMOVED***, type: ***REMOVED***text***REMOVED*** }]
      }
      const result = makeJsonPath(field)
      expect(result).toBe(***REMOVED***parent[2].child.fieldWithIndex***REMOVED***)
    })
    it(***REMOVED***should construct the path correctly for a field with a path array and index in the field***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***fieldWithIndex***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        multiple: true,
        index: 2,
        path: [{ id: ***REMOVED***parent***REMOVED***, multiple: true, type: ***REMOVED***object***REMOVED***, fields: [] }, { id: ***REMOVED***child***REMOVED***, type: ***REMOVED***object***REMOVED***, fields: [] }, { id: ***REMOVED***fieldWithIndex***REMOVED***, type: ***REMOVED***text***REMOVED***, multiple: true, index: 2 }]
      }
      const result = makeJsonPath(field)
      expect(result).toBe(***REMOVED***parent[0].child.fieldWithIndex[2]***REMOVED***)
    })
  })

  describe(***REMOVED***getChildFields***REMOVED***, () => {
    it(***REMOVED***should return child fields if they exist***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***field4***REMOVED***,
        type: ***REMOVED***object***REMOVED***,
        fields: [{ id: ***REMOVED***child1***REMOVED***, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***child2***REMOVED***, type: ***REMOVED***text***REMOVED*** }]
      }
      const result = getChildFields(field)
      expect(result).toEqual([{ id: ***REMOVED***child1***REMOVED***, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***child2***REMOVED***, type: ***REMOVED***text***REMOVED*** }])
    })

    it(***REMOVED***should return an empty array if no child fields exist***REMOVED***, () => {
      const field = { id: ***REMOVED***field5***REMOVED***, type: ***REMOVED***text***REMOVED*** }
      const result = getChildFields(field)
      expect(result).toEqual([])
    })
  })

  describe(***REMOVED***getFields***REMOVED***, () => {
    it(***REMOVED***should return all fields recursively***REMOVED***, () => {
      const fields: IFormField[] = [
        { id: ***REMOVED***field6***REMOVED***, type: ***REMOVED***object***REMOVED***, fields: [{ id: ***REMOVED***child3***REMOVED***, type: ***REMOVED***text***REMOVED*** }] },
        { id: ***REMOVED***field7***REMOVED***, type: ***REMOVED***text***REMOVED*** }
      ]
      const result = getFields(fields)
      expect(result).toEqual([
        { id: ***REMOVED***field6***REMOVED***, type: ***REMOVED***object***REMOVED***, fields: [{ id: ***REMOVED***child3***REMOVED***, type: ***REMOVED***text***REMOVED*** }] },
        { id: ***REMOVED***child3***REMOVED***, type: ***REMOVED***text***REMOVED*** },
        { id: ***REMOVED***field7***REMOVED***, type: ***REMOVED***text***REMOVED*** }
      ])
    })

    it(***REMOVED***should return an empty array if fields are undefined***REMOVED***, () => {
      const result = getFields(undefined)
      expect(result).toEqual([])
    })
  })

  describe(***REMOVED***getValueFromPath***REMOVED***, () => {
    it(***REMOVED***should return the value from the given simple path***REMOVED***, () => {
      const formValues = { data: { field8: ***REMOVED***value1***REMOVED*** } }
      const result = getValueFromPath(***REMOVED***data.field8***REMOVED***, formValues)
      expect(result).toBe(***REMOVED***value1***REMOVED***)
    })

    it(***REMOVED***should return undefined if the path does not exist***REMOVED***, () => {
      const formValues = { data: { field8: ***REMOVED***value1***REMOVED*** } }
      const result = getValueFromPath(***REMOVED***data.nonExistentField***REMOVED***, formValues)
      expect(result).toBeUndefined()
    })
  })

  describe(***REMOVED***getFieldValue***REMOVED***, () => {
    it(***REMOVED***should return the value of a field from form values***REMOVED***, () => {
      const field: IFormField = { id: ***REMOVED***field9***REMOVED***, type: ***REMOVED***text***REMOVED***, destPath: ***REMOVED***data.field9***REMOVED*** }
      const formValues = { data: { field9: ***REMOVED***value1***REMOVED*** } }
      const result = getFieldValue(field, formValues)
      expect(result).toBe(***REMOVED***value1***REMOVED***)
    })

    it(***REMOVED***should return undefined if the field value does not exist***REMOVED***, () => {
      const field: IFormField = { id: ***REMOVED***field10***REMOVED***, type: ***REMOVED***text***REMOVED***, destPath: ***REMOVED***data.nonExistentField***REMOVED*** }
      const formValues = { data: { field10: ***REMOVED***value1***REMOVED*** } }
      const result = getFieldValue(field, formValues)
      expect(result).toBeUndefined()
    })
  })

  describe(***REMOVED***getPathFromField***REMOVED***, () => {
    it(***REMOVED***should return the destPath if it exists***REMOVED***, () => {
      const field: IFormField = { id: ***REMOVED***field11***REMOVED***, type: ***REMOVED***text***REMOVED***, destPath: ***REMOVED***data.field11***REMOVED*** }
      const result = getPathFromField(field)
      expect(result).toBe(***REMOVED***data.field11***REMOVED***)
    })

    it(***REMOVED***should construct the path from the path array if destPath is undefined***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***field12***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        path: [{ id: ***REMOVED***parent***REMOVED***, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***child***REMOVED***, type: ***REMOVED***text***REMOVED*** }, { id: ***REMOVED***field12***REMOVED***, type: ***REMOVED***text***REMOVED*** }]
      }
      const result = getPathFromField(field)
      expect(result).toBe(***REMOVED***parent.child.field12***REMOVED***)
    })

    it(***REMOVED***should return the field id if both destPath and path are undefined***REMOVED***, () => {
      const field: IFormField = { id: ***REMOVED***field13***REMOVED***, type: ***REMOVED***text***REMOVED*** }
      const result = getPathFromField(field)
      expect(result).toBe(***REMOVED***field13***REMOVED***)
    })
    it(***REMOVED***should ignore an object id in the path that is set to skip_path when constructing id***REMOVED***, () => {
      const field: IFormField = {
        id: ***REMOVED***field1***REMOVED***,
        type: ***REMOVED***text***REMOVED***,
        path: [
          {
            id: ***REMOVED***parent***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            skip_path: true,
            fields: []
          },
          {
            id: ***REMOVED***field1***REMOVED***,
            type: ***REMOVED***text***REMOVED***
          }
        ]
      }
      const result = getPathFromField(field)
      expect(result).toBe(***REMOVED***field1***REMOVED***)
    })
  })

  describe(***REMOVED***getFieldsFromFormSection***REMOVED***, () => {
    it(***REMOVED***should return all fields from a form section recursively***REMOVED***, () => {
      const formSection: IFormSection = {
        id: ***REMOVED***section1***REMOVED***,
        label: ***REMOVED***Section 1***REMOVED***,
        fields: [{ id: ***REMOVED***field14***REMOVED***, type: ***REMOVED***text***REMOVED*** }],
        pages: [{ id: ***REMOVED***page1***REMOVED***, label: ***REMOVED***Page 1***REMOVED***, fields: [{ id: ***REMOVED***field15***REMOVED***, type: ***REMOVED***text***REMOVED*** }] }],
        wizard_steps: [{ id: ***REMOVED***step1***REMOVED***, order: 0, label: ***REMOVED***Step 1***REMOVED***, fields: [{ id: ***REMOVED***field16***REMOVED***, type: ***REMOVED***text***REMOVED*** }] }]
      }
      const result = getFieldsFromFormSection(formSection)
      expect(result).toEqual([
        { id: ***REMOVED***field14***REMOVED***, type: ***REMOVED***text***REMOVED*** },
        { id: ***REMOVED***field15***REMOVED***, type: ***REMOVED***text***REMOVED*** },
        { id: ***REMOVED***field16***REMOVED***, type: ***REMOVED***text***REMOVED*** }
      ])
    })

    it(***REMOVED***should return an empty array if the form section has no fields***REMOVED***, () => {
      const formSection = { id: ***REMOVED***section2***REMOVED***, label: ***REMOVED***Section 2***REMOVED*** }
      const result = getFieldsFromFormSection(formSection)
      expect(result).toEqual([])
    })
  })

  describe(***REMOVED***getFormPayload***REMOVED***, () => {
    it(***REMOVED***should exclude fields marked with excludeFromPayload=true***REMOVED***, () => {
      const form = {
        id: ***REMOVED***test-form***REMOVED***,
        label: ***REMOVED***Test Form***REMOVED***,
        fields: [
          { id: ***REMOVED***shape_type***REMOVED***, type: ***REMOVED***select***REMOVED***, excludeFromPayload: true } as any,
          { id: ***REMOVED***geojson***REMOVED***, type: ***REMOVED***text***REMOVED*** } as any
        ]
      } as any
      const formValues = {
        shape_type: ***REMOVED***point***REMOVED***,
        geojson: { type: ***REMOVED***Point***REMOVED***, coordinates: [0, 0] }
      }
      const result = getFormPayload(formValues, form)
      expect(result).toEqual({ geojson: { type: ***REMOVED***Point***REMOVED***, coordinates: [0, 0] } })
      expect(result).not.toHaveProperty(***REMOVED***shape_type***REMOVED***)
    })

    it(***REMOVED***should include fields with excludeFromPayload=false even if marked***REMOVED***, () => {
      const form = {
        id: ***REMOVED***test-form***REMOVED***,
        label: ***REMOVED***Test Form***REMOVED***,
        fields: [
          { id: ***REMOVED***control_field***REMOVED***, type: ***REMOVED***select***REMOVED***, excludeFromPayload: false } as any,
          { id: ***REMOVED***data_field***REMOVED***, type: ***REMOVED***text***REMOVED*** } as any
        ]
      } as any
      const formValues = {
        control_field: ***REMOVED***value1***REMOVED***,
        data_field: ***REMOVED***value2***REMOVED***
      }
      const result = getFormPayload(formValues, form)
      expect(result).toEqual({ control_field: ***REMOVED***value1***REMOVED***, data_field: ***REMOVED***value2***REMOVED*** })
    })

    it(***REMOVED***should return empty payload when no fields or all excluded***REMOVED***, () => {
      const form = {
        id: ***REMOVED***test-form***REMOVED***,
        label: ***REMOVED***Test Form***REMOVED***,
        fields: [
          { id: ***REMOVED***excluded1***REMOVED***, type: ***REMOVED***text***REMOVED***, excludeFromPayload: true } as any,
          { id: ***REMOVED***excluded2***REMOVED***, type: ***REMOVED***text***REMOVED***, excludeFromPayload: true } as any
        ]
      } as any
      const formValues = { excluded1: ***REMOVED***val1***REMOVED***, excluded2: ***REMOVED***val2***REMOVED*** }
      const result = getFormPayload(formValues, form)
      expect(result).toEqual({})
    })

    it(***REMOVED***should gather fields from pages when top-level fields are empty***REMOVED***, () => {
      const form = {
        id: ***REMOVED***test-form***REMOVED***,
        label: ***REMOVED***Test Form***REMOVED***,
        pages: [
          {
            id: ***REMOVED***page1***REMOVED***,
            label: ***REMOVED***Page 1***REMOVED***,
            fields: [
              { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED*** } as any,
              { id: ***REMOVED***field2***REMOVED***, type: ***REMOVED***text***REMOVED***, excludeFromPayload: true } as any
            ]
          }
        ]
      } as any
      const formValues = {
        field1: ***REMOVED***value1***REMOVED***,
        field2: ***REMOVED***excluded_value***REMOVED***
      }
      const result = getFormPayload(formValues, form)
      expect(result).toEqual({ field1: ***REMOVED***value1***REMOVED*** })
      expect(result).not.toHaveProperty(***REMOVED***field2***REMOVED***)
    })

    it(***REMOVED***should emit simple key/value payload for objectList when settings.valueField is set***REMOVED***, () => {
      const form = {
        id: ***REMOVED***test-form***REMOVED***,
        label: ***REMOVED***Test Form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***servers***REMOVED***,
            type: ***REMOVED***objectList***REMOVED***,
            settings: {
              keyField: ***REMOVED***hostname***REMOVED***,
              valueField: ***REMOVED***ip***REMOVED***,
            },
            fields: [
              { id: ***REMOVED***hostname***REMOVED***, type: ***REMOVED***text***REMOVED*** },
              { id: ***REMOVED***ip***REMOVED***, type: ***REMOVED***text***REMOVED*** },
            ],
          } as any,
        ],
      } as any

      const formValues = {
        servers: {
          alpha: ***REMOVED***10.0.0.1***REMOVED***,
          beta: {
            hostname: ***REMOVED***beta***REMOVED***,
            ip: ***REMOVED***10.0.0.2***REMOVED***,
            environment: ***REMOVED***prod***REMOVED***,
          },
        },
      }

      const result = getFormPayload(formValues, form)
      expect(result).toEqual({
        servers: {
          alpha: ***REMOVED***10.0.0.1***REMOVED***,
          beta: ***REMOVED***10.0.0.2***REMOVED***,
        },
      })
    })

    it(***REMOVED***should emit objectList payload from wrapper layout without keyField when excludeKeyFieldFromValue is true***REMOVED***, () => {
      const schema: JSONSchema6 = {
        type: ***REMOVED***object***REMOVED***,
        properties: {
          list: {
            type: ***REMOVED***object***REMOVED***,
            additionalProperties: {
              type: ***REMOVED***object***REMOVED***,
              properties: {
                name: { type: ***REMOVED***string***REMOVED*** },
                value: { type: ***REMOVED***number***REMOVED*** },
              },
            },
          },
        },
      }

      const form = overridesAndSchemaToFormObject({
        schema,
        formOverrides: [
          {
            fields: [
              {
                prop: ***REMOVED***list***REMOVED***,
                type: ***REMOVED***objectList***REMOVED***,
                settings: {
                  keyField: ***REMOVED***name***REMOVED***,
                  excludeKeyFieldFromValue: true,
                },
                fields: [
                  {
                    id: ***REMOVED***wrapper***REMOVED***,
                    type: ***REMOVED***objectWrapper***REMOVED***,
                    layout: ***REMOVED***grid2***REMOVED***,
                    fields: [{ prop: ***REMOVED***name***REMOVED*** }, { prop: ***REMOVED***value***REMOVED*** }],
                  },
                ],
              } as any,
            ],
          },
        ],
      })

      const formValues = {
        list: {
          alpha: {
            name: ***REMOVED***alpha***REMOVED***,
            value: 42,
          },
        },
      }

      const result = getFormPayload(formValues, form)
      expect(result).toEqual({
        list: {
          alpha: {
            value: 42,
          },
        },
      })
    })

    it(***REMOVED***should include flattened skip_path child values for multiple object items***REMOVED***, () => {
      const form = {
        id: ***REMOVED***test-form***REMOVED***,
        label: ***REMOVED***Test Form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***variable_converter***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            multiple: true,
            fields: [
              {
                id: ***REMOVED***split_operator***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                skip_path: true,
                fields: [
                  { id: ***REMOVED***source_variable***REMOVED***, type: ***REMOVED***text***REMOVED*** },
                  { id: ***REMOVED***converter_type***REMOVED***, type: ***REMOVED***text***REMOVED*** },
                ],
              },
              {
                id: ***REMOVED***drop_columns***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                skip_path: true,
                fields: [
                  { id: ***REMOVED***column_names***REMOVED***, type: ***REMOVED***text***REMOVED***, multiple: true },
                  { id: ***REMOVED***converter_type***REMOVED***, type: ***REMOVED***text***REMOVED*** },
                ],
              },
              {
                id: ***REMOVED***output_variables***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                multiple: true,
                fields: [
                  { id: ***REMOVED***index***REMOVED***, type: ***REMOVED***number***REMOVED*** },
                  { id: ***REMOVED***output_variable***REMOVED***, type: ***REMOVED***text***REMOVED*** },
                ],
              },
            ],
          } as any,
        ],
      } as any

      const formValues = {
        variable_converter: [
          {
            source_variable: ***REMOVED***temp_raw***REMOVED***,
            converter_type: ***REMOVED***split***REMOVED***,
            column_names: [***REMOVED***unused***REMOVED***],
            output_variables: [
              { index: 0, output_variable: ***REMOVED***u***REMOVED*** },
              { index: 1, output_variable: ***REMOVED***v***REMOVED*** },
            ],
          },
          {
            converter_type: ***REMOVED***drop***REMOVED***,
            column_names: [***REMOVED***a***REMOVED***, ***REMOVED***b***REMOVED***],
            output_variables: [
              { index: 0, output_variable: ***REMOVED***depth***REMOVED*** },
            ],
          },
        ],
      }

      const result = getFormPayload(formValues, form)
      expect(result).toEqual({
        variable_converter: [
          {
            source_variable: ***REMOVED***temp_raw***REMOVED***,
            converter_type: ***REMOVED***split***REMOVED***,
            column_names: [***REMOVED***unused***REMOVED***],
            output_variables: [
              { index: 0, output_variable: ***REMOVED***u***REMOVED*** },
              { index: 1, output_variable: ***REMOVED***v***REMOVED*** },
            ],
          },
          {
            converter_type: ***REMOVED***drop***REMOVED***,
            column_names: [***REMOVED***a***REMOVED***, ***REMOVED***b***REMOVED***],
            output_variables: [
              { index: 0, output_variable: ***REMOVED***depth***REMOVED*** },
            ],
          },
        ],
      })
    })

    it(***REMOVED***should support n-level nested payload extraction with skip_path at arbitrary non-multiple levels***REMOVED***, () => {
      const form = {
        id: ***REMOVED***deep-form***REMOVED***,
        label: ***REMOVED***Deep Form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***variable_converter***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            multiple: true,
            fields: [
              {
                id: ***REMOVED***split_operator***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                skip_path: true,
                fields: [
                  { id: ***REMOVED***source_variable***REMOVED***, type: ***REMOVED***text***REMOVED*** },
                  {
                    id: ***REMOVED***details***REMOVED***,
                    type: ***REMOVED***object***REMOVED***,
                    fields: [
                      {
                        id: ***REMOVED***meta***REMOVED***,
                        type: ***REMOVED***object***REMOVED***,
                        skip_path: true,
                        fields: [
                          { id: ***REMOVED***units***REMOVED***, type: ***REMOVED***text***REMOVED*** },
                        ],
                      },
                    ],
                  },
                  {
                    id: ***REMOVED***output_variables***REMOVED***,
                    type: ***REMOVED***object***REMOVED***,
                    multiple: true,
                    fields: [
                      { id: ***REMOVED***index***REMOVED***, type: ***REMOVED***number***REMOVED*** },
                      {
                        id: ***REMOVED***shape***REMOVED***,
                        type: ***REMOVED***object***REMOVED***,
                        skip_path: true,
                        fields: [{ id: ***REMOVED***output_variable***REMOVED***, type: ***REMOVED***text***REMOVED*** }],
                      },
                    ],
                  },
                ],
              },
            ],
          } as any,
        ],
      } as any

      const formValues = {
        variable_converter: [
          {
            source_variable: ***REMOVED***temp_raw***REMOVED***,
            details: {
              units: ***REMOVED***degC***REMOVED***,
            },
            output_variables: [
              { index: 0, output_variable: ***REMOVED***temp_surface***REMOVED*** },
              { index: 1, output_variable: ***REMOVED***temp_bottom***REMOVED*** },
            ],
          },
        ],
      }

      const result = getFormPayload(formValues, form)
      expect(result).toEqual({
        variable_converter: [
          {
            source_variable: ***REMOVED***temp_raw***REMOVED***,
            details: {
              units: ***REMOVED***degC***REMOVED***,
            },
            output_variables: [
              { index: 0, output_variable: ***REMOVED***temp_surface***REMOVED*** },
              { index: 1, output_variable: ***REMOVED***temp_bottom***REMOVED*** },
            ],
          },
        ],
      })
    })
  })
})
