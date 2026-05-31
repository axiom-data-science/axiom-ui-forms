import { describe, it, expect } from ***REMOVED***vitest***REMOVED***
import { getLayoutClassName, getFieldFlexClass, type LayoutType } from ***REMOVED***./layoutHelpers***REMOVED***

describe(***REMOVED***layoutHelpers***REMOVED***, () => {
  describe(***REMOVED***getLayoutClassName***REMOVED***, () => {
    it(***REMOVED***returns flex-col (default) when layout is undefined***REMOVED***, () => {
      expect(getLayoutClassName(undefined)).toBe(***REMOVED***flex flex-col gap-4***REMOVED***)
    })

    it(***REMOVED***returns flex-col when layout is "vertical"***REMOVED***, () => {
      expect(getLayoutClassName(***REMOVED***vertical***REMOVED***)).toBe(***REMOVED***flex flex-col gap-4***REMOVED***)
    })

    it(***REMOVED***returns horizontal flex classes for "horizontal"***REMOVED***, () => {
      expect(getLayoutClassName(***REMOVED***horizontal***REMOVED***)).toBe(***REMOVED***flex md:flex-row sm:flex-col gap-4 sm:gap-2***REMOVED***)
    })

    it(***REMOVED***returns 2-column grid classes for "grid2"***REMOVED***, () => {
      expect(getLayoutClassName(***REMOVED***grid2***REMOVED***)).toBe(***REMOVED***grid grid-cols-1 md:grid-cols-2 gap-4***REMOVED***)
    })

    it(***REMOVED***returns 3-column grid classes for "grid3"***REMOVED***, () => {
      expect(getLayoutClassName(***REMOVED***grid3***REMOVED***)).toBe(
        ***REMOVED***grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4***REMOVED***
      )
    })

    it(***REMOVED***returns 4-column grid classes for "grid4"***REMOVED***, () => {
      expect(getLayoutClassName(***REMOVED***grid4***REMOVED***)).toBe(
        ***REMOVED***grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4***REMOVED***
      )
    })

    it(***REMOVED***handles all LayoutType values without throwing***REMOVED***, () => {
      const allLayouts: LayoutType[] = [***REMOVED***horizontal***REMOVED***, ***REMOVED***vertical***REMOVED***, ***REMOVED***grid2***REMOVED***, ***REMOVED***grid3***REMOVED***, ***REMOVED***grid4***REMOVED***]
      for (const l of allLayouts) {
        expect(() => getLayoutClassName(l)).not.toThrow()
        expect(typeof getLayoutClassName(l)).toBe(***REMOVED***string***REMOVED***)
        expect(getLayoutClassName(l).length).toBeGreaterThan(0)
      }
    })
  })

  describe(***REMOVED***getFieldFlexClass***REMOVED***, () => {
    it(***REMOVED***returns "flex-1" for horizontal layout***REMOVED***, () => {
      expect(getFieldFlexClass(***REMOVED***horizontal***REMOVED***)).toBe(***REMOVED***flex-1***REMOVED***)
    })

    it(***REMOVED***returns empty string for grid layouts***REMOVED***, () => {
      expect(getFieldFlexClass(***REMOVED***grid2***REMOVED***)).toBe(***REMOVED******REMOVED***)
      expect(getFieldFlexClass(***REMOVED***grid3***REMOVED***)).toBe(***REMOVED******REMOVED***)
      expect(getFieldFlexClass(***REMOVED***grid4***REMOVED***)).toBe(***REMOVED******REMOVED***)
    })

    it(***REMOVED***returns empty string for vertical layout***REMOVED***, () => {
      expect(getFieldFlexClass(***REMOVED***vertical***REMOVED***)).toBe(***REMOVED******REMOVED***)
    })

    it(***REMOVED***returns empty string when layout is undefined***REMOVED***, () => {
      expect(getFieldFlexClass(undefined)).toBe(***REMOVED******REMOVED***)
    })
  })
})
