import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { EmbeddedArraysFromSchemaWithOverrides } from './EmbeddedArrays'

vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jotai')>()
  return {
    ...actual,
    useAtom: () => React.useState({}),
  }
})

vi.mock('@axdspub/axiom-ui-utilities', () => ({
  Button: ({ children, onClick, ...rest }: any) => (
    <button onClick={onClick} {...rest}>
      {children}
    </button>
  ),
}))

vi.mock('@/Form/FormWithEditorOverlay', () => ({
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

describe('EmbeddedArraysFromSchemaWithOverrides override mode switching', () => {
  it('switches between mixed, relative, and fully-qualified path modes', () => {
    render(<EmbeddedArraysFromSchemaWithOverrides />)

    const getOverrideJson = (): string => {
      return screen.getByTestId('override-json').textContent ?? ''
    }

    // Initial mode is mixed.
    expect(getOverrideJson()).toContain('"topLevel[].name"')
    expect(getOverrideJson()).toContain('"prop":"nestedArray"')

    fireEvent.click(screen.getByRole('button', { name: 'Relative Only' }))
    expect(getOverrideJson()).toContain('"prop":"nestedArray"')
    expect(getOverrideJson()).not.toContain('"topLevel[].name"')
    expect(getOverrideJson()).toContain('"prop":"thing"')

    fireEvent.click(screen.getByRole('button', { name: 'Fully Qualified Only' }))
    expect(getOverrideJson()).toContain('"prop":"topLevel[].nestedArray"')
    expect(getOverrideJson()).toContain('"prop":"topLevel[].nestedArray[].thing"')
    expect(getOverrideJson()).toContain('"prop":"topLevel[].nestedArray[].other"')
  })
})
