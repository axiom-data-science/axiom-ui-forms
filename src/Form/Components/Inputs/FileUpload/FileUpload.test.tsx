import React from ***REMOVED***react***REMOVED***
import { describe, it, expect, beforeEach, vi } from ***REMOVED***vitest***REMOVED***
import { fireEvent, render, screen, waitFor } from ***REMOVED***@testing-library/react***REMOVED***
import FileUpload from ***REMOVED***./FileUpload***REMOVED***
import type { IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

vi.mock(***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***, () => ({
  Loader: () => <div data-testid="loader" />,
  Table: () => <div data-testid="table" />,
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  utils: {
    createButtonClass: () => ***REMOVED***btn***REMOVED***,
  },
}))

describe(***REMOVED***FileUpload***REMOVED***, () => {
  const createObjectUrlMock = vi.fn(() => ***REMOVED***blob:preview-url***REMOVED***)
  const revokeObjectUrlMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(globalThis.URL.createObjectURL as any) = createObjectUrlMock
    ;(globalThis.URL.revokeObjectURL as any) = revokeObjectUrlMock
  })

  const baseField: IFormField = {
    id: ***REMOVED***upload***REMOVED***,
    type: ***REMOVED***file_upload***REMOVED***,
    label: ***REMOVED***Upload***REMOVED***,
    settings: {
      acceptedFileTypes: [***REMOVED***image/png***REMOVED***],
    },
  } as IFormField

  it(***REMOVED***keeps uploaded file preview in session memory across unmount/remount***REMOVED***, async () => {
    const onChange = vi.fn()
    const file = new File([***REMOVED***fake-image***REMOVED***], ***REMOVED***photo.png***REMOVED***, { type: ***REMOVED***image/png***REMOVED*** })

    const { unmount } = render(
      <FileUpload field={baseField as any} value={null} onChange={onChange} />
    )

    const fileInput = document.querySelector(***REMOVED***#file_input***REMOVED***) as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(***REMOVED***photo.png***REMOVED***)
    })

    expect(screen.getByAltText(***REMOVED***Uploaded file preview***REMOVED***)).toBeInTheDocument()

    unmount()

    render(<FileUpload field={baseField as any} value={***REMOVED***photo.png***REMOVED***} onChange={onChange} />)

    await waitFor(() => {
      expect(screen.getByAltText(***REMOVED***Uploaded file preview***REMOVED***)).toBeInTheDocument()
    })
  })

  it(***REMOVED***uses upload and preview hooks passed as component props***REMOVED***, async () => {
    const onChange = vi.fn()
    const onFileUpload = vi.fn(async () => undefined)
    const getPreviewUrl = vi.fn(async () => ***REMOVED***https://example.com/files/photo.png***REMOVED***)
    const file = new File([***REMOVED***fake-image***REMOVED***], ***REMOVED***photo.png***REMOVED***, { type: ***REMOVED***image/png***REMOVED*** })

    const { unmount } = render(
      <FileUpload
        field={baseField as any}
        value={null}
        onChange={onChange}
        onFileUpload={onFileUpload}
        getPreviewUrl={getPreviewUrl}
      />
    )

    const fileInput = document.querySelector(***REMOVED***#file_input***REMOVED***) as HTMLInputElement
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(onFileUpload).toHaveBeenCalled()
    })
    expect(onFileUpload).toHaveBeenCalledWith(***REMOVED***photo.png***REMOVED***, expect.any(ArrayBuffer), null)

    unmount()

    render(
      <FileUpload
        field={baseField as any}
        value={***REMOVED***photo.png***REMOVED***}
        onChange={onChange}
        onFileUpload={onFileUpload}
        getPreviewUrl={getPreviewUrl}
      />
    )

    await waitFor(() => {
      expect(getPreviewUrl).toHaveBeenCalledWith(***REMOVED***photo.png***REMOVED***)
    })
    await waitFor(() => {
      expect(screen.getByAltText(***REMOVED***Uploaded file preview***REMOVED***)).toHaveAttribute(
        ***REMOVED***src***REMOVED***,
        ***REMOVED***https://example.com/files/photo.png***REMOVED***
      )
    })
  })
})
