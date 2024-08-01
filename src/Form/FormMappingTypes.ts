
export interface IFormMapping {
    fields: Record<string, IFieldMapping>
    $targetSchema: string
}

type IFieldMapping = {
    xpath: string
}


export const example: IFormMapping = {
    $targetSchema: 'testAsset',
    fields: {
        label: {
            xpath: '/label'
        }
    }
}
