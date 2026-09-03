import { fireEvent, render, screen } from ***REMOVED***@testing-library/react***REMOVED***
import { describe, it, expect, vi } from ***REMOVED***vitest***REMOVED***
import FieldLabel, { FieldDescriptionTooltip, FieldLabelText, FieldDescriptionText } from ***REMOVED***./FieldLabel***REMOVED***
import { type IFormField } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***
import React from ***REMOVED***react***REMOVED***

// Helper function to pause execution for a given duration
// const sleep = async (ms: number): Promise<void> => { await new Promise(resolve => setTimeout(resolve, ms)) }

describe(***REMOVED***FieldLabel Component***REMOVED***, () => {
  const mockField: IFormField = {
    id: ***REMOVED***test-field***REMOVED***,
    label: ***REMOVED***Test Label***REMOVED***,
    description: ***REMOVED***This is a test description***REMOVED***,
    type: ***REMOVED***text***REMOVED***,
    required: true
  }

  it(***REMOVED***renders the FieldLabelText with required indicator***REMOVED***, () => {
    render(<FieldLabelText field={mockField} />)

    expect(screen.getByText(***REMOVED***Test Label***REMOVED***)).toBeInTheDocument()
    expect(screen.getByText(***REMOVED*******REMOVED***)).toBeInTheDocument()
  })

  it(***REMOVED***renders the FieldLabelText without required indicator***REMOVED***, () => {
    render(<FieldLabelText field={{ ...mockField, required: false }} />)
    expect(screen.getByText(***REMOVED***Test Label***REMOVED***)).toBeInTheDocument()
    expect(screen.queryByText(***REMOVED*******REMOVED***)).not.toBeInTheDocument()
  })

  it(***REMOVED***renders the FieldDescriptionTooltip when description is provided***REMOVED***, async () => {
    render(<FieldDescriptionTooltip field={mockField} />)

    const toolTipTarget = screen.getByRole(***REMOVED***tooltip***REMOVED***)
    expect(toolTipTarget).toBeInTheDocument()
    // fireEvent.mouseEnter(toolTipTarget)
    fireEvent.focus(toolTipTarget)

    // Wait for the tooltip content to appear
    // text appears multiple times when tooltip active
    await screen.findAllByText(String(mockField.description ?? ***REMOVED******REMOVED***))
    expect(screen.getAllByText(String(mockField.description ?? ***REMOVED******REMOVED***))).not.toHaveLength(0)
  })

  it(***REMOVED***renders the FieldDescriptionText when description is provided***REMOVED***, () => {
    render(<FieldDescriptionText field={mockField} />)

    expect(screen.getByText(***REMOVED***This is a test description***REMOVED***)).toBeInTheDocument()
  })

  it(***REMOVED***renders the FieldLabel component with label and description***REMOVED***, () => {
    render(<FieldLabel field={mockField} />)

    expect(screen.getByText(***REMOVED***Test Label***REMOVED***)).toBeInTheDocument()
    expect(screen.getByText(***REMOVED*******REMOVED***)).toBeInTheDocument()
    expect(screen.getByText(***REMOVED***This is a test description***REMOVED***)).toBeInTheDocument()
  })

  it(***REMOVED***does not render FieldDescriptionTooltip when description is undefined***REMOVED***, () => {
    const fieldWithoutDescription: IFormField = { ...mockField, description: undefined }
    render(<FieldDescriptionTooltip field={fieldWithoutDescription} />)

    expect(screen.queryByRole(***REMOVED***tooltip***REMOVED***)).not.toBeInTheDocument()
  })

  it(***REMOVED***does not render FieldDescriptionText when description is undefined***REMOVED***, () => {
    const fieldWithoutDescription: IFormField = { ...mockField, description: undefined }
    render(<FieldDescriptionText field={fieldWithoutDescription} />)

    expect(screen.queryByText(***REMOVED***This is a test description***REMOVED***)).not.toBeInTheDocument()
  })

  it(***REMOVED***renders FieldLabelText without required indicator when required is false***REMOVED***, () => {
    const fieldWithoutRequired: IFormField = { ...mockField, required: false }
    render(<FieldLabelText field={fieldWithoutRequired} />)

    expect(screen.getByText(String(mockField.label ?? ***REMOVED******REMOVED***))).toBeInTheDocument()
    expect(screen.queryByText(***REMOVED*******REMOVED***)).not.toBeInTheDocument()
  })

  it(***REMOVED***renders FieldLabelText with required indicator when required is false***REMOVED***, () => {
    const fieldWithoutRequired: IFormField = { ...mockField, required: true }
    render(<FieldLabelText field={fieldWithoutRequired} />)

    expect(screen.getByText(String(mockField.label ?? ***REMOVED******REMOVED***))).toBeInTheDocument()
    expect(screen.queryByText(***REMOVED*******REMOVED***)).toBeInTheDocument()
  })
  it(***REMOVED***renders FieldLabelText with revert button visible and clicking button passes default value to onChange function***REMOVED***, async () => {
    const onChange = vi.fn()
    const fieldWithDefaultValue = { ...mockField, defaultValue: ***REMOVED***default value***REMOVED*** }
    render(<FieldLabelText field={fieldWithDefaultValue} disabled={false} value={***REMOVED***something else***REMOVED***} onChange={onChange} />)
    const el = screen.getByTestId(***REMOVED***revert-to-default***REMOVED***)
    expect(el).toBeInTheDocument()
    fireEvent.click(el)
    expect(onChange).toHaveBeenCalledTimes(1)
  })
  it(***REMOVED***renders FieldLabelText with revert button visible and clicking button does not call onChange when disabled***REMOVED***, async () => {
    const onChange = vi.fn()
    const fieldWithDefaultValue = { ...mockField, defaultValue: ***REMOVED***default value***REMOVED*** }
    render(<FieldLabelText field={fieldWithDefaultValue} disabled={true} value={***REMOVED***something else***REMOVED***} onChange={onChange} />)
    const el = screen.getByTestId(***REMOVED***revert-to-default***REMOVED***)
    expect(el).toBeInTheDocument()
    fireEvent.click(el)
    expect(onChange).toHaveBeenCalledTimes(0)
  })
})
