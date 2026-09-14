import type { InputHTMLAttributes } from 'react'

export interface FolderFileTypeFlags {
  lowerName: string
  isImage: boolean
  isVideo: boolean
  isAudio: boolean
  isPdf: boolean
  isCsv: boolean
  isText: boolean
  isGeojson: boolean
}

export interface FolderFileEntry {
  file: File
  relativePath: string
  fileType: FolderFileTypeFlags
}

export interface FolderPreviewProps {
  files: FolderFileEntry[]
  folderName: string
}

export type FolderInputAttributes = InputHTMLAttributes<HTMLInputElement> & {
  webkitdirectory?: string
}