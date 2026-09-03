import { render, screen, fireEvent } from ***REMOVED***@testing-library/react***REMOVED***
import React from ***REMOVED***react***REMOVED***
import { describe, it, expect, vi } from ***REMOVED***vitest***REMOVED***
import StringInput from ***REMOVED***./String***REMOVED***

describe(***REMOVED***StringInput***REMOVED***, () => {
  it(***REMOVED***renders input field with placeholder***REMOVED***, () => {
    const mockOnChange = vi.fn()
    render(
      <StringInput
        field={{ id: ***REMOVED***test-id***REMOVED***, type: ***REMOVED***text***REMOVED***, placeholder: ***REMOVED***Enter text***REMOVED*** }}
        onChange={mockOnChange}
        value=""
        disabled={false}
      />
    )

    const input = screen.getByTestId(***REMOVED***test-id***REMOVED***)
    expect(input).toHaveAttribute(***REMOVED***placeholder***REMOVED***, ***REMOVED***Enter text***REMOVED***)
  })

  it(***REMOVED***cancels pending onChange on unmount during debounce delay***REMOVED***, async () => {
    const mockOnChange = vi.fn()
    const { unmount } = render(
      <StringInput
        field={{ id: ***REMOVED***test-id***REMOVED***, type: ***REMOVED***text***REMOVED***, placeholder: ***REMOVED***Enter text***REMOVED*** }}
        onChange={mockOnChange}
        value=""
        disabled={false}
      />
    )

    const input = screen.getByTestId(***REMOVED***test-id***REMOVED***) as HTMLInputElement

    fireEvent.change(input, { target: { value: ***REMOVED***hello***REMOVED*** } })

    // Unmount immediately (before debounce completes)
    unmount()

    // Wait longer than debounce delay to ensure onChange won***REMOVED***t be called after unmount
    await new Promise((resolve) => setTimeout(resolve, 300))

    // onChange should not have been called because debounce was cancelled on unmount
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it(***REMOVED***disables input when disabled prop is true***REMOVED***, () => {
    const mockOnChange = vi.fn()
    render(
      <StringInput
        field={{ id: ***REMOVED***test-id***REMOVED***, type: ***REMOVED***text***REMOVED***, placeholder: ***REMOVED***Enter text***REMOVED*** }}
        onChange={mockOnChange}
        value=""
        disabled={true}
      />
    )

    const input = screen.getByTestId(***REMOVED***test-id***REMOVED***) as HTMLInputElement
    expect(input).toBeDisabled()
  })

  it(***REMOVED***displays provided value***REMOVED***, () => {
    const mockOnChange = vi.fn()
    render(
      <StringInput
        field={{ id: ***REMOVED***test-id***REMOVED***, type: ***REMOVED***text***REMOVED***, placeholder: ***REMOVED***Enter text***REMOVED*** }}
        onChange={mockOnChange}
        value="test value"
        disabled={false}
      />
    )

    const input = screen.getByTestId(***REMOVED***test-id***REMOVED***) as HTMLInputElement
    expect(input.value).toBe(***REMOVED***test value***REMOVED***)
  })

  it(***REMOVED***handles null value as empty string***REMOVED***, () => {
    const mockOnChange = vi.fn()
    render(
      <StringInput
        field={{ id: ***REMOVED***test-id***REMOVED***, type: ***REMOVED***text***REMOVED***, placeholder: ***REMOVED***Enter text***REMOVED*** }}
        onChange={mockOnChange}
        value={null as any}
        disabled={false}
      />
    )

    const input = screen.getByTestId(***REMOVED***test-id***REMOVED***) as HTMLInputElement
    expect(input.value).toBe(***REMOVED******REMOVED***)
  })
})
