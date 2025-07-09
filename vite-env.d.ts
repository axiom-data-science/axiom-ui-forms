/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly TEST_VAR: string
  readonly SHOW_DEBUG: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  readonly glob: <T>(pattern: string, options?: { eager?: boolean, default?: ***REMOVED***default***REMOVED*** | string }) => Record<string, T>
}
