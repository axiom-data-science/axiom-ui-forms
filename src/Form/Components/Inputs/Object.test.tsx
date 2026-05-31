import React from ***REMOVED***react***REMOVED***
import { describe, expect, it, vi } from ***REMOVED***vitest***REMOVED***
import { render, screen } from ***REMOVED***@testing-library/react***REMOVED***
import ObjectInput from ***REMOVED***./Object***REMOVED***
import { type IFieldInputProps } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

vi.mock(***REMOVED***@/Form/Creator/FormContextProvider***REMOVED***, () => ({
  useFormContext: () => ({
    form: { id: ***REMOVED***test-form***REMOVED*** },
    setFormValues: vi.fn(),
  }),
  useFormValues: () => ({
    cache_enabled: true,
    cache_ttl: 3600,
  }),
}))

vi.mock(***REMOVED***@/Form/Components/FieldLabel***REMOVED***, () => ({
  default: () => <div data-testid="field-label" />,
}))

vi.mock(***REMOVED***@/Form/Creator/TabLayout***REMOVED***, () => ({
  default: ({ scopedValue }: any) => (
    <div data-testid="tab-layout" data-scoped={scopedValue !== undefined ? ***REMOVED***true***REMOVED*** : ***REMOVED***false***REMOVED***} />
  ),
}))

vi.mock(***REMOVED***@/Form/Creator/Page***REMOVED***, () => ({
  default: () => <div data-testid="page-layout" />,
}))

vi.mock(***REMOVED***@/Form/Creator/Wizard***REMOVED***, () => ({
  default: () => <div data-testid="wizard-layout" />,
}))

describe(***REMOVED***ObjectInput skip_path tabs scoping***REMOVED***, () => {
  const fieldWithNestedTabs = {
    id: ***REMOVED***performance_wrapper***REMOVED***,
    type: ***REMOVED***objectWrapper***REMOVED*** as const,
    skip_path: true,
    tabs: [
      {
        id: ***REMOVED***caching***REMOVED***,
        fields: [{ id: ***REMOVED***cache_enabled***REMOVED***, type: ***REMOVED***boolean***REMOVED*** as const }],
      },
    ],
  }

  it(***REMOVED***renders root skip_path tabs in non-scoped mode when value is undefined***REMOVED***, () => {
    const props: IFieldInputProps = {
      field: fieldWithNestedTabs as any,
      onChange: vi.fn(),
      value: undefined,
    }

    render(<ObjectInput {...props} />)

    expect(screen.getByTestId(***REMOVED***tab-layout***REMOVED***)).toHaveAttribute(***REMOVED***data-scoped***REMOVED***, ***REMOVED***false***REMOVED***)
  })

  it(***REMOVED***renders skip_path tabs in scoped mode when explicit scoped value is provided***REMOVED***, () => {
    const props: IFieldInputProps = {
      field: fieldWithNestedTabs as any,
      onChange: vi.fn(),
      value: { cache_enabled: true },
    }

    render(<ObjectInput {...props} />)

    expect(screen.getByTestId(***REMOVED***tab-layout***REMOVED***)).toHaveAttribute(***REMOVED***data-scoped***REMOVED***, ***REMOVED***true***REMOVED***)
  })
})
