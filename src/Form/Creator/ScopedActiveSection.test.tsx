/**
 * ScopedActiveSection.test.tsx
 *
 * Tests that ScopedActiveSection applies the correct layout CSS class
 * from a tab's `layout` property, and correctly propagates
 * scoped value/onChange to child fields.
 */

import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { ScopedActiveSection } from './TabLayout'
import { type IFormSection } from '@/Form/Creator/FormCreatorTypes'

// FieldCreator requires full form context — mock it to a simple div with a test id
vi.mock('@/Form/Components/FieldCreator', () => ({
  default: ({ field, value, onChange }: any) => (
    <div
      data-testid={`field-${field.id}`}
      data-value={JSON.stringify(value)}
      onClick={() => onChange?.('new-value')}
    />
  ),
}))

// FieldLabel is used only for description rendering — mock to a simple span
vi.mock('@/Form/Components/FieldLabel', () => ({
  default: ({ field }: any) => <span data-testid="field-label">{field.label}</span>,
}))

const makeSection = (layout?: string, fieldIds = ['a', 'b']): IFormSection =>
  ({
    id: 'test-tab',
    label: 'Test Tab',
    fields: fieldIds.map((id) => ({ id, type: 'text' as const, label: id })),
    ...(layout !== undefined ? { layout } : {}),
  }) as any

const noop = () => {}

describe('ScopedActiveSection', () => {
  describe('layout CSS class', () => {
    it('renders fields in a flex-col container by default (no layout)', () => {
      const { container } = render(
        <ScopedActiveSection
          formSection={makeSection(undefined)}
          scopedValue={{ a: '1', b: '2' }}
          scopedOnChange={noop}
          level={1}
        />
      )
      const fieldsDiv = container.querySelector('[class*="flex-col"]')
      expect(fieldsDiv).not.toBeNull()
    })

    it('renders fields in a grid-cols-2 container for layout="grid2"', () => {
      const { container } = render(
        <ScopedActiveSection
          formSection={makeSection('grid2')}
          scopedValue={{ a: '1', b: '2' }}
          scopedOnChange={noop}
          level={1}
        />
      )
      const fieldsDiv = container.querySelector('[class*="grid-cols-2"]')
      expect(fieldsDiv).not.toBeNull()
    })

    it('renders fields in a 3-col grid container for layout="grid3"', () => {
      const { container } = render(
        <ScopedActiveSection
          formSection={makeSection('grid3')}
          scopedValue={{ a: '1', b: '2' }}
          scopedOnChange={noop}
          level={1}
        />
      )
      const fieldsDiv = container.querySelector('[class*="grid-cols-3"]')
      expect(fieldsDiv).not.toBeNull()
    })

    it('renders fields in a 4-col grid container for layout="grid4"', () => {
      const { container } = render(
        <ScopedActiveSection
          formSection={makeSection('grid4')}
          scopedValue={{ a: '1', b: '2' }}
          scopedOnChange={noop}
          level={1}
        />
      )
      const fieldsDiv = container.querySelector('[class*="grid-cols-4"]')
      expect(fieldsDiv).not.toBeNull()
    })

    it('renders fields in a horizontal flex container for layout="horizontal"', () => {
      const { container } = render(
        <ScopedActiveSection
          formSection={makeSection('horizontal')}
          scopedValue={{ a: '1', b: '2' }}
          scopedOnChange={noop}
          level={1}
        />
      )
      const fieldsDiv = container.querySelector('[class*="flex-row"]')
      expect(fieldsDiv).not.toBeNull()
    })
  })

  describe('scoped value/onChange wiring', () => {
    it('passes each field its scoped value from scopedValue', () => {
      render(
        <ScopedActiveSection
          formSection={makeSection(undefined, ['name', 'age'])}
          scopedValue={{ name: 'Alice', age: 30 }}
          scopedOnChange={noop}
          level={1}
        />
      )
      expect(screen.getByTestId('field-name').dataset.value).toBe('"Alice"')
      expect(screen.getByTestId('field-age').dataset.value).toBe('30')
    })

    it('calls scopedOnChange with merged object when a normal field changes', () => {
      const onChange = vi.fn()
      render(
        <ScopedActiveSection
          formSection={makeSection(undefined, ['name'])}
          scopedValue={{ name: 'Alice', other: 'keep' }}
          scopedOnChange={onChange}
          level={1}
        />
      )
      screen.getByTestId('field-name').click()
      expect(onChange).toHaveBeenCalledTimes(1)
      const result = onChange.mock.calls[0][0]
      expect(result.name).toBe('new-value')
      // other keys must be preserved
      expect(result.other).toBe('keep')
    })

    it('passes null when field has no value in scopedValue', () => {
      render(
        <ScopedActiveSection
          formSection={makeSection(undefined, ['missing'])}
          scopedValue={{}}
          scopedOnChange={noop}
          level={1}
        />
      )
      expect(screen.getByTestId('field-missing').dataset.value).toBe('null')
    })
  })

  describe('description rendering', () => {
    it('renders a description label when formSection has a description', () => {
      const section: IFormSection = {
        id: 'tab',
        description: 'Helpful info about this tab',
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
      expect(screen.getByTestId('field-label')).toBeInTheDocument()
    })

    it('does not render a description label when formSection has no description', () => {
      render(
        <ScopedActiveSection
          formSection={makeSection()}
          scopedValue={{}}
          scopedOnChange={noop}
          level={1}
        />
      )
      expect(screen.queryByTestId('field-label')).toBeNull()
    })
  })
})
