const { VITE_SHOW_DEBUG } = import.meta?.env ?? {}
const config = {
  SHOW_DEBUG: VITE_SHOW_DEBUG === ***REMOVED***true***REMOVED*** || VITE_SHOW_DEBUG === true
}
export default config
