import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { vi } from 'vitest'
import LongStringInput from './LongString'

describe('LongStringInput', () => {
  it('renders textarea with placeholder', () => {
    const mockOnChange = vi.fn()
    render(
      <LongStringInput
        field={{ id: 'test-id', type: 'long_text', placeholder: 'Enter long text' }}
        onChange={mockOnChange}
        value=""
        disabled={false}
      />
    )

    const textarea = screen.getByTestId('test-id')
    expect(textarea).toHaveAttribute('placeholder', 'Enter long text')
  })

  it('cancels pending onChange on unmount during debounce delay', async () => {
    const mockOnChange = vi.fn()
    const { unmount } = render(
      <LongStringInput
        field={{ id: 'test-id', type: 'long_text', placeholder: 'Enter long text' }}
        onChange={mockOnChange}
        value=""
        disabled={false}
      />
    )

    const textarea = screen.getByTestId('test-id') as HTMLTextAreaElement

    fireEvent.change(textarea, { target: { value: 'Hello\nWorld' } })

    // Unmount immediately (before debounce completes)
    unmount()

    // Wait longer than debounce delay to ensure onChange won't be called after unmount
    await new Promise((resolve) => setTimeout(resolve, 300))

    // onChange should not have been called because debounce was cancelled on unmount
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('disables textarea when disabled prop is true', () => {
    const mockOnChange = vi.fn()
    render(
      <LongStringInput
        field={{ id: 'test-id', type: 'long_text', placeholder: 'Enter long text' }}
        onChange={mockOnChange}
        value=""
        disabled={true}
      />
    )

    const textarea = screen.getByTestId('test-id') as HTMLTextAreaElement
    expect(textarea).toBeDisabled()
  })

  it('displays provided value', () => {
    const mockOnChange = vi.fn()
    render(
      <LongStringInput
        field={{ id: 'test-id', type: 'long_text', placeholder: 'Enter long text' }}
        onChange={mockOnChange}
        value="test value"
        disabled={false}
      />
    )

    const textarea = screen.getByTestId('test-id') as HTMLTextAreaElement
    expect(textarea.value).toBe('test value')
  })

  it('handles null value as empty string', () => {
    const mockOnChange = vi.fn()
    render(
      <LongStringInput
        field={{ id: 'test-id', type: 'long_text', placeholder: 'Enter long text' }}
        onChange={mockOnChange}
        value={null as any}
        disabled={false}
      />
    )

    const textarea = screen.getByTestId('test-id') as HTMLTextAreaElement
    expect(textarea.value).toBe('')
  })
})
