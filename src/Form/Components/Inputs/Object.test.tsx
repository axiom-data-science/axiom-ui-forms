import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ObjectInput from './Object'
import { type IFieldInputProps } from '@/Form/Creator/FormCreatorTypes'

vi.mock('@/Form/Creator/FormContextProvider', () => ({
  useFormContext: () => ({
    form: { id: 'test-form' },
    setFormValues: vi.fn(),
  }),
  useFormValues: () => ({
    cache_enabled: true,
    cache_ttl: 3600,
  }),
}))

vi.mock('@/Form/Components/FieldLabel', () => ({
  default: () => <div data-testid="field-label" />,
}))

vi.mock('@/Form/Creator/TabLayout', () => ({
  default: ({ scopedValue }: any) => (
    <div data-testid="tab-layout" data-scoped={scopedValue !== undefined ? 'true' : 'false'} />
  ),
}))

vi.mock('@/Form/Creator/Page', () => ({
  default: () => <div data-testid="page-layout" />,
}))

vi.mock('@/Form/Creator/Wizard', () => ({
  default: () => <div data-testid="wizard-layout" />,
}))

describe('ObjectInput skip_path tabs scoping', () => {
  const fieldWithNestedTabs = {
    id: 'performance_wrapper',
    type: 'objectWrapper' as const,
    skip_path: true,
    tabs: [
      {
        id: 'caching',
        fields: [{ id: 'cache_enabled', type: 'boolean' as const }],
      },
    ],
  }

  it('renders root skip_path tabs in non-scoped mode when value is undefined', () => {
    const props: IFieldInputProps = {
      field: fieldWithNestedTabs as any,
      onChange: vi.fn(),
      value: undefined,
    }

    render(<ObjectInput {...props} />)

    expect(screen.getByTestId('tab-layout')).toHaveAttribute('data-scoped', 'false')
  })

  it('renders skip_path tabs in scoped mode when explicit scoped value is provided', () => {
    const props: IFieldInputProps = {
      field: fieldWithNestedTabs as any,
      onChange: vi.fn(),
      value: { cache_enabled: true },
    }

    render(<ObjectInput {...props} />)

    expect(screen.getByTestId('tab-layout')).toHaveAttribute('data-scoped', 'true')
  })
})
