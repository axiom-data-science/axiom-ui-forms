/**
 * ScopedActiveSection.test.tsx
 *
 * Tests that ScopedActiveSection applies the correct layout CSS class
 * from a tab***REMOVED***s `layout` property, and correctly propagates
 * scoped value/onChange to child fields.
 */

import { describe, it, expect, vi } from ***REMOVED***vitest***REMOVED***
import React from ***REMOVED***react***REMOVED***
import { render, screen } from ***REMOVED***@testing-library/react***REMOVED***
import { ScopedActiveSection } from ***REMOVED***./TabLayout***REMOVED***
import { type IFormSection } from ***REMOVED***@/Form/Creator/FormCreatorTypes***REMOVED***

// FieldCreator requires full form context — mock it to a simple div with a test id
vi.mock(***REMOVED***@/Form/Components/FieldCreator***REMOVED***, () => ({
  default: ({ field, value, onChange }: any) => (
    <div
      data-testid={`field-${field.id}`}
      data-value={JSON.stringify(value)}
      onClick={() => onChange?.(***REMOVED***new-value***REMOVED***)}
    />
  ),
}))

// FieldLabel is used only for description rendering — mock to a simple span
vi.mock(***REMOVED***@/Form/Components/FieldLabel***REMOVED***, () => ({
  default: ({ field }: any) => <span data-testid="field-label">{field.label}</span>,
}))

const makeSection = (layout?: string, fieldIds = [***REMOVED***a***REMOVED***, ***REMOVED***b***REMOVED***]): IFormSection =>
  ({
    id: ***REMOVED***test-tab***REMOVED***,
    label: ***REMOVED***Test Tab***REMOVED***,
    fields: fieldIds.map((id) => ({ id, type: ***REMOVED***text***REMOVED*** as const, label: id })),
    ...(layout !== undefined ? { layout } : {}),
  }) as any

const noop = () => {}

