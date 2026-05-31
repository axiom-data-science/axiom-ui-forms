/**
 * Layout utility functions for form sections
 */

export type LayoutType = ***REMOVED***horizontal***REMOVED*** | ***REMOVED***vertical***REMOVED*** | ***REMOVED***grid2***REMOVED*** | ***REMOVED***grid3***REMOVED*** | ***REMOVED***grid4***REMOVED***

/**
 * Get the CSS class string for a given layout type
 * Used for rendering fields with different layout options
 */
export const getLayoutClassName = (layout?: LayoutType): string => {
  switch (layout) {
    case ***REMOVED***horizontal***REMOVED***:
      return ***REMOVED***flex md:flex-row sm:flex-col gap-4 sm:gap-2***REMOVED***
    case ***REMOVED***grid4***REMOVED***:
      return ***REMOVED***grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4***REMOVED***
    case ***REMOVED***grid3***REMOVED***:
      return ***REMOVED***grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4***REMOVED***
    case ***REMOVED***grid2***REMOVED***:
      return ***REMOVED***grid grid-cols-1 md:grid-cols-2 gap-4***REMOVED***
    case ***REMOVED***vertical***REMOVED***:
    default:
      return ***REMOVED***flex flex-col gap-4***REMOVED***
  }
}

/**
 * Get the flex-1 class for horizontal layout fields
 */
export const getFieldFlexClass = (layout?: LayoutType): string => {
  return layout === ***REMOVED***horizontal***REMOVED*** ? ***REMOVED***flex-1***REMOVED*** : ***REMOVED******REMOVED***
}
