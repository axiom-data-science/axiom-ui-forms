import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import FileUpload from './FileUpload'
import type { IFormField } from '@/Form/Creator/FormCreatorTypes'

vi.mock('@axdspub/axiom-ui-utilities', () => ({
  Loader: () => <div data-testid="loader" />,
  Table: () => <div data-testid="table" />,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  utils: {
    createButtonClass: () => 'btn',
  },
}))

describe('FileUpload', () => {
  const createObjectUrlMock = vi.fn(() => 'blob:preview-url')
  const revokeObjectUrlMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(globalThis.URL.createObjectURL as any) = createObjectUrlMock
    ;(globalThis.URL.revokeObjectURL as any) = revokeObjectUrlMock
  })

  const baseField: IFormField = {
    id: 'upload',
    type: 'file_upload',
    label: 'Upload',
    settings: {
      acceptedFileTypes: ['image/png'],
    },
  } as IFormField

  it('keeps uploaded file preview in session memory across unmount/remount', async () => {
    const onChange = vi.fn()
    const file = new File(['fake-image'], 'photo.png', { type: 'image/png' })

    const { unmount } = render(
      <FileUpload field={baseField as any} value={null} onChange={onChange} />
    )

    const fileInput = document.querySelector('#file_input') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith('photo.png')
    })

    await waitFor(() => {
      expect(screen.getByAltText('Uploaded file preview')).toBeInTheDocument()
    })

    unmount()

    render(<FileUpload field={baseField as any} value={'photo.png'} onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByAltText('Uploaded file preview')).toBeInTheDocument()
    })
  })

  it('uses upload and preview hooks passed as component props', async () => {
    const onChange = vi.fn()
    const storedFileRef = 'https://example.com/files/photo.png'
    const onFileUpload = vi.fn(async () => storedFileRef)
    const getPreviewUrl = vi.fn(async () => 'https://example.com/files/photo.png')
    const file = new File(['fake-image'], 'photo.png', { type: 'image/png' })

    const { unmount } = render(
      <FileUpload
        field={baseField as any}
        value={null}
        onChange={onChange}
        onFileUpload={onFileUpload}
        getPreviewUrl={getPreviewUrl}
      />
    )

    const fileInput = document.querySelector('#file_input') as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(onFileUpload).toHaveBeenCalled()
    })
    expect(onFileUpload).toHaveBeenCalledWith({
      fileName: 'photo.png',
      fileData: expect.any(ArrayBuffer),
      parsedCsvData: null,
      file,
    })
    expect(onChange).toHaveBeenCalledWith(storedFileRef)

    unmount()

    render(
      <FileUpload
        field={baseField as any}
        value={storedFileRef}
        onChange={onChange}
        onFileUpload={onFileUpload}
        getPreviewUrl={getPreviewUrl}
      />
    )

    await waitFor(() => {
      expect(getPreviewUrl).toHaveBeenCalledWith(storedFileRef)
    })
    await waitFor(() => {
      expect(screen.getByAltText('Uploaded file preview')).toHaveAttribute(
        'src',
        'https://example.com/files/photo.png'
      )
    })
  })

  it('previews a restored file based on its retrieved MIME type', async () => {
    const storedFileRef = 'https://example.com/files/opaque-reference'
    const getPreviewFile = vi.fn(async () =>
      new File(['fake-image'], 'downloaded-file', { type: 'image/png' })
    )

    render(
      <FileUpload
        field={baseField as any}
        value={storedFileRef}
        onChange={vi.fn()}
        getPreviewFile={getPreviewFile}
      />
    )

    await waitFor(() => {
      expect(getPreviewFile).toHaveBeenCalledWith(storedFileRef)
      expect(screen.getByAltText('Uploaded file preview')).toBeInTheDocument()
    })
  })

  it('parses a restored CSV before setting file state', async () => {
    const csvText = 'name,value\nsample,42'
    const file = new File([csvText], 'downloaded-file.csv', { type: 'text/plain' })
    Object.defineProperty(file, 'text', {
      value: async () => {
        await new Promise((resolve) => setTimeout(resolve, 0))
        return csvText
      },
    })
    const getPreviewFile = vi.fn(async () => file)

    render(
      <FileUpload
        field={baseField as any}
        value="https://example.com/files/opaque-reference"
        onChange={vi.fn()}
        getPreviewFile={getPreviewFile}
      />
    )

    await waitFor(() => {
      expect(screen.getByTestId('table')).toBeInTheDocument()
    })
  })

})
