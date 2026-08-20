import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ManagementUI from '@/Management/ManagementUI'

vi.mock('@axdspub/axiom-ui-utilities', () => ({
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

vi.mock('@/Management/Components/OverlayEditor', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}))

vi.mock('@/Form/Creator/FormCreator', () => ({
  SchemaFormCreator: () => <div data-testid="schema-form-creator" />,
}))

vi.mock('@/Form/Components/Inputs', () => ({
  JSONInput: ({ field, value }: any) => (
    <pre data-testid={`json-${field.id}`}>{JSON.stringify(value)}</pre>
  ),
}))

describe('ManagementUI clear configs regression', () => {
  it('keeps generated JSON live after clear-all when adding a field', () => {
    render(<ManagementUI />)

    fireEvent.click(screen.getByText('Clear All Configs'))

    const formOverrideNode = screen.getByTestId('json-management-form-override')
    const afterClearRaw = formOverrideNode.textContent ?? '{}'
    const afterClear = JSON.parse(afterClearRaw)

    expect(afterClear).toHaveProperty('fields')
    expect(Array.isArray(afterClear.fields)).toBe(true)
    expect(afterClear.fields).toHaveLength(0)

    fireEvent.click(screen.getByText('Add Unmapped Field'))

    const afterAddRaw = screen.getByTestId('json-management-form-override').textContent ?? '{}'
    const afterAdd = JSON.parse(afterAddRaw)

    expect(afterAdd.fields).toHaveLength(1)
    expect(afterAdd.fields[0]).toEqual({ prop: '' })
    expect(afterAddRaw).not.toEqual(afterClearRaw)
  })

  it('clears child section type badge when last child section is deleted', async () => {
    const { container } = render(<ManagementUI />)

    const rootSection = container.querySelector('#editor-section-section-1')
    expect(rootSection).not.toBeNull()

    const rootButtons = Array.from(rootSection?.querySelectorAll('button') ?? [])
    fireEvent.click(rootButtons[1])

    expect(rootSection?.querySelector('span.bg-indigo-100')).not.toBeNull()

    const childSection = container.querySelector('#editor-section-section-2')
    expect(childSection).not.toBeNull()

    const childButtons = Array.from(childSection?.querySelectorAll('button') ?? [])
    fireEvent.click(childButtons[3])

    await waitFor(() => {
      expect(container.querySelector('#editor-section-section-2')).toBeNull()
      expect(container.querySelector('#editor-section-section-1 span.bg-indigo-100')).toBeNull()
    })
  })
})
