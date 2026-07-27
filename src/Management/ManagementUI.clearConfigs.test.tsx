import React from ***REMOVED***react***REMOVED***
import { fireEvent, render, screen } from ***REMOVED***@testing-library/react***REMOVED***
import { describe, expect, it, vi } from ***REMOVED***vitest***REMOVED***
import ManagementUI from ***REMOVED***@/Management/ManagementUI***REMOVED***

vi.mock(***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***, () => ({
  Button: ({ children, onClick, ...rest }: any) => (
    <button type="button" onClick={onClick} {...rest}>
      {children}
    </button>
  ),
  Tabs: ({ tabs }: any) => (
    <div>
      {tabs.map((tab: any) => (
        <section key={tab.id} data-testid={`tab-${tab.id}`}>
          {tab.content}
        </section>
      ))}
    </div>
  ),
  Tooltip: ({ children }: any) => <span>{children}</span>,
}))

vi.mock(***REMOVED***@/Management/Components/OverlayEditor***REMOVED***, () => ({
  default: ({ children }: any) => <div>{children}</div>,
}))

vi.mock(***REMOVED***@/Form/Creator/FormCreator***REMOVED***, () => ({
  SchemaFormCreator: () => <div data-testid="schema-form-creator" />,
}))

vi.mock(***REMOVED***@/Form/Components/Inputs***REMOVED***, () => ({
  JSONInput: ({ field, value }: any) => (
    <pre data-testid={`json-${field.id}`}>{JSON.stringify(value)}</pre>
  ),
}))

describe(***REMOVED***ManagementUI clear configs regression***REMOVED***, () => {
  it(***REMOVED***keeps generated JSON live after clear-all when adding a field***REMOVED***, () => {
    render(<ManagementUI />)

    fireEvent.click(screen.getByText(***REMOVED***Clear All Configs***REMOVED***))

    const formOverrideNode = screen.getByTestId(***REMOVED***json-management-form-override***REMOVED***)
    const afterClearRaw = formOverrideNode.textContent ?? ***REMOVED***{}***REMOVED***
    const afterClear = JSON.parse(afterClearRaw)

    expect(afterClear).toHaveProperty(***REMOVED***fields***REMOVED***)
    expect(Array.isArray(afterClear.fields)).toBe(true)
    expect(afterClear.fields).toHaveLength(0)

    fireEvent.click(screen.getByText(***REMOVED***Add Unmapped Field***REMOVED***))

    const afterAddRaw = screen.getByTestId(***REMOVED***json-management-form-override***REMOVED***).textContent ?? ***REMOVED***{}***REMOVED***
    const afterAdd = JSON.parse(afterAddRaw)

    expect(afterAdd.fields).toHaveLength(1)
    expect(afterAdd.fields[0]).toEqual({ prop: ***REMOVED******REMOVED*** })
    expect(afterAddRaw).not.toEqual(afterClearRaw)
  })
})
