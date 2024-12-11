export interface IFormMapping {
  fields: Record<string, IFieldMapping>
  $targetSchema: string
}

interface IFieldMapping {
  xpath: string
}

export const example: IFormMapping = {
  $targetSchema: ***REMOVED***testAsset***REMOVED***,
  fields: {
    label: {
      xpath: ***REMOVED***/label***REMOVED***
    }
  }
}
