import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FieldLabel, { FieldDescriptionTooltip, FieldLabelText, FieldDescriptionText } from './FieldLabel'
import { type IFormField } from '@/Form/Creator/FormCreatorTypes'
import React from 'react'

// Helper function to pause execution for a given duration
// const sleep = async (ms: number): Promise<void> => { await new Promise(resolve => setTimeout(resolve, ms)) }

describe('FieldLabel Component', () => {
  const mockField: IFormField = {
    id: 'test-field',
    label: 'Test Label',
    description: 'This is a test description',
    type: 'text',
    required: true
  }

  it('renders the FieldLabelText with required indicator', () => {
    render(<FieldLabelText {...mockField} />)

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('renders the FieldLabelText without required indicator', () => {
    render(<FieldLabelText {...mockField} required={false} />)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('renders the FieldDescriptionTooltip when description is provided', async () => {
    render(<FieldDescriptionTooltip {...mockField} />)

    const toolTipTarget = screen.getByRole('tooltip')
    expect(toolTipTarget).toBeInTheDocument()
    // fireEvent.mouseEnter(toolTipTarget)
    fireEvent.focus(toolTipTarget)

    // Wait for the tooltip content to appear
    // text appears multiple times when tooltip active
    await screen.findAllByText(String(mockField.description ?? ''))
    expect(screen.getAllByText(String(mockField.description ?? ''))).not.toHaveLength(0)
  })

  it('renders the FieldDescriptionText when description is provided', () => {
    render(<FieldDescriptionText {...mockField} />)

    expect(screen.getByText('This is a test description')).toBeInTheDocument()
  })

  it('renders the FieldLabel component with label and description', () => {
    render(<FieldLabel {...mockField} />)

    expect(screen.getByText('Test Label')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('This is a test description')).toBeInTheDocument()
  })

  it('does not render FieldDescriptionTooltip when description is undefined', () => {
    const fieldWithoutDescription: IFormField = { ...mockField, description: undefined }
    render(<FieldDescriptionTooltip {...fieldWithoutDescription} />)

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('does not render FieldDescriptionText when description is undefined', () => {
    const fieldWithoutDescription: IFormField = { ...mockField, description: undefined }
    render(<FieldDescriptionText {...fieldWithoutDescription} />)

    expect(screen.queryByText('This is a test description')).not.toBeInTheDocument()
  })

  it('renders FieldLabelText without required indicator when required is false', () => {
    const fieldWithoutRequired: IFormField = { ...mockField, required: false }
    render(<FieldLabelText {...fieldWithoutRequired} />)

    expect(screen.getByText(String(mockField.label ?? ''))).toBeInTheDocument()
    expect(screen.queryByText('*')).not.toBeInTheDocument()
  })

  it('renders FieldLabelText with required indicator when required is false', () => {
    const fieldWithoutRequired: IFormField = { ...mockField, required: true }
    render(<FieldLabelText {...fieldWithoutRequired} />)

    expect(screen.getByText(String(mockField.label ?? ''))).toBeInTheDocument()
    expect(screen.queryByText('*')).toBeInTheDocument()
  })
})
