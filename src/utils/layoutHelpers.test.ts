import { describe, it, expect } from 'vitest'
import { getLayoutClassName, getFieldFlexClass, type LayoutType } from './layoutHelpers'

describe('layoutHelpers', () => {
  describe('getLayoutClassName', () => {
    it('returns flex-col (default) when layout is undefined', () => {
      expect(getLayoutClassName(undefined)).toBe('flex flex-col gap-4')
    })

    it('returns flex-col when layout is "vertical"', () => {
      expect(getLayoutClassName('vertical')).toBe('flex flex-col gap-4')
    })

    it('returns horizontal flex classes for "horizontal"', () => {
      expect(getLayoutClassName('horizontal')).toBe('flex md:flex-row sm:flex-col gap-4 sm:gap-2')
    })

    it('returns 2-column grid classes for "grid2"', () => {
      expect(getLayoutClassName('grid2')).toBe('grid grid-cols-1 md:grid-cols-2 gap-4')
    })

    it('returns 3-column grid classes for "grid3"', () => {
      expect(getLayoutClassName('grid3')).toBe(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      )
    })

    it('returns 4-column grid classes for "grid4"', () => {
      expect(getLayoutClassName('grid4')).toBe(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
      )
    })

    it('handles all LayoutType values without throwing', () => {
      const allLayouts: LayoutType[] = ['horizontal', 'vertical', 'grid2', 'grid3', 'grid4']
      for (const l of allLayouts) {
        expect(() => getLayoutClassName(l)).not.toThrow()
        expect(typeof getLayoutClassName(l)).toBe('string')
        expect(getLayoutClassName(l).length).toBeGreaterThan(0)
      }
    })
  })

  describe('getFieldFlexClass', () => {
    it('returns "flex-1" for horizontal layout', () => {
      expect(getFieldFlexClass('horizontal')).toBe('flex-1')
    })

    it('returns empty string for grid layouts', () => {
      expect(getFieldFlexClass('grid2')).toBe('')
      expect(getFieldFlexClass('grid3')).toBe('')
      expect(getFieldFlexClass('grid4')).toBe('')
    })

    it('returns empty string for vertical layout', () => {
      expect(getFieldFlexClass('vertical')).toBe('')
    })

    it('returns empty string when layout is undefined', () => {
      expect(getFieldFlexClass(undefined)).toBe('')
    })
  })
})
