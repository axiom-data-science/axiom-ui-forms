/**
 * Layout utility functions for form sections
 */

export type LayoutType = 'horizontal' | 'vertical' | 'grid2' | 'grid3' | 'grid4'

/**
 * Get the CSS class string for a given layout type
 * Used for rendering fields with different layout options
 */
export const getLayoutClassName = (layout?: LayoutType): string => {
  switch (layout) {
    case 'horizontal':
      return 'flex md:flex-row sm:flex-col gap-4 sm:gap-2'
    case 'grid4':
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
    case 'grid3':
      return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
    case 'grid2':
      return 'grid grid-cols-1 md:grid-cols-2 gap-4'
    case 'vertical':
    default:
      return 'flex flex-col gap-4'
  }
}

/**
 * Get the flex-1 class for horizontal layout fields
 */
export const getFieldFlexClass = (layout?: LayoutType): string => {
  return layout === 'horizontal' ? 'flex-1' : ''
}
