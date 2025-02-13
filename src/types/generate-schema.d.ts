declare module ***REMOVED***generate-schema***REMOVED*** {
  interface Schema {
    json: (name: string, obj: unknown) => unknown
  }

  const GenerateSchema: Schema
  export default GenerateSchema
}
