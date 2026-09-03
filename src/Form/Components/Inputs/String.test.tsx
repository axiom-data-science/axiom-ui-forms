import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import StringInput from './String'

describe('StringInput', () => {
  it('renders input field with placeholder', () => {
    const mockOnChange = vi.fn()
    render(
      <StringInput
        field={{ id: 'test-id', type: 'text', placeholder: 'Enter text' }}
        onChange={mockOnChange}
        value=""
        disabled={false}
      />
    )

    const input = screen.getByTestId('test-id')
    expect(input).toHaveAttribute('placeholder', 'Enter text')
  })

  it('cancels pending onChange on unmount during debounce delay', async () => {
    const mockOnChange = vi.fn()
    const { unmount } = render(
      <StringInput
        field={{ id: 'test-id', type: 'text', placeholder: 'Enter text' }}
        onChange={mockOnChange}
        value=""
        disabled={false}
      />
    )

    const input = screen.getByTestId('test-id') as HTMLInputElement

    fireEvent.change(input, { target: { value: 'hello' } })

    // Unmount immediately (before debounce completes)
    unmount()

    // Wait longer than debounce delay to ensure onChange won't be called after unmount
    await new Promise((resolve) => setTimeout(resolve, 300))

    // onChange should not have been called because debounce was cancelled on unmount
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('disables input when disabled prop is true', () => {
    const mockOnChange = vi.fn()
    render(
      <StringInput
        field={{ id: 'test-id', type: 'text', placeholder: 'Enter text' }}
        onChange={mockOnChange}
        value=""
        disabled={true}
      />
    )

    const input = screen.getByTestId('test-id') as HTMLInputElement
    expect(input).toBeDisabled()
  })

  it('displays provided value', () => {
    const mockOnChange = vi.fn()
    render(
      <StringInput
        field={{ id: 'test-id', type: 'text', placeholder: 'Enter text' }}
        onChange={mockOnChange}
        value="test value"
        disabled={false}
      />
    )

    const input = screen.getByTestId('test-id') as HTMLInputElement
    expect(input.value).toBe('test value')
  })

  it('handles null value as empty string', () => {
    const mockOnChange = vi.fn()
    render(
      <StringInput
        field={{ id: 'test-id', type: 'text', placeholder: 'Enter text' }}
        onChange={mockOnChange}
        value={null as any}
        disabled={false}
      />
    )

    const input = screen.getByTestId('test-id') as HTMLInputElement
    expect(input.value).toBe('')
  })
})
