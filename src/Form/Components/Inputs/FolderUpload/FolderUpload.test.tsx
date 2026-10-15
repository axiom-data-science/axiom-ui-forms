import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import FolderUpload from './FolderUpload'
import type { FolderPreviewProps } from './folderUploadTypes'

vi.mock('@axdspub/axiom-ui-utilities', () => ({
  Loader: () => <span data-testid="loader" />,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  utils: {
    createButtonClass: () => 'button',
  },
}))

const FileListPreview = ({ files }: FolderPreviewProps) => (
  <ul>
    {files.map((entry) => (
      <li key={entry.relativePath}>{entry.relativePath}</li>
    ))}
  </ul>
)

const createFile = (name: string, relativePath: string): File => {
  const file = new File(['contents'], name, { type: 'text/plain' })
  Object.defineProperty(file, 'webkitRelativePath', { value: relativePath })
  return file
}

const renderFolderUpload = (settings?: Record<string, unknown>, maxDepth?: number) => {
  const view = render(
    <FolderUpload
      field={{ id: 'folder', type: 'folder_upload', label: 'Folder', settings } as any}
      value={undefined}
      onChange={vi.fn()}
      maxDepth={maxDepth}
      folderPreviewComponent={FileListPreview}
    />
  )
  const fileInput = view.container.querySelector('input[type="file"]') as HTMLInputElement

  fireEvent.change(fileInput, {
    target: {
      files: [
        createFile('top.txt', 'root/top.txt'),
        createFile('nested.txt', 'root/subfolder/nested.txt'),
      ],
    },
  })

  return view
}

describe('FolderUpload depth limit', () => {
  it('includes nested files by default', async () => {
    renderFolderUpload()

    await waitFor(() => {
      expect(screen.getByText('root/top.txt')).toBeInTheDocument()
      expect(screen.getByText('root/subfolder/nested.txt')).toBeInTheDocument()
    })
  })

  it('limits files to the selected folder when maxDepth is one', async () => {
    renderFolderUpload({ maxDepth: 1 })

    await waitFor(() => {
      expect(screen.getByText('root/top.txt')).toBeInTheDocument()
    })
    expect(screen.queryByText('root/subfolder/nested.txt')).not.toBeInTheDocument()
  })

  it('accepts maxDepth as a component prop', async () => {
    renderFolderUpload(undefined, 1)

    await waitFor(() => {
      expect(screen.getByText('root/top.txt')).toBeInTheDocument()
    })
    expect(screen.queryByText('root/subfolder/nested.txt')).not.toBeInTheDocument()
  })
})