import { type IFormField, type IFormOverride, type IFormFieldOverride } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

export type IManagementNavigationMode = ***REMOVED***fields***REMOVED*** | ***REMOVED***pages***REMOVED*** | ***REMOVED***tabs***REMOVED*** | ***REMOVED***wizard_steps***REMOVED***

export interface IManagementSection {
  id: string
  label: string
  order: number
  parentSectionId?: string
  parentListType?: Exclude<IManagementNavigationMode, ***REMOVED***fields***REMOVED***>
  childListType?: Exclude<IManagementNavigationMode, ***REMOVED***fields***REMOVED***>
}

export interface IManagementFieldNode {
  id: string
  prop: string
  label: string
  baseType: IFormField[***REMOVED***type***REMOVED***]
  parentRef: string
  order: number
  overrideType?: IFormField[***REMOVED***type***REMOVED***]
  overrideLabel?: string
  overrideConditions?: IFormField[***REMOVED***conditions***REMOVED***]
  overrideConditionsSet?: IFormField[***REMOVED***conditionsSet***REMOVED***]
  overrideSettings?: IFormField[***REMOVED***settings***REMOVED***]
}

export interface IManagementGroupNode {
  id: string
  label: string
  layout?: ***REMOVED***horizontal***REMOVED*** | ***REMOVED***vertical***REMOVED*** | ***REMOVED***grid2***REMOVED*** | ***REMOVED***grid3***REMOVED*** | ***REMOVED***grid4***REMOVED***
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