describe(***REMOVED***ScopedActiveSection***REMOVED***, () => {
  describe(***REMOVED***layout CSS class***REMOVED***, () => {
    it(***REMOVED***renders fields in a flex-col container by default (no layout)***REMOVED***, () => {
      const { container } = render(
        <ScopedActiveSection
          formSection={makeSection(undefined)}
          scopedValue={{ a: ***REMOVED***1***REMOVED***, b: ***REMOVED***2***REMOVED*** }}
          scopedOnChange={noop}
          level={1}
        />
      )
      const fieldsDiv = container.querySelector(***REMOVED***[class*="flex-col"]***REMOVED***)
      expect(fieldsDiv).not.toBeNull()
    })

    it(***REMOVED***renders fields in a grid-cols-2 container for layout="grid2"***REMOVED***, () => {
      const { container } = render(
        <ScopedActiveSection
          formSection={makeSection(***REMOVED***grid2***REMOVED***)}
          scopedValue={{ a: ***REMOVED***1***REMOVED***, b: ***REMOVED***2***REMOVED*** }}
          scopedOnChange={noop}
          level={1}
        />
      )
      const fieldsDiv = container.querySelector(***REMOVED***[class*="grid-cols-2"]***REMOVED***)
      expect(fieldsDiv).not.toBeNull()
    })

    it(***REMOVED***renders fields in a 3-col grid container for layout="grid3"***REMOVED***, () => {
      const { container } = render(
        <ScopedActiveSection
          formSection={makeSection(***REMOVED***grid3***REMOVED***)}
          scopedValue={{ a: ***REMOVED***1***REMOVED***, b: ***REMOVED***2***REMOVED*** }}
          scopedOnChange={noop}
          level={1}
        />
      )
      const fieldsDiv = container.querySelector(***REMOVED***[class*="grid-cols-3"]***REMOVED***)
      expect(fieldsDiv).not.toBeNull()
    })

    it(***REMOVED***renders fields in a 4-col grid container for layout="grid4"***REMOVED***, () => {
      const { container } = render(
        <ScopedActiveSection
          formSection={makeSection(***REMOVED***grid4***REMOVED***)}
          scopedValue={{ a: ***REMOVED***1***REMOVED***, b: ***REMOVED***2***REMOVED*** }}
          scopedOnChange={noop}
          level={1}
        />
      )
      const fieldsDiv = container.querySelector(***REMOVED***[class*="grid-cols-4"]***REMOVED***)
      expect(fieldsDiv).not.toBeNull()
    })

    it(***REMOVED***renders fields in a horizontal flex container for layout="horizontal"***REMOVED***, () => {
      const { container } = render(
        <ScopedActiveSection
          formSection={makeSection(***REMOVED***horizontal***REMOVED***)}
          scopedValue={{ a: ***REMOVED***1***REMOVED***, b: ***REMOVED***2***REMOVED*** }}
          scopedOnChange={noop}
          level={1}
        />
      )
      const fieldsDiv = container.querySelector(***REMOVED***[class*="flex-row"]***REMOVED***)
      expect(fieldsDiv).not.toBeNull()
    })
  })

  describe(***REMOVED***scoped value/onChange wiring***REMOVED***, () => {
    it(***REMOVED***passes each field its scoped value from scopedValue***REMOVED***, () => {
      render(
        <ScopedActiveSection
          formSection={makeSection(undefined, [***REMOVED***name***REMOVED***, ***REMOVED***age***REMOVED***])}
          scopedValue={{ name: ***REMOVED***Alice***REMOVED***, age: 30 }}
          scopedOnChange={noop}
          level={1}
        />
      )
      expect(screen.getByTestId(***REMOVED***field-name***REMOVED***).dataset.value).toBe(***REMOVED***"Alice"***REMOVED***)
      expect(screen.getByTestId(***REMOVED***field-age***REMOVED***).dataset.value).toBe(***REMOVED***30***REMOVED***)
    })

    it(***REMOVED***calls scopedOnChange with merged object when a normal field changes***REMOVED***, () => {
      const onChange = vi.fn()
      render(
        <ScopedActiveSection
          formSection={makeSection(undefined, [***REMOVED***name***REMOVED***])}
          scopedValue={{ name: ***REMOVED***Alice***REMOVED***, other: ***REMOVED***keep***REMOVED*** }}
          scopedOnChange={onChange}
          level={1}
        />
      )
      screen.getByTestId(***REMOVED***field-name***REMOVED***).click()
      expect(onChange).toHaveBeenCalledTimes(1)
      const result = onChange.mock.calls[0][0]
      expect(result.name).toBe(***REMOVED***new-value***REMOVED***)
      // other keys must be preserved
      expect(result.other).toBe(***REMOVED***keep***REMOVED***)
    })

    it(***REMOVED***passes null when field has no value in scopedValue***REMOVED***, () => {
      render(
        <ScopedActiveSection
          formSection={makeSection(undefined, [***REMOVED***missing***REMOVED***])}
          scopedValue={{}}
          scopedOnChange={noop}
          level={1}
        />
      )
      expect(screen.getByTestId(***REMOVED***field-missing***REMOVED***).dataset.value).toBe(***REMOVED***null***REMOVED***)
    })
  })

  describe(***REMOVED***description rendering***REMOVED***, () => {
    it(***REMOVED***renders a description label when formSection has a description***REMOVED***, () => {
      const section: IFormSection = {
        id: ***REMOVED***tab***REMOVED***,
        description: ***REMOVED***Helpful info about this tab***REMOVED***,
        fields: [],
      }
      render(
        <ScopedActiveSection
          formSection={section}
          scopedValue={{}}
          scopedOnChange={noop}
          level={1}
        />
      )
      expect(screen.getByTestId(***REMOVED***field-label***REMOVED***)).toBeInTheDocument()
    })

    it(***REMOVED***does not render a description label when formSection has no description***REMOVED***, () => {
      render(
        <ScopedActiveSection
          formSection={makeSection()}
          scopedValue={{}}
          scopedOnChange={noop}
          level={1}
        />
      )
      expect(screen.queryByTestId(***REMOVED***field-label***REMOVED***)).toBeNull()
    })
  })
})
