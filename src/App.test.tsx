import { render, screen } from ***REMOVED***@testing-library/react***REMOVED***
import { describe, it, expect, vi } from ***REMOVED***vitest***REMOVED***
import App from ***REMOVED***./AppTry***REMOVED***
import React from ***REMOVED***react***REMOVED***

describe(***REMOVED***App***REMOVED***, () => {
  it(***REMOVED***should load the home page without browser errors***REMOVED***, () => {
    const consoleErrorMock = vi.spyOn(console, ***REMOVED***error***REMOVED***).mockImplementation(() => {})
    const consoleWarnMock = vi.spyOn(console, ***REMOVED***warn***REMOVED***).mockImplementation(() => {})

    render(<App />)

    expect(consoleErrorMock).not.toHaveBeenCalled()
    expect(consoleWarnMock).not.toHaveBeenCalled()

    consoleErrorMock.mockRestore()
    consoleWarnMock.mockRestore()
  })
  it(***REMOVED***should render multiple elements on the home page***REMOVED***, () => {
    render(<App />)

    // Replace ***REMOVED***element-text***REMOVED*** with actual text or test IDs from your app
    const elements = screen.getAllByText(/welcome to the home/i) // Adjust the regex or query to match your elements
    expect(elements.length).toBeGreaterThan(0) // Ensure multiple elements are present
  })
})
