import { describe, it, expect } from 'vitest'
import type { IForm } from '@/Form/Creator/FormCreatorTypes'
import { formHasNestedNavigation } from './hasNestedNavigation'

describe('formHasNestedNavigation', () => {
  describe('top-level navigation', () => {
    it('should detect top-level pages', () => {
      const form: IForm = {
        id: 'form',
        pages: [
          { id: 'page1', fields: [] },
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it('should detect top-level wizard_steps', () => {
      const form: IForm = {
        id: 'form',
        wizard_steps: [
          { id: 'step1', fields: [] },
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it('should return false for form without navigation', () => {
      const form: IForm = {
        id: 'form',
        fields: [
          { id: 'field1', type: 'text' },
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(false)
    })
  })

  describe('nested in object fields', () => {
    it('should detect pages nested in object field', () => {
      const form: IForm = {
        id: 'form',
        fields: [
          {
            id: 'objectField',
            type: 'object',
            fields: [
              {
                id: 'nestedField',
                type: 'text',
                pages: [
                  { id: 'page1', fields: [] },
                ],
              } as any,
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it('should detect wizard_steps nested in objectWrapper', () => {
      const form: IForm = {
        id: 'form',
        fields: [
          {
            id: 'wrapperField',
            type: 'objectWrapper',
            fields: [
              {
                id: 'nestedField',
                type: 'text',
                wizard_steps: [
                  { id: 'step1', fields: [] },
                ],
              } as any,
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it('should detect pages in deeply nested object fields', () => {
      const form: IForm = {
        id: 'form',
        fields: [
          {
            id: 'object1',
            type: 'object',
            fields: [
              {
                id: 'object2',
                type: 'object',
                fields: [
                  {
                    id: 'fieldWithPages',
                    type: 'text',
                    pages: [
                      { id: 'page1', fields: [] },
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

  describe('nested in objectList', () => {
    it('should detect pages in objectList field', () => {
      const form: IForm = {
        id: 'form',
        fields: [
          {
            id: 'listField',
            type: 'objectList',
            settings: { keyField: 'id' },
            fields: [
              {
                id: 'fieldWithPages',
                type: 'text',
                pages: [
                  { id: 'page1', fields: [] },
                ],
              } as any,
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it('should detect wizard_steps in objectList field', () => {
      const form: IForm = {
        id: 'form',
        fields: [
          {
            id: 'listField',
            type: 'objectList',
            settings: { keyField: 'id' },
            fields: [
              {
                id: 'fieldWithSteps',
                type: 'text',
                wizard_steps: [
                  { id: 'step1', fields: [] },
                ],
              } as any,
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })
  })

  describe('nested in tabs', () => {
    it('should detect pages in field within tabs', () => {
      const form: IForm = {
        id: 'form',
        fields: [
          {
            id: 'fieldWithTabs',
            type: 'object',
            tabs: [
              {
                id: 'tab1',
                fields: [
                  {
                    id: 'fieldWithPages',
                    type: 'text',
                    pages: [
                      { id: 'page1', fields: [] },
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

    it('should detect wizard_steps in field within tabs', () => {
      const form: IForm = {
        id: 'form',
        fields: [
          {
            id: 'fieldWithTabs',
            type: 'object',
            tabs: [
              {
                id: 'tab1',
                fields: [
                  {
                    id: 'fieldWithSteps',
                    type: 'text',
                    wizard_steps: [
                      { id: 'step1', fields: [] },
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

  describe('nested in pages and wizard_steps', () => {
    it('should detect nested pages within pages', () => {
      const form: IForm = {
        id: 'form',
        pages: [
          {
            id: 'page1',
            fields: [
              {
                id: 'fieldWithPages',
                type: 'text',
                pages: [
                  { id: 'nestedPage1', fields: [] },
                ],
              } as any,
            ],
          },
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it('should detect nested wizard_steps within wizard_steps', () => {
      const form: IForm = {
        id: 'form',
        wizard_steps: [
          {
            id: 'step1',
            fields: [
              {
                id: 'fieldWithSteps',
                type: 'text',
                wizard_steps: [
                  { id: 'nestedStep1', fields: [] },
                ],
              } as any,
            ],
          },
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })
  })

  describe('multiple fields', () => {
    it('should detect navigation in any field of multiple', () => {
      const form: IForm = {
        id: 'form',
        fields: [
          { id: 'field1', type: 'text' },
          { id: 'field2', type: 'text' },
          {
            id: 'field3',
            type: 'object',
            fields: [
              {
                id: 'nestedField',
                type: 'text',
                pages: [
                  { id: 'page1', fields: [] },
                ],
              } as any,
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(true)
    })

    it('should return false when no field has navigation', () => {
      const form: IForm = {
        id: 'form',
        fields: [
          { id: 'field1', type: 'text' },
          {
            id: 'field2',
            type: 'object',
            fields: [
              { id: 'nestedField', type: 'text' },
            ],
          } as any,
          {
            id: 'field3',
            type: 'objectList',
            settings: { keyField: 'id' },
            fields: [
              { id: 'listField', type: 'text' },
            ],
          } as any,
        ],
      }
      expect(formHasNestedNavigation(form)).toBe(false)
    })
  })
})
