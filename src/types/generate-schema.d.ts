declare module 'generate-schema' {
  interface Schema {
    json: (name: string, obj: unknown) => unknown
  }

  const GenerateSchema: Schema
  export default GenerateSchema
}
