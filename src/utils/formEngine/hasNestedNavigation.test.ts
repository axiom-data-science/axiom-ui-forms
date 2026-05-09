import { describe, it, expect } from ***REMOVED***vitest***REMOVED***
import type { IForm } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import { formHasNestedNavigation } from ***REMOVED***./hasNestedNavigation***REMOVED***

describe(***REMOVED***formHasNestedNavigation***REMOVED***, () => {
  describe(***REMOVED***top-level navigation***REMOVED***, () => {
    it(***REMOVED***should detect top-level pages***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        pages: [
          { id: ***REMOVED***page1***REMOVED***, fields: [] },
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it(***REMOVED***should detect top-level wizard_steps***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        wizard_steps: [
          { id: ***REMOVED***step1***REMOVED***, fields: [] },
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it(***REMOVED***should return false for form without navigation***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        fields: [
          { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED*** },
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(false)
    })
  })

  describe(***REMOVED***nested in object fields***REMOVED***, () => {
    it(***REMOVED***should detect pages nested in object field***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***objectField***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            fields: [
              {
                id: ***REMOVED***nestedField***REMOVED***,
                type: ***REMOVED***text***REMOVED***,
                pages: [
                  { id: ***REMOVED***page1***REMOVED***, fields: [] },
                ],
              } as any,
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it(***REMOVED***should detect wizard_steps nested in objectWrapper***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***wrapperField***REMOVED***,
            type: ***REMOVED***objectWrapper***REMOVED***,
            fields: [
              {
                id: ***REMOVED***nestedField***REMOVED***,
                type: ***REMOVED***text***REMOVED***,
                wizard_steps: [
                  { id: ***REMOVED***step1***REMOVED***, fields: [] },
                ],
              } as any,
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it(***REMOVED***should detect pages in deeply nested object fields***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***object1***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            fields: [
              {
                id: ***REMOVED***object2***REMOVED***,
                type: ***REMOVED***object***REMOVED***,
                fields: [
                  {
                    id: ***REMOVED***fieldWithPages***REMOVED***,
                    type: ***REMOVED***text***REMOVED***,
                    pages: [
                      { id: ***REMOVED***page1***REMOVED***, fields: [] },
                    ],
                  } as any,
                ],
              } as any,
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })
  })

  describe(***REMOVED***nested in objectList***REMOVED***, () => {
    it(***REMOVED***should detect pages in objectList field***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***listField***REMOVED***,
            type: ***REMOVED***objectList***REMOVED***,
            settings: { keyField: ***REMOVED***id***REMOVED*** },
            fields: [
              {
                id: ***REMOVED***fieldWithPages***REMOVED***,
                type: ***REMOVED***text***REMOVED***,
                pages: [
                  { id: ***REMOVED***page1***REMOVED***, fields: [] },
                ],
              } as any,
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it(***REMOVED***should detect wizard_steps in objectList field***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***listField***REMOVED***,
            type: ***REMOVED***objectList***REMOVED***,
            settings: { keyField: ***REMOVED***id***REMOVED*** },
            fields: [
              {
                id: ***REMOVED***fieldWithSteps***REMOVED***,
                type: ***REMOVED***text***REMOVED***,
                wizard_steps: [
                  { id: ***REMOVED***step1***REMOVED***, fields: [] },
                ],
              } as any,
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })
  })

  describe(***REMOVED***nested in tabs***REMOVED***, () => {
    it(***REMOVED***should detect pages in field within tabs***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***fieldWithTabs***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            tabs: [
              {
                id: ***REMOVED***tab1***REMOVED***,
                fields: [
                  {
                    id: ***REMOVED***fieldWithPages***REMOVED***,
                    type: ***REMOVED***text***REMOVED***,
                    pages: [
                      { id: ***REMOVED***page1***REMOVED***, fields: [] },
                    ],
                  } as any,
                ],
              },
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it(***REMOVED***should detect wizard_steps in field within tabs***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        fields: [
          {
            id: ***REMOVED***fieldWithTabs***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            tabs: [
              {
                id: ***REMOVED***tab1***REMOVED***,
                fields: [
                  {
                    id: ***REMOVED***fieldWithSteps***REMOVED***,
                    type: ***REMOVED***text***REMOVED***,
                    wizard_steps: [
                      { id: ***REMOVED***step1***REMOVED***, fields: [] },
                    ],
                  } as any,
                ],
              },
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })
  })

  describe(***REMOVED***nested in pages and wizard_steps***REMOVED***, () => {
    it(***REMOVED***should detect nested pages within pages***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        pages: [
          {
            id: ***REMOVED***page1***REMOVED***,
            fields: [
              {
                id: ***REMOVED***fieldWithPages***REMOVED***,
                type: ***REMOVED***text***REMOVED***,
                pages: [
                  { id: ***REMOVED***nestedPage1***REMOVED***, fields: [] },
                ],
              } as any,
            ],
          },
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it(***REMOVED***should detect nested wizard_steps within wizard_steps***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        wizard_steps: [
          {
            id: ***REMOVED***step1***REMOVED***,
            fields: [
              {
                id: ***REMOVED***fieldWithSteps***REMOVED***,
                type: ***REMOVED***text***REMOVED***,
                wizard_steps: [
                  { id: ***REMOVED***nestedStep1***REMOVED***, fields: [] },
                ],
              } as any,
            ],
          },
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })
  })

  describe(***REMOVED***multiple fields***REMOVED***, () => {
    it(***REMOVED***should detect navigation in any field of multiple***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        fields: [
          { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED*** },
          { id: ***REMOVED***field2***REMOVED***, type: ***REMOVED***text***REMOVED*** },
          {
            id: ***REMOVED***field3***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            fields: [
              {
                id: ***REMOVED***nestedField***REMOVED***,
                type: ***REMOVED***text***REMOVED***,
                pages: [
                  { id: ***REMOVED***page1***REMOVED***, fields: [] },
                ],
              } as any,
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it(***REMOVED***should return false when no field has navigation***REMOVED***, () => {
      const form: IForm = {
        id: ***REMOVED***form***REMOVED***,
        fields: [
          { id: ***REMOVED***field1***REMOVED***, type: ***REMOVED***text***REMOVED*** },
          {
            id: ***REMOVED***field2***REMOVED***,
            type: ***REMOVED***object***REMOVED***,
            fields: [
              { id: ***REMOVED***nestedField***REMOVED***, type: ***REMOVED***text***REMOVED*** },
            ],
          } as any,
          {
            id: ***REMOVED***field3***REMOVED***,
            type: ***REMOVED***objectList***REMOVED***,
            settings: { keyField: ***REMOVED***id***REMOVED*** },
            fields: [
              { id: ***REMOVED***listField***REMOVED***, type: ***REMOVED***text***REMOVED*** },
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(false)
    })
  })
})
