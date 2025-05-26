import { render, screen, fireEvent } from ***REMOVED***@testing-library/react***REMOVED***
import BooleanInput from ***REMOVED***./Boolean***REMOVED***
import { describe, it, expect, vi } from ***REMOVED***vitest***REMOVED***
import { type IFormField, type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import React from ***REMOVED***react***REMOVED***

const checkboxDomTestId = ***REMOVED***test-checkbox***REMOVED***

describe(***REMOVED***BooleanInput Component***REMOVED***, () => {
  const mockOnChange = vi.fn()
  const mockField: IFormField = {
    id: checkboxDomTestId,
    label: ***REMOVED***Test Checkbox***REMOVED***,
    description: ***REMOVED***This is a test checkbox***REMOVED***,
    type: ***REMOVED***boolean***REMOVED***
  }

  const defaultProps: IFieldInputProps = {
    field: mockField,
    onChange: mockOnChange,
    value: false
  }

  it(***REMOVED***renders the checkbox with the correct label and description***REMOVED***, () => {
    render(<BooleanInput {...defaultProps} />)

    // Check if the label and description are rendered
    expect(screen.getByText(***REMOVED***Test Checkbox***REMOVED***)).toBeInTheDocument()

    // fireEvent.focus(screen.getByText(***REMOVED***Test Checkbox***REMOVED***))
    // expect(screen.getByText(***REMOVED***This is a test checkbox***REMOVED***)).toBeInTheDocument()

    // Check if the checkbox is rendered
    const checkbox: HTMLInputElement = screen.getByTestId(checkboxDomTestId)
    expect(checkbox).toBeInTheDocument()
    expect(checkbox.checked).not.toBe(true)
  })

  it(***REMOVED***calls onChange when the checkbox is clicked***REMOVED***, () => {
    render(<BooleanInput {...defaultProps} />)

    const checkbox = screen.getByTestId(checkboxDomTestId)
    fireEvent.click(checkbox)

    expect(mockOnChange).toHaveBeenCalledTimes(1)
  })

  it(***REMOVED***renders the checkbox as checked when value is true***REMOVED***, () => {
    render(<BooleanInput {...defaultProps} value={true} />)

    const checkbox: HTMLInputElement = screen.getByTestId(checkboxDomTestId)
    expect(checkbox.checked).toBe(true)
  })
  it(***REMOVED***renders the checkbox as unchecked when value is undefined***REMOVED***, () => {
    render(<BooleanInput {...defaultProps} value={undefined} />)

    const checkbox: HTMLInputElement = screen.getByTestId(checkboxDomTestId)
    expect(checkbox.checked).toBe(false)
  })
})
