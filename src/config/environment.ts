const { VITE_SHOW_DEBUG } = import.meta?.env ?? {}
const config = {
  SHOW_DEBUG: VITE_SHOW_DEBUG === 'true' || VITE_SHOW_DEBUG === true
}
export default config
