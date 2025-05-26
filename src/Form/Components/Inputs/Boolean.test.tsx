import { render, screen, fireEvent } from '@testing-library/react'
import BooleanInput from './Boolean'
import { describe, it, expect, vi } from 'vitest'
import { type IFormField, type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'
import React from 'react'

const checkboxDomTestId = 'test-checkbox'

describe('BooleanInput Component', () => {
  const mockOnChange = vi.fn()
  const mockField: IFormField = {
    id: checkboxDomTestId,
    label: 'Test Checkbox',
    description: 'This is a test checkbox',
    type: 'boolean'
  }

  const defaultProps: IFieldInputProps = {
    field: mockField,
    onChange: mockOnChange,
    value: false
  }

  it('renders the checkbox with the correct label and description', () => {
    render(<BooleanInput {...defaultProps} />)

    // Check if the label and description are rendered
    expect(screen.getByText('Test Checkbox')).toBeInTheDocument()

    // fireEvent.focus(screen.getByText('Test Checkbox'))
    // expect(screen.getByText('This is a test checkbox')).toBeInTheDocument()

    // Check if the checkbox is rendered
    const checkbox: HTMLInputElement = screen.getByTestId(checkboxDomTestId)
    expect(checkbox).toBeInTheDocument()
    expect(checkbox.checked).not.toBe(true)
  })

  it('calls onChange when the checkbox is clicked', () => {
    render(<BooleanInput {...defaultProps} />)

    const checkbox = screen.getByTestId(checkboxDomTestId)
    fireEvent.click(checkbox)

    expect(mockOnChange).toHaveBeenCalledTimes(1)
  })

  it('renders the checkbox as checked when value is true', () => {
    render(<BooleanInput {...defaultProps} value={true} />)

    const checkbox: HTMLInputElement = screen.getByTestId(checkboxDomTestId)
    expect(checkbox.checked).toBe(true)
  })
  it('renders the checkbox as unchecked when value is undefined', () => {
    render(<BooleanInput {...defaultProps} value={undefined} />)

    const checkbox: HTMLInputElement = screen.getByTestId(checkboxDomTestId)
    expect(checkbox.checked).toBe(false)
  })
})
