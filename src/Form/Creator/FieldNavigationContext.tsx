import { type IFormSection } from '@/Form/Creator/FormCreatorTypes'
import { getFieldsFromFormSection, makeJsonPath } from '@/utils/getters'
import React, { createContext, useContext } from 'react'

export interface IFieldNavigationRequest {
  path: string
  requestId: number
}

const FieldNavigationContext = createContext<IFieldNavigationRequest | undefined>(undefined)

export const FieldNavigationProvider = FieldNavigationContext.Provider

export const useFieldNavigationRequest = (): IFieldNavigationRequest | undefined => {
  return useContext(FieldNavigationContext)
}

export const fieldPathsMatch = (left: string, right: string): boolean => {
  const normalize = (path: string): string => path.replace(/\[\d+\]/g, '[]')
  return normalize(left) === normalize(right)
}

export const findSectionForFieldPath = (
  sections: IFormSection[],
  path: string
): IFormSection | undefined => {
  return sections.find((section) =>
    getFieldsFromFormSection(section).some((field) => {
      const fieldPath = makeJsonPath(field)
      return fieldPath !== undefined && fieldPathsMatch(fieldPath, path)
    })
  )
}