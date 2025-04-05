import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import App from './App'
import React from 'react'

describe('App', () => {
  it('should load the home page without browser errors', () => {
    const consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {})
    const consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(<App />)

    expect(consoleErrorMock).not.toHaveBeenCalled()
    expect(consoleWarnMock).not.toHaveBeenCalled()

    consoleErrorMock.mockRestore()
    consoleWarnMock.mockRestore()
  })
  it('should render multiple elements on the home page', () => {
    render(<App />)

    // Replace 'element-text' with actual text or test IDs from your app
    const elements = screen.getAllByText(/form with object/i) // Adjust the regex or query to match your elements
    expect(elements.length).toBeGreaterThan(0) // Ensure multiple elements are present
  })
})
