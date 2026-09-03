import { render, screen, fireEvent } from ***REMOVED***@testing-library/react***REMOVED***
import React from ***REMOVED***react***REMOVED***
import { describe, it, expect, vi } from ***REMOVED***vitest***REMOVED***
import LongStringInput from ***REMOVED***./LongString***REMOVED***

describe(***REMOVED***LongStringInput***REMOVED***, () => {
  it(***REMOVED***renders textarea with placeholder***REMOVED***, () => {
    const mockOnChange = vi.fn()
    render(
      <LongStringInput
        field={{ id: ***REMOVED***test-id***REMOVED***, type: ***REMOVED***long_text***REMOVED***, placeholder: ***REMOVED***Enter long text***REMOVED*** }}
        onChange={mockOnChange}
        value=""
        disabled={false}
      />
    )

    const textarea = screen.getByTestId(***REMOVED***test-id***REMOVED***)
    expect(textarea).toHaveAttribute(***REMOVED***placeholder***REMOVED***, ***REMOVED***Enter long text***REMOVED***)
  })

  it(***REMOVED***cancels pending onChange on unmount during debounce delay***REMOVED***, async () => {
    const mockOnChange = vi.fn()
    const { unmount } = render(
      <LongStringInput
        field={{ id: ***REMOVED***test-id***REMOVED***, type: ***REMOVED***long_text***REMOVED***, placeholder: ***REMOVED***Enter long text***REMOVED*** }}
        onChange={mockOnChange}
        value=""
        disabled={false}
      />
    )

    const textarea = screen.getByTestId(***REMOVED***test-id***REMOVED***) as HTMLTextAreaElement

    fireEvent.change(textarea, { target: { value: ***REMOVED***Hello\nWorld***REMOVED*** } })

    // Unmount immediately (before debounce completes)
    unmount()

    // Wait longer than debounce delay to ensure onChange won***REMOVED***t be called after unmount
    await new Promise((resolve) => setTimeout(resolve, 300))

    // onChange should not have been called because debounce was cancelled on unmount
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it(***REMOVED***disables textarea when disabled prop is true***REMOVED***, () => {
    const mockOnChange = vi.fn()
    render(
      <LongStringInput
        field={{ id: ***REMOVED***test-id***REMOVED***, type: ***REMOVED***long_text***REMOVED***, placeholder: ***REMOVED***Enter long text***REMOVED*** }}
        onChange={mockOnChange}
        value=""
        disabled={true}
      />
    )

    const textarea = screen.getByTestId(***REMOVED***test-id***REMOVED***) as HTMLTextAreaElement
    expect(textarea).toBeDisabled()
  })

  it(***REMOVED***displays provided value***REMOVED***, () => {
    const mockOnChange = vi.fn()
    render(
      <LongStringInput
        field={{ id: ***REMOVED***test-id***REMOVED***, type: ***REMOVED***long_text***REMOVED***, placeholder: ***REMOVED***Enter long text***REMOVED*** }}
        onChange={mockOnChange}
        value="test value"
        disabled={false}
      />
    )

    const textarea = screen.getByTestId(***REMOVED***test-id***REMOVED***) as HTMLTextAreaElement
    expect(textarea.value).toBe(***REMOVED***test value***REMOVED***)
  })

  it(***REMOVED***handles null value as empty string***REMOVED***, () => {
    const mockOnChange = vi.fn()
    render(
      <LongStringInput
        field={{ id: ***REMOVED***test-id***REMOVED***, type: ***REMOVED***long_text***REMOVED***, placeholder: ***REMOVED***Enter long text***REMOVED*** }}
        onChange={mockOnChange}
        value={null as any}
        disabled={false}
      />
    )

    const textarea = screen.getByTestId(***REMOVED***test-id***REMOVED***) as HTMLTextAreaElement
    expect(textarea.value).toBe(***REMOVED******REMOVED***)
  })
})
