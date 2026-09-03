import React from ***REMOVED***react***REMOVED***
import { describe, expect, it, vi } from ***REMOVED***vitest***REMOVED***
import { fireEvent, render, screen } from ***REMOVED***@testing-library/react***REMOVED***
import { EmbeddedArraysFromSchemaWithOverrides } from ***REMOVED***./EmbeddedArrays***REMOVED***

vi.mock(***REMOVED***jotai***REMOVED***, async (importOriginal) => {
  const actual = await importOriginal<typeof import(***REMOVED***jotai***REMOVED***)>()
  return {
    ...actual,
    useAtom: () => React.useState({}),
  }
})

vi.mock(***REMOVED***@axdspub/axiom-ui-utilities***REMOVED***, () => ({
  Button: ({ children, onClick, ...rest }: any) => (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}))

vi.mock(***REMOVED***@/Form/FormWithEditorOverlay***REMOVED***, () => ({
  __esModule: true,
  default: ({ formOverrideState }: any) => {
    return (
      <div>
        <div data-testid="override-json">{JSON.stringify(formOverrideState?.[0] ?? null)}</div>
      </div>
    )
  },
  FormWithEditorOverlay: () => <div data-testid="form-with-editor-overlay" />,
}))

describe(***REMOVED***EmbeddedArraysFromSchemaWithOverrides override mode switching***REMOVED***, () => {
  it(***REMOVED***switches between mixed, relative, and fully-qualified path modes***REMOVED***, () => {
    render(<EmbeddedArraysFromSchemaWithOverrides />)

    const getOverrideJson = (): string => {
      return screen.getByTestId(***REMOVED***override-json***REMOVED***).textContent ?? ***REMOVED******REMOVED***
    }

    // Initial mode is mixed.
    expect(getOverrideJson()).toContain(***REMOVED***"topLevel[].name"***REMOVED***)
    expect(getOverrideJson()).toContain(***REMOVED***"prop":"nestedArray"***REMOVED***)

    fireEvent.click(screen.getByRole(***REMOVED***button***REMOVED***, { name: ***REMOVED***Relative Only***REMOVED*** }))
    expect(getOverrideJson()).toContain(***REMOVED***"prop":"nestedArray"***REMOVED***)
    expect(getOverrideJson()).not.toContain(***REMOVED***"topLevel[].name"***REMOVED***)
    expect(getOverrideJson()).toContain(***REMOVED***"prop":"thing"***REMOVED***)

    fireEvent.click(screen.getByRole(***REMOVED***button***REMOVED***, { name: ***REMOVED***Fully Qualified Only***REMOVED*** }))
    expect(getOverrideJson()).toContain(***REMOVED***"prop":"topLevel[].nestedArray"***REMOVED***)
    expect(getOverrideJson()).toContain(***REMOVED***"prop":"topLevel[].nestedArray[].thing"***REMOVED***)
    expect(getOverrideJson()).toContain(***REMOVED***"prop":"topLevel[].nestedArray[].other"***REMOVED***)
  })
})
