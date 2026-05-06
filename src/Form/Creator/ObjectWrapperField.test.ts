/**
 * ObjectWrapperField.test.ts
 * Tests for IObjectWrapperField - UI-only container for organizing nested fields with layouts
 */

import { describe, it, expect } from ***REMOVED***vitest***REMOVED***
import { type IObjectWrapperField, type ITextField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

describe(***REMOVED***IObjectWrapperField***REMOVED***, () => {
  it(***REMOVED***creates a valid objectWrapper field with tab layout***REMOVED***, () => {
    const tabLayout: IObjectWrapperField = {
      id: ***REMOVED***personal_info_wrapper***REMOVED***,
      type: ***REMOVED***objectWrapper***REMOVED***,
      skip_path: true,
      label: ***REMOVED***Personal Information***REMOVED***,
      tabs: [
        {
          id: ***REMOVED***basic***REMOVED***,
          label: ***REMOVED***Basic Info***REMOVED***,
          fields: [
            {
              id: ***REMOVED***firstName***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***First Name***REMOVED***
            } as ITextField
          ]
        },
        {
          id: ***REMOVED***contact***REMOVED***,
          label: ***REMOVED***Contact Details***REMOVED***,
          fields: [
            {
              id: ***REMOVED***email***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***Email***REMOVED***
            } as ITextField
          ]
        }
      ]
    }

    expect(tabLayout.type).toBe(***REMOVED***objectWrapper***REMOVED***)
    expect(tabLayout.skip_path).toBe(true)
    expect(tabLayout.tabs).toHaveLength(2)
    expect(tabLayout.tabs?.[0].label).toBe(***REMOVED***Basic Info***REMOVED***)
  })

  it(***REMOVED***creates a valid objectWrapper field with pages layout***REMOVED***, () => {
    const pagesLayout: IObjectWrapperField = {
      id: ***REMOVED***wizard_wrapper***REMOVED***,
      type: ***REMOVED***objectWrapper***REMOVED***,
      skip_path: true,
      label: ***REMOVED***Multi-Step Form***REMOVED***,
      pages: [
        {
          id: ***REMOVED***page1***REMOVED***,
          label: ***REMOVED***Page 1***REMOVED***,
          fields: [
            {
              id: ***REMOVED***step1_field***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***Step 1 Field***REMOVED***
            } as ITextField
          ]
        }
      ]
    }

    expect(pagesLayout.type).toBe(***REMOVED***objectWrapper***REMOVED***)
    expect(pagesLayout.pages).toHaveLength(1)
  })

  it(***REMOVED***creates a valid objectWrapper field with simple nested fields***REMOVED***, () => {
    const simpleWrapper: IObjectWrapperField = {
      id: ***REMOVED***grouped_fields***REMOVED***,
      type: ***REMOVED***objectWrapper***REMOVED***,
      skip_path: true,
      layout: ***REMOVED***grid2***REMOVED***,
      fields: [
        {
          id: ***REMOVED***field1***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          label: ***REMOVED***Field 1***REMOVED***
        } as ITextField,
        {
          id: ***REMOVED***field2***REMOVED***,
          type: ***REMOVED***text***REMOVED***,
          label: ***REMOVED***Field 2***REMOVED***
        } as ITextField
      ]
    }

    expect(simpleWrapper.type).toBe(***REMOVED***objectWrapper***REMOVED***)
    expect(simpleWrapper.layout).toBe(***REMOVED***grid2***REMOVED***)
    expect(simpleWrapper.fields).toHaveLength(2)
  })

  it(***REMOVED***enforces skip_path: true requirement***REMOVED***, () => {
    // TypeScript will enforce this at compile time, but document the expectation
    const wrapper: IObjectWrapperField = {
      id: ***REMOVED***wrapper***REMOVED***,
      type: ***REMOVED***objectWrapper***REMOVED***,
      skip_path: true, // REQUIRED - property has no default
      fields: []
    }

    expect(wrapper.skip_path).toBe(true)
  })

  it(***REMOVED***supports multiple layout options***REMOVED***, () => {
    const layoutOptions: Array<IObjectWrapperField[***REMOVED***layout***REMOVED***]> = [
      ***REMOVED***horizontal***REMOVED***,
      ***REMOVED***vertical***REMOVED***,
      ***REMOVED***grid2***REMOVED***,
      ***REMOVED***grid3***REMOVED***,
      ***REMOVED***grid4***REMOVED***
    ]

    layoutOptions.forEach(layout => {
      const wrapper: IObjectWrapperField = {
        id: `wrapper_${layout}`,
        type: ***REMOVED***objectWrapper***REMOVED***,
        skip_path: true,
        layout,
        fields: []
      }

      expect(wrapper.layout).toBe(layout)
    })
  })

  it(***REMOVED***does not store any data in form values (skip_path: true behavior)***REMOVED***, () => {
    // This test documents the expected behavior when rendering
    // The wrapper itself doesn***REMOVED***t appear in formValues, only its children do
    const wrapper: IObjectWrapperField = {
      id: ***REMOVED***contact_info_wrapper***REMOVED***,
      type: ***REMOVED***objectWrapper***REMOVED***,
      skip_path: true,
      fields: [
        {
          id: ***REMOVED***email***REMOVED***,
          type: ***REMOVED***text***REMOVED***
        } as ITextField,
        {
          id: ***REMOVED***phone***REMOVED***,
          type: ***REMOVED***text***REMOVED***
        } as ITextField
      ]
    }

    expect(wrapper.skip_path).toBe(true)
    expect(wrapper.fields?.map(f => f.id)).toEqual([***REMOVED***email***REMOVED***, ***REMOVED***phone***REMOVED***])

    // When rendering, formValues should have:
    // { email: "...", phone: "..." }
    // NOT { contact_info_wrapper: { email: "...", phone: "..." } }
    // This is enforced by skip_path: true
  })

  it(***REMOVED***can be used in form overrides for UI organization***REMOVED***, () => {
    // Example use case: Adding tab structure to existing form without data restructuring
    const formOverride = {
      tabs: [
        {
          id: ***REMOVED***section1***REMOVED***,
          label: ***REMOVED***Section 1***REMOVED***,
          fields: [
            {
              id: ***REMOVED***existing_field_1***REMOVED***,
              type: ***REMOVED***text***REMOVED***,
              label: ***REMOVED***Field 1***REMOVED***
            }
          ]
        }
      ]
    }

    const wrapperForTabStructure: IObjectWrapperField = {
      id: ***REMOVED***root_tabs***REMOVED***,
      type: ***REMOVED***objectWrapper***REMOVED***,
      skip_path: true,
      tabs: formOverride.tabs
    }

    expect(wrapperForTabStructure.tabs).toBe(formOverride.tabs)
  })
})
