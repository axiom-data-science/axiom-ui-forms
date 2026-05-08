/**
 * ObjectWrapperField.test.ts
 * Tests for IObjectWrapperField - UI-only container for organizing nested fields with layouts
 */

import { describe, it, expect } from 'vitest'
import { type IObjectWrapperField, type ITextField } from '@/Form/Creator/FormCreatorTypes'

describe('IObjectWrapperField', () => {
  it('creates a valid objectWrapper field with tab layout', () => {
    const tabLayout: IObjectWrapperField = {
      id: 'personal_info_wrapper',
      type: 'objectWrapper',
      skip_path: true,
      label: 'Personal Information',
      tabs: [
        {
          id: 'basic',
          label: 'Basic Info',
          fields: [
            {
              id: 'firstName',
              type: 'text',
              label: 'First Name'
            } satisfies ITextField
          ]
        },
        {
          id: 'contact',
          label: 'Contact Details',
          fields: [
            {
              id: 'email',
              type: 'text',
              label: 'Email'
            } satisfies ITextField
          ]
        }
      ]
    }

    expect(tabLayout.type).toBe('objectWrapper')
    expect(tabLayout.skip_path).toBe(true)
    expect(tabLayout.tabs).toHaveLength(2)
    expect(tabLayout.tabs?.[0].label).toBe('Basic Info')
  })

  it('creates a valid objectWrapper field with pages layout', () => {
    const pagesLayout: IObjectWrapperField = {
      id: 'wizard_wrapper',
      type: 'objectWrapper',
      skip_path: true,
      label: 'Multi-Step Form',
      pages: [
        {
          id: 'page1',
          label: 'Page 1',
          fields: [
            {
              id: 'step1_field',
              type: 'text',
              label: 'Step 1 Field'
            } satisfies ITextField
          ]
        }
      ]
    }

    expect(pagesLayout.type).toBe('objectWrapper')
    expect(pagesLayout.pages).toHaveLength(1)
  })

  it('creates a valid objectWrapper field with simple nested fields', () => {
    const simpleWrapper: IObjectWrapperField = {
      id: 'grouped_fields',
      type: 'objectWrapper',
      skip_path: true,
      layout: 'grid2',
      fields: [
        {
          id: 'field1',
          type: 'text',
          label: 'Field 1'
        } satisfies ITextField,
        {
          id: 'field2',
          type: 'text',
          label: 'Field 2'
        } satisfies ITextField
      ]
    }

    expect(simpleWrapper.type).toBe('objectWrapper')
    expect(simpleWrapper.layout).toBe('grid2')
    expect(simpleWrapper.fields).toHaveLength(2)
  })

  it('enforces skip_path: true requirement', () => {
    // TypeScript will enforce this at compile time, but document the expectation
    const wrapper: IObjectWrapperField = {
      id: 'wrapper',
      type: 'objectWrapper',
      skip_path: true, // REQUIRED - property has no default
      fields: []
    }

    expect(wrapper.skip_path).toBe(true)
  })

  it('supports multiple layout options', () => {
    const layoutOptions: Array<IObjectWrapperField['layout']> = [
      'horizontal',
      'vertical',
      'grid2',
      'grid3',
      'grid4'
    ]

    layoutOptions.forEach(layout => {
      const wrapper: IObjectWrapperField = {
        id: `wrapper_${layout}`,
        type: 'objectWrapper',
        skip_path: true,
        layout,
        fields: []
      }

      expect(wrapper.layout).toBe(layout)
    })
  })

  it('does not store any data in form values (skip_path: true behavior)', () => {
    // This test documents the expected behavior when rendering
    // The wrapper itself doesn't appear in formValues, only its children do
    const wrapper: IObjectWrapperField = {
      id: 'contact_info_wrapper',
      type: 'objectWrapper',
      skip_path: true,
      fields: [
        {
          id: 'email',
          type: 'text'
        } satisfies ITextField,
        {
          id: 'phone',
          type: 'text'
        } satisfies ITextField
      ]
    }

    expect(wrapper.skip_path).toBe(true)
    expect(wrapper.fields?.map(f => f.id)).toEqual(['email', 'phone'])

    // When rendering, formValues should have:
    // { email: "...", phone: "..." }
    // NOT { contact_info_wrapper: { email: "...", phone: "..." } }
    // This is enforced by skip_path: true
  })

  it('can be used in form overrides for UI organization', () => {
    // Example use case: Adding tab structure to existing form without data restructuring
    const formOverride = {
      tabs: [
        {
          id: 'section1',
          label: 'Section 1',
          fields: [
            {
              id: 'existing_field_1',
              type: 'text',
              label: 'Field 1'
            } satisfies ITextField
          ]
        }
      ]
    }

    const wrapperForTabStructure: IObjectWrapperField = {
      id: 'root_tabs',
      type: 'objectWrapper',
      skip_path: true,
      tabs: formOverride.tabs
    }

    expect(wrapperForTabStructure.tabs).toBe(formOverride.tabs)
  })
})
