import {
  type IFormField,
  type IFormOverride,
  type IFormFieldOverride,
} from '@/Form/Creator/FormCreatorTypes'

export type IManagementNavigationMode = 'fields' | 'pages' | 'tabs' | 'wizard_steps'

export interface IManagementSection {
  id: string
  label: string
  order: number
  parentSectionId?: string
  parentListType?: Exclude<IManagementNavigationMode, 'fields'>
  childListType?: Exclude<IManagementNavigationMode, 'fields'>
}

export interface IManagementFieldNode {
  id: string
  prop: string
  label: string
  baseType: IFormField['type']
  parentRef: string
  order: number
  overrideType?: IFormField['type']
  overrideLabel?: string
  overrideConditions?: IFormField['conditions']
  overrideConditionsSet?: IFormField['conditionsSet']
  overrideSettings?: IFormField['settings']
  overrideExtras?: Record<string, unknown>
  destPath?: string
}

export interface IManagementGroupNode {
  id: string
  label: string
  layout?: 'horizontal' | 'vertical' | 'grid2' | 'grid3' | 'grid4'
  parentRef: string
  order: number
}

export interface IManagementModel {
  formId: string
  label: string
  description?: string
  navigation: IManagementNavigationMode
  sections: IManagementSection[]
  groups: IManagementGroupNode[]
  fields: IManagementFieldNode[]
}

export interface IManagementExport {
  formOverride: IFormOverride
  fieldOverrides: IFormFieldOverride[]
}
